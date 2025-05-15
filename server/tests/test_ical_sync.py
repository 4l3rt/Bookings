import os
import pytest
import requests
from icalendar import Calendar

def load_env(monkeypatch):
    
    ical_url = os.getenv("ICAL_URL") or "http://localhost:8000/mock.ics"
    monkeypatch.setenv("ICAL_URL", ical_url)

def test_fetch_and_parse():
    url = os.getenv("ICAL_URL")
    resp = requests.get(url, timeout=10)
    assert resp.status_code == 200

    cal = Calendar.from_ical(resp.text)
    vevents = [c for c in cal.walk() if c.name == "VEVENT"]
    assert len(vevents) >= 1  

    
