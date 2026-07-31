from fastapi import Depends, HTTPException, Request

from jose import JWTError



from app.core.config import COOKIE_NAME

from app.utils.security import decode_access_token





def _get_token_from_request(request: Request) -> str:

    token = request.cookies.get(COOKIE_NAME)

    if not token:

        raise HTTPException(status_code=401, detail="Not authenticated")

    return token





def get_current_user(request: Request) -> dict:

    token = _get_token_from_request(request)

    try:

        payload = decode_access_token(token)

    except JWTError:

        raise HTTPException(status_code=401, detail="Invalid or expired token")



    if not payload.get("sub"):

        raise HTTPException(status_code=401, detail="Invalid token payload")



    return payload





def require_staff(user: dict = Depends(get_current_user)) -> dict:

    if user.get("role") not in ("admin", "staff"):

        raise HTTPException(status_code=403, detail="Staff access required")

    return user





def require_admin(user: dict = Depends(get_current_user)) -> dict:

    if user.get("role") != "admin":

        raise HTTPException(status_code=403, detail="Admin access required")

    return user





def require_customer(user: dict = Depends(get_current_user)) -> dict:

    if user.get("type") != "customer":

        raise HTTPException(status_code=403, detail="Customer access required")

    return user





def require_staff_or_customer(user: dict = Depends(get_current_user)) -> dict:

    if user.get("type") == "customer" or user.get("role") in ("admin", "staff"):

        return user

    raise HTTPException(status_code=403, detail="Access denied")


