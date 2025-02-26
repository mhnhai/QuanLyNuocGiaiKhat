from fastapi import APIRouter
from app.constants.position import position

router = APIRouter()

@router.get("/positions", response_model=list)
async def get_positions():
    return position