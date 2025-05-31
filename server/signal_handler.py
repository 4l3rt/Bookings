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
    try:
        res = requests.post(os.getenv("SIGNAL_API"), json=payload)
        res.raise_for_status()
    except Exception as e:
        print(f"Failed to send Signal message: {e}")


def handle_incoming():
    try:
        resp = requests.get(os.getenv("POLL_API"))
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"Failed to poll messages: {e}")
        return

    for msg in data.get('messages', []):
        text = msg.get('message', '').strip().upper()
        sender = msg.get('envelope', {}).get('source')

        if not text or not sender:
            continue

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
