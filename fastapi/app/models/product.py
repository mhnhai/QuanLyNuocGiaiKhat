from pydantic import BaseModel, Field
from typing import Union, List, Optional
from bson import ObjectId
from .supplierprice import SupplierPrice

class ProductModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    name: str = Field(..., min_length=2, max_length=100)
    supplier_price: List[SupplierPrice] # gia nhap tu cac nha cung cap    
    selling_price: float # gia ban
    category: str = Field(..., min_length=2, max_length=20)
    stock: int
    volume: str = Field(..., min_length=2, max_length=10)
    origin: str = Field(..., min_length=2, max_length=30)
    description: str = Field(..., min_length=10, max_length=1000)
    image: Union[str, None] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}