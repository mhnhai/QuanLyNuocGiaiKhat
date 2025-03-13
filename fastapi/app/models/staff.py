from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from .customer import CustomerModel  # Import the AccountModel

class StaffModel(CustomerModel):  # Inherit from AccountModel
    position: str
    salary: float

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}