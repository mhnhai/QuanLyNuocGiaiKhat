from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from app.database import orders_collection
import logging
from app.functions.revenue import calculate_revenue

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/revenue")
async def get_revenue(period: str = Query(..., enum=["date", "month", "year"]), value: int = Query(...)):
    try:
        if period == "date":
            value_date = datetime.strptime(str(value), "%Y%m%d")
        elif period == "month":
            value_date = datetime.strptime(str(value), "%Y%m")
        elif period == "year":
            value_date = datetime.strptime(str(value), "%Y")
        else:
            raise ValueError("Invalid period")

        revenue = await calculate_revenue(period, value_date)
        return {"period": period, "value": value, "revenue": revenue}
    except Exception as e:
        logger.error(f"Error retrieving revenue: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")