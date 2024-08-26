import CardItem from "@/components/CardItem";
import HeaderInfo from "@/components/HeaderInfo";
import Records from "@/components/Records";
import { ALERT_MESSAGES, GAME_MOVEMENT, GAME_TIME } from "@/constants";
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

export const getServerSideProps = async () => ({
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

  const showAlert = useCallback(
    (
      title: string,
      text: string,
      icon: SweetAlertOptions["icon"],
      callback: () => void
    ) => {
      Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: "بازی دوباره",
        showCancelButton: true,
        cancelButtonText: "متوجه شدم",
      }).then(({ isConfirmed }) => isConfirmed && callback());
    },
    []
  );

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

  const handleMatchingPair = (item: ItemType) => {
    let isWon = false;
    const modifiedItems = items.map((prevItem) =>
      prevItem.id === item.id ? { ...prevItem, isFlip: true } : prevItem
    );
    if (modifiedItems.every((x) => x.isFlip)) {
      isWon = true;
      setUserIsWon(true);
      setGameActive(false);
      setTimeout(() => {
        showAlert(
          ALERT_MESSAGES.win.title,
          ALERT_MESSAGES.win.text,
          "success",
          resetGame
        );
      }, 1000);
    }
    setItems(modifiedItems);

    if (isWon) {
      let timeSpent = GAME_TIME - time;
      let movesLeft = GAME_MOVEMENT - clickTimes;
      addRecord({
        date: new Intl.DateTimeFormat("Fa-IR").format(Date.now()),
        movesLeft,
        timeSpent,
        score: calculateScore(timeSpent, movesLeft),
      });
    }
    
    setTempItems([]);
  };
  const handleClickItem = useCallback(
    (item: ItemType) => {
      setGameActive(true);

      const updatedClickTimes = Math.max(clickTimes - 1, 0);
      setClickTimes(updatedClickTimes);

      const isMatchingPair =
        tempItems.length === 1 &&
        tempItems[0].id === item.id &&
        tempItems[0].index !== item.index;

      const gameState = () => {
        if (updatedClickTimes <= 0 && !userIsWon) return "NO_MOVES";
        if (time === 0 && !userIsWon) return "TIME_OUT";
        if (isMatchingPair) return "MATCHING_PAIR";
        if (tempItems.length === 1) return "NO_MATCH";
        return "FIRST_CLICK";
      };

      const state = gameState();
      if (state === "NO_MOVES" || state === "TIME_OUT") {
        if (state === "NO_MOVES") {
          showAlert(
            ALERT_MESSAGES.noMoves.title,
            ALERT_MESSAGES.noMoves.text,
            "error",
            resetGame
          );
        } else {
          showAlert(
            ALERT_MESSAGES.timeOut.title,
            ALERT_MESSAGES.timeOut.text,
            "error",
            resetGame
          );
        }
      } else if (state === "MATCHING_PAIR") {
        handleMatchingPair(item);
      } else if (state === "NO_MATCH") {
        setTempItems([tempItems[0], item]);
        setTimeout(() => setTempItems([]), 1000);
      } else if (state === "FIRST_CLICK") {
        setTempItems([item]);
      }
    },
    [clickTimes, time, userIsWon, tempItems, showAlert, resetGame]
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
              onClick={handleClickItem}
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
