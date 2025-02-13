from fastapi import APIRouter
from app.constants.status_order import statuses

router = APIRouter()

@router.get("/statuses", response_model=list)
async def get_statuses():
    return statuses