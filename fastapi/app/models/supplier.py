from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class SupplierModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str
    email: str
    address: str
    phone: str
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}