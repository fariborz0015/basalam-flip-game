import { ItemType } from "@/pages";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface CardItemProps {
  item: ItemType;
  onClick: (arg: ItemType) => void;
  isActive: boolean;
}
const CardItem = ({ item, onClick, isActive = false }: CardItemProps) => {
  const [showImage, setShowImage] = useState<boolean>(isActive);

  useEffect(() => {
    if (isActive) {
      setShowImage(true);
    } else {
      const timer = setTimeout(() => setShowImage(false), 1000); // 1 ثانیه تأخیر
      return () => clearTimeout(timer); // پاک کردن تایمر در صورت تغییر isActive یا خروج از کامپوننت
    }
  }, [isActive]);
  return (
    <div
      onClick={() => onClick?.(item)}
      className="col-span-1 w-20 h-20 relative shadow-inner flex justify-center items-center"
      key={item.index}
    >
      <div
        className={`w-full rounded-lg h-full absolute top-0 flex justify-center items-center left-0 ${
          isActive ? "animate-flip" : "animate-flip-back"
        }`}
      >
        {showImage && (
          <Image
            width={80}
            height={80}
            src={item.img}
            alt="chance"
            className={`text-lg border rounded-lg font-extrabold  ${    isActive ? "animate-flip" : "animate-flip-back"}`}
          />
        )}
      </div>
      <div
        className={`w-full h-full overflow-hidden rounded-lg absolute top-0 shadow-inner border bg-white bg-contain bg-[url('/logo.png')] left-0 ${
          isActive ? "animate-flip" : "animate-flip-back"
        }`}
        style={{ backfaceVisibility: "hidden" }}
      />
    </div>
  );
};

export default CardItem;
