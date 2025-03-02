from fastapi import APIRouter, HTTPException
from typing import List
from app.database import orders_collection
from app.models.order import OrderModel
from bson import ObjectId
import logging
from datetime import datetime, date

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/orders/count", response_model=dict,  tags=["Orders"])
async def count_orders():
    try:
        count = await orders_collection.count_documents({})
        return {"total_orders": count}
    except Exception as e:
        logger.error(f"Error counting orders: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/orders", response_model=List[OrderModel], tags=["Orders"])
async def read_orders():
    try:
        orders = []
        async for order in orders_collection.find():
            order["_id"] = str(order["_id"])  # Convert ObjectId to string
            orders.append(OrderModel(**order))
        return orders
    except Exception as e:
        logger.error(f"Error retrieving orders: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/orders/{order_id}", response_model=OrderModel, tags=["Orders"])
async def read_order(order_id: str):
    try:
        if not ObjectId.is_valid(order_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        order = await orders_collection.find_one({"_id": ObjectId(order_id)})
        if order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        order["_id"] = str(order["_id"])  # Convert ObjectId to string
        return OrderModel(**order)
    except Exception as e:
        logger.error(f"Error retrieving order with id {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/orders", response_model=OrderModel, tags=["Orders"])
async def create_order(order: OrderModel):
    try:
        order_dict = order.dict(by_alias=True, exclude_unset=True)

        if "_id" in order_dict:
            del order_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        
        result = await orders_collection.insert_one(order_dict)
        order_dict["_id"] = str(result.inserted_id)
        return OrderModel(**order_dict)
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.put("/orders/{order_id}", response_model=OrderModel, tags=["Orders"])
async def update_order(order_id: str, order: OrderModel):
    try:
        if not ObjectId.is_valid(order_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        
        order_dict = order.dict(by_alias=True, exclude_unset=True)

        if "_id" in order_dict:
            del order_dict["_id"]  # Remove the _id field from the update data
        
        result = await orders_collection.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": order_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        updated_order = await orders_collection.find_one({"_id": ObjectId(order_id)})
        updated_order["_id"] = str(updated_order["_id"])  # Convert ObjectId to string
        return OrderModel(**updated_order)
    except Exception as e:
        logger.error(f"Error updating order with id {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/orders/{order_id}", response_model=dict, tags=["Orders"])
async def delete_order(order_id: str):
    try:
        if not ObjectId.is_valid(order_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await orders_collection.delete_one({"_id": ObjectId(order_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": order_id}
    except Exception as e:
        logger.error(f"Error deleting order with id {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/orders", response_model=dict, tags=["Orders"])
async def delete_all_orders():
    try:
        result = await orders_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all orders: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")