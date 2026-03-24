from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB_NAME

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

users = db.users
items = db.items
swaps = db.swaps
point_logs = db.pointLogs
admin_tasks = db.adminTasks
