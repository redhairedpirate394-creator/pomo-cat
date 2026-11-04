import { z } from "zod";
import { NAME_MAX } from "../domain/cat";
import { ROOM_ITEM_IDS, type RoomItemId } from "../domain/catalog";
import { isValidMinutes, isValidUnits, LIMITS } from "../domain/settings";
import { TODO_MAX } from "../domain/todos";
import { type GameStore, StoreError } from "./port";

export const STORAGE_KEY = "pomo-cat:game:v1";
export const DEMO_STORAGE_KEY = "pomo-cat:demo:v1";

const timestamp = z.number().finite();

const planSchema = z
  .object({
    learnMinutes: z
      .number()
      .refine((value) => isValidMinutes(value, LIMITS.learnMinutes)),
    shortBreakMinutes: z
      .number()
      .refine((value) => isValidMinutes(value, LIMITS.shortBreakMinutes)),
    longBreakMinutes: z
      .number()
      .refine((value) => isValidMinutes(value, LIMITS.longBreakMinutes)),
    units: z.number().refine(isValidUnits),
  })
  .strict();

const unitNumber = z.number().int().min(1).max(LIMITS.units.max);

const phaseSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("idle") }).strict(),
  z
    .object({
      kind: z.literal("learning"),
      plan: planSchema,
      unit: unitNumber,
      startedAt: timestamp,
      endsAt: timestamp,
    })
    .strict(),
  z
    .object({
      kind: z.literal("break"),
      plan: planSchema,
      unit: unitNumber,
      length: z.enum(["short", "long"]),
      endsAt: timestamp,
      fed: z.boolean(),
      coinsEarned: z.number().int().min(0),
      warned: z.boolean(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("held"),
      plan: planSchema,
      nextUnit: unitNumber,
    })
    .strict(),
]);

const roomItemId = z.custom<RoomItemId>(
  (value) =>
    typeof value === "string" && ROOM_ITEM_IDS.some((id) => id === value),
);

const stateSchema = z
  .object({
    version: z.literal(1),
    cat: z
      .object({
        name: z.string().trim().min(1).max(NAME_MAX),
        mood: z.enum(["sad", "normal", "happy"]),
        moodAt: timestamp,
      })
      .strict()
      .nullable(),
    coins: z.number().int().min(0),
    owned: z
      .array(roomItemId)
      .refine((items) => new Set(items).size === items.length),
    studyLog: z.record(
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      z.number().int().min(0),
    ),
    todos: z.array(
      z
        .object({
          id: z.string().min(1),
          text: z.string().trim().min(1).max(TODO_MAX),
          done: z.boolean(),
        })
        .strict(),
    ),
    settings: planSchema
      .extend({
        sound: z.boolean(),
        language: z.enum(["de", "en"]).nullable(),
      })
      .strict(),
    phase: phaseSchema,
    lastSeenAt: timestamp.nullable(),
  })
  .strict();

type StorageAccess = () => Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function createBrowserStore(
  key: string = STORAGE_KEY,
  access: StorageAccess = () => window.localStorage,
): GameStore {
  return {
    async load() {
      let raw: string | null;
      try {
        raw = access().getItem(key);
      } catch {
        throw new StoreError("read-failed");
      }
      if (raw === null) return null;
      try {
        const { version: _version, ...state } = stateSchema.parse(
          JSON.parse(raw),
        );
        return state;
      } catch {
        throw new StoreError("data-invalid");
      }
    },
    async save(state) {
      const document = stateSchema.parse({ version: 1, ...state });
      try {
        access().setItem(key, JSON.stringify(document));
      } catch {
        throw new StoreError("save-failed");
      }
    },
    async reset() {
      try {
        access().removeItem(key);
      } catch {
        throw new StoreError("reset-failed");
      }
    },
  };
}
