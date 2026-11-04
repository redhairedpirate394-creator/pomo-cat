import { type Cat, createCat, currentMood, raiseMood } from "./cat";
import {
  type FoodId,
  ROOM_ITEMS,
  type RoomItemId,
  SNACK_PRICE,
} from "./catalog";
import { coinsFor } from "./rewards";
import {
  DEFAULT_SETTINGS,
  isValidMinutes,
  isValidUnits,
  LIMITS,
  type Plan,
  planFrom,
  type Settings,
} from "./settings";
import { addMinutes, type StudyLog } from "./studyLog";
import type { Todo } from "./todos";

const MINUTE = 60 * 1000;
const WARNING_MS = 30 * 1000;
/** Coming back within this time continues as if the app had stayed open. */
export const CLOSE_GRACE_MS = 2 * MINUTE;

export interface LearningPhase {
  readonly kind: "learning";
  readonly plan: Plan;
  readonly unit: number;
  readonly startedAt: number;
  readonly endsAt: number;
}

export interface BreakPhase {
  readonly kind: "break";
  readonly plan: Plan;
  /** The unit that just finished. */
  readonly unit: number;
  readonly length: "short" | "long";
  readonly endsAt: number;
  readonly fed: boolean;
  readonly coinsEarned: number;
  readonly warned: boolean;
}

export interface HeldPhase {
  readonly kind: "held";
  readonly plan: Plan;
  readonly nextUnit: number;
}

export type Phase =
  | { readonly kind: "idle" }
  | LearningPhase
  | BreakPhase
  | HeldPhase;

export interface GameState {
  readonly cat: Cat | null;
  readonly coins: number;
  readonly owned: readonly RoomItemId[];
  readonly studyLog: StudyLog;
  readonly todos: readonly Todo[];
  readonly settings: Settings;
  readonly phase: Phase;
  readonly lastSeenAt: number | null;
}

export type Sound = "unit-end" | "warning" | "long-break-end";

export interface Step {
  readonly state: GameState;
  readonly sounds: readonly Sound[];
}

const IDLE: Phase = { kind: "idle" };

export function newGame(): GameState {
  return {
    cat: null,
    coins: 0,
    owned: [],
    studyLog: {},
    todos: [],
    settings: DEFAULT_SETTINGS,
    phase: IDLE,
    lastSeenAt: null,
  };
}

export function nameCat(
  state: GameState,
  name: string,
  now: number,
): GameState {
  return { ...state, cat: createCat(name, now) };
}

function learning(plan: Plan, unit: number, startedAt: number): LearningPhase {
  return {
    kind: "learning",
    plan,
    unit,
    startedAt,
    endsAt: startedAt + plan.learnMinutes * MINUTE,
  };
}

/** Starts a run from idle, or continues a held one at its next unit. */
export function start(state: GameState, now: number): GameState {
  if (state.cat === null) return state;
  const { phase } = state;
  if (phase.kind === "idle") {
    return { ...state, phase: learning(planFrom(state.settings), 1, now) };
  }
  if (phase.kind === "held") {
    return { ...state, phase: learning(phase.plan, phase.nextUnit, now) };
  }
  return state;
}

function learnedMinutes(phase: LearningPhase, until: number): number {
  const end = Math.min(until, phase.endsAt);
  return Math.max(0, Math.floor((end - phase.startedAt) / MINUTE));
}

function cancelUnit(
  state: GameState,
  phase: LearningPhase,
  until: number,
): GameState {
  return {
    ...state,
    phase: IDLE,
    studyLog: addMinutes(
      state.studyLog,
      phase.startedAt,
      learnedMinutes(phase, until),
    ),
  };
}

/** Ends the unit and the run: the learned time counts, nothing else changes. */
export function stop(state: GameState, now: number): GameState {
  return state.phase.kind === "learning"
    ? cancelUnit(state, state.phase, now)
    : state;
}

function finishUnit(state: GameState, phase: LearningPhase): GameState {
  if (state.cat === null) return state;
  const { plan, unit, endsAt } = phase;
  const isLast = unit >= plan.units;
  const breakMinutes = isLast ? plan.longBreakMinutes : plan.shortBreakMinutes;
  // The bonus rewards the mood the cat was in, before this unit raises it.
  const coinsEarned = coinsFor(
    plan.learnMinutes,
    currentMood(state.cat, endsAt),
  );
  return {
    ...state,
    cat: raiseMood(state.cat, endsAt),
    coins: state.coins + coinsEarned,
    studyLog: addMinutes(state.studyLog, phase.startedAt, plan.learnMinutes),
    phase: {
      kind: "break",
      plan,
      unit,
      length: isLast ? "long" : "short",
      endsAt: endsAt + breakMinutes * MINUTE,
      fed: false,
      coinsEarned,
      warned: false,
    },
  };
}

