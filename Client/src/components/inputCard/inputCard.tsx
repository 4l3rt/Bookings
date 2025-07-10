import "./inputCard.css";
import { useState, forwardRef } from "react";

interface InputCardProps {
  icon: string;
  heading: string;
  value: string;
  onChange: (val: string) => void;
  type?: "text" | "tel" | "email";
  placeholder?: string;
}

export const InputCard = forwardRef<HTMLInputElement, InputCardProps>(
  ({ icon, heading, value, onChange, type = "text", placeholder = " " }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="input-card_wrapper">
        <img src={icon} className="icon" />
        <div className={`input-group ${focused || value ? "active" : ""}`}>
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="input-card_input txt-primary"
          />
         <label
            htmlFor="input"
            className={`input-card_label txt-secondary ${focused || value ? "floating" : ""}`}
        >
            {heading}
        </label>



        </div>
      </div>
    );
  }
);

InputCard.displayName = "InputCard";
export default InputCard;
