from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class CustomerModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str
    username: str 
    password: str
    phone: str = Field(..., min_length=10, max_length=10)
    role_account: str 
    address: str
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
           