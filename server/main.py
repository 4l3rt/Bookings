from fastapi import FastAPI, HTTPException, Query
from uuid import uuid4
from datetime import  datetime
from db import bookings, availability
from models import BookingRequest, BookingResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",  
    "http://localhost:3000",  
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/bookings/", response_model=BookingResponse)
async def create_booking(payload: BookingRequest):
    # generate unique code
    code = uuid4().hex[:6].upper()
    doc = payload.dict()

    doc["checkIn"] = datetime.combine(doc["checkIn"], datetime.min.time())
    doc["checkOut"] = datetime.combine(doc["checkOut"], datetime.min.time())

    doc.update({"code": code, "status": "pending"})
    result = bookings.insert_one(doc)
    return {"code": code}

@app.get("/availability/")
async def get_availability(
    roomId: int = Query(..., ge=1, le=3)
):
    doc = availability.find_one({"source": "booking_com"})
    if not doc:
        return []
    # filter ranges for this room
    return [r for r in doc["ranges_by_room"].get(str(roomId), [])]

