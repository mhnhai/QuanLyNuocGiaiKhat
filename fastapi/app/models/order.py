from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId
from datetime import datetime

class OrderModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    id_customer: str
    id_staff: str
    order_date: datetime
    shipping_date: datetime
    form_payment: str
    total_price: float
    status: str
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}