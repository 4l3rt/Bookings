import os
from flask import Flask, jsonify
import requests
from icalendar import Calendar
from dotenv import load_dotenv

here = os.path.dirname(__file__)
load_dotenv(os.path.join(here, ".env"))


app = Flask(
    __name__,
    static_folder="/Users/computer/projects/snoHouse/server/tests/static",
    static_url_path=""
)

app.route("/sync")

def sync():
    ical_url = os.getenv("ICAL_URL")
    if not ical_url:
        return jsonify(error="No ICCAL_URL set"), 500

    resp = requests.get(ical_url, timeout=10)
    resp.raise_for_status()

    cal = Calendar.from_ical(resp.text)
    events = []
    for component in cal.walk():
        events.append({
            "uid": str(component.get("UID")),
            "start": component.decoded("DTSTART").isoformat(),
            "end":   component.decoded("DTEND").isoformat(),
            "summary": str(component.get("SUMMARY")),
        })

    return jsonify(count=len(events), events=events)

@app.route("/mock.ics")
def mock_ics():

    return send_from_directory(app.static_folder, "mock.ics", mimetype="text/calendar")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)