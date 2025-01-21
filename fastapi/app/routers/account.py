from fastapi import APIRouter, HTTPException
from typing import List
from app.database import accounts_collection
from app.models.account import AccountModel
from bson import ObjectId
import logging

router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/accounts", response_model=List[AccountModel])
async def read_accounts():
    try:
        accounts = []
        async for account in accounts_collection.find():
            account["_id"] = str(account["_id"])  # Convert ObjectId to string
            accounts.append(AccountModel(**account))
        return accounts
    except Exception as e:
        logger.error(f"Error retrieving accounts: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/accounts/{account_id}", response_model=AccountModel)
async def read_account(account_id: str):
    try:
        if not ObjectId.is_valid(account_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        account = await accounts_collection.find_one({"_id": ObjectId(account_id)})
        if account is None:
            raise HTTPException(status_code=404, detail="Account not found")
        account["_id"] = str(account["_id"])  # Convert ObjectId to string
        return AccountModel(**account)
    except Exception as e:
        logger.error(f"Error retrieving account with id {account_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/accounts", response_model=AccountModel)
async def create_account(account: AccountModel):
    try:
        account_dict = account.dict(by_alias=True, exclude_unset=True)
        if "_id" in account_dict:
            del account_dict["_id"]  # Ensure _id is not included in the document to let MongoDB generate it
        result = await accounts_collection.insert_one(account_dict)
        account_dict["_id"] = str(result.inserted_id)
        return AccountModel(**account_dict)
    except Exception as e:
        logger.error(f"Error creating account: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.put("/accounts/{account_id}", response_model=AccountModel)
async def update_account(account_id: str, updated_account: AccountModel):
    try:
        if not ObjectId.is_valid(account_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        account_dict = updated_account.dict(by_alias=True, exclude_unset=True)
        result = await accounts_collection.update_one({"_id": ObjectId(account_id)}, {"$set": account_dict})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="account not found")
        account_dict["_id"] = account_id
        return AccountModel(**account_dict)
    except Exception as e:
        logger.error(f"Error updating account with id {account_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.delete("/accounts/{account_id}", response_model=dict)
async def delete_account(account_id: str):
    try:
        if not ObjectId.is_valid(account_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        result = await accounts_collection.delete_one({"_id": ObjectId(account_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"_id": account_id}
    except Exception as e:
        logger.error(f"Error deleting account with id {account_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/accounts", response_model=dict)
async def delete_all_accounts():
    try:
        result = await accounts_collection.delete_many({})
        return {"deleted_count": result.deleted_count}
    except Exception as e:
        logger.error(f"Error deleting all accounts: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")