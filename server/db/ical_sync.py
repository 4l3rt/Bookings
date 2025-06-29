import asyncio
import os
import requests
from icalendar import Calendar
from datetime import date, datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGODB_URI)
db = client["bookings_app"]
availability = db.availability
bookings = db.bookings

ICAL_URLS = {
    "1": os.getenv("TWIN_ROOM_URL"),
    "2": os.getenv("DOUBLE_ROOM_URL"),
    "3": os.getenv("FAMILY_ROOM_URL"),
}


print("Connecting to MongoDB at:", MONGODB_URI)


def ensure_datetime(d):
    return datetime.combine(d, datetime.min.time()) if isinstance(d, date) else d

def fetch_ranges(url):
    try:
        r = requests.get(url)
        cal = Calendar.from_ical(r.content)
        return [
            (
                ensure_datetime(event.get("dtstart").dt),
                ensure_datetime(event.get("dtend").dt)
            )
            for event in cal.walk("vevent")
        ]
    except Exception as e:
        print(f"⚠️ Error fetching {url}: {e}")
        return []

async def fetch_manual_bookings():
    cursor = bookings.find({"status": "approved"})
    manual_ranges = {"1": [], "2": [], "3": []}

    async for booking in cursor:
        room_id = str(booking.get("roomId"))
        if room_id in manual_ranges:
            check_in = booking.get("checkIn")
            check_out = booking.get("checkOut")
            if check_in and check_out:
                manual_ranges[room_id].append((check_in, check_out))
    return manual_ranges

def merge_ranges(ranges):
    if not ranges:
        return []
    sorted_ranges = sorted(ranges, key=lambda x: x[0])
    merged = [sorted_ranges[0]]

    for current in sorted_ranges[1:]:
        last_start, last_end = merged[-1]
        current_start, current_end = current

        # If overlapping or contiguous (allow 1 day gap if needed)
        if current_start <= last_end:
            merged[-1] = (last_start, max(last_end, current_end))
        else:
            merged.append(current)
    return merged

async def sync_all():
    print("🔁 Syncing iCal availability with manual bookings merged...")
    data = {}
    manual_ranges = await fetch_manual_bookings()

    for room_id, url in ICAL_URLS.items():
        ical_ranges = fetch_ranges(url) if url else []
        combined = merge_ranges(ical_ranges + manual_ranges.get(room_id, []))
        data[room_id] = combined

    await availability.replace_one(
        {"source": "booking_com"},
        {"source": "booking_com", "ranges_by_room": data},
        upsert=True
    )
    print("✅ Availability updated with merged ranges.")

async def main():
    while True:
        await sync_all()
        await asyncio.sleep(600)

if __name__ == "__main__":
    asyncio.run(main())

