from datetime import datetime, timedelta
from fastapi import HTTPException
from app.database import importations_collection
import logging

logger = logging.getLogger(__name__)

async def calculate_cost(period: str, value: datetime):
    try:
        if period == "year":
            start_date = datetime(value.year, 1, 1)
            end_date = datetime(value.year + 1, 1, 1)
        elif period == "years":
            start_date = datetime(value.year - 5, 1, 1)
            end_date = datetime(value.year + 1, 1, 1)
        else:
            raise ValueError("Invalid period")

        pipeline = [
            {"$match": {"import_date": {"$gte": start_date, "$lt": end_date}}},
            {"$group": {"_id": None, "total_cost": {"$sum": "$total_price"}}}
        ]

        result = await importations_collection.aggregate(pipeline).to_list(length=None)
        return result[0]["total_cost"] if result else 0.0
    except Exception as e:
        logger.error(f"Error calculating cost: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

async def calculate_daily_cost(year: int, month: int):
    try:
        daily_cost = []
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        
        current_date = start_date
        while current_date < end_date:
            next_date = current_date + timedelta(days=1)
            pipeline = [
                {"$match": {"import_date": {"$gte": current_date, "$lt": next_date}}},
                {"$group": {"_id": None, "total_cost": {"$sum": "$total_price"}}}
            ]
            result = await importations_collection.aggregate(pipeline).to_list(length=None)
            daily_cost.append(result[0]["total_cost"] if result else 0.0)
            current_date = next_date
        
        return daily_cost
    except Exception as e:
        logger.error(f"Error calculating daily cost: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

async def calculate_monthly_cost(year: int):
    try:
        monthly_cost = []
        for month in range(1, 13):
            start_date = datetime(year, month, 1)
            if month == 12:
                end_date = datetime(year + 1, 1, 1)
            else:
                end_date = datetime(year, month + 1, 1)
            pipeline = [
                {"$match": {"import_date": {"$gte": start_date, "$lt": end_date}}},
                {"$group": {"_id": None, "total_cost": {"$sum": "$total_price"}}}
            ]
            result = await importations_collection.aggregate(pipeline).to_list(length=None)
            monthly_cost.append(result[0]["total_cost"] if result else 0.0)
        return monthly_cost
    except Exception as e:
        logger.error(f"Error calculating monthly cost: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

async def calculate_yearly_cost(year: int):
    try:
        yearly_cost = []
        for y in range(year - 4, year + 1):
            start_date = datetime(y, 1, 1)
            end_date = datetime(y + 1, 1, 1)
            pipeline = [
                {"$match": {"import_date": {"$gte": start_date, "$lt": end_date}}},
                {"$group": {"_id": None, "total_cost": {"$sum": "$total_price"}}}
            ]
            result = await importations_collection.aggregate(pipeline).to_list(length=None)
            yearly_cost.append(result[0]["total_cost"] if result else 0.0)
        return yearly_cost
    except Exception as e:
        logger.error(f"Error calculating yearly cost: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")