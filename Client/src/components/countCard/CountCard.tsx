
import "./iconCard.css"; 
import { forwardRef } from "react";
import { AnimatedText } from "@/utils/AnimatedText"; 

interface CountCardProps {
  icon: string;
  heading: string;
  count: number;
  setCount: (val: number) => void;
}

export const CountCard = forwardRef<HTMLButtonElement, CountCardProps>(
  ({ icon, heading, count, setCount }) => {
    const inc = () => setCount(count + 1);
    const dec = () => count > 0 && setCount(count - 1);

    return (
      <div className="icon-card_content-wrapper" >
        <img src={icon} alt="icon" className="icon" />
        <div className="card-text">
          <h3 className="txt-primary">{heading}</h3>
          <AnimatedText value={count} />
        </div>
        <div className="counter-controls">
          <button onClick={dec} className="arrow-btn">−</button>
          <button onClick={inc} className="arrow-btn">＋</button>
        </div>
      </div>
    );
  }
);

export default CountCard;
