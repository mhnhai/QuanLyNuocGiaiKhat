from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class AccountModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    username: str 
    password: str
    role_account: str 
    phone: str 
    address: str
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}