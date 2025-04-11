from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class SupplierModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str = Field(..., min_length=2, max_length=50)
    email: str = Field(..., min_length=5, max_length=50)
    address: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=10, max_length=10)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}