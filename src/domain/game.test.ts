import { describe, expect, it } from "vitest";
import {
  advance,
  buyRoomItem,
  buySnack,
  CLOSE_GRACE_MS,
  feed,
  type GameState,
  hold,
  learnNow,
  nameCat,
  newGame,
  remainingMs,
  resumeAfterClose,
  start,
  stop,
  updateSettings,
} from "./game";

const MINUTE = 60 * 1000;
const T0 = new Date(2026, 10, 4, 9).getTime();

function fresh(): GameState {
  return nameCat(newGame(), "Mimi", T0);
}

function started(state = fresh()): GameState {
  return start(state, T0);
}

/** Finishes the running unit and returns the state at the start of the break. */
function afterUnit(state: GameState): GameState {
  const { phase } = state;
  if (phase.kind !== "learning") throw new Error("not learning");
  return advance(state, phase.endsAt).state;
}

function untilBreakEnd(state: GameState) {
  const { phase } = state;
  if (phase.kind !== "break") throw new Error("not on a break");
  return advance(state, phase.endsAt);
}

describe("start", () => {
  it("needs a named cat", () => {
    expect(start(newGame(), T0).phase.kind).toBe("idle");
  });

  it("starts unit one with a snapshot of the settings", () => {
    const { phase } = started();
    expect(phase).toMatchObject({
      kind: "learning",
      unit: 1,
      startedAt: T0,
      endsAt: T0 + 25 * MINUTE,
      plan: { learnMinutes: 25, units: 4 },
    });
  });

  it("keeps the plan of a running run when settings change", () => {
    const state = started();
    const changed = {
      ...state,
      settings: { ...state.settings, learnMinutes: 50, units: 1 },
    };
    const fed = feed(afterUnit(changed), "dry");
    const next = untilBreakEnd(fed).state;
    expect(next.phase).toMatchObject({ kind: "learning", unit: 2 });
    expect(next.phase).toMatchObject({ plan: { learnMinutes: 25, units: 4 } });
  });

  it("does nothing while a unit runs", () => {
    const state = started();
    expect(start(state, T0 + MINUTE)).toBe(state);
  });
});

describe("finishing a unit", () => {
  it("credits coins, logs minutes, raises the mood, starts the short break", () => {
    const step = advance(started(), T0 + 25 * MINUTE);
    expect(step.sounds).toEqual(["unit-end"]);
    expect(step.state.coins).toBe(5);
    expect(step.state.studyLog).toEqual({ "2026-11-04": 25 });
    expect(step.state.cat?.mood).toBe("happy");
    expect(step.state.phase).toMatchObject({
      kind: "break",
      length: "short",
      fed: false,
      coinsEarned: 5,
      endsAt: T0 + 30 * MINUTE,
    });
  });

  it("does nothing before the time is up", () => {
    const state = started();
    expect(advance(state, T0 + 25 * MINUTE - 1).state).toBe(state);
  });

  it("gives the bonus for the mood before this unit raised it", () => {
    const first = feed(afterUnit(started()), "tuna");
    const second = afterUnit(untilBreakEnd(first).state);
    expect(second.phase).toMatchObject({ coinsEarned: 8 });
    expect(second.coins).toBe(13);
  });

  it("uses the long break after the last unit", () => {
    let state = {
      ...fresh(),
      settings: { ...fresh().settings, units: 1 },
    };
    state = afterUnit(started(state));
    expect(state.phase).toMatchObject({
      kind: "break",
      length: "long",
      endsAt: T0 + 40 * MINUTE,
    });
  });
});

describe("feeding", () => {
  it("marks the break as fed and adds no further coins", () => {
    const state = afterUnit(started());
    const fed = feed(state, "wet");
    expect(fed.phase).toMatchObject({ fed: true });
    expect(fed.coins).toBe(state.coins);
  });

  it("works only once and only in a break", () => {
    const fed = feed(afterUnit(started()), "wet");
    expect(feed(fed, "dry")).toBe(fed);
    const learningState = started();
    expect(feed(learningState, "dry")).toBe(learningState);
  });
});

