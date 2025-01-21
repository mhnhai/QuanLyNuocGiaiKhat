from fastapi import APIRouter, HTTPException
from typing import List
from app.database import items_collection
from app.models.item import ItemModel
from bson import ObjectId
import logging

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/items", response_model=List[ItemModel])
async def read_items():
    try:
        items = []
        async for item in items_collection.find():
            item["_id"] = str(item["_id"])  # Convert ObjectId to string
            items.append(ItemModel(**item))
        return items
    except Exception as e:
        logger.error(f"Error retrieving items: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/items", response_model=ItemModel)
async def create_item(item: ItemModel):
    try:
        item_dict = item.dict(by_alias=True, exclude_unset=True)
        if "_id" in item_dict:
            del item_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        result = await items_collection.insert_one(item_dict)
        item_dict["_id"] = str(result.inserted_id)
        return ItemModel(**item_dict)
    except Exception as e:
        logger.error(f"Error creating item: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.put("/items/{item_id}", response_model=ItemModel)
async def update_item(item_id: str, updated_item: ItemModel):
    try:
        if not ObjectId.is_valid(item_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        item_dict = updated_item.dict(by_alias=True, exclude_unset=True)
        result = await items_collection.update_one({"_id": ObjectId(item_id)}, {"$set": item_dict})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        item_dict["_id"] = item_id
        return ItemModel(**item_dict)
    except Exception as e:
        logger.error(f"Error updating item with id {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/items", response_model=dict)
async def delete_all_items():
    try:
        result = await items_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all items: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")