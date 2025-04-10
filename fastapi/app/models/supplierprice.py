from pydantic import BaseModel, Field

class SupplierPrice(BaseModel):
    id_supplier: str
    import_price: float