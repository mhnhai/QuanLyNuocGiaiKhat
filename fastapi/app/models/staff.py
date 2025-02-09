from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId
from datetime import date

class StaffModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str
    position: str
    # birth_date: date 
    salary: float 
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            date: lambda v: v.strftime("%d-%m-%Y")
        }