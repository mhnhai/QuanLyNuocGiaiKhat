from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId
from datetime import datetime

class StaffModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str
    position: str
    birth_date: datetime 
    username: str 
    password: str
    phone: str = Field(..., min_length=10, max_length=10)
    role_account: str 
    address: str
    salary: float 
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
           