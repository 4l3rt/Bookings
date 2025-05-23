# ical_sync.py
import requests, io
from icalendar import Calendar
from db import db


def fetch_booked_dates(ical_url):
    resp = requests.get(ical_url)
    cal = Calendar.from_ical(resp.content)
    booked = []
    for event in cal.walk('vevent'):
        start = event.get('dtstart').dt
        end = event.get('dtend').dt
        booked.append((start, end))        # a tuple of date objects
    return booked


def sync_to_db(ical_url):
    ranges = fetch_booked_dates(ical_url)
    db.availability.replace_one(
        {"source": "booking_com"},
        {"source": "booking_com", "ranges": ranges},
        upsert=True
    )
