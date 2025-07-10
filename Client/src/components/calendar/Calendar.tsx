import "./calendar.css";
import React, { useMemo, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconCard } from "@/components";
import { calendarSvg } from "@/assets";
import { format } from "date-fns";

type CalendarPickerProps = {
  isCheckIn: boolean;
  linkedDate: Date | null;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  bookedRanges: Array<{ start: Date; end: Date }>;
};

// --- STABLE CUSTOM INPUT ---
const DatepickerInput = forwardRef<
  HTMLDivElement,
  { onClick?: () => void; label: string; value: string }
>(({ onClick, label, value }, ref) => {
  return (
    <div ref={ref} onClick={onClick} className="datepicker-input-wrapper">
      <IconCard
        icon={calendarSvg}
        type="display"
        heading={label}
        text={value || "Select date"}
      />
    </div>
  );
});
DatepickerInput.displayName = "DatepickerInput";

// --- MAIN COMPONENT ---
export const Calendar: React.FC<CalendarPickerProps> = ({
  isCheckIn,
  linkedDate,
  selectedDate,
  onDateChange,
  bookedRanges
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
      customInput={
        <DatepickerInput
          label={isCheckIn ? "Check In" : "Check Out"}
          value={selectedDate ? format(selectedDate, "MM/dd/yyyy") : ""}
        />
      }
      popperContainer={({ children }) => (
        <div className="datepicker-popper-wrapper">{children}</div>
      )}
      excludeDateIntervals={bookedRanges}
    />
  );
};
