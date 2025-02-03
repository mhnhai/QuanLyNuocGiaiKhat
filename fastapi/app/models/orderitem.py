from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class OrderItem(BaseModel):
    id_product: str
    quantity: int
    selling_price: float