
import  { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IconCardProps {
  icon: string;
  heading: string;
  className: string;
  text?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: string[];
  onHoverOptionChange?: (hoveredOption: string | null) => void;
  onOptionSelect?: (selectedOption: string) => void;
}

export const SelectCard = forwardRef<HTMLDivElement, IconCardProps>(
  ({
    icon,
    heading,
    className,
    text,
    value,
    onChange,
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

      return (
        <div
          className={`icon-card_content-wrapper ${className}`}
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
                className={`icon-card-dropdown ${className}` }
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {options.map((opt) => (
                  <div
                    key={opt}
                    className="icon-card-option txt-secondary"
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
);

export default SelectCard;
