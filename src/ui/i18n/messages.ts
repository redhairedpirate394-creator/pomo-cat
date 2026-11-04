import type { CatErrorCode, Mood } from "../../domain/cat";
import type { FoodId } from "../../domain/catalog";
import type { StoreErrorCode } from "../../storage/port";

export type ErrorCode = CatErrorCode | StoreErrorCode | "unexpected";

// Every locale implements this shape, so a missing string is a type error.
// Parameterized text is a function: translators control word order instead of
// the UI concatenating sentence fragments.
export interface Messages {
  readonly documentTitle: string;
  readonly loading: string;
  readonly nameTitle: string;
  readonly nameLabel: string;
  readonly nameSubmit: string;
  readonly start: string;
  readonly stop: string;
  readonly stopTitle: string;
  readonly stopText: string;
  readonly stopConfirm: string;
  readonly stopKeep: string;
  readonly unitOf: (unit: number, total: number) => string;
  readonly breakShort: string;
  readonly breakLong: string;
  readonly timerLabel: string;
  readonly feedTitle: string;
  readonly feedQuestion: (name: string) => string;
  readonly feedTimeLeft: (time: string) => string;
  readonly feedStopNote: string;
  readonly foods: Readonly<Record<FoodId, string>>;
  readonly fedNote: (name: string, coins: number) => string;
  readonly warning: string;
  readonly warningStop: string;
  readonly continueUnit: (unit: number, total: number) => string;
  readonly coins: (count: number) => string;
  readonly catAsleep: (name: string) => string;
  readonly catEating: (name: string) => string;
  readonly catMood: (name: string, mood: Mood) => string;
  readonly demoNote: string;
  readonly retry: string;
  readonly startOver: string;
  readonly startOverTitle: string;
  readonly startOverText: string;
  readonly startOverConfirm: string;
  readonly cancel: string;
  readonly saveFailed: string;
  readonly errors: Readonly<Record<ErrorCode, string>>;
}
