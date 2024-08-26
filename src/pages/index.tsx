import CardItem from "@/components/CardItem";
import HeaderInfo from "@/components/HeaderInfo";
import Records from "@/components/Records";
import { GAME_MOVEMENT, GAME_TIME } from "@/constants";
import useRecordStore from "@/hooks/useRecordStore";
import calculateScore from "@/utils/calculateScore ";
import { Vazirmatn } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import Swal, { SweetAlertOptions } from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export interface ItemType {
  id: number;
  isFlip: boolean;
  index: number;
  img: string;
}

const randomItemGenerator = () => {
  const RandIds = [1, 2, 3, 4, 5, 6, 7, 8];
  return RandIds.flatMap((item) => [
    {
      id: item,
      isFlip: false,
      index: 0,
      img: `/assets/products/product-${item}.jpg`,
    },
    {
      id: item,
      isFlip: false,
      index: 0,
      img: `/assets/products/product-${item}.jpg`,
    },
  ])
    .map((item, index) => ({ ...item, index }))
    .sort(() => Math.random() - 0.5);
};

export const getServerSideProps = async ( ) => ({
  props: { initialItems: randomItemGenerator() },
});

interface HomeProps {
  initialItems: ItemType[];
}

export default function Home({ initialItems }: HomeProps) {
  const [time, setTime] = useState(GAME_TIME);
  const [clickTimes, setClickTimes] = useState(GAME_MOVEMENT);
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [tempItems, setTempItems] = useState<ItemType[]>([]);
  const [isGameActive, setGameActive] = useState(false);
  const [userIsWon, setUserIsWon] = useState(false);
  const { addRecord } = useRecordStore();
  const renderCount = useRef(0);

  const resetGame = useCallback(() => {
    setTempItems([]);
    setTime(GAME_TIME);
    setClickTimes(GAME_MOVEMENT);
    setItems(randomItemGenerator());
    setUserIsWon(false);
    setGameActive(false);
  }, []);

  const showAlert = useCallback((title:string, text:string, icon:SweetAlertOptions['icon'], callback:()=>void) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "بازی دوباره",
      showCancelButton: true,
      cancelButtonText: "متوجه شدم",
    }).then(({ isConfirmed }) => isConfirmed && callback());
  }, []);

  const checkGameOver = useCallback(() => {
    if (time <= 0) {
      showAlert(
        "باختی!",
        "قبل اینکه همه کارت هارو حدس بزنی زمانت تموم شد",
        "error",
        resetGame
      );
    } else if (clickTimes <= 0) {
      showAlert(
        "باختی!",
        "قبل اینکه همه کارت هارو حدس بزنی حرکت هات تموم شد",
        "error",
        resetGame
      );
    }
  }, [time, clickTimes, showAlert, resetGame]);

  useEffect(() => {
    if (isGameActive && time > 0 && !userIsWon) {
      const timer = setTimeout(() => setTime((prevTime) => prevTime - 1), 1000);
      return () => clearTimeout(timer);
    }
    checkGameOver();
  }, [time, isGameActive, userIsWon, checkGameOver]);

  useEffect(() => {
    if (userIsWon) {
      const timeSpent = GAME_TIME - time;
      const movesLeft = GAME_MOVEMENT - clickTimes;
      addRecord({
        date: new Intl.DateTimeFormat("Fa-IR").format(Date.now()),
        movesLeft,
        timeSpent,
        score: calculateScore(timeSpent, movesLeft),
      });
    }
  }, [userIsWon, time, clickTimes, addRecord]);

  const handleItemClick = useCallback(
    (item: ItemType) => {
      if (!isGameActive) setGameActive(true);

      if (
        tempItems.length === 1 &&
        tempItems[0].id === item.id &&
        tempItems[0].index !== item.index
      ) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isFlip: true } : i))
        );
        setTempItems([]);
        if (items.every((i) => i.isFlip || i.id === item.id)) {
          setUserIsWon(true);
          setGameActive(false);
          showAlert(
            "آفرین بهت باهوش!",
            "تونستی همه کارت هارو درست حدس بزنی، نظرت چیه یه دست دیگه بازی کنیم؟",
            "success",
            resetGame
          );
        }
      } else {
        setClickTimes((prev) => Math.max(prev - 1, 0));
        if (tempItems.length < 2) {
          setTempItems((prev) => (prev.length === 1 ? [] : [item]));
        }
      }
    },
    [isGameActive, tempItems, items, showAlert, resetGame]
  );

  useEffect(() => {
    renderCount.current += 1;
    console.log(`Component re-rendered ${renderCount.current} times`);
  });

  return (
    <main
      className={`flex flex-col container mx-auto min-h-screen gap-y-10 p-24 ${vazirmatn.className}`}
    >
      <div className="sm:col-span-8 col-span-12 max-w-md mx-auto space-y-6 flex flex-col items-end">
        <HeaderInfo clickTimes={clickTimes} time={time} />
        <div className="grid grid-cols-4 w-full h-fit gap-2">
          {items.map((item) => (
            <CardItem
              onClick={handleItemClick}
              item={item}
              isActive={
                tempItems.some(
                  (temp) => temp.id === item.id && temp.index === item.index
                ) || item.isFlip
              }
              key={item.index}
            />
          ))}
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md"
        >
          شروع دوباره
        </button>
      </div>
      <div className="flex-1 col-span-full max-w-lg mx-auto">
        <Records />
      </div>
    </main>
  );
}