describe("the break", () => {
  it("warns 30 seconds before its end, once", () => {
    const state = afterUnit(started());
    const end = T0 + 30 * MINUTE;
    expect(advance(state, end - 30_001).sounds).toEqual([]);
    const warned = advance(state, end - 30_000);
    expect(warned.sounds).toEqual(["warning"]);
    expect(advance(warned.state, end - 1).sounds).toEqual([]);
  });

  it("starts the next unit by itself when the cat was fed", () => {
    const fed = feed(afterUnit(started()), "dry");
    const next = untilBreakEnd(fed).state;
    expect(next.phase).toMatchObject({
      kind: "learning",
      unit: 2,
      startedAt: T0 + 30 * MINUTE,
    });
  });

  it("stops when the cat was not fed, and the coins stay", () => {
    const state = afterUnit(started());
    const next = untilBreakEnd(state).state;
    expect(next.phase).toMatchObject({ kind: "held", nextUnit: 2 });
    expect(next.coins).toBe(5);
  });

  it("ends the run after the long break, with or without feeding", () => {
    const base = { ...fresh(), settings: { ...fresh().settings, units: 1 } };
    const state = afterUnit(started(base));
    const unfed = untilBreakEnd(state);
    expect(unfed.state.phase.kind).toBe("idle");
    expect(unfed.sounds).toContain("long-break-end");
    expect(untilBreakEnd(feed(state, "dry")).state.phase.kind).toBe("idle");
  });

  it("never warns before the long break", () => {
    const base = { ...fresh(), settings: { ...fresh().settings, units: 1 } };
    const state = afterUnit(started(base));
    const end = T0 + 40 * MINUTE;
    expect(advance(state, end - 1).sounds).toEqual([]);
  });
});

describe("hold and continue", () => {
  it("holds a fed short break and continues at the next unit", () => {
    const held = hold(feed(afterUnit(started()), "dry"));
    expect(held.phase).toMatchObject({ kind: "held", nextUnit: 2 });
    expect(advance(held, T0 + 1000 * MINUTE).state).toBe(held);
    const next = start(held, T0 + 1000 * MINUTE);
    expect(next.phase).toMatchObject({
      kind: "learning",
      unit: 2,
      startedAt: T0 + 1000 * MINUTE,
    });
  });

  it("is not possible before feeding", () => {
    const state = afterUnit(started());
    expect(hold(state)).toBe(state);
  });

  it("is not possible in the long break", () => {
    const base = { ...fresh(), settings: { ...fresh().settings, units: 1 } };
    const fed = feed(afterUnit(started(base)), "dry");
    expect(hold(fed)).toBe(fed);
  });
});

describe("nobody there", () => {
  it("earns the coins of one unit at most when nobody touches the app", () => {
    const step = advance(started(), T0 + 100_000 * MINUTE);
    expect(step.state.coins).toBe(5);
    expect(step.state.phase).toMatchObject({ kind: "held", nextUnit: 2 });
  });

  it("runs through a sleeping device up to the first unfed break", () => {
    const fed = feed(afterUnit(started()), "dry");
    const step = advance(fed, T0 + 100_000 * MINUTE);
    expect(step.state.coins).toBe(13);
    expect(step.state.phase).toMatchObject({ kind: "held", nextUnit: 3 });
  });
});

describe("stop", () => {
  it("ends the run with the learned whole minutes and no coins", () => {
    const state = stop(started(), T0 + 12.9 * MINUTE);
    expect(state.phase.kind).toBe("idle");
    expect(state.coins).toBe(0);
    expect(state.studyLog).toEqual({ "2026-11-04": 12 });
    expect(state.cat?.mood).toBe("normal");
  });

  it("logs nothing under one minute", () => {
    expect(stop(started(), T0 + 59_000).studyLog).toEqual({});
  });

  it("does nothing outside a unit", () => {
    const state = fresh();
    expect(stop(state, T0)).toBe(state);
  });
});

describe("resumeAfterClose", () => {
  const seen = (state: GameState, at: number): GameState => ({
    ...state,
    lastSeenAt: at,
  });

  it("continues a unit when back within two minutes", () => {
    const state = seen(started(), T0 + 10 * MINUTE);
    const next = resumeAfterClose(state, T0 + 10 * MINUTE + CLOSE_GRACE_MS);
    expect(next.phase).toMatchObject({ kind: "learning", unit: 1 });
  });

  it("cancels a unit after more than two minutes, up to the last moment seen", () => {
    const state = seen(started(), T0 + 10 * MINUTE);
    const next = resumeAfterClose(state, T0 + 10 * MINUTE + CLOSE_GRACE_MS + 1);
    expect(next.phase.kind).toBe("idle");
    expect(next.coins).toBe(0);
    expect(next.studyLog).toEqual({ "2026-11-04": 10 });
  });

  it("finishes a unit that ended during the grace time", () => {
    const state = seen(started(), T0 + 24 * MINUTE);
    const next = resumeAfterClose(state, T0 + 25.5 * MINUTE);
    expect(next.coins).toBe(5);
    expect(next.phase.kind).toBe("break");
  });

  it("holds a short break after more than two minutes", () => {
    const state = feed(afterUnit(started()), "dry");
    const next = resumeAfterClose(
      seen(state, T0 + 26 * MINUTE),
      T0 + 500 * MINUTE,
    );
    expect(next.phase).toMatchObject({ kind: "held", nextUnit: 2 });
  });

  it("ends a long break after more than two minutes", () => {
    const base = { ...fresh(), settings: { ...fresh().settings, units: 1 } };
    const state = afterUnit(started(base));
    const next = resumeAfterClose(
      seen(state, T0 + 26 * MINUTE),
      T0 + 500 * MINUTE,
    );
    expect(next.phase.kind).toBe("idle");
  });

  it("keeps a held run however long it took", () => {
    const held = hold(feed(afterUnit(started()), "dry"));
    const next = resumeAfterClose(seen(held, T0), T0 + 90_000 * MINUTE);
    expect(next.phase).toMatchObject({ kind: "held", nextUnit: 2 });
  });
});

