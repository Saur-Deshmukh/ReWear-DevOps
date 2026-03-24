from pymongo import MongoClient, ASCENDING, DESCENDING, TEXT
from config import MONGO_URI, MONGO_DB_NAME

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

def init_collections():
    db.users.create_index([("uid", ASCENDING)], unique=True)
    db.users.create_index([("role", ASCENDING)])

    # Updated indexes for items
    db.items.create_index([("approved", ASCENDING), ("status", ASCENDING)])
    db.items.create_index([("uploaderUid", ASCENDING)])
    db.items.create_index([("category", ASCENDING)])
    db.items.create_index([("type", ASCENDING)])
    db.items.create_index([("size", ASCENDING)])
    db.items.create_index([("brand", ASCENDING)])
    db.items.create_index([("color", ASCENDING)])
    db.items.create_index([("material", ASCENDING)])
    db.items.create_index([("points", ASCENDING)])
    db.items.create_index([
        ("tags", TEXT), 
        ("title", TEXT), 
        ("description", TEXT)
    ])  # full-text search for UI

    db.swaps.create_index([("ownerUid", ASCENDING)])
    db.swaps.create_index([("requesterUid", ASCENDING)])
    db.swaps.create_index([("status", ASCENDING), ("timestamps.requestedAt", DESCENDING)])

    db.pointLogs.create_index([("uid", ASCENDING), ("createdAt", DESCENDING)])
    db.adminTasks.create_index([("status", ASCENDING), ("createdAt", DESCENDING)])

    print("MongoDB indexes created.")
