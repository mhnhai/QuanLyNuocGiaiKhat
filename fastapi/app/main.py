# from fastapi import FastAPI, HTTPException
# from typing import List
# from app.database import ItemModel, items_collection
# from bson import ObjectId
# import logging

# app = FastAPI()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

# @app.get("/items", response_model=List[ItemModel])
# async def read_items():
#     try:
#         items = []
#         async for item in items_collection.find():
#             item["_id"] = str(item["_id"])  # Convert ObjectId to string
#             items.append(ItemModel(**item))
#         return items
#     except Exception as e:
#         logger.error(f"Error retrieving items: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

# @app.get("/items/{item_id}", response_model=ItemModel)
# async def read_item(item_id: str):
#     try:
#         if not ObjectId.is_valid(item_id):
#             raise HTTPException(status_code=400, detail="Invalid ObjectId")
#         item = await items_collection.find_one({"_id": ObjectId(item_id)})
#         if item is None:
#             raise HTTPException(status_code=404, detail="Item not found")
#         item["_id"] = str(item["_id"])  # Convert ObjectId to string
#         return ItemModel(**item)
#     except Exception as e:
#         logger.error(f"Error retrieving item with id {item_id}: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

# @app.post("/items", response_model=ItemModel)
# async def create_item(item: ItemModel):
#     try:
#         item_dict = item.dict(by_alias=True, exclude_unset=True)
#         if "_id" in item_dict:
#             del item_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
#         result = await items_collection.insert_one(item_dict)
#         item_dict["_id"] = str(result.inserted_id)
#         return ItemModel(**item_dict)
#     except Exception as e:
#         logger.error(f"Error creating item: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

# @app.put("/items/{item_id}", response_model=ItemModel)
# async def update_item(item_id: str, updated_item: ItemModel):
#     try:
#         if not ObjectId.is_valid(item_id):
#             raise HTTPException(status_code=400, detail="Invalid ObjectId")
#         item_dict = updated_item.dict(by_alias=True, exclude_unset=True)
#         result = await items_collection.update_one({"_id": ObjectId(item_id)}, {"$set": item_dict})
#         if result.modified_count == 0:
#             raise HTTPException(status_code=404, detail="Item not found")
#         item_dict["_id"] = item_id
#         return ItemModel(**item_dict)
#     except Exception as e:
#         logger.error(f"Error updating item with id {item_id}: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

# @app.delete("/items/{item_id}", response_model=dict)
# async def delete_item(item_id: str):
#     try:
#         if not ObjectId.is_valid(item_id):
#             raise HTTPException(status_code=400, detail="Invalid ObjectId")
#         result = await items_collection.delete_one({"_id": ObjectId(item_id)})
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Item not found")
#         return {"_id": item_id}
#     except Exception as e:
#         logger.error(f"Error deleting item with id {item_id}: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import item, account, product, staff, supplier, order, importation, role_account, status_order
    
origins =[
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(item.router, prefix="/api")
app.include_router(product.router, prefix="/api")
app.include_router(account.router, prefix="/api")
app.include_router(staff.router, prefix="/api")
app.include_router(supplier.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(importation.router, prefix="/api")
app.include_router(role_account.router, prefix="/api")
app.include_router(status_order.router, prefix="/api")
@app.get("/")
def read_root():
    return {"Hello": "World"}
