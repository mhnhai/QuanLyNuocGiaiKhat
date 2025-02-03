from fastapi import APIRouter, HTTPException
from typing import List
from app.database import staffs_collection
from app.models.staff import StaffModel
from bson import ObjectId
import logging

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/staffs", response_model=List[StaffModel])
async def read_staffs():
    try:
        staffs = []
        async for staff in staffs_collection.find():
            staff["_id"] = str(staff["_id"])  # Convert ObjectId to string
            staffs.append(StaffModel(**staff))
        return staffs
    except Exception as e:
        logger.error(f"Error retrieving staffs: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/staffs/{staff_id}", response_model=StaffModel)
async def read_staff(staff_id: str):
    try:
        if not ObjectId.is_valid(staff_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        staff = await staffs_collection.find_one({"_id": ObjectId(staff_id)})
        if staff is None:
            raise HTTPException(status_code=404, detail="Staff not found")
        staff["_id"] = str(staff["_id"])  # Convert ObjectId to string
        return StaffModel(**staff)
    except Exception as e:
        logger.error(f"Error retrieving staff with id {staff_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/staffs", response_model=StaffModel)
async def create_staff(staff: StaffModel):
    try:
        staff_dict = staff.dict(by_alias=True, exclude_unset=True)
        if "_id" in staff_dict:
            del staff_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        result = await staffs_collection.insert_one(staff_dict)
        staff_dict["_id"] = str(result.inserted_id)
        return StaffModel(**staff_dict)
    except Exception as e:
        logger.error(f"Error creating staff: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.put("/staffs/{staff_id}", response_model=StaffModel)
async def update_staff(staff_id: str, staff: StaffModel):
    try:
        if not ObjectId.is_valid(staff_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        
        staff_dict = staff.dict()
        if "_id" in staff_dict:
            del staff_dict["_id"]  # Remove the _id field from the update data
        
        result = await staffs_collection.update_one(
            {"_id": ObjectId(staff_id)},
            {"$set": staff_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Staff not found")
        
        updated_staff = await staffs_collection.find_one({"_id": ObjectId(staff_id)})
        updated_staff["_id"] = str(updated_staff["_id"])  # Convert ObjectId to string
        return StaffModel(**updated_staff)
    except Exception as e:
        logger.error(f"Error updating staff with id {staff_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/staffs/{staff_id}", response_model=dict)
async def delete_staff(staff_id: str):
    try:
        if not ObjectId.is_valid(staff_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await staffs_collection.delete_one({"_id": ObjectId(staff_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": staff_id}
    except Exception as e:
        logger.error(f"Error deleting staff with id {staff_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
