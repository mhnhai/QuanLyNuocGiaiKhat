import base64
import hashlib
import hmac
import json
import secrets
from typing import Any, Dict, Optional
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException
from jose import JWTError, jwt
from jose.exceptions import JWTClaimsError
from app.core.config import (
    AUTH0_AUTHORIZE_URL,
    AUTH0_CALLBACK_URL,
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET,
    AUTH0_DOMAIN,
    AUTH0_ISSUER,
    AUTH0_JWKS_URL,
    AUTH0_LOGOUT_URL,
    AUTH0_TOKEN_URL,
    JWT_SECRET_KEY,
)

_jwks_cache: Optional[Dict[str, Any]] = None


def _auth0_http_client() -> httpx.AsyncClient:
    # Bypass system HTTP_PROXY (e.g. 127.0.0.1:60921) which breaks Auth0 TLS.
    return httpx.AsyncClient(timeout=10.0, trust_env=False)


def _ensure_auth0_config() -> None:
    if not all([AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET]):
        raise HTTPException(status_code=500, detail="Auth0 is not configured")


def create_oauth_state(return_to: str, account_type: str) -> str:
    payload = {
        "csrf": secrets.token_urlsafe(16),
        "return_to": return_to,
        "account_type": account_type,
    }
    raw = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    signature = hmac.new(
        JWT_SECRET_KEY.encode(), raw.encode(), hashlib.sha256
    ).hexdigest()
    return f"{raw}.{signature}"


def parse_oauth_state(state: str) -> Dict[str, str]:
    try:
        raw, signature = state.rsplit(".", 1)
        expected = hmac.new(
            JWT_SECRET_KEY.encode(), raw.encode(), hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(signature, expected):
            raise ValueError("Invalid state signature")
        payload = json.loads(base64.urlsafe_b64decode(raw.encode()).decode())
        return {
            "return_to": payload["return_to"],
            "account_type": payload["account_type"],
        }
    except (ValueError, KeyError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=400, detail="Invalid OAuth state") from exc


def build_authorize_url(state: str) -> str:
    _ensure_auth0_config()
    params = {
        "response_type": "code",
        "client_id": AUTH0_CLIENT_ID,
        "redirect_uri": AUTH0_CALLBACK_URL,
        "scope": "openid profile email offline_access",
        "state": state,
    }
    return f"{AUTH0_AUTHORIZE_URL}?{urlencode(params)}"


def build_logout_url(return_to: str) -> str:
    _ensure_auth0_config()
    params = {
        "client_id": AUTH0_CLIENT_ID,
        "returnTo": return_to,
    }
    return f"{AUTH0_LOGOUT_URL}?{urlencode(params)}"


async def _get_jwks() -> Dict[str, Any]:
    global _jwks_cache
    if _jwks_cache is None:
        async with _auth0_http_client() as client:
            response = await client.get(AUTH0_JWKS_URL)
            response.raise_for_status()
            _jwks_cache = response.json()
    return _jwks_cache


def _get_rsa_key(token: str, jwks: Dict[str, Any]) -> Dict[str, str]:
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token header") from exc

    kid = unverified_header.get("kid")
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    raise HTTPException(status_code=401, detail="Unable to find signing key")


async def verify_auth0_id_token(id_token: str) -> Dict[str, Any]:
    _ensure_auth0_config()
    jwks = await _get_jwks()
    rsa_key = _get_rsa_key(id_token, jwks)
    try:
        return jwt.decode(
            id_token,
            rsa_key,
            algorithms=["RS256"],
            audience=AUTH0_CLIENT_ID,
            issuer=AUTH0_ISSUER,
        )
    except (JWTError, JWTClaimsError) as exc:
        raise HTTPException(status_code=401, detail="Invalid Auth0 token") from exc


async def exchange_code_for_tokens(code: str) -> Dict[str, Any]:
    _ensure_auth0_config()
    async with _auth0_http_client() as client:
        response = await client.post(
            AUTH0_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "client_id": AUTH0_CLIENT_ID,
                "client_secret": AUTH0_CLIENT_SECRET,
                "code": code,
                "redirect_uri": AUTH0_CALLBACK_URL,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    if response.status_code >= 400:
        raise HTTPException(status_code=401, detail="Auth0 code exchange failed")
    return response.json()


async def refresh_auth0_tokens(refresh_token: str) -> Dict[str, Any]:
    _ensure_auth0_config()
    async with _auth0_http_client() as client:
        response = await client.post(
            AUTH0_TOKEN_URL,
            data={
                "grant_type": "refresh_token",
                "client_id": AUTH0_CLIENT_ID,
                "client_secret": AUTH0_CLIENT_SECRET,
                "refresh_token": refresh_token,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    if response.status_code >= 400:
        raise HTTPException(status_code=401, detail="Auth0 refresh failed")
    return response.json()
