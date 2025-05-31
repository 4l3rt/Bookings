import requests
from icalendar import Calendar
from db import availability
import os
from dotenv import load_dotenv
from datetime import date, datetime


load_dotenv()

ICAL_URLS = {
    "1": os.getenv("TWIN_ROOM_URL"),
    "2": os.getenv("DOUBLE_ROOM_URL"),
    "3": os.getenv("FAMILY_ROOM_URL"),
}

def fetch_ranges(url):
    r = requests.get(url)
    cal = Calendar.from_ical(r.content)
    def ensure_datetime(d):
        return datetime.combine(d, datetime.min.time()) if isinstance(d, date) else d

    return [
        (
            ensure_datetime(event.get("dtstart").dt),
            ensure_datetime(event.get("dtend").dt)
        )
        for event in cal.walk("vevent")
    ]

def sync_all():
    data = {}
    for room_id, url in ICAL_URLS.items():
        if url:
            data[room_id] = fetch_ranges(url)
    availability.replace_one(
        {"source": "booking_com"},
        {"source": "booking_com", "ranges_by_room": data},
        upsert=True
    )

if __name__ == "__main__":
    sync_all()
