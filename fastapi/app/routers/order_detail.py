from fastapi import APIRouter, HTTPException
from typing import List
from app.database import order_details_collection
from app.models.orderitem import OrderDetailModel
from bson import ObjectId
import logging

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/order_details", response_model=List[OrderDetailModel])
async def read_order_details():
    try:
        order_details = []
        async for order_detail in order_details_collection.find():
            order_detail["_id"] = str(order_detail["_id"])  # Convert ObjectId to string
            order_details.append(OrderDetailModel(**order_detail))
        return order_details
    except Exception as e:
        logger.error(f"Error retrieving order_details: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/order_details/{order_detail_id}", response_model=OrderDetailModel)
async def read_order_detail(order_detail_id: str):
    try:
        if not ObjectId.is_valid(order_detail_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        order_detail = await order_details_collection.find_one({"_id": ObjectId(order_detail_id)})
        if order_detail is None:
            raise HTTPException(status_code=404, detail="Order detail not found")
        order_detail["_id"] = str(order_detail["_id"])  # Convert ObjectId to string
        return OrderDetailModel(**order_detail)
    except Exception as e:
        logger.error(f"Error retrieving order_detail with id {order_detail_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/order_details", response_model=OrderDetailModel)
async def create_order_detail(order_detail: OrderDetailModel):
    try:
        order_detail_dict = order_detail.dict(by_alias=True, exclude_unset=True)
        if "_id" in order_detail_dict:
            del order_detail_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        result = await order_details_collection.insert_one(order_detail_dict)
        order_detail_dict["_id"] = str(result.inserted_id)
        return OrderDetailModel(**order_detail_dict)
    except Exception as e:
        logger.error(f"Error creating order_detail: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
@router.put("/order_details/{order_detail_id}", response_model=OrderDetailModel)
async def update_order_detail(order_detail_id: str, order_detail: OrderDetailModel):
    try:
        if not ObjectId.is_valid(order_detail_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        
        order_detail_dict = order_detail.dict()
        if "_id" in order_detail_dict:
            del order_detail_dict["_id"]  # Remove the _id field from the update data
        
        result = await order_details_collection.update_one(
            {"_id": ObjectId(order_detail_id)},
            {"$set": order_detail_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order detail not found")
        
        updated_order_detail = await order_details_collection.find_one({"_id": ObjectId(order_detail_id)})
        updated_order_detail["_id"] = str(updated_order_detail["_id"])  # Convert ObjectId to string
        return OrderDetailModel(**updated_order_detail)
    except Exception as e:
        logger.error(f"Error updating order_detail with id {order_detail_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/order_details/{order_detail_id}", response_model=dict)
async def delete_order_detail(order_detail_id: str):
    try:
        if not ObjectId.is_valid(order_detail_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await order_details_collection.delete_one({"_id": ObjectId(order_detail_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": order_detail_id}
    except Exception as e:
        logger.error(f"Error deleting order_detail with id {order_detail_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/order_details", response_model=dict)
async def delete_all_order_details():
    try:
        result = await order_details_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all order_details: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")