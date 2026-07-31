from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt as jose_jwt
import httpx

from app.core.config import (
    ACCOUNT_TYPE_COOKIE_NAME,
    ALLOWED_RETURN_URLS,
    APP_URL_ADMIN,
    APP_URL_CUSTOMER,
    COOKIE_MAX_AGE,
    COOKIE_NAME,
    JWT_ALGORITHM,
    JWT_SECRET_KEY,
    REFRESH_COOKIE_MAX_AGE,
    REFRESH_COOKIE_NAME,
)
from app.dependencies.auth import get_current_user
from app.schemas.auth import UserInfo
from app.services.user_mapping import resolve_local_user
from app.utils.auth0 import (
    build_authorize_url,
    build_logout_url,
    create_oauth_state,
    exchange_code_for_tokens,
    parse_oauth_state,
    refresh_auth0_tokens,
    verify_auth0_id_token,
)
from app.utils.security import create_access_token

router = APIRouter()

_COOKIE_OPTS = {
    "httponly": True,
    "secure": False,
    "samesite": "lax",
    "path": "/",
}


def _set_access_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE,
        **_COOKIE_OPTS,
    )


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        max_age=REFRESH_COOKIE_MAX_AGE,
        **_COOKIE_OPTS,
    )


def _set_account_type_cookie(response: Response, account_type: str) -> None:
    response.set_cookie(
        key=ACCOUNT_TYPE_COOKIE_NAME,
        value=account_type,
        max_age=REFRESH_COOKIE_MAX_AGE,
        **_COOKIE_OPTS,
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key=COOKIE_NAME, path="/")
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/")
    response.delete_cookie(key=ACCOUNT_TYPE_COOKIE_NAME, path="/")


def _normalize_return_url(return_to: str, fallback: str) -> str:
    if return_to in ALLOWED_RETURN_URLS:
        return return_to
    return fallback


def _build_user_info(doc: dict, account_type: str) -> UserInfo:
    return UserInfo(
        id=str(doc["_id"]),
        name=doc["name"],
        username=doc["username"],
        email=doc.get("email"),
        role=doc.get("role_account", "customer"),
        type=account_type,
    )


def _user_payload(doc: dict, account_type: str) -> dict:
    return {
        "sub": str(doc["_id"]),
        "username": doc["username"],
        "email": doc.get("email"),
        "name": doc["name"],
        "role": doc.get("role_account", "customer"),
        "type": account_type,
    }


async def _issue_app_tokens(
    response: Response, doc: dict, account_type: str, auth0_refresh_token: str
) -> UserInfo:
    payload = _user_payload(doc, account_type)
    access_token = create_access_token(payload)
    _set_access_cookie(response, access_token)
    _set_refresh_cookie(response, auth0_refresh_token)
    _set_account_type_cookie(response, account_type)
    return _build_user_info(doc, account_type)


async def _issue_from_auth0_tokens(
    response: Response,
    token_data: dict,
    account_type: str,
    fallback_refresh: str = None,
) -> UserInfo:
    id_token = token_data.get("id_token")
    refresh_token = token_data.get("refresh_token") or fallback_refresh
    if not id_token or not refresh_token:
        raise HTTPException(status_code=401, detail="Auth0 tokens missing")

    auth0_profile = await verify_auth0_id_token(id_token)
    doc, resolved_type = await resolve_local_user(account_type, auth0_profile)
    if resolved_type != account_type:
        raise HTTPException(status_code=403, detail="Wrong account type")

    return await _issue_app_tokens(response, doc, account_type, refresh_token)


def _redirect_with_error(return_to: str, message: str) -> RedirectResponse:
    encoded = message.replace(" ", "+")
    return RedirectResponse(url=f"{return_to}/login?error={encoded}")


def _account_type_from_request(request: Request) -> str:
    account_type = request.cookies.get(ACCOUNT_TYPE_COOKIE_NAME)
    if account_type in ("staff", "customer"):
        return account_type

    access_token = request.cookies.get(COOKIE_NAME)
    if access_token:
        try:
            payload = jose_jwt.decode(
                access_token,
                JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM],
                options={"verify_exp": False},
            )
            if payload.get("type") in ("staff", "customer"):
                return payload["type"]
        except JWTError:
            pass

    return "customer"


@router.get("/auth/login/staff", tags=["Auth"])
async def login_staff(
    return_to: str = Query(default=APP_URL_ADMIN),
):
    safe_return_to = _normalize_return_url(return_to, APP_URL_ADMIN)
    state = create_oauth_state(safe_return_to, "staff")
    return RedirectResponse(url=build_authorize_url(state))


@router.get("/auth/login/customer", tags=["Auth"])
async def login_customer(
    return_to: str = Query(default=APP_URL_CUSTOMER),
):
    safe_return_to = _normalize_return_url(return_to, APP_URL_CUSTOMER)
    state = create_oauth_state(safe_return_to, "customer")
    return RedirectResponse(url=build_authorize_url(state))


@router.get("/auth/callback", tags=["Auth"])
async def auth_callback(
    code: str = Query(default=""),
    state: str = Query(default=""),
    error: str = Query(default=""),
    error_description: str = Query(default=""),
):
    parsed = parse_oauth_state(state)
    return_to = parsed["return_to"]
    account_type = parsed["account_type"]

    if error:
        message = error_description or error
        return _redirect_with_error(return_to, message)

    if not code:
        return _redirect_with_error(return_to, "Missing authorization code")

    response = RedirectResponse(url=return_to, status_code=302)
    try:
        token_data = await exchange_code_for_tokens(code)
        await _issue_from_auth0_tokens(response, token_data, account_type)
    except HTTPException as exc:
        return _redirect_with_error(return_to, str(exc.detail))
    except httpx.HTTPError:
        return _redirect_with_error(
            return_to, "Không kết nối được Auth0. Kiểm tra mạng hoặc tắt proxy hệ thống."
        )

    return response


@router.post("/auth/refresh", tags=["Auth"])
async def refresh_tokens(request: Request, response: Response):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    account_type = _account_type_from_request(request)
    token_data = await refresh_auth0_tokens(refresh_token)
    await _issue_from_auth0_tokens(
        response, token_data, account_type, fallback_refresh=refresh_token
    )
    return {"message": "Token refreshed"}


@router.post("/auth/logout", tags=["Auth"])
async def logout(
    response: Response,
    return_to: str = Query(default=APP_URL_ADMIN),
):
    safe_return_to = _normalize_return_url(return_to, APP_URL_ADMIN)
    _clear_auth_cookies(response)
    return {
        "message": "Logged out",
        "logout_url": build_logout_url(safe_return_to),
    }


@router.get("/auth/me", response_model=UserInfo, tags=["Auth"])
async def get_me(user: dict = Depends(get_current_user)):
    return UserInfo(
        id=user["sub"],
        name=user["name"],
        username=user["username"],
        email=user.get("email"),
        role=user["role"],
        type=user["type"],
    )
