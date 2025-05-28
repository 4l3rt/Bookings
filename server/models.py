from pydantic import BaseModel
from datetime import date

class BookingRequest(BaseModel):
    roomId: int                
    checkIn: date
    checkOut: date
    name: str
    phone: str

class BookingResponse(BaseModel):
    code: str                   