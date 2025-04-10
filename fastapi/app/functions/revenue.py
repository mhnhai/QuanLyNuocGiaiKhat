from datetime import datetime, timedelta
from fastapi import HTTPException
from app.database import orders_collection
import logging

logger = logging.getLogger(__name__)

async def calculate_daily_revenue(year: int, month: int):
    try:
        daily_revenue = []
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        
        current_date = start_date
        while current_date < end_date:
            next_date = current_date + timedelta(days=1)
            pipeline = [
                {"$match": {"order_date": {"$gte": current_date, "$lt": next_date}, "status": "Đã giao"}},
                {"$group": {"_id": None, "total_revenue": {"$sum": "$total_price"}}}
            ]
            result = await orders_collection.aggregate(pipeline).to_list(length=None)
            daily_revenue.append(result[0]["total_revenue"] if result else 0.0)
            current_date = next_date
        
        return daily_revenue
    except Exception as e:
        logger.error(f"Error calculating daily revenue: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

async def calculate_monthly_revenue(year: int):
    try:
        monthly_revenue = []
        for month in range(1, 13):
            start_date = datetime(year, month, 1)
            if month == 12:
                end_date = datetime(year + 1, 1, 1)
            else:
                end_date = datetime(year, month + 1, 1)
            pipeline = [
                {"$match": {"order_date": {"$gte": start_date, "$lt": end_date}, "status": "Đã giao"}},
                {"$group": {"_id": None, "total_revenue": {"$sum": "$total_price"},}}
            ]
            result = await orders_collection.aggregate(pipeline).to_list(length=None)
            monthly_revenue.append(result[0]["total_revenue"] if result else 0.0)
        return monthly_revenue
    except Exception as e:
        logger.error(f"Error calculating monthly revenue: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

async def calculate_yearly_revenue(year: int):
    try:
        yearly_revenue = []
        for y in range(year - 4, year + 1):
            start_date = datetime(y, 1, 1)
            end_date = datetime(y + 1, 1, 1)
            pipeline = [
                {"$match": {"order_date": {"$gte": start_date, "$lt": end_date}}},
                {"$group": {"_id": None, "total_revenue": {"$sum": "$total_price"}}}
            ]
            result = await orders_collection.aggregate(pipeline).to_list(length=None)
            yearly_revenue.append(result[0]["total_revenue"] if result else 0.0)
        return yearly_revenue
    except Exception as e:
        logger.error(f"Error calculating yearly revenue: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")