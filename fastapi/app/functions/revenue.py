from datetime import datetime, timedelta
from fastapi import HTTPException
from app.database import orders_collection
import logging

logger = logging.getLogger(__name__)

async def calculate_revenue(period: str, value: datetime) -> float:
    try:
        if period == "date":
            start_date = datetime(value.year, value.month, value.day)
            end_date = start_date + timedelta(days=1)
        elif period == "month":
            start_date = datetime(value.year, value.month, 1)
            if value.month == 12:
                end_date = datetime(value.year + 1, 1, 1)
            else:
                end_date = datetime(value.year, value.month + 1, 1)
        elif period == "year":
            start_date = datetime(value.year, 1, 1)
            end_date = datetime(value.year + 1, 1, 1)
        else:
            raise ValueError("Invalid period")

        pipeline = [
            {"$match": {"order_date": {"$gte": start_date, "$lt": end_date}}},
            {"$group": {"_id": None, "total_revenue": {"$sum": "$total_price"}}}
        ]

        result = await orders_collection.aggregate(pipeline).to_list(length=None)
        return result[0]["total_revenue"] if result else 0.0
    except Exception as e:
        logger.error(f"Error calculating revenue: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")