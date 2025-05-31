from pymongo import MongoClient
from dotenv import load_dotenv
import os


client = MongoClient(os.getenv("MONGO_URI"))

db = client.booking_app
bookings = db.bookings
availability = db.availability
