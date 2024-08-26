import { GAME_TIME } from "@/constants";

 
 
const calculateScore = (timeSpent: number, movesLeft: number) => {
  const baseScore = 1000;
  const maxTime = 500;

  const time = Math.min(
    maxTime,
    (timeSpent / GAME_TIME) * maxTime
  );

  const move = movesLeft * 10;

  const score = baseScore - time - move;

  return Math.max(Math.floor(score), 0);
};

export default calculateScore;
