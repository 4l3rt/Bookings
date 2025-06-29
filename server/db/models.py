
from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class BookingRequest(BaseModel):
    name: str
    phone: str
    roomId: int
    checkIn: date
    checkOut: date
    adults: int
    kids: int
    notify_method: str

class BookingResponse(BaseModel):
    code: str

