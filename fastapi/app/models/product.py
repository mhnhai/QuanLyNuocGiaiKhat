from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class ProductModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    id_supplier: str
    name: str
    import_price: float # gia nhap
    selling_price: float # gia ban
    category: str
    stock: int
    volume: Union[str, None] = None
    origin: Union[str, None] = None
    description: Union[str, None] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}