describe("remainingMs", () => {
  it("counts down to zero and is empty when nothing runs", () => {
    const state = started();
    expect(remainingMs(state.phase, T0 + MINUTE)).toBe(24 * MINUTE);
    expect(remainingMs(state.phase, T0 + 99 * MINUTE)).toBe(0);
    expect(remainingMs({ kind: "idle" }, T0)).toBeNull();
  });
});

describe("learnNow", () => {
  it("ends a fed short break at once", () => {
    const fed = feed(afterUnit(started()), "dry");
    const next = learnNow(fed, T0 + 26 * MINUTE);
    expect(next.phase).toMatchObject({
      kind: "learning",
      unit: 2,
      startedAt: T0 + 26 * MINUTE,
    });
  });

  it("is not possible before feeding", () => {
    const state = afterUnit(started());
    expect(learnNow(state, T0 + 26 * MINUTE)).toBe(state);
  });

  it("starts a new run from the long break, with the current settings", () => {
    const base = { ...fresh(), settings: { ...fresh().settings, units: 1 } };
    const fed = feed(afterUnit(started(base)), "dry");
    const changed = { ...fed, settings: { ...fed.settings, learnMinutes: 50 } };
    const next = learnNow(changed, T0 + 26 * MINUTE);
    expect(next.phase).toMatchObject({
      kind: "learning",
      unit: 1,
      plan: { learnMinutes: 50 },
    });
  });
});

describe("the shop", () => {
  const rich = (coins = 40): GameState => ({ ...fresh(), coins });

  it("feeds a snack at once: five coins, one mood step", () => {
    const next = buySnack(rich(), T0 + MINUTE);
    expect(next.coins).toBe(35);
    expect(next.cat?.mood).toBe("happy");
    expect(next.cat?.moodAt).toBe(T0 + MINUTE);
  });

  it("refuses a snack without enough coins", () => {
    const state = rich(4);
    expect(buySnack(state, T0)).toBe(state);
  });

  it("can buy with exactly the price, and never goes negative", () => {
    expect(buySnack(rich(5), T0).coins).toBe(0);
    expect(buyRoomItem(rich(5), "yarn").coins).toBe(0);
    const state = rich(4);
    expect(buyRoomItem(state, "yarn")).toBe(state);
  });

  it("does not sell what is not in the shop for now", () => {
    const state = rich();
    expect(buyRoomItem(state, "plant")).toBe(state);
    expect(buyRoomItem(state, "rug")).toBe(state);
    expect(buyRoomItem(state, "scratching-post")).toBe(state);
  });

  it("keeps room items, once each", () => {
    const next = buyRoomItem(rich(), "yarn");
    expect(next.owned).toEqual(["yarn"]);
    expect(next.coins).toBe(35);
    expect(buyRoomItem(next, "yarn")).toBe(next);
  });

  it("is closed during a unit and before feeding", () => {
    const learning = { ...started(), coins: 40 };
    expect(buySnack(learning, T0)).toBe(learning);
    expect(buyRoomItem(learning, "yarn")).toBe(learning);
    const unfed = afterUnit(started());
    expect(buySnack(unfed, T0 + 26 * MINUTE)).toBe(unfed);
    expect(buyRoomItem(unfed, "yarn")).toBe(unfed);
  });

  it("is open in a fed break and while held", () => {
    const fed = feed(afterUnit(started()), "dry");
    expect(buySnack(fed, T0 + 26 * MINUTE).coins).toBe(0);
    expect(buySnack(hold(fed), T0 + 26 * MINUTE).coins).toBe(0);
  });
});

describe("updateSettings", () => {
  it("changes settings and leaves a running plan alone", () => {
    const state = started();
    const next = updateSettings(state, { learnMinutes: 50, sound: false });
    expect(next.settings).toMatchObject({ learnMinutes: 50, sound: false });
    expect(next.phase).toEqual(state.phase);
  });

  it("applies from the next run", () => {
    const next = updateSettings(fresh(), { learnMinutes: 50, units: 2 });
    expect(start(next, T0).phase).toMatchObject({
      endsAt: T0 + 50 * MINUTE,
      plan: { units: 2 },
    });
  });

  it("ignores values outside the rules", () => {
    const state = fresh();
    expect(updateSettings(state, { learnMinutes: 7 })).toBe(state);
    expect(updateSettings(state, { shortBreakMinutes: 35 })).toBe(state);
    expect(updateSettings(state, { longBreakMinutes: 65 })).toBe(state);
    expect(updateSettings(state, { units: 9 })).toBe(state);
  });
});
