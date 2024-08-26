import { GAME_TIME } from "@/constants";

 
 
const calculateScore = (timeSpent: number, movesLeft: number) => {
  const baseScore = 1000;
  const maxTimePenalty = 500;

  const timePenalty = Math.min(
    maxTimePenalty,
    (timeSpent / GAME_TIME) * maxTimePenalty
  );

  const movePenalty = movesLeft * 10;

  const score = baseScore - timePenalty - movePenalty;

  return Math.max(Math.floor(score), 0);
};

export default calculateScore;
