import "./countCard.css";
import { forwardRef } from "react";
import { AnimatedText } from "@/utils/AnimatedText";
import { upArrow, downArrow } from "@/assets/";

interface CountCardProps {
  icon: string;
  heading: string;
  count: number;
  setCount: (val: number) => void;
}

export const CountCard = forwardRef<HTMLDivElement, CountCardProps>(
  ({ icon, heading, count, setCount }, ref) => {
    const inc = () => {
      if (count < 6) setCount(count + 1);
    };

    const dec = () => {
      if (count > 0) setCount(count - 1);
    };

    return (
      <div className="countCard_content-wrapper" ref={ref}>
        <img src={icon} alt="icon" className="icon" />
        <div className="countCard-text">
          <h3 className="txt-primary">{heading}</h3>
          <div className="counter-controls">
            <div className="count">
              <AnimatedText value={count} />
            </div>
            <div className="counter-control-btns">
              <button
                type="button"
                onClick={inc}
                className="arrow-btn"
                disabled={count >= 6}
                aria-label={`Increase ${heading}`}
              >
                <img src={upArrow} />
              </button>
              <button
                type="button"
                onClick={dec}
                className="arrow-btn"
                disabled={count <= 0}
                aria-label={`Decrease ${heading}`}
              >
                <img src={downArrow} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CountCard.displayName = "CountCard";
export default CountCard;
