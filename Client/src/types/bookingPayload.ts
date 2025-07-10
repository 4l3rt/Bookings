
export interface BookingPayload {
  name: string;
  phone: string;
  roomId: string;
  checkIn: string;     // ISO string
  checkOut: string;    // ISO string
  adults: number;
  kids: number;
  notifyVia?: string;
  total: number;
}
