import { GAME_TIME } from "@/constants";

const calculateScore = (timeSpent: number, movesLeft: number) => {
  const baseScore = 1000; // امتیاز پایه
  const timeScore = Math.max(0, GAME_TIME - timeSpent); // امتیاز بر اساس تایم صرف شده
  const moveScore = movesLeft * 10; // امتیاز بر اساس حرکت‌های باقی‌مانده

  return baseScore + timeScore + moveScore;
};
export default calculateScore;
