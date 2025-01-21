from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class ItemModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str
    price: float
    is_offer: Union[bool, None] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}