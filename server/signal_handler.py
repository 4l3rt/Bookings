import requests
from db import bookings
import os
from dotenv import load_dotenv

load_dotenv()





def notify_signal(message, recipient):
    payload = {
        "message": message,
        "number": os.getenv("PHONE_NUMBER"),
        "recipients": [recipient]
    }
    requests.post(os.getenv("SIGNAL_API"), json=payload)


def handle_incoming():
    # polling example
    resp = requests.get(os.getenv("POLL_API")).json()
    for msg in resp.get('messages', []):
        text = msg['message'].strip().upper()
        sender = msg['envelope']['data']['envelope']['source']

        if text.startswith("CONFIRM "):
            code = text.split()[1]
            res = bookings.update_one(
                {"code": code, "status": "pending"},
                {"$set": {"status": "confirmed"}}
            )
            reply = (
                f"Booking {code} confirmed." if res.matched_count
                else f"No pending booking with code {code}."
            )
            notify_signal(reply, sender)

        elif text.startswith("DECLINE "):
            code = text.split()[1]
            res = bookings.update_one(
                {"code": code, "status": "pending"},
                {"$set": {"status": "declined"}}
            )
            reply = (
                f"Booking {code} declined." if res.matched_count
                else f"No pending booking with code {code}."
            )
            notify_signal(reply, sender)

if __name__ == '__main__':
    handle_incoming()

