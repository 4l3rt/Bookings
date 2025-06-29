def format_booking_text(b: dict, status: str = "Pending") -> str:
    return (
        f"📬 Booking Status: {status}\n"
        f"ID: {b.get('_id')}\n"
        f"Name: {b.get('name')}\n"
        f"Phone: {b.get('phone')}\n"
        f"Room: {b.get('roomId')}\n"
        f"Check-in: {str(b.get('checkIn'))[:10]}\n"
        f"Check-out: {str(b.get('checkOut'))[:10]}\n"
        f"Adults: {b.get('adults', 'N/A')}\n"
        f"Kids: {b.get('kids', 'N/A')}\n"
        f"Notify via: {b.get('notifyVia', 'N/A')}\n"
        f"💰 Total: {b.get('total', 'N/A')} ₾"
    )


