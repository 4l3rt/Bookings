import "./calendar.css";
import React, { useMemo, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconCard } from "../../components";
import { calendarSvg } from "../../containers/header"; // Adjust path if needed
import { format } from "date-fns";

type CalendarPickerProps = {
  isCheckIn: boolean; // true = check-in, false = check-out
  linkedDate: Date | null;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
};

export const Calendar: React.FC<CalendarPickerProps> = ({
  isCheckIn,
  linkedDate,
  selectedDate,
  onDateChange,
}) => {
  const today = useMemo(() => new Date(), []);

  const minDate = useMemo(() => {
    if (isCheckIn) return today;
    if (linkedDate) {
      const nextDay = new Date(linkedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return today;
  }, [isCheckIn, linkedDate]);

  const handleChange = (date: Date | null) => {
    if (!date) {
      onDateChange(null);
      return;
    }

    if (!isCheckIn && linkedDate && date <= linkedDate) {
      alert("Check-out must be after check-in");
      return;
    }

    onDateChange(date);
  };

  const MemoizedInput = useMemo(() => {
    return forwardRef<HTMLDivElement, { onClick?: () => void }>(({ onClick }, ref) => {
      const displayValue = selectedDate ? format(selectedDate, "MM/dd/yyyy") : "";

      return (
        <div ref={ref} onClick={onClick} className="datepicker-input-wrapper" >
          <IconCard
            icon={calendarSvg}
            heading={isCheckIn ? "Check In" : "Check Out"}
            text={displayValue || "Select date"}
          />
        </div>
      );
    });
  }, [isCheckIn, selectedDate]);

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      minDate={minDate}
      selectsStart={isCheckIn}
      selectsEnd={!isCheckIn}
      startDate={isCheckIn ? selectedDate : linkedDate}
      endDate={!isCheckIn ? selectedDate : linkedDate}
      placeholderText={isCheckIn ? "Check In" : "Check Out"}
      onKeyDown={(e) => e.preventDefault()}
      popperPlacement="top-start"
      shouldCloseOnSelect
      customInput={React.createElement(MemoizedInput)}
    />
  );
};
