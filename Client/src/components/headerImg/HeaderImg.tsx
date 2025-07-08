import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {mainImg} from "../../assets"
import { ROOM_IMAGES } from "../../utils/roomImages";
import "./headerImg.css";

interface HeaderImageProps {
  selectedLabel: string;
}

export interface HeaderImgRef {
  handlePreviewChange: (val: string | null) => void;
}

export const HeaderImg = forwardRef<HeaderImgRef, HeaderImageProps>(
  ({ selectedLabel }, ref) => {
    const [previewRoom, setPreviewRoom] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [images, setImages] = useState<string[]>([mainImg, mainImg]);

    const nextImage = ROOM_IMAGES[previewRoom || selectedLabel] || mainImg;

    useEffect(() => {
      if (images[activeIndex] === nextImage) return;
      const nextIndex = activeIndex === 0 ? 1 : 0;
      const newImages = [...images];
      newImages[nextIndex] = nextImage;
      setImages(newImages);
      setActiveIndex(nextIndex);
    }, [selectedLabel, previewRoom]);

    // Expose preview setter to parent via ref
    useImperativeHandle(ref, () => ({
      handlePreviewChange: (val: string | null) => {
        setPreviewRoom(val);
      },
    }));


    return (
      <div className="sno__headerImg-wrapper">
        <img
          src={images[0]}
          className={`sno__headerImg ${activeIndex === 0 ? "fade-in" : "fade-out"}`}
          alt="room-img-1"
        />
        <img
          src={images[1]}
          className={`sno__headerImg ${activeIndex === 1 ? "fade-in" : "fade-out"}`}
          alt="room-img-2"
        />
      </div>
    );
  }
);
