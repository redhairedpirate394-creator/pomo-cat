import type { CatErrorCode, Mood } from "../../domain/cat";
import type { FoodId, RoomItemId, SnackId } from "../../domain/catalog";
import type { TodoErrorCode } from "../../domain/todos";
import type { StoreErrorCode } from "../../storage/port";

// Language-neutral glyphs and names that are the same in every catalog.
export const GLYPHS = {
  help: "?",
  remove: "×",
  previous: "‹",
  next: "›",
  titleSeparator: " · ",
} as const;

// Each language is named in its own language, whichever locale is active.
export const LANGUAGE_NAMES = { de: "Deutsch", en: "English" } as const;

export type ErrorCode =
  | CatErrorCode
  | TodoErrorCode
  | StoreErrorCode
  | "unexpected";

// Every locale implements this shape, so a missing string is a type error.
// Parameterized text is a function: translators control word order instead of
// the UI concatenating sentence fragments.
export interface Messages {
  readonly documentTitle: string;
  readonly intlLocale: string;
  readonly calendar: string;
  readonly previousMonth: string;
  readonly nextMonth: string;
  readonly dayMinutes: (date: string, minutes: number) => string;
  readonly streak: (days: number) => string;
  readonly todos: string;
  readonly todoLabel: string;
  readonly todoAdd: string;
  readonly todoDelete: (text: string) => string;
  readonly settings: string;
  readonly settingLearn: string;
  readonly settingShortBreak: string;
  readonly settingLongBreak: string;
  readonly settingUnits: string;
  readonly settingsNote: string;
  readonly helpOpen: string;
  readonly helpTitle: string;
  readonly helpPoints: readonly [string, string, string];
  readonly settingSound: string;
  readonly settingLanguage: string;
  readonly minutes: (count: number) => string;
  readonly close: string;
  readonly loading: string;
  readonly otherTab: string;
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
  readonly timerLabel: (time: string) => string;
  readonly feedTitle: string;
  readonly feedQuestion: (name: string) => string;
  readonly feedTimeLeft: (time: string) => string;
  readonly feedStopNote: string;
  readonly foods: Readonly<Record<FoodId, string>>;
  readonly fedNote: (name: string, coins: number) => string;
  readonly warning: string;
  readonly warningStop: string;
  readonly hold: string;
  readonly learnNow: string;
  readonly petCat: (name: string) => string;
  readonly catPetted: (name: string) => string;
  readonly heldNote: string;
  readonly shop: string;
  readonly snacksHeading: string;
  readonly roomHeading: string;
  readonly snacks: Readonly<Record<SnackId, string>>;
  readonly roomItems: Readonly<Record<RoomItemId, string>>;
  readonly buy: (name: string, price: string) => string;
  readonly ownedItem: (name: string) => string;
  readonly snackNote: (cat: string, snack: string) => string;
  readonly itemNote: (item: string) => string;
  readonly playWith: (item: string) => string;
  readonly playNote: (cat: string, item: string) => string;
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
