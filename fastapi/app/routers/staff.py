from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import staffs_collection
from app.schemas.staff import StaffCreate, StaffUpdate, StaffResponse
from app.dependencies.auth import require_staff
from app.utils.security import hash_password
from bson import ObjectId
import logging

router = APIRouter()

logger = logging.getLogger(__name__)


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _to_staff_response(doc: dict) -> StaffResponse:
    doc["_id"] = str(doc["_id"])
    doc.pop("password", None)
    return StaffResponse(**doc)


@router.get("/staffs/check-registered", response_model=dict, tags=["Staffs"])
async def check_registered(username: str, _user: dict = Depends(require_staff)):
    try:
        staff = await staffs_collection.find_one({"username": username})
        return {"registered": staff is not None}
    except Exception as e:
        logger.error(f"Error checking if staff is registered: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/staffs", response_model=List[StaffResponse], tags=["Staffs"])
async def read_staffs(_user: dict = Depends(require_staff)):
    try:
        staffs = []
        async for staff in staffs_collection.find({}, {"password": 0}):
            staffs.append(_to_staff_response(staff))
        return staffs
    except Exception as e:
        logger.error(f"Error retrieving staffs: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/staffs/{staff_id}", response_model=StaffResponse, tags=["Staffs"])
async def read_staff(staff_id: str, _user: dict = Depends(require_staff)):
    try:
        if not ObjectId.is_valid(staff_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        staff = await staffs_collection.find_one(
            {"_id": ObjectId(staff_id)}, {"password": 0}
        )
        if staff is None:
            raise HTTPException(status_code=404, detail="Staff not found")
        return _to_staff_response(staff)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving staff with id {staff_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/staffs/{staff_id}/name", response_model=dict, tags=["Staffs"])
async def get_staff_name(staff_id: str, _user: dict = Depends(require_staff)):
    try:
        if not ObjectId.is_valid(staff_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        staff = await staffs_collection.find_one({"_id": ObjectId(staff_id)}, {"name": 1})
        if staff is None:
            raise HTTPException(status_code=404, detail="Staff not found")
        return {"name": staff["name"]}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving staff name with id {staff_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/staffs", response_model=StaffResponse, tags=["Staffs"])
async def create_staff(staff: StaffCreate, _user: dict = Depends(require_staff)):
    try:
        email = _normalize_email(staff.email)
        existing = await staffs_collection.find_one(
            {"$or": [{"username": staff.username}, {"email": email}]}
        )
        if existing and existing.get("username") == staff.username:
            raise HTTPException(status_code=400, detail="Username already exists")
        if existing and existing.get("email") == email:
            raise HTTPException(status_code=400, detail="Email already exists")
        staff_dict = staff.model_dump()
        staff_dict["email"] = email
        staff_dict["password"] = hash_password(staff_dict["password"])
        result = await staffs_collection.insert_one(staff_dict)
        staff_dict["_id"] = str(result.inserted_id)
        staff_dict.pop("password", None)
        return StaffResponse(**staff_dict)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating staff: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.put("/staffs/{staff_id}", response_model=StaffResponse, tags=["Staffs"])
async def update_staff(
    staff_id: str, staff: StaffUpdate, _user: dict = Depends(require_staff)
):
    try:
        if not ObjectId.is_valid(staff_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")

        staff_dict = staff.model_dump(exclude_unset=True)
        if "email" in staff_dict:
            staff_dict["email"] = _normalize_email(staff_dict["email"])
        if "password" in staff_dict:
            password = staff_dict.pop("password")
            if password:
                staff_dict["password"] = hash_password(password)

        if not staff_dict:
            raise HTTPException(status_code=400, detail="No fields to update")

        if "username" in staff_dict:
            existing = await staffs_collection.find_one(
                {
                    "username": staff_dict["username"],
                    "_id": {"$ne": ObjectId(staff_id)},
                }
            )
            if existing:
                raise HTTPException(status_code=400, detail="Username already exists")

        if "email" in staff_dict:
            existing = await staffs_collection.find_one(
                {
                    "email": staff_dict["email"],
                    "_id": {"$ne": ObjectId(staff_id)},
                }
            )
            if existing:
                raise HTTPException(status_code=400, detail="Email already exists")

        result = await staffs_collection.update_one(
            {"_id": ObjectId(staff_id)},
            {"$set": staff_dict},
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Staff not found")

        updated_staff = await staffs_collection.find_one(
            {"_id": ObjectId(staff_id)}, {"password": 0}
        )
        return _to_staff_response(updated_staff)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating staff with id {staff_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/staffs/{staff_id}", response_model=dict, tags=["Staffs"])
async def delete_staff(staff_id: str, _user: dict = Depends(require_staff)):
    try:
        if not ObjectId.is_valid(staff_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await staffs_collection.delete_one({"_id": ObjectId(staff_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": staff_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting staff with id {staff_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/staffs", response_model=dict, tags=["Staffs"])
async def delete_all_staffs(_user: dict = Depends(require_staff)):
    try:
        result = await staffs_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all staffs: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
