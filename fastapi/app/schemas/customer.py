from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    username: str = Field(..., min_length=5, max_length=20)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6, max_length=20)
    phone: str = Field(..., min_length=10, max_length=10)
    address: str = Field(..., min_length=1, max_length=100)
    role_account: str = Field(default="customer")


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    username: Optional[str] = Field(None, min_length=5, max_length=20)
    email: Optional[str] = Field(None, min_length=5, max_length=100)
    password: Optional[str] = Field(None, min_length=6, max_length=20)
    phone: Optional[str] = Field(None, min_length=10, max_length=10)
    address: Optional[str] = Field(None, min_length=1, max_length=100)
    role_account: Optional[str] = None


class CustomerResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, ser_json_by_alias=True)

    id: str = Field(alias="_id")
    name: str
    username: str
    email: Optional[str] = None
    phone: str
    address: str
    role_account: str = "customer"
