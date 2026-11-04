import type { Mood } from "./cat";

const MINUTES_PER_COIN = 5;
const HAPPY_BONUS = 1.5;

export function coinsFor(learnMinutes: number, mood: Mood): number {
  const base = Math.floor(learnMinutes / MINUTES_PER_COIN);
  return mood === "happy" ? Math.ceil(base * HAPPY_BONUS) : base;
}
