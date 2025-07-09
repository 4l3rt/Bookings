import "./iconCard.css";
import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IconCardProps {
  icon: string;
  heading: string;
  text?: string;
  value?: string;
  onClick?: () => void;
  type?: "display" | "custom";
}

export const IconCard = forwardRef<HTMLButtonElement, IconCardProps>(
  ({ icon, heading, text, value, type, onClick }, ref) => {
    return (
      <button
        type="button"
        className="icon-card_content-wrapper"
        onClick={onClick}
        ref={ref}
      >
        <img src={icon} alt="icon" className="icon" />

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
      </button>
    );
  }
);

IconCard.displayName = "IconCard"; // avoids React devtools warning

export default IconCard;
