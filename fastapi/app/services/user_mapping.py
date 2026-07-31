from typing import Any, Dict, Tuple

from fastapi import HTTPException

from app.database import customers_collection, staffs_collection


def _collection_for_type(account_type: str):
    if account_type == "staff":
        return staffs_collection
    if account_type == "customer":
        return customers_collection
    raise HTTPException(status_code=400, detail="Invalid account type")


def _other_collection_for_type(account_type: str):
    if account_type == "staff":
        return customers_collection
    if account_type == "customer":
        return staffs_collection
    raise HTTPException(status_code=400, detail="Invalid account type")


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _username_candidates(profile: Dict[str, Any]) -> list:
    candidates = []
    for key in ("nickname", "preferred_username", "name"):
        value = profile.get(key)
        if value and value not in candidates:
            candidates.append(value)
    email = profile.get("email")
    if email and "@" in email:
        local_part = email.split("@", 1)[0]
        if local_part and local_part not in candidates:
            candidates.append(local_part)
    return candidates


async def resolve_local_user(
    account_type: str, auth0_profile: Dict[str, Any]
) -> Tuple[dict, str]:
    collection = _collection_for_type(account_type)
    other_collection = _other_collection_for_type(account_type)
    auth0_id = auth0_profile.get("sub")
    if not auth0_id:
        raise HTTPException(status_code=401, detail="Auth0 profile missing subject")

    other_user = await other_collection.find_one({"auth0_id": auth0_id})
    if other_user:
        raise HTTPException(
            status_code=403,
            detail="Tài khoản Auth0 này thuộc loại tài khoản khác. Hãy đăng nhập đúng cổng.",
        )

    user = await collection.find_one({"auth0_id": auth0_id})
    if user:
        return user, account_type

    email = auth0_profile.get("email")
    if email:
        normalized_email = _normalize_email(email)
        user = await collection.find_one({"email": normalized_email})
        if user:
            await collection.update_one(
                {"_id": user["_id"]},
                {"$set": {"auth0_id": auth0_id, "email": normalized_email}},
            )
            user["auth0_id"] = auth0_id
            user["email"] = normalized_email
            return user, account_type

    for username in _username_candidates(auth0_profile):
        user = await collection.find_one({"username": username})
        if user:
            update_fields = {"auth0_id": auth0_id}
            if email:
                update_fields["email"] = _normalize_email(email)
            await collection.update_one(
                {"_id": user["_id"]},
                {"$set": update_fields},
            )
            user["auth0_id"] = auth0_id
            if email:
                user["email"] = _normalize_email(email)
            return user, account_type

    detail = (
        "Tài khoản Auth0 chưa được liên kết với hệ thống. "
        "Hãy dùng email hoặc username trùng với tài khoản trong hệ thống."
    )
    raise HTTPException(status_code=403, detail=detail)
