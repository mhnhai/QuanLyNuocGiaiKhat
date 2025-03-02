from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
import logging
from app.functions.cost import calculate_cost, calculate_monthly_cost, calculate_yearly_cost, calculate_daily_cost

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/cost")
async def get_cost(period: str = Query(..., enum=["month", "year", "years"]), value: int = Query(...)):
    try:
    
        if period == "year":
            value_date = datetime.strptime(str(value), "%Y")
            monthly_cost = await calculate_monthly_cost(value_date.year)
            return {"period": period, "value": value, "monthly_cost": monthly_cost}
        elif period == "years":
            value_date = datetime.strptime(str(value), "%Y")
            yearly_cost = await calculate_yearly_cost(value_date.year)
            return {"period": period, "value": value, "yearly_cost": yearly_cost}
        elif period == "month":
            value_date = datetime.strptime(str(value), "%Y%m")
            daily_cost = await calculate_daily_cost(value_date.year, value_date.month)
            return {"period": period, "value": value, "daily_cost": daily_cost}
        else:
            raise ValueError("Invalid period")
    except Exception as e:
        logger.error(f"Error retrieving cost: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")