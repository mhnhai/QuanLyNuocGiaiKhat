from fastapi import APIRouter
from app.constants.role_account import role

router = APIRouter()

@router.get("/roles", response_model=list)
async def get_roles():
    return role