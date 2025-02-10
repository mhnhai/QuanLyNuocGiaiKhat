from pydantic import BaseModel, Field
from typing import Union
from bson import ObjectId

class ImportItem(BaseModel):
    id_product: str
    quantity: int
    import_price: float