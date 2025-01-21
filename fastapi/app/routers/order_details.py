# from database import OrderDetailsModel, order_details_collection

# @app.get("/order-details", response_model=List[OrderDetailsModel])
# async def read_order_details():
#     try:
#         order_details = []
#         async for detail in order_details_collection.find():
#             detail["_id"] = str(detail["_id"])  # Convert ObjectId to string
#             order_details.append(OrderDetailsModel(**detail))
#         return order_details
#     except Exception as e:
#         logger.error(f"Error retrieving order details: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

# @app.post("/order-details", response_model=OrderDetailsModel)
# async def create_order_detail(detail: OrderDetailsModel):
#     try:
#         detail_dict = detail.dict(by_alias=True, exclude_unset=True)
#         if "_id" in detail_dict:
#             del detail_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
#         result = await order_details_collection.insert_one(detail_dict)
#         detail_dict["_id"] = str(result.inserted_id)
#         return OrderDetailsModel(**detail_dict)
#     except Exception as e:
#         logger.error(f"Error creating order detail: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")