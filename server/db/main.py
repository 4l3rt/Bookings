import os
from fastapi import FastAPI, Request, HTTPException
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime
from dateutil.parser import isoparse
from utils import format_booking_text
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
import httpx

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID"))

db = client["bookings_app"]
bookings = db.bookings
pending = db.pending
availability = db.availability

app = FastAPI()

def serialize_doc(doc):
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


def to_datetime(value):
    if isinstance(value, str):
        return isoparse(value)
    return value


@app.post("/notify-booking")
async def notify_booking(request: Request):
    data = await request.json()
    insert_result = await bookings.insert_one(data)
    inserted_id = str(insert_result.inserted_id)
    data["_id"] = inserted_id

    text = format_booking_text(data)

    buttons = {
        "inline_keyboard": [[
            {"text": "✅ Approve", "callback_data": f"approve:{inserted_id}"},
            {"text": "❌ Reject", "callback_data": f"reject:{inserted_id}"}
        ]]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={
                "chat_id": ADMIN_ID,
                "text": text,
                "reply_markup": buttons
            }
        )
        response.raise_for_status()

    return {"ok": True, "id": inserted_id}

@app.post("/confirm-booking")
async def confirm_booking(data: dict):
    bid = data.get("id")

    booking = await bookings.find_one({"_id": ObjectId(bid)})

    room_id = str(booking["roomId"])
    check_in = to_datetime(booking["checkIn"])
    check_out = to_datetime(booking["checkOut"])
    
    await availability.update_one(
        {"source": "booking_com"},
        {"$push": {f"ranges_by_room.{room_id}": [check_in, check_out]}},
        upsert=True
    )

    await bookings.update_one(
        {"_id": ObjectId(bid)},
        {"$set": {
            "status": "Approved",
            "checkIn": check_in,
            "checkOut": check_out
        }}
    )

    updated_booking = await bookings.find_one({"_id": ObjectId(bid)})
    return {"ok": True, "booking": serialize_doc(updated_booking)}

@app.post("/reject-booking")
async def reject_booking(data: dict):
    bid = data.get("id")
    await bookings.delete_one({"_id": ObjectId(bid)})
    return {"ok": True}

@app.post("/delete-booking")
async def delete_booking(data: dict):
    bid = data.get("id")

    booking = await bookings.find_one({"_id": ObjectId(bid)})

    
    room_id = str(booking["roomId"])
    check_in = booking["checkIn"]
    check_out = booking["checkOut"]

    await availability.update_one(
        {"source": "booking_com"},
        {"$pull": {f"ranges_by_room.{room_id}": [check_in, check_out]}}
    )

    booking["_id"] = str(booking["_id"])
    booking["checkIn"] = check_in.isoformat()
    booking["checkOut"] = check_out.isoformat()
    
    return {"ok": True, "booking": booking}

