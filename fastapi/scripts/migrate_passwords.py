"""One-time migration: hash plaintext passwords with bcrypt."""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import customers_collection, staffs_collection
from app.utils.security import hash_password, is_bcrypt_hash


async def migrate_collection(collection, label: str) -> int:
    updated = 0
    async for doc in collection.find({}):
        password = doc.get("password", "")
        if not password or is_bcrypt_hash(password):
            continue
        await collection.update_one(
            {"_id": doc["_id"]},
            {"$set": {"password": hash_password(password)}},
        )
        updated += 1
        print(f"  [{label}] hashed password for: {doc.get('username')}")
    return updated


async def main():
    print("Migrating passwords to bcrypt...")
    staff_count = await migrate_collection(staffs_collection, "staff")
    customer_count = await migrate_collection(customers_collection, "customer")
    print(f"Done. Updated {staff_count} staff(s), {customer_count} customer(s).")


if __name__ == "__main__":
    asyncio.run(main())
