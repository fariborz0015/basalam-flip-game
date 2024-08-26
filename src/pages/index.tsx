import CardItem from "@/components/CardItem";
import HeaderInfo from "@/components/HeaderInfo";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Vazirmatn } from "next/font/google";
import Image from "next/image";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  useRef,
} from "react";
import Swal from "sweetalert2";
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
  const [time, setTime] = useState(120);
  const [clickTimes, setClickTimes] = useState(40);
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [tempItems, setTempItems] = useState<ItemType[]>([]);
  const [userIsWon, setUserIsWon] = useState<boolean>(false);
  const [isStarted, setStarted] = useState<boolean>(false);

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

  const handleReset = useCallback(() => {
    setTempItems([]);
  }, []);

  const tryAgain = useCallback(() => {
    handleReset();
    setTime(120);
    setClickTimes(40);
    setItems(randomItemGenerator());
    setUserIsWon(false);
    setStarted(false);
  }, [handleReset]);

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

  const handleMatchingPair = useCallback(
    (item: ItemType) => {
      setItems((prev) => {
        const newItems = prev.map((prevItem) =>
          prevItem.id === item.id ? { ...prevItem, isFlip: true } : prevItem
        );

        if (newItems.every((x) => x.isFlip)) {
          setUserIsWon(true);
          setStarted(false);
          setTimeout(
            () =>
              showAlert(
                " آفرین بهت باهوش !",
                "تونستی همه کارت هارو درست حدس بزنی ، نظرت چیه یه دست دیگه بازی کنیم ؟",
                "success",
                tryAgain
              ),
            1000
          );
        }

        return newItems;
      });
      handleReset();
    },
    [setItems, setUserIsWon, setStarted, showAlert, tryAgain, handleReset]
  );

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
            console.log("first click");
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
          console.log("s");
          setTempItems([tempItems[0], item]);
          console.log([tempItems[0], item]);
          setTimeout(() => handleReset(), 1000);
          break;

        case "FIRST_CLICK":
          setTempItems([item]);
          break;

        case "DEFAULT":
        default:
          break;
      }
    },
    [
      clickTimes,
      time,
      userIsWon,
      tempItems,
      showAlert,
      tryAgain,
      handleReset,
      handleMatchingPair,
    ]
  );

  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    console.log(`Component re-rendered ${renderCount.current} times`);
  });
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${vazirmatn.className}`}
    >
      <div className="max-w-md mx-auto space-y-6 flex flex-col items-end">
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
    </main>
  );
}
