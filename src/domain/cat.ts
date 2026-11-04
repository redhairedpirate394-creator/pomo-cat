export type Mood = "sad" | "normal" | "happy";

export interface Cat {
  readonly name: string;
  readonly mood: Mood;
  /** When the mood last rose (or the cat was named). */
  readonly moodAt: number;
}

export const NAME_MAX = 20;

const HOUR = 60 * 60 * 1000;
const NORMAL_AFTER = 48 * HOUR;
const SAD_AFTER = 96 * HOUR;

export type CatErrorCode = "name-required" | "name-too-long";

export class CatError extends Error {
  readonly code: CatErrorCode;

  constructor(code: CatErrorCode) {
    super(code);
    this.name = "CatError";
    this.code = code;
  }
}

export function createCat(name: string, now: number): Cat {
  const trimmed = name.trim();
  if (trimmed.length === 0) throw new CatError("name-required");
  if (trimmed.length > NAME_MAX) throw new CatError("name-too-long");
  return { name: trimmed, mood: "normal", moodAt: now };
}

/** The stored mood fades with time; the cat never gets worse than sad. */
export function currentMood(cat: Cat, now: number): Mood {
  const elapsed = now - cat.moodAt;
  if (elapsed >= SAD_AFTER) return "sad";
  if (elapsed >= NORMAL_AFTER && cat.mood === "happy") return "normal";
  return cat.mood;
}

export function raiseMood(cat: Cat, now: number): Cat {
  const mood = currentMood(cat, now);
  return {
    ...cat,
    mood: mood === "sad" ? "normal" : "happy",
    moodAt: now,
  };
}
