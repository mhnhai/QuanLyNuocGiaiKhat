from fastapi import APIRouter, HTTPException
from typing import List
from app.database import products_collection
from app.models.product import ProductModel
from bson import ObjectId
import logging

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/products/count", response_model=dict, tags=["Products"])
async def count_products():
    try:
        count = await products_collection.count_documents({})
        logger.info(f"Product count: {count}")
        return {"total_products": count}
    except Exception as e:
        logger.error(f"Error counting products: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/products/supplier/{id_supplier}", response_model=List[ProductModel], tags=["Products"])
async def get_products_by_supplier(id_supplier: str):

    try:
        products = []
        async for product in products_collection.find({"supplier_price.id_supplier": id_supplier}).sort("name", 1):
            product["_id"] = str(product["_id"])  # Convert ObjectId to string
            products.append(ProductModel(**product))
        return products
    except Exception as e:
        logger.error(f"Error retrieving products for supplier {id_supplier}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/products", response_model=List[ProductModel], tags=["Products"])
async def read_products(sort_by: str = "stock", order: int = -1):
    try:
        products = []
        # Validate sort parameters
        valid_sort_fields = ["stock", "name", "selling_price"]
        if sort_by not in valid_sort_fields:
            sort_by = "stock"
        if order not in [-1, 1]:
            order = -1
            
        cursor = products_collection.find().sort(sort_by, order)
        async for product in cursor:
            product["_id"] = str(product["_id"])  # Convert ObjectId to string
            products.append(ProductModel(**product))
        return products
    except Exception as e:
        logger.error(f"Error retrieving products: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/products/{product_id}", response_model=ProductModel, tags=["Products"])
async def read_product(product_id: str):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        product = await products_collection.find_one({"_id": ObjectId(product_id)})
        if product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        product["_id"] = str(product["_id"])  # Convert ObjectId to string
        return ProductModel(**product)
    except Exception as e:
        logger.error(f"Error retrieving product with id {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/products/{product_id}/name", response_model=dict, tags=["Products"])
async def get_product_name(product_id: str):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        product = await products_collection.find_one({"_id": ObjectId(product_id)}, {"name": 1})
        if product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"name": product["name"]}
    except Exception as e:
        logger.error(f"Error retrieving product name with id {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/products", response_model=ProductModel, tags=["Products"])
async def create_product(product: ProductModel):
    try:
        product_dict = product.dict(by_alias=True, exclude_unset=True)
        if "_id" in product_dict:
            del product_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        result = await products_collection.insert_one(product_dict)
        product_dict["_id"] = str(result.inserted_id)
        return ProductModel(**product_dict)
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.put("/products/{product_id}", response_model=ProductModel, tags=["Products"])
async def update_product(product_id: str, product: ProductModel):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        
        product_dict = product.dict()
        if "_id" in product_dict:
            del product_dict["_id"]  # Remove the _id field from the update data
        
        result = await products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": product_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        
        updated_product = await products_collection.find_one({"_id": ObjectId(product_id)})
        updated_product["_id"] = str(updated_product["_id"])  # Convert ObjectId to string
        return ProductModel(**updated_product)
    except Exception as e:
        logger.error(f"Error updating product with id {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/products/{product_id}", response_model=dict, tags=["Products"])
async def delete_product(product_id: str):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await products_collection.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": product_id}
    except Exception as e:
        logger.error(f"Error deleting product with id {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/products", response_model=dict, tags=["Products"])
async def delete_all_products():
    try:
        result = await products_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all products: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
