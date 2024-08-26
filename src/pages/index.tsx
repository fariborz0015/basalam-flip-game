import { Vazirmatn } from "next/font/google";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

interface ItemType {
  id: number;
  isFlip: boolean;
  index: number;
}

export default function Home() {
  const [time, setTime] = useState(120);
  const [clickTimes, setClickTimes] = useState(40);
  const [isPending, setIsPending] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);
  const [tempItems, setTempItems] = useState<ItemType[]>([]);
  const [userIsWon, setUserIsWon] = useState<boolean>(false);
  const [isStarted,setStarted]=useState<boolean>(false)

  const generateRandomItems = useCallback(() => {
    const RandIds = [1, 2, 3, 4, 5, 6, 7, 8];
    const orderedItems = RandIds.flatMap((item) => [
      { id: item, isFlip: false, index: 0 },
      { id: item, isFlip: false, index: 0 },
    ]);

    const shuffledItems = orderedItems
      .map((item, index) => ({ ...item, index }))
      .sort(() => 0.5 - Math.random());

    setItems(shuffledItems);
  }, []);

  useEffect(() => {
    if (items.length === 0) generateRandomItems();
  }, [generateRandomItems, items.length]);

  const Images = [
    "/assets/products/product-1.jpg",
    "/assets/products/product-2.jpg",
    "/assets/products/product-3.jpg",
    "/assets/products/product-4.jpg",
    "/assets/products/product-5.jpg",
    "/assets/products/product-6.jpg",
    "/assets/products/product-7.jpg",
    "/assets/products/product-8.jpg",
  ];
  // این لاجیک با استفاده از اینتروال هست برای ثانیه شمار
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (time > 0) {
  //       setTime((prev) => prev - 1);
  //     }
  //   }, 1000);
  //   if (time == 0) clearInterval(intervalId);

  //   return () => clearInterval(intervalId);
  // }, [time]);

  // این با استفاده از setTimeOut

  const TimeEndAlert = () =>
    Swal.fire({
      title: "باختی !",
      text: "قبل اینکه همه کارت هارو حدس بزنی زمانت تموم شد ",
      icon: "error",
      confirmButtonText: "بازی دوباره",
      showCancelButton: true,
      cancelButtonText: "متوجه شدم",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) tryAgain();
    });

  const OpportunityEndAlert = () =>
    Swal.fire({
      title: "باختی !",
      text: "قبل اینکه همه کارت هارو حدس بزنی   حرکت هات تموم شد ",
      icon: "error",
      confirmButtonText: "بازی دوباره",
      showCancelButton: true,
      cancelButtonText: "متوجه شدم",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) tryAgain();
    });

  const WonAlert = () =>
    Swal.fire({
      title: " آفرین بهت باهوش  !",
      text: "تونستی همه کارت هارو درست حدس بزنی ، نظرت چیه یه دست دیگه بازی کنیم ؟ ",
      icon: "success",
      confirmButtonText: "  باشه بازی کنیم",
      showCancelButton: true,
      cancelButtonText: "نموخوام ",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) tryAgain();
    });

  useEffect(() => {
    if (time > 0 && !userIsWon && isStarted) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time <= 0) TimeEndAlert();
  }, [time, userIsWon,isStarted]);

  const handleReset = () => {
    setTempItems([]);
    setIsPending(false);
 
  };

  const tryAgain = () => {
    setTempItems([]);
    setIsPending(false);
    setTime(120);
    setClickTimes(40);
    generateRandomItems();
    setUserIsWon(false);
    setStarted(false)
  };

  const clickHandler = (item: ItemType) => {
    setStarted(true)
    if (clickTimes > 0 && !isPending && time > 0 && !userIsWon) {
      setClickTimes((prev) => Math.max(prev - 1, 0));
      if (tempItems.length === 1) {
        const [firstItem] = tempItems;

        if (firstItem.id === item.id && firstItem.index !== item.index) {
          setItems((prev) => {
            let newItems = prev.map((prevItem) =>
              prevItem.id === item.id ? { ...prevItem, isFlip: true } : prevItem
            );
            if (
              newItems.filter((x) => x.isFlip == true).length == items.length
            ) {
              setUserIsWon(true);
              setStarted(false)
              setTimeout(() =>WonAlert(),1000)
            }
            return newItems;
          });
          handleReset();
        } else {
          setTempItems([firstItem, item]);
          setIsPending(true);
          setTimeout(() => handleReset(), 1000);
        }
      } else {
        setTempItems([item]);
      }
    } else if (clickTimes <= 0 && !userIsWon) {
      OpportunityEndAlert();
    } else if (time == 0 && !userIsWon) {
      TimeEndAlert();
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${vazirmatn.className}`}
    >
      <div className="max-w-md mx-auto space-y-6 flex flex-col items-end">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-bold">
            تعداد حرکت: <span>{clickTimes}</span>
          </h2>
          <h2 className="text-lg font-bold">
            زمان:{" "}
            <span>
              {Math.floor(time / 60)}:{Math.floor(time % 60)}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-4 w-full h-fit gap-2">
          {items.map((item) => {
            const isTemporary = tempItems.some(
              (tempItem) =>
                tempItem.id === item.id && tempItem.index === item.index
            );
            const isActive = isTemporary || item.isFlip;
            return (
              <>
                <div
                  onClick={() => clickHandler(item)}
                  className={`
                     
                  col-span-1 w-20 h-20    relative shadow-inner  flex justify-center items-center`}
                  key={item.index}
                >
                  <div
                    className={`w-full    rounded-lg h-full absolute top-0 flex justify-center items-center   left-0 ${
                      isActive ? "animate-flip" : "animate-flip-back"
                    }`}
                  >
                    <Image
                      width={80}
                      height={80}
                      src={Images[item.id - 1]}
                      alt={"chance"}
                      className="text-lg  border  rounded-lg   font-extrabold animate-flip "
                    />
                  </div>
                  <div
                    className={`w-full h-full overflow-hidden  rounded-lg absolute top-0 shadow-inner border bg-white bg-contain  bg-[url('/logo.png')] left-0 ${
                      isActive ? "animate-flip" : "animate-flip-back"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  ></div>
                </div>
              </>
            );
          })}
        </div>
        <button
          onClick={tryAgain}
          className="px-4 py-2  bg-yellow-400 text-black font-bold rounded-md"
        >
          شروع دوباره
        </button>
      </div>
    </main>
  );
}
