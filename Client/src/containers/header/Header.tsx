import { useState, useRef } from "react";
import "./header.css";
import { IconCard, Calendar, HeaderImg } from "../../components";
import { ROOM_IMAGES } from "../../utils/roomImages.ts"
import { bedSvg } from "../../assets";
import type { HeaderImgRef } from "../../components/headerImg/HeaderImg.tsx";



export function Header() {
  const [room, setRoom] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const headerImgRef = useRef<HeaderImgRef>(null);

  return (
    <div className="sno__header">
      <HeaderImg
        ref={headerImgRef}
        selectedLabel={room}
      />
      <form className="sno__header_form">
       <IconCard
          icon={bedSvg}
          heading="Room"
          text="Select room"
          type="select"
          value={room}
          options={Object.keys(ROOM_IMAGES)}
          onChange={setRoom}
          onHoverOptionChange={(val) => headerImgRef.current?.handlePreviewChange(val)}
          onOptionSelect={() => headerImgRef.current?.handlePreviewChange(null)}
        />
        <div className="sno__header_form_split" />
        <Calendar
          isCheckIn={true}
          linkedDate={checkOut}
          selectedDate={checkIn}
          onDateChange={setCheckIn}
        />
        <div className="sno__header_form_split" />
        <Calendar
          isCheckIn={false}
          linkedDate={checkIn}
          selectedDate={checkOut}
          onDateChange={setCheckOut}
        />
      </form>

      <p className="text-primary">Or</p>
      <p>
        <a className="sno__header_contact-us text-primary">Contact Us</a>
      </p>
    </div>
  );
}
