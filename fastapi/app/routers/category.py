from fastapi import APIRouter
from app.constants.category import categories

router = APIRouter()

@router.get("/categories", response_model=list)
async def get_categories():
    return categories