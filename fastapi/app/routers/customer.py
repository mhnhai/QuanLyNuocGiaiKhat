from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import customers_collection
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.dependencies.auth import require_staff, get_current_user
from app.utils.security import hash_password
from bson import ObjectId
import logging

router = APIRouter()

logger = logging.getLogger(__name__)


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _to_customer_response(doc: dict) -> CustomerResponse:
    doc["_id"] = str(doc["_id"])
    doc.pop("password", None)
    return CustomerResponse(**doc)


@router.get("/customers/check-registered", response_model=dict, tags=["Customers"])
async def check_registered(username: str):
    try:
        customer = await customers_collection.find_one({"username": username})
        return {"registered": customer is not None}
    except Exception as e:
        logger.error(f"Error checking if customer is registered: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/customers/count", response_model=dict, tags=["Customers"])
async def count_customers(_user: dict = Depends(require_staff)):
    try:
        count = await customers_collection.count_documents({})
        return {"total_customers": count}
    except Exception as e:
        logger.error(f"Error counting customers: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/customers", response_model=List[CustomerResponse], tags=["Customers"])
async def read_customers(_user: dict = Depends(require_staff)):
    try:
        customers = []
        async for customer in customers_collection.find({}, {"password": 0}):
            customers.append(_to_customer_response(customer))
        return customers
    except Exception as e:
        logger.error(f"Error retrieving customers: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/customers/{customer_id}", response_model=CustomerResponse, tags=["Customers"])
async def read_customer(customer_id: str, user: dict = Depends(get_current_user)):
    try:
        if not ObjectId.is_valid(customer_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        if user.get("type") == "customer" and user.get("sub") != customer_id:
            raise HTTPException(status_code=403, detail="Access denied")
        customer = await customers_collection.find_one(
            {"_id": ObjectId(customer_id)}, {"password": 0}
        )
        if customer is None:
            raise HTTPException(status_code=404, detail="Customer not found")
        return _to_customer_response(customer)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving customer with id {customer_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/customers", response_model=CustomerResponse, tags=["Customers"])
async def create_customer(customer: CustomerCreate):
    try:
        email = _normalize_email(customer.email)
        existing = await customers_collection.find_one(
            {"$or": [{"username": customer.username}, {"email": email}]}
        )
        if existing and existing.get("username") == customer.username:
            raise HTTPException(status_code=400, detail="Username already exists")
        if existing and existing.get("email") == email:
            raise HTTPException(status_code=400, detail="Email already exists")
        customer_dict = customer.model_dump()
        customer_dict["email"] = email
        customer_dict["password"] = hash_password(customer_dict["password"])
        result = await customers_collection.insert_one(customer_dict)
        customer_dict["_id"] = str(result.inserted_id)
        customer_dict.pop("password", None)
        return CustomerResponse(**customer_dict)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating customer: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.put("/customers/{customer_id}", response_model=CustomerResponse, tags=["Customers"])
async def update_customer(
    customer_id: str,
    customer: CustomerUpdate,
    user: dict = Depends(get_current_user),
):
    try:
        if not ObjectId.is_valid(customer_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        is_staff = user.get("role") in ("admin", "staff")
        is_own_profile = user.get("type") == "customer" and user.get("sub") == customer_id
        if not is_staff and not is_own_profile:
            raise HTTPException(status_code=403, detail="Access denied")

        customer_dict = customer.model_dump(exclude_unset=True)
        if "email" in customer_dict:
            customer_dict["email"] = _normalize_email(customer_dict["email"])
        if "password" in customer_dict:
            password = customer_dict.pop("password")
            if password:
                customer_dict["password"] = hash_password(password)

        if not customer_dict:
            raise HTTPException(status_code=400, detail="No fields to update")

        if "username" in customer_dict:
            existing = await customers_collection.find_one(
                {
                    "username": customer_dict["username"],
                    "_id": {"$ne": ObjectId(customer_id)},
                }
            )
            if existing:
                raise HTTPException(status_code=400, detail="Username already exists")

        if "email" in customer_dict:
            existing = await customers_collection.find_one(
                {
                    "email": customer_dict["email"],
                    "_id": {"$ne": ObjectId(customer_id)},
                }
            )
            if existing:
                raise HTTPException(status_code=400, detail="Email already exists")

        result = await customers_collection.update_one(
            {"_id": ObjectId(customer_id)},
            {"$set": customer_dict},
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Customer not found")

        updated_customer = await customers_collection.find_one(
            {"_id": ObjectId(customer_id)}, {"password": 0}
        )
        return _to_customer_response(updated_customer)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating customer with id {customer_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/customers/{customer_id}", response_model=dict, tags=["Customers"])
async def delete_customer(customer_id: str, _user: dict = Depends(require_staff)):
    try:
        if not ObjectId.is_valid(customer_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await customers_collection.delete_one({"_id": ObjectId(customer_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": customer_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting customer with id {customer_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/customers", response_model=dict, tags=["Customers"])
async def delete_all_customers(_user: dict = Depends(require_staff)):
    try:
        result = await customers_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all customers: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
