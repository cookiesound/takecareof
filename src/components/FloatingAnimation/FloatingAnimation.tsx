import React, { useEffect, useState } from "react";
import winGif from "../../assets/win.gif";
import tonGif from "../../assets/ton.gif";
import "./FloatingAnimation.scss";

interface Tooltip {
  id: number;
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

interface FloatingItem {
  id: number;
  src: string;
  alt: string;
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  speed: number;
}

const FloatingAnimation: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [tooltips, setTooltips] = useState<Tooltip[]>([]);
  const [tooltipId, setTooltipId] = useState(1);

  useEffect(() => {
    console.log("FloatingAnimation mounted");
    console.log("winGif path:", winGif);
    console.log("tonGif path:", tonGif);

    // 초기 아이템 생성
    const initialItems: FloatingItem[] = [
      {
        id: 1,
        src: winGif,
        alt: "Win",
        x: Math.random() * (window.innerWidth - 40),
        y: 200 + Math.random() * 100, // 화면 하단에서 시작
        directionX: (Math.random() - 0.5) * 2,
        directionY: (Math.random() - 0.5) * 2,
        speed: 1.5 + Math.random() * 1.5,
      },
      {
        id: 2,
        src: tonGif,
        alt: "Ton",
        x: Math.random() * (window.innerWidth - 40),
        y: 200 + Math.random() * 100, // 화면 하단에서 시작
        directionX: (Math.random() - 0.5) * 2,
        directionY: (Math.random() - 0.5) * 2,
        speed: 1.5 + Math.random() * 1.5,
      },
    ];
    console.log("Initial items:", initialItems);
    setItems(initialItems);

    // 애니메이션 루프
    const animate = () => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          let newX = item.x + item.directionX * item.speed;
          let newY = item.y + item.directionY * item.speed;

          // 화면 경계 체크
          if (newX <= 0 || newX >= window.innerWidth - 40) {
            item.directionX *= -1;
            newX = Math.max(0, Math.min(window.innerWidth - 40, newX));
          }

          if (newY <= 0 || newY >= 300) {
            item.directionY *= -1;
            newY = Math.max(0, Math.min(300, newY));
          }

          return {
            ...item,
            x: newX,
            y: newY,
          };
        })
      );
    };

    const intervalId = setInterval(animate, 50);

    return () => clearInterval(intervalId);
  }, []);

  // 툴팁 표시 함수
  const showTooltip = (item: FloatingItem, x: number, y: number) => {
    const text = item.alt === "Win" ? "오-예!" : "할짝";
    const newTooltip: Tooltip = {
      id: tooltipId,
      text,
      x: x + 50, // 이미지 옆에 표시
      y: y - 30, // 이미지 위에 표시
      visible: true,
    };

    setTooltips((prev) => [...prev, newTooltip]);
    setTooltipId((prev) => prev + 1);

    // 2.5초 후 툴팁 제거
    setTimeout(() => {
      setTooltips((prev) => prev.filter((t) => t.id !== newTooltip.id));
    }, 1500);
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (item: FloatingItem, x: number, y: number) => {
    showTooltip(item, x, y);
  };

  return (
    <div className="floating-animation">
      {items.map((item) => (
        <img
          key={item.id}
          src={item.src}
          alt={item.alt}
          className="floating-item"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
          }}
          onClick={() => handleImageClick(item, item.x, item.y)}
          onError={(e) => {
            console.error("Image failed to load:", item.src);
            e.currentTarget.style.display = "none";
          }}
        />
      ))}

      {/* 툴팁들 */}
      {tooltips.map((tooltip) => (
        <div
          key={tooltip.id}
          className="tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.text}
        </div>
      ))}
    </div>
  );
};

export default FloatingAnimation;
