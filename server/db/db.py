from pymongo import MongoClient
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))

db = client.bookings_app
bookings = db.bookings
availability = db.availability
