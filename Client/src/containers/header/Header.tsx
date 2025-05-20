import "./header.css"
import  { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactFlagsSelect from 'react-flags-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type RoomType = 'twin' | 'double' | 'family';
const ROOM_RATES: Record<RoomType, number> = {
  twin: 90,
  double: 110,
  family: 130,
};

export  function Header() {

  const [room, setRoom] = useState<RoomType>('twin');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [country, setCountry] = useState('US');
  const [phone, setPhone] = useState('');


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


  return (
    <div className="sno__header" >
        <div className="sno__header-booking-form color-transparent">
            <div className="sno__header-booking-form-input-spacer">
                <div className="sno__header-booking-form-input-container input-medium ">
                  <select
          value={room}
          onChange={e => setRoom(e.target.value as RoomType)}
        >
          <option value="twin">Twin Room (90GEL/night)</option>
          <option value="double">Double Room (110GEL/night)</option>
          <option value="family">Family Room (130GEL/night)</option>
        </select>
                </div>
                <div className="sno__header-booking-form-input-container input-large "><p>Check In</p><DatePicker
      className="input-picker"
      selected={checkIn}
      onChange={date => setCheckIn(date)}
      selectsStart
      startDate={checkIn}
      endDate={checkOut}
      placeholderText="MM/DD/YY"
      onKeyDown={e => e.preventDefault()}
      /></div>
                <div className="sno__header-booking-form-input-container input-large "><p>Check Out</p><DatePicker
      className="input-picker"
      selected={checkOut}
      onChange={date => setCheckOut(date)}
      selectsStart
      startDate={checkIn}
      endDate={checkOut}
      placeholderText="MM/DD/YY2"
      onKeyDown={e => e.preventDefault()}
    /></div>
                <div className="sno__header-booking-form-input-container input-small " ><p>Adults</p><input
                className="input-picker"
                type="number"
                min={1}
                max={10}
                value={adults}
                onChange={e => setAdults(Number(e.target.value))}
                onKeyDown={e => e.preventDefault()}
                ></input></div>
                <div className="sno__header-booking-form-input-container input-small "><p>Kids</p><input
                className="input-picker"
                type="number"
                min={0}
                max={10}
                value={kids}
                onChange={e => setKids(Number(e.target.value))}
                onKeyDown={e => e.preventDefault()}


                ></input></div>
                <div className="sno__header-booking-form-input-container input-large"><p>Full Name</p><input></input></div>
                <div className="sno__header-booking-form-input-container input-medium"><p>Country</p>
                <ReactFlagsSelect
                  countries={['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
                    'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ',
                    'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ',
                    'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ',
                    'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET',
                    'FI', 'FJ', 'FM', 'FO', 'FR',
                    'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GT', 'GU', 'GW', 'GY',
                    'HK', 'HM', 'HN', 'HR', 'HT', 'HU',
                    'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT',
                    'JE', 'JM', 'JO', 'JP',
                    'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ',
                    'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY',
                    'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ',
                    'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ',
                    'OM',
                    'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PT', 'PW', 'PY',
                    'QA',
                    'RE', 'RO', 'RS', 'RU', 'RW',
                    'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ',
                    'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TZ',
                    'UA', 'UG', 'UM', 'US', 'UY', 'UZ',
                    'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU',
                    'WF', 'WS',
                    'YE', 'YT',
                    'ZA', 'ZM', 'ZW']}
                  selected={country}
                  onSelect={code => setCountry(code)}
                  showSelectedLabel={false}
                  showOptionLabel={false}
                  className="flag-btn"
                  searchable={true}
                /></div>
                <div className="sno__header-booking-form-input-container input-large"><p className="phone-costum-margin">Phone Number</p><PhoneInput
                country={country.toLowerCase()}
                value={phone}
                onChange={setPhone}
                buttonStyle={{ display: 'none' }}
                inputClass="custom-phone-input"
              /></div>
                <div className="sno__header-booking-form-input-container input-mdeium"><p>How should we notify you?</p>
                  <select

                  >
                    <option value="twin">Whatsapp</option>
                    <option value="double">Signal</option>
                    <option value="family">SMS</option>
                    </select>
                </div>
                <p><strong>Total: {total.toFixed(2)} GEL </strong></p>
            </div>
            <p>Problem booking? no worries! Contact us</p>
        </div>
    </div>
  )
}
