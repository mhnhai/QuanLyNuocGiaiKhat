from fastapi import APIRouter, HTTPException
from typing import List
from app.database import suppliers_collection
from app.models.supplier import SupplierModel
from bson import ObjectId
import logging

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/suppliers", response_model=List[SupplierModel])
async def read_suppliers():
    try:
        suppliers = []
        async for supplier in suppliers_collection.find():
            supplier["_id"] = str(supplier["_id"])  # Convert ObjectId to string
            suppliers.append(SupplierModel(**supplier))
        return suppliers
    except Exception as e:
        logger.error(f"Error retrieving suppliers: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/suppliers/{supplier_id}", response_model=SupplierModel)
async def read_supplier(supplier_id: str):
    try:
        if not ObjectId.is_valid(supplier_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        supplier = await suppliers_collection.find_one({"_id": ObjectId(supplier_id)})
        if supplier is None:
            raise HTTPException(status_code=404, detail="Supplier not found")
        supplier["_id"] = str(supplier["_id"])  # Convert ObjectId to string
        return SupplierModel(**supplier)
    except Exception as e:
        logger.error(f"Error retrieving supplier with id {supplier_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/suppliers", response_model=SupplierModel)
async def create_supplier(supplier: SupplierModel):
    try:
        supplier_dict = supplier.dict(by_alias=True, exclude_unset=True)
        if "_id" in supplier_dict:
            del supplier_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        result = await suppliers_collection.insert_one(supplier_dict)
        supplier_dict["_id"] = str(result.inserted_id)
        return SupplierModel(**supplier_dict)
    except Exception as e:
        logger.error(f"Error creating supplier: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.put("/suppliers/{supplier_id}", response_model=SupplierModel)
async def update_supplier(supplier_id: str, updated_supplier: SupplierModel):
    try:
        if not ObjectId.is_valid(supplier_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        supplier_dict = updated_supplier.dict(by_alias=True, exclude_unset=True)
        result = await suppliers_collection.update_one({"_id": ObjectId(supplier_id)}, {"$set": supplier_dict})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="supplier not found")
        supplier_dict["_id"] = supplier_id
        return SupplierModel(**supplier_dict)
    except Exception as e:
        logger.error(f"Error updating supplier with id {supplier_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/suppliers/{supplier_id}", response_model=dict)
async def delete_supplier(supplier_id: str):
    try:
        if not ObjectId.is_valid(supplier_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await suppliers_collection.delete_one({"_id": ObjectId(supplier_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": supplier_id}
    except Exception as e:
        logger.error(f"Error deleting supplier with id {supplier_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/suppliers", response_model=dict)
async def delete_all_suppliers():
    try:
        result = await suppliers_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all suppliers: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")