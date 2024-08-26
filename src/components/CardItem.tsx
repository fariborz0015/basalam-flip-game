import { ItemType } from "@/pages";
import Image from "next/image";
import React from "react";

interface CardItemProps {
  item: ItemType;
  onClick: (arg: ItemType) => void;
  isActive: boolean;
}
const CardItem = ({ item, onClick, isActive = false }: CardItemProps) => {
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
        {
          <Image
            width={80}
            height={80}
            src={item.img}
            alt="chance"
            className="text-lg border rounded-lg font-extrabold animate-flip"
          />
        }
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
