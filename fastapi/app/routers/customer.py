from fastapi import APIRouter, HTTPException
from typing import List
from app.database import customers_collection
from app.models.customer import CustomerModel
from bson import ObjectId
import logging

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)
# endpoint to check if the customer is already registered
@router.get("/customers/check-registered", response_model=dict, tags=["Customers"])
async def check_registered(username: str):
    try:
        customer = await customers_collection.find_one({"username": username})
        return {"registered": customer is not None}  
    except Exception as e:
        logger.error(f"Error checking if customer is registered: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/customers/count", response_model=dict,  tags=["Customers"])
async def count_customers():
    try:
        count = await customers_collection.count_documents({})
        return {"total_customers": count}
    except Exception as e:
        logger.error(f"Error counting customers: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/customers", response_model=List[CustomerModel], tags=["Customers"])
async def read_customers():
    try:
        customers = []
        async for customer in customers_collection.find():
            customer["_id"] = str(customer["_id"])  # Convert ObjectId to string
            customers.append(CustomerModel(**customer))
        return customers
    except Exception as e:
        logger.error(f"Error retrieving customers: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/customers/{customer_id}", response_model=CustomerModel, tags=["Customers"])
async def read_customer(customer_id: str):
    try:
        if not ObjectId.is_valid(customer_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
        if customer is None:
            raise HTTPException(status_code=404, detail="Customer not found")
        customer["_id"] = str(customer["_id"])  # Convert ObjectId to string
        return CustomerModel(**customer)
    except Exception as e:
        logger.error(f"Error retrieving customer with id {customer_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/customers", response_model=CustomerModel, tags=["Customers"])
async def create_customer(customer: CustomerModel):
    try:
        customer_dict = customer.dict(by_alias=True, exclude_unset=True)
        if "_id" in customer_dict:
            del customer_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        result = await customers_collection.insert_one(customer_dict)
        customer_dict["_id"] = str(result.inserted_id)
        return CustomerModel(**customer_dict)
    except Exception as e:
        logger.error(f"Error creating customer: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.put("/customers/{customer_id}", response_model=CustomerModel, tags=["Customers"])
async def update_customer(customer_id: str, customer: CustomerModel):
    try:
        if not ObjectId.is_valid(customer_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        
        customer_dict = customer.dict()
        if "_id" in customer_dict:
            del customer_dict["_id"]  # Remove the _id field from the update data
        
        result = await customers_collection.update_one(
            {"_id": ObjectId(customer_id)},
            {"$set": customer_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        updated_customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
        updated_customer["_id"] = str(updated_customer["_id"])  # Convert ObjectId to string
        return CustomerModel(**updated_customer)
    except Exception as e:
        logger.error(f"Error updating customer with id {customer_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/customers/{customer_id}", response_model=dict, tags=["Customers"])
async def delete_customer(customer_id: str):
    try:
        if not ObjectId.is_valid(customer_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await customers_collection.delete_one({"_id": ObjectId(customer_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": customer_id}
    except Exception as e:
        logger.error(f"Error deleting customer with id {customer_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/customers", response_model=dict, tags=["Customers"])
async def delete_all_customers():
    try:
        result = await customers_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all customers: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
