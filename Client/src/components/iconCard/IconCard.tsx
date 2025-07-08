import "./iconCard.css";
import  { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface IconCardProps {
  icon: string;
  heading: string;
  text?: string;
  value?: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
  type?: "display" | "input" | "select" | "count";
  options?: string[];
  onHoverOptionChange?: (hoveredOption: string | null) => void;
  onOptionSelect?: (selectedOption: string) => void;
}

export const IconCard = forwardRef<HTMLDivElement, IconCardProps>(
  ({
    icon,
    heading,
    text,
    value,
    onClick,
    onChange,
    type = "display",
    options = [],
    onHoverOptionChange,
    onOptionSelect
  }, ) => {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(value || null);

    const handleSelect = (option: string) => {
      setSelectedOption(option);
      setOpen(false);
      onChange?.(option);
      onOptionSelect?.(option);
    };

    if (type === "select") {
      return (
        <div
          className="icon-card_content-wrapper"
          style={{ cursor: "pointer", position: "relative" }}
          onClick={() => setOpen(!open)}
        >
          <img src={icon} alt="icon" className="icon" />
          <div className="card-text">
            <h3 className="txt-primary">{heading}</h3>
            <p className="txt-secondary">{selectedOption || text || "Select option"}</p>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                className="icon-card-dropdown"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {options.map((opt) => (
                  <div
                    key={opt}
                    className="icon-card-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(opt);
                    }}
                    onMouseEnter={() => onHoverOptionChange?.(opt)}
                    onMouseLeave={() => onHoverOptionChange?.(null)}
                  >
                    {opt}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="icon-card_content-wrapper"
        onClick={onClick}
        style={{ cursor: type === "display" ? "pointer" : "default" }}
      >
        <img src={icon} alt="icon" className="icon" />

        {type === "input" && (
          <div className="card-text">
            <input
              className="icon-card-input"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={text}
            />
          </div>
        )}

        {type === "display" && (
          <div className="card-text">
            <h3 className="txt-primary">{heading}</h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={value}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="txt-secondary"
              >
                {value || text}
              </motion.p>
            </AnimatePresence>
          </div>
        )}

        {type === "count" && <div />}
      </button>
    );
  }
);

export default IconCard;
