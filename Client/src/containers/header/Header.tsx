import { useState, useRef } from "react";
import "./header.css";
import { Calendar, HeaderImg, SelectCard, CountCard } from "../../components";
import { ROOM_IMAGES } from "@/utils/roomImages.ts"
import { bedSvg, adultSvg, kidSvg, phoneSvg, bellSvg, walletSvg } from "@/assets";
import type { HeaderImgRef } from "@/components/headerImg/HeaderImg.tsx";


export function Header() {
  const [room, setRoom] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const headerImgRef = useRef<HeaderImgRef>(null);

  return (
    <div className="sno__header">
      <div className="sno__header_content-wrapper">
        <HeaderImg
          ref={headerImgRef}
          selectedLabel={room}
        />
        <form className="sno__header_form">
          <div className="sno__header_form_option-wrapper">
          <SelectCard
              icon={bedSvg}
              heading="Room"
              text="Select room"
              value={room}
              options={Object.keys(ROOM_IMAGES)}
              onChange={setRoom}
              onHoverOptionChange={(val) => headerImgRef.current?.handlePreviewChange(val)}
              onOptionSelect={() => headerImgRef.current?.handlePreviewChange(null)}
            />
            <div className="sno__header_form_split" />
          </div>
        <div className="sno__header_form_option-wrapper ">
            <Calendar
              isCheckIn={true}
              linkedDate={checkOut}
              selectedDate={checkIn}
              onDateChange={setCheckIn}
            />
        <div className="sno__header_form_split" />
        </div>
        <div className="sno__header_form_option-wrapper">
          <Calendar
            isCheckIn={false}
            linkedDate={checkIn}
            selectedDate={checkOut}
            onDateChange={setCheckOut}
          />
        </div>

        <div className="sno__header_form_additional-form" >
            <div>
              <CountCard icon={adultSvg} heading="Adults" 

              />
            </div>


        </div>

        </form>
      </div>

      <p className="txt-primary">Or</p>
      <p>
        <a className="sno__header_contact-us txt-primary">Contact Us</a>
      </p>
    </div>
  );
}
