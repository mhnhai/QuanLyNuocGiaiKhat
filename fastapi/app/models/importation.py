from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId
from datetime import date
from .importitem import ImportItem

class ImportationModel(BaseModel):
    id: str = Field(alias="_id", default=None)
    id_supplier: str
    id_staff: str
    # import_date: date
    total_price: float
    import_items: List[ImportItem]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            date: lambda v: v.strftime("%d-%m-%Y")
        }