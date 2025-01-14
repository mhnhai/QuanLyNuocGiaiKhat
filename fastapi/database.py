from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Union

MONGO_DETAILS = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.items_db
items_collection = database.get_collection("items_collection")

class ItemModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str
    price: float
    is_offer: Union[bool, None] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}