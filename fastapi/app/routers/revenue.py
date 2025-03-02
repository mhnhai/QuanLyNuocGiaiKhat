from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
import logging
from app.functions.revenue import calculate_revenue, calculate_monthly_revenue, calculate_yearly_revenue, calculate_daily_revenue

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/revenue")
async def get_revenue(period: str = Query(..., enum=["month", "year", "years"]), value: int = Query(...)):
    try:
    
        if period == "year":
            value_date = datetime.strptime(str(value), "%Y")
            monthly_revenue = await calculate_monthly_revenue(value_date.year)
            return {"period": period, "value": value, "monthly_revenue": monthly_revenue}
        elif period == "years":
            value_date = datetime.strptime(str(value), "%Y")
            yearly_revenue = await calculate_yearly_revenue(value_date.year)
            return {"period": period, "value": value, "yearly_revenue": yearly_revenue}
        elif period == "month":
            value_date = datetime.strptime(str(value), "%Y%m")
            daily_revenue = await calculate_daily_revenue(value_date.year, value_date.month)
            return {"period": period, "value": value, "daily_revenue": daily_revenue}
        else:
            raise ValueError("Invalid period")
    except Exception as e:
        logger.error(f"Error retrieving revenue: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")