

import { useState, useRef, useMemo } from "react";
import "./header.css";
import { Calendar, HeaderImg, SelectCard, CountCard, InputCard } from "@/components";
import { ROOM_IMAGES, PLATFORMS, PAYMENT_OPTIONS } from "@/utils";
import { submitBooking } from "@/services/bookingService"
import { bedSvg, adultSvg,kidSvg, phoneSvg, bellSvg, walletSvg, nameSvg,} from "@/assets";
import type { HeaderImgRef } from "@/components/headerImg/HeaderImg.tsx";


export function Header() {
  const [room, setRoom] = useState<RoomType>("Select Room")
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const headerImgRef = useRef<HeaderImgRef>(null);
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [name, setName] = useState<string>("")
  const [phone, setPhone] = useState('');
  const [notifyVia, setNotifyVia] = useState<string | undefined>("Signal");
  const [payment, setPayment] = useState<string | undefined>("Select payment method");



  const roomId = (room: RoomType) => {
      if (room === 'Twin Room (90 GEL)') return 1;
      if (room === 'Double Room (110 GEL)') return 2;
      return 3;
  };

  type RoomType = string;

    const nights = useMemo(() => {
      if (!checkIn || !checkOut) return 0;
      const msPerDay = 1000 * 60 * 60 * 24;
      return Math.max(
        0,
        Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay)
      );
    }, [checkIn, checkOut]);

    const ROOM_RATES: Record<RoomType, number> = {
    'Twin Room (90 GEL)': 90,
    'Double Room (110 GEL)': 110,
    'Family Room (130 GEL)': 130,
  };

    const roomRate = ROOM_RATES[room];
    const total = nights * roomRate;



const handleSubmit = async () => {
  const payload = {
  name,
  phone,
  roomId: String(roomId),
  checkIn: checkIn!.toISOString(),
  checkOut: checkOut!.toISOString(),
  adults,
  kids,
  notifyVia,
  total
} 

  try {
    await submitBooking(payload);
    alert("Booking submitted successfully!");
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Failed to send booking.");
  }
}


  return (
    <div className="sno__header">
      <form className="sno__header_content-wrapper">
        <HeaderImg ref={headerImgRef} selectedLabel={room} />
        <div className="sno__header_form">
          <div className="sno__header_form_option-wrapper clickable-thing">
            <SelectCard
              icon={bedSvg}
              heading="Room"
              text="Select room"
              className={["icon-card_content-wrapper", "card-text"]}
              value={room}
              options={Object.keys(ROOM_IMAGES)}
              onChange={setRoom}
              onHoverOptionChange={(val) =>
                headerImgRef.current?.handlePreviewChange(val)
              }
              onOptionSelect={() =>
                headerImgRef.current?.handlePreviewChange(null)
              }
            />
            <div className="sno__header_form_split" />
          </div>
          <div className="sno__header_form_option-wrapper clickable-thing ">
            <Calendar
              isCheckIn={true}
              linkedDate={checkOut}
              selectedDate={checkIn}
              onDateChange={setCheckIn}
            />
            <div className="sno__header_form_split" />
          </div>
          <div className="sno__header_form_option-wrapper ">
            <Calendar
              isCheckIn={false}
              linkedDate={checkIn}
              selectedDate={checkOut}
              onDateChange={setCheckOut}
            />
          </div>
        </div>
        <div className="sno__header_form_additional">
          <div className="sno__header_form_additional_counts">
            <CountCard
              icon={adultSvg}
              heading="Adults"
              count={adults}
              setCount={setAdults}
            />
            <CountCard
              icon={kidSvg}
              heading="Kids"
              count={kids}
              setCount={setKids}
            />
          </div>
            <InputCard
              icon={nameSvg}
              heading="Full Name"
              value={name}
              onChange={setName}
              type="text"
            />
            <InputCard
              icon={phoneSvg}
              heading="Phone Number"
              value={phone}
              onChange={setPhone}
              type="text"
            />

            <SelectCard
            icon={bellSvg}
            heading="Notify me via"
            text="Select Platform"
            value={notifyVia}
            onChange={setNotifyVia}
            options={Object.keys(PLATFORMS)}
            className={["Sno__header_form_additional_select", "additional-card-text"]}
            />

            <SelectCard
            icon={walletSvg}
            heading="Payment Method"
            text="Select payment Method"
            value={payment}
            onChange={setPayment}
            options={Object.keys(PAYMENT_OPTIONS)}
            className={["Sno__header_form_additional_select", "additional-card-text"]}
            />

            <button type="submit" onSubmit={() => handleSubmit()} className="Sno__header_submit-btn">Book Now</button>
            {total}

        </div>
      </form>

      <p className="txt-primary">Or</p>
      <p>
        <a className="sno__header_contact-us txt-primary">Contact Us</a>
      </p>
    </div>
  );
}
