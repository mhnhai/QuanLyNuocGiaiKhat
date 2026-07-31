from pydantic import BaseModel, Field
from typing import Optional


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class UserInfo(BaseModel):
    id: str
    name: str
    username: str
    email: Optional[str] = None
    role: str
    type: str
