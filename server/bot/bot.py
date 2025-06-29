import os
import logging
import sys
from dotenv import load_dotenv
from telegram.ext import ApplicationBuilder, CallbackQueryHandler, ContextTypes
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
import httpx
from utils import format_booking_text

load_dotenv()
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID"))
API_BASE_URL = os.getenv("API_BASE_URL")

async def button_handler(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    if q.from_user.id != ADMIN_ID:
        await q.edit_message_text("\u274c Unauthorized.")
        return

    try:
        action, bid = q.data.split(":")
    except ValueError:
        await q.edit_message_text("\u274c Invalid action.")
        return

    url_map = {
        "approve": f"{API_BASE_URL}/confirm-booking",
        "reject": f"{API_BASE_URL}/reject-booking",
        "delete": f"{API_BASE_URL}/delete-booking"
    }
    url = url_map.get(action)
    if not url:
        await q.edit_message_text("\u274c Unknown action.")
        return

    async with httpx.AsyncClient() as client:
        res = await client.post(url, json={"id": bid})

    if res.status_code != 200:
        await q.edit_message_text("\u274c Failed to process.")
        return

    data = res.json()
    if action == "approve":
        booking = data.get("booking")
        if booking:
            delete_button = InlineKeyboardMarkup([
                [InlineKeyboardButton("🗑 Delete", callback_data=f"delete:{bid}")]
            ])
            await q.edit_message_text(format_booking_text(booking, status="✅ Approved"), reply_markup=delete_button)
        else:
            await q.edit_message_text("✅ Approved.")
    elif action == "reject":
       booking = data.get("booking")
       if booking:
           await q.edit_message_text(format_booking_text(booking, status="❌ Rejected"), reply_markup=None)
       else:
          await q.edit_message_text("❌ Booking Rejected.", reply_markup=None)
    
    elif action == "delete":
        booking = data.get("booking")
        if booking:
            approve_reject = InlineKeyboardMarkup([
                [
                    InlineKeyboardButton("✅ Approve", callback_data=f"approve:{bid}"),
                    InlineKeyboardButton("❌ Reject", callback_data=f"reject:{bid}")
                ]
            ])
            await q.edit_message_text(format_booking_text(booking, status="⏳ Pending again"), reply_markup=approve_reject)
        else:
            await q.edit_message_text("🗑 Availability removed.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CallbackQueryHandler(button_handler))
    app.run_polling()

