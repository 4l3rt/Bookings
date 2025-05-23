
from fastapi import FastAPI
from db import bookings
app = FastAPI()

@app.post("/bookings/")
async def create_booking(data: dict):
    result = bookings.insert_one({**data, "status": "pending"})
    return {"id": str(result.inserted_id)}

