import "./header.css"
import  { useState, useMemo, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';



const apiUrl = import.meta.env.VITE_API_SERVER_IP;
const bookingsUrl = import.meta.env.VITE_BOOKINGS_URL




const today = new Date();
type RoomType = 'twin' | 'double' | 'family';
const ROOM_RATES: Record<RoomType, number> = {
  twin: 90,
  double: 110,
  family: 130,
};


export  function Header() {
  
  const [bookedRanges, setBookedRanges] = useState<Array<{ start: Date; end: Date }>>([]);
  const [room, setRoom] = useState<RoomType>('twin');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [name, setName] = useState<string>("")
  const [phone, setPhone] = useState('');
  const roomId = (room: RoomType) => {
    if (room === 'twin') return 1;
    if (room === 'double') return 2;
    return 3;
};
const [notifyVia, setNotifyVia] = useState<string>('whatsapp');


  const [nameError, setNameError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [calendarError, setCalendarError] = useState<string | null>(null)

  const addDays = (date: Date, days = 1) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  useEffect(() => {
  const fetchAvailability = async () => {
    try {
      const res = await fetch(`${apiUrl}${roomId(room)}`);
      const data = await res.json();
      const parsed = data.unavailable.map((range: [string, string]) => ({
        start: new Date(range[0]),
        end: new Date(range[1]),
      }));
      setBookedRanges(parsed);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    }

  };

  fetchAvailability();
}, [room]);





  const minCheckOut = useMemo(() => {
    const base = checkIn || new Date();
    return addDays(base, 1);
  }, [checkIn]);


  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.max(
      0,
      Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay)
    );
  }, [checkIn, checkOut]);


  const roomRate = ROOM_RATES[room];
  const total = nights * roomRate;

  



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  if (!checkIn || !checkOut || !name || !phone) {
    alert("Missing required fields.");
    return;
  }

  const payload = {
    name,
    phone,
    roomId: roomId(room),
    checkIn: checkIn.toISOString(),
    checkOut: checkOut.toISOString(),
    adults,
    kids,
    notifyVia,
    total,
    source: "manual",

  };

  try {
    const res = await fetch(`${bookingsUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Booking failed");

    alert("Booking request submitted successfully!\n We will contact you as soon as possible");
    window.location.reload(); 
  } catch (err) {
    console.error(err);
    alert("Failed to send booking.");
  }

    setCalendarError(null);

  }

    

  useEffect(() => {
    if (name.length === 0) {
      setNameError(''); // no feedback yet
    } else if (name.length <= 2) {
      setNameError('Name too short');
    } else if (/[^a-zA-Z\s'-]/.test(name)) {
      setNameError('No symbols allowed in name');
    } else {
      setNameError('');
    }
  }, [name]);

  useEffect(() => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 0) {
      setPhoneError('');
    } else if (digits.length < 5) {
      setPhoneError('Enter a valid phone number');
    } else {
      setPhoneError('');
    }
  }, [phone]);


  

useEffect(() => {
    setCanSubmit(
      nameError === '' &&
      phoneError === '' &&
      checkIn != null &&
      checkOut != null &&
      name.length > 2 &&
      phone.replace(/\D/g, '').length >= 4
    );
  }, [
    nameError,
    phoneError,
    checkIn,
    checkOut,
    name,
    phone,
  ]);



  return (
    <div className="sno__header" >
        <form className="sno__header-booking-form color-transparent" onSubmit={handleSubmit}>
            <div className="sno__header-booking-form-input-spacer">

                <label className="sno__header-booking-form-input-container  container-medium ">
                  <p>Room</p>
                  <select
                  className="sno__header-input"
                  value={room}
                  onChange={e => setRoom(e.target.value as RoomType)}
                  >
                    <option value="twin">Twin Room (90GEL/night)</option>
                    <option value="double">Double Room (110GEL/night)</option>
                    <option value="family">Family Room (130GEL/night)</option>
                  </select>
                </label>

                <label className="sno__header-booking-form-input-container  container-large ">
                  <p>Check In</p>
                  <DatePicker
                    portalId="root-portal"
                    className="sno__header-input input-picker"
                    selected={checkIn}
                    minDate={today}
                    onChange={date => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    placeholderText="MM/DD/YY"
                    onKeyDown={e => e.preventDefault()}
                    shouldCloseOnSelect={true}
                    excludeDateIntervals={bookedRanges}
                  />
                  {calendarError && <p className="error">{calendarError}</p>}
                </label>

                <label className="sno__header-booking-form-input-container container-large ">
                  <p>Check Out</p>
                  <DatePicker
                    portalId="root-portal"
                    className="sno__header-input input-picker"
                    selected={checkOut}
                    onChange={date => setCheckOut(date)}
                    selectsEnd
                    startDate={checkIn}
                    minDate={minCheckOut}
                    endDate={checkOut}
                    placeholderText="MM/DD/YY"
                    onKeyDown={e => e.preventDefault()}
                    shouldCloseOnSelect={true}
                    excludeDateIntervals={bookedRanges}
                    />
                </label>

                <label className="sno__header-booking-form-input-container container-small " >
                  <p>Adults</p>
                  <input
                    className="sno__header-input input-picker"
                    type="number"
                    min={1}
                    max={6}
                    value={adults}
                    onChange={e => setAdults(Number(e.target.value))}
                    onKeyDown={e => e.preventDefault()}
                    >
                  </input>
                </label>

                <label className="sno__header-booking-form-input-container container-small ">
                  <p>Kids</p>
                  <input
                    className="sno__header-input input-picker"
                    type="number"
                    min={0}
                    max={5}
                    value={kids}
                    onChange={e => setKids(Number(e.target.value))}
                    onKeyDown={e => e.preventDefault()} 
                    >
                    </input>
                </label>

                <label className="sno__header-booking-form-input-container container-large">
                  <p>Full Name</p>
                  <input 
                    className="sno__header-input sno__nameInpud-padding"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Gela Geladze"
                    >
                  </input>
                  {nameError && <p className="error">{nameError}</p>}
                </label>

                <label className="sno__header-booking-form-input-container container-large">
                  <p className="phone-costum-margin">Phone Number </p>
                  <PhoneInput
                  country={"ge"}
                  value={phone}
                  onChange={setPhone}
                  containerClass="custom-phone-container"
                  inputClass="custom-phone-input"
                  />
                  {phoneError && <div className="error">{phoneError}</div>}
                </label>

                 </div>
                <div className="sno__header-booking-form-input-container container-mdeium">

                {checkIn && checkOut && (
                <p className="sno__total" ><strong>Total: {total.toFixed(2)} GEL </strong></p>
                )}

                  <p className="notify-costum-margin">How should we notify you?</p>
                  <select value={notifyVia} onChange={(e) => setNotifyVia(e.target.value)}>
                    <option value="whatsapp">Whatsapp</option>
                    <option value="signal">Signal</option>
                    <option value="telegram">Telegram</option>
                    <option value="sms">SMS</option>
                  </select>

                  { canSubmit && (
                    <p className="sno__header-form-keepInMind" ><b>Note:</b> Please make sure the mobile number is correct. If you don't reply to our confirmation in a day or two we will have to cancel your booking ;(( </p>

                  )}

                  <button
                      className="son__booking-submit-btn"
                      type="submit"
                      disabled={!canSubmit}
                      style={{
                        opacity: canSubmit ? 1 : 0.5,
                        cursor: canSubmit ? 'pointer' : 'not-allowed'
                      }}
                  >Book Now</button>
              </div>
            <p className="sno__header-form-feepInMind">Problem booking or any qestions?  <span>no worries! just <a href="2">let us know</a></span></p>
        </form>
    </div>
  )
}



