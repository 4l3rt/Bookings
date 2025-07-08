import "./header.css";
import { useState, useEffect } from "react";
import mainImg from "../../assets/imgs/HeaderPictureLight.png";
import { IconCard, Calendar } from "../../components";
import {
  bedSvg,
  twinRoomImg,
  doubleRoomImg,
  familyRoomImg,
} from "./index.ts";




const ROOM_IMAGES: Record<string, string> = {
  "Twin Room (90GEL/night)": twinRoomImg,
  "Double Room (110GEL/night)": doubleRoomImg,
  "Family Room (130GEL/night)": familyRoomImg,
};

export function Header() {
  const [room, setRoom] = useState<string>("");
  const [previewRoom, setPreviewRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const [activeIndex, setActiveIndex] = useState(0); // 0 or 1
  const [images, setImages] = useState<string[]>([mainImg, mainImg]);

  const nextImage = ROOM_IMAGES[previewRoom || room] || mainImg;

  useEffect(() => {
    if (images[activeIndex] === nextImage) return;

    const nextIndex = activeIndex === 0 ? 1 : 0;
    const newImages = [...images];
    newImages[nextIndex] = nextImage;
    setImages(newImages);
    setActiveIndex(nextIndex);
  }, [room, previewRoom]);

  return (
    <div className="sno__header">
      <div className="sno_header_img-wrapper">
        <img
          src={images[0]}
          className={`sno__header_img ${
            activeIndex === 0 ? "fade-in" : "fade-out"
          }`}
          alt="room-img-1"
        />
        <img
          src={images[1]}
          className={`sno__header_img ${
            activeIndex === 1 ? "fade-in" : "fade-out"
          }`}
          alt="room-img-2"
        />
      </div>

      <form className="sno__header_form">
        <IconCard
          icon={bedSvg}
          heading="Room"
          text="Select room"
          type="select"
          value={room}
          options={Object.keys(ROOM_IMAGES)}
          
          onChange={(val) => setRoom(val)}
          onHoverOptionChange={setPreviewRoom}
          onOptionSelect={(val) => {
            setRoom(val);        // full label is stored
            setPreviewRoom(null); // lock image
          }}

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
