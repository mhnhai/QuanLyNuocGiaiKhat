from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from .orderitem import OrderItem

class OrderModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    id_customer: str
    id_staff: str
    order_date: datetime
    shipping_date: Optional[datetime] = None
    form_payment: str = Field(..., min_length=5, max_length=50)
    total_price: float
    status: str = Field(..., min_length=5, max_length=50)
    order_items: List[OrderItem]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }