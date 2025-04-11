from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class CustomerModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str = Field(..., min_length=2, max_length=50)
    username: str = Field(..., min_length=5, max_length=20)
    password: str = Field(..., min_length=6, max_length=20)
    phone: str = Field(..., min_length=10, max_length=10)
    address: str = Field(..., min_length=1, max_length=100)
    role_account: str = Field(default="customer")
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
           