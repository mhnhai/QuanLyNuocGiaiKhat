from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.my_database

# Collections
products_collection = database.get_collection("products_collection")
customers_collection = database.get_collection("customers_collection")
staffs_collection = database.get_collection("staffs_collection")
suppliers_collection = database.get_collection("suppliers_collection")
orders_collection = database.get_collection("orders_collection")
importations_collection = database.get_collection("importations_collection")
