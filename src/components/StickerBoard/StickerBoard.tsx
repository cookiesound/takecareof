import React from "react";
import "./StickerBoard.scss";
import sticker from "../../assets/sticker.png";
import sticker_bg from "../../assets/sticker_bg.jpg";

interface StickerBoardProps {
  stickerCount: number;
}

const StickerBoard: React.FC<StickerBoardProps> = ({ stickerCount }) => {
  const totalSlots = 30; // 10 x 3 격자
  const filledSlots = Math.min(stickerCount, totalSlots);

  return (
    <div className="sticker-board">
      <div className="board-background">
        <img
          src={sticker_bg}
          alt="스티커 보드 배경"
          className="background-image"
        />
      </div>
      <div className="sticker-grid">
        {Array.from({ length: totalSlots }, (_, index) => (
          <div
            key={index}
            className={`sticker-slot ${
              index < filledSlots ? "filled" : "empty"
            }`}
          >
            {index < filledSlots && (
              <div className="sticker">
                <img src={sticker} alt="스티커" className="sticker-image" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickerBoard;
