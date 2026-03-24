import os
from dotenv import load_dotenv

# Load env vars from .env file
load_dotenv()

MONGO_URI = os.getenv("DATABASE_URI")
MONGO_DB_NAME = "ReWearDB"
