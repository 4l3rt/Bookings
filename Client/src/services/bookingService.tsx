import type { BookingPayload } from "@/types/bookingPayload";
const bookingsUrl = import.meta.env.VITE_BOOKINGS_URL



export const submitBooking = async (payload: BookingPayload) => {
  const res = await fetch(`${bookingsUrl}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Booking failed");
  return data;
};