function afterBreak(phase: BreakPhase): Phase {
  if (phase.length === "long") return IDLE;
  if (!phase.fed) {
    return { kind: "held", plan: phase.plan, nextUnit: phase.unit + 1 };
  }
  return learning(phase.plan, phase.unit + 1, phase.endsAt);
}

/**
 * Moves through every phase that has expired by `now`, so a device that slept
 * through several phases still lands in a defined state. An unfed break always
 * ends the chain, which is what stops coins piling up with nobody there.
 */
export function advance(state: GameState, now: number): Step {
  let current = state;
  const sounds: Sound[] = [];
  for (;;) {
    const { phase } = current;
    if (phase.kind === "learning" && now >= phase.endsAt) {
      current = finishUnit(current, phase);
      sounds.push("unit-end");
    } else if (phase.kind === "break" && now >= phase.endsAt) {
      current = { ...current, phase: afterBreak(phase) };
      if (phase.length === "long") sounds.push("long-break-end");
    } else if (
      phase.kind === "break" &&
      phase.length === "short" &&
      !phase.warned &&
      now >= phase.endsAt - WARNING_MS
    ) {
      current = { ...current, phase: { ...phase, warned: true } };
      sounds.push("warning");
    } else {
      return { state: current, sounds };
    }
  }
}

export function feed(state: GameState, _food: FoodId): GameState {
  const { phase } = state;
  if (phase.kind !== "break" || phase.fed) return state;
  return { ...state, phase: { ...phase, fed: true } };
}

/** Stops a fed short break without a time limit; only a click goes on. */
export function hold(state: GameState): GameState {
  const { phase } = state;
  if (phase.kind !== "break" || phase.length !== "short" || !phase.fed) {
    return state;
  }
  return {
    ...state,
    phase: { kind: "held", plan: phase.plan, nextUnit: phase.unit + 1 },
  };
}

function closedTooLong(state: GameState, lastSeenAt: number): GameState {
  const { phase } = state;
  if (phase.kind === "learning") return cancelUnit(state, phase, lastSeenAt);
  if (phase.kind === "break") {
    return {
      ...state,
      phase:
        phase.length === "long"
          ? IDLE
          : { kind: "held", plan: phase.plan, nextUnit: phase.unit + 1 },
    };
  }
  return state;
}

/** Runs once when the app loads: only then can it know it had been closed. */
export function resumeAfterClose(state: GameState, now: number): GameState {
  const { lastSeenAt } = state;
  const closedFor = lastSeenAt === null ? 0 : now - lastSeenAt;
  if (lastSeenAt !== null && closedFor > CLOSE_GRACE_MS) {
    return closedTooLong(state, lastSeenAt);
  }
  return advance(state, now).state;
}

export function remainingMs(phase: Phase, now: number): number | null {
  if (phase.kind !== "learning" && phase.kind !== "break") return null;
  return Math.max(0, phase.endsAt - now);
}

/** Ends a fed break early; after the long break this starts a new run. */
export function learnNow(state: GameState, now: number): GameState {
  const { phase } = state;
  if (phase.kind !== "break" || !phase.fed) return state;
  if (phase.length === "long") {
    return start({ ...state, phase: IDLE }, now);
  }
  return { ...state, phase: learning(phase.plan, phase.unit + 1, now) };
}

function canShop(state: GameState): boolean {
  const { phase } = state;
  if (state.cat === null || phase.kind === "learning") return false;
  return phase.kind !== "break" || phase.fed;
}

/** A snack goes straight to the cat; there is no supply. */
export function buySnack(state: GameState, now: number): GameState {
  if (!canShop(state) || state.cat === null || state.coins < SNACK_PRICE) {
    return state;
  }
  return {
    ...state,
    coins: state.coins - SNACK_PRICE,
    cat: raiseMood(state.cat, now),
  };
}

export function buyRoomItem(state: GameState, id: RoomItemId): GameState {
  const item = ROOM_ITEMS.find((candidate) => candidate.id === id);
  if (
    !canShop(state) ||
    item === undefined ||
    !item.inShop ||
    state.owned.includes(id) ||
    state.coins < item.price
  ) {
    return state;
  }
  return {
    ...state,
    coins: state.coins - item.price,
    owned: [...state.owned, id],
  };
}

/** Only valid values get through; a running run keeps its own plan. */
export function updateSettings(
  state: GameState,
  patch: Partial<Settings>,
): GameState {
  const settings = { ...state.settings, ...patch };
  const valid =
    isValidMinutes(settings.learnMinutes, LIMITS.learnMinutes) &&
    isValidMinutes(settings.shortBreakMinutes, LIMITS.shortBreakMinutes) &&
    isValidMinutes(settings.longBreakMinutes, LIMITS.longBreakMinutes) &&
    isValidUnits(settings.units);
  return valid ? { ...state, settings } : state;
}
