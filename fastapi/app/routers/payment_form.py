from fastapi import APIRouter
from app.constants.payment_form import payment_forms

router = APIRouter()

@router.get("/payment_forms", response_model=list)
async def get_payment_forms():
    return payment_forms