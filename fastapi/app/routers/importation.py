from fastapi import APIRouter, HTTPException
from typing import List
from app.database import importations_collection
from app.models.importation import ImportationModel
from bson import ObjectId
import logging
from datetime import datetime, date

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/importations", response_model=List[ImportationModel])
async def read_importations():
    try:
        importations = []
        async for importation in importations_collection.find():
            importation["_id"] = str(importation["_id"])  # Convert ObjectId to string
            importations.append(ImportationModel(**importation))
        return importations
    except Exception as e:
        logger.error(f"Error retrieving importations: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/importations/{importation_id}", response_model=ImportationModel)
async def read_importation(importation_id: str):
    try:
        if not ObjectId.is_valid(importation_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        importation = await importations_collection.find_one({"_id": ObjectId(importation_id)})
        if importation is None:
            raise HTTPException(status_code=404, detail="Importation not found")
        importation["_id"] = str(importation["_id"])  # Convert ObjectId to string
        return ImportationModel(**importation)
    except Exception as e:
        logger.error(f"Error retrieving importation with id {importation_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/importations", response_model=ImportationModel)
async def create_importation(importation: ImportationModel):
    try:
        importation_dict = importation.dict(by_alias=True, exclude_unset=True)
        
        # Convert datetime.date to datetime.datetime
        if isinstance(importation_dict.get('import_date'), date):
            importation_dict['import_date'] = datetime.combine(importation_dict['import_date'], datetime.min.time())
 
        
        if "_id" in importation_dict:
            del importation_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        
        result = await importations_collection.insert_one(importation_dict)
        importation_dict["_id"] = str(result.inserted_id)
        return ImportationModel(**importation_dict)
    except Exception as e:
        logger.error(f"Error creating importation: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.put("/importations/{importation_id}", response_model=ImportationModel)
async def update_importation(importation_id: str, importation: ImportationModel):
    try:
        if not ObjectId.is_valid(importation_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        
        importation_dict = importation.dict(by_alias=True, exclude_unset=True)
        
        # Convert datetime.date to datetime.datetime
        if isinstance(importation_dict.get('import_date'), date):
            importation_dict['import_date'] = datetime.combine(importation_dict['import_date'], datetime.min.time())

        
        if "_id" in importation_dict:
            del importation_dict["_id"]  # Remove the _id field from the update data
        
        result = await importations_collection.update_one(
            {"_id": ObjectId(importation_id)},
            {"$set": importation_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Importation not found")
        
        updated_importation = await importations_collection.find_one({"_id": ObjectId(importation_id)})
        updated_importation["_id"] = str(updated_importation["_id"])  # Convert ObjectId to string
        return ImportationModel(**updated_importation)
    except Exception as e:
        logger.error(f"Error updating importation with id {importation_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/importations/{importation_id}", response_model=dict)
async def delete_importation(importation_id: str):
    try:
        if not ObjectId.is_valid(importation_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await importations_collection.delete_one({"_id": ObjectId(importation_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": importation_id}
    except Exception as e:
        logger.error(f"Error deleting importation with id {importation_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/importations", response_model=dict)
async def delete_all_importations():
    try:
        result = await importations_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all importations: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")