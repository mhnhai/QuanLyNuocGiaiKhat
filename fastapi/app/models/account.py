from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class AccountModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    username: str 
    password: str
    role_account: str 
    phone: str 
    # phone: str = Field(..., description="Phone number must be between 10 and 15 characters", min_length=10, max_length=10)
    address: str
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}