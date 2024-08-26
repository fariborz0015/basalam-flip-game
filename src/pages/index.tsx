import { useCallback, useEffect, useRef, useState } from "react";

import Swal from "sweetalert2";
import CardItem from "@/components/CardItem";
import { Vazirmatn } from "next/font/google";
import HeaderInfo from "@/components/HeaderInfo";
import { GetServerSidePropsContext } from "next";

import "sweetalert2/src/sweetalert2.scss";
import Records from "@/components/Records";
import { GAME_MOVEMENT, GAME_TIME } from "@/constants";
import useRecordStore from "@/hooks/useRecordStore";
import calculateScore from "@/utils/calculateScore ";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export interface ItemType {
  id: number;
  isFlip: boolean;
  index: number;
  img: string;
}

const randomItemGenerator = () => {
  const RandIds = [1, 2, 3, 4, 5, 6, 7, 8];

  const orderedItems = RandIds.flatMap((item) => [
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
  ]);

  const shuffledItems = orderedItems
    .map((item, index) => ({ ...item, index }))
    .sort(() => 0.5 - Math.random());
  return shuffledItems;
};

export const getServerSideProps = async (props: GetServerSidePropsContext) => {
  const initialItems = randomItemGenerator();
  return {
    props: {
      initialItems,
    },
  };
};

interface HomeProps {
  initialItems: ItemType[];
}

export default function Home({ initialItems }: HomeProps) {
  const [time, setTime] = useState(GAME_TIME);
  const [clickTimes, setClickTimes] = useState(GAME_MOVEMENT);
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [tempItems, setTempItems] = useState<ItemType[]>([]);
  const [userIsWon, setUserIsWon] = useState<boolean>(false);
  const [isStarted, setStarted] = useState<boolean>(false);
  const { addRecord } = useRecordStore();
  const showAlert = useCallback(
    (title: string, text: string, icon: any, callback: () => void) => {
      Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: "بازی دوباره",
        showCancelButton: true,
        cancelButtonText: "متوجه شدم",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) callback();
      });
    },
    []
  );

  const tryAgain = useCallback(() => {
    setTempItems([]);
    setTime(120);
    setClickTimes(40);
    setItems(randomItemGenerator());
    setUserIsWon(false);
    setStarted(false);
  }, []);

  useEffect(() => {
    if (time > 0 && !userIsWon && isStarted) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time <= 0)
      showAlert(
        "باختی !",
        "قبل اینکه همه کارت هارو حدس بزنی زمانت تموم شد",
        "error",
        tryAgain
      );
  }, [time, userIsWon, isStarted, showAlert, tryAgain]);

  useEffect(() => {
    if (userIsWon) {
      let timeSpent = GAME_TIME - time;
      let movesLeft = GAME_MOVEMENT - clickTimes;
     
      addRecord({
        date: new Intl.DateTimeFormat("Fa-IR").format(Date.now()),
        movesLeft,
        timeSpent,
        score: calculateScore(timeSpent, movesLeft),
      });
    }
  }, [userIsWon]);

  const handleMatchingPair = (item: ItemType) => {
    setItems((prev) => {
      const newItems = prev.map((prevItem) =>
        prevItem.id === item.id ? { ...prevItem, isFlip: true } : prevItem
      );

      if (newItems.every((x) => x.isFlip)) {
        setUserIsWon(true);
        setStarted(false);
        setTimeout(() => {
          showAlert(
            " آفرین بهت باهوش !",
            "تونستی همه کارت هارو درست حدس بزنی ، نظرت چیه یه دست دیگه بازی کنیم ؟",
            "success",
            tryAgain
          );
        }, 1000);
      }

      return newItems;
    });
    setTempItems([]);
  };

  const handleClickItem = useCallback(
    (item: ItemType) => {
      setStarted(true);

      const updatedClickTimes = Math.max(clickTimes - 1, 0);
      setClickTimes(updatedClickTimes);

      const gameState = {
        clickTimes: updatedClickTimes,
        time,
        userIsWon,
        tempItemsLength: tempItems.length,
        matchingPair:
          tempItems.length === 1 &&
          tempItems[0].id === item.id &&
          tempItems[0].index !== item.index,
      };

      const getGameState = () => {
        if (gameState.clickTimes <= 0 && !gameState.userIsWon)
          return "NO_MOVES";
        if (gameState.time === 0 && !gameState.userIsWon) return "TIME_OUT";
        if (
          gameState.clickTimes > 0 &&
          !(gameState.tempItemsLength > 1) &&
          gameState.time > 0 &&
          !gameState.userIsWon
        ) {
          if (gameState.tempItemsLength === 1) {
            return gameState.matchingPair ? "MATCHING_PAIR" : "NO_MATCH";
          } else {
            return "FIRST_CLICK";
          }
        }
        return "DEFAULT";
      };

      switch (getGameState()) {
        case "NO_MOVES":
          showAlert(
            "باختی !",
            "قبل اینکه همه کارت هارو حدس بزنی حرکت هات تموم شد",
            "error",
            tryAgain
          );
          break;

        case "TIME_OUT":
          showAlert(
            "باختی !",
            "قبل اینکه همه کارت هارو حدس بزنی زمانت تموم شد",
            "error",
            tryAgain
          );
          break;

        case "MATCHING_PAIR":
          handleMatchingPair(item);
          break;

        case "NO_MATCH":
          setTempItems([tempItems[0], item]);
          setTimeout(() => setTempItems([]), 1000);
          break;

        case "FIRST_CLICK":
          setTempItems([item]);
          break;

        case "DEFAULT":
        default:
          break;
      }
    },
    [clickTimes, time, userIsWon, tempItems, showAlert, tryAgain]
  );

  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    console.log(`Component re-rendered ${renderCount.current} times`);
  });
  return (
    <main
      className={`flex flex-col container mx-auto  min-h-screen gap-y-10   p-24 ${vazirmatn.className}`}
    >
      <div className="sm:col-span-8 col-span-12  max-w-md mx-auto space-y-6 flex flex-col items-end">
        <HeaderInfo clickTimes={clickTimes} time={time} />
        <div className="grid grid-cols-4 w-full h-fit gap-2">
          {items.map((item) => {
            const isTemporary = tempItems.some(
              (tempItem) =>
                tempItem.id === item.id && tempItem.index === item.index
            );

            const isActive = isTemporary || item.isFlip;

            return (
              <CardItem
                onClick={handleClickItem}
                item={item}
                isActive={isActive}
                key={item.index}
              />
            );
          })}
        </div>
        <button
          onClick={tryAgain}
          className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md"
        >
          شروع دوباره
        </button>
      </div>
      <div className=" flex-1 col-span-full max-w-lg mx-auto">
        <Records />
      </div>
    </main>
  );
}
