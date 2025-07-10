import { useState, useRef } from "react";
import "./header.css";
import { Calendar, HeaderImg, SelectCard, CountCard, InputCard } from "../../components";
import { ROOM_IMAGES, PLATFORMS, PAYMENT_OPTIONS } from "@/utils";
import { bedSvg, adultSvg,kidSvg, phoneSvg, bellSvg, walletSvg, nameSvg,} from "@/assets";
import type { HeaderImgRef } from "@/components/headerImg/HeaderImg.tsx";

export function Header() {
  const [room, setRoom] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const headerImgRef = useRef<HeaderImgRef>(null);
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [name, setName] = useState<string>("")
  const [phone, setPhone] = useState('');
  const [platform, setPlatform] = useState<string | undefined>("Signal");
  const [payment, setPayment] = useState<string | undefined>("Select payment method");

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
              className="icon-card_content-wrapper"
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
            value={platform}
            onChange={setPlatform}
            options={Object.keys(PLATFORMS)}
            className="Sno__header_form_additional_select"
            />

            <SelectCard
            icon={walletSvg}
            heading="Payment Method"
            text="Select payment Method"
            value={payment}
            onChange={setPayment}
            options={Object.keys(PAYMENT_OPTIONS)}
            className="Sno__header_form_additional_select"
            />

        </div>
      </form>

      <p className="txt-primary">Or</p>
      <p>
        <a className="sno__header_contact-us txt-primary">Contact Us</a>
      </p>
    </div>
  );
}
