import { describe, expect, it } from "vitest";
import {
  advance,
  feed,
  type GameState,
  nameCat,
  newGame,
  start,
} from "../domain/game";
import {
  createBrowserStore,
  DEMO_STORAGE_KEY,
  loadDemoEpoch,
  STORAGE_KEY,
} from "./browser";
import { StoreError } from "./port";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

function storeWith(initial: Record<string, string> = {}, key = STORAGE_KEY) {
  const storage = memoryStorage(initial);
  return { storage, store: createBrowserStore(key, () => storage) };
}

const T0 = new Date(2026, 10, 4, 9).getTime();

function samples(): GameState[] {
  const named = nameCat(newGame(), "Mimi", T0);
  const learning = start(named, T0);
  const onBreak = advance(learning, T0 + 25 * 60_000).state;
  const fed = feed(onBreak, "dry");
  const held = advance(onBreak, T0 + 31 * 60_000).state;
  return [newGame(), named, learning, onBreak, fed, held];
}

async function codeOf(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (cause) {
    return cause instanceof StoreError ? cause.code : "other";
  }
  return "none";
}

describe("browser game store", () => {
  it("returns null when nothing is saved", async () => {
    expect(await storeWith().store.load()).toBeNull();
  });

  it("saves and loads every phase unchanged", async () => {
    for (const state of samples()) {
      const { store } = storeWith();
      await store.save(state);
      expect(await store.load()).toEqual(state);
    }
  });

  it("keeps demo data apart from real data", async () => {
    const { store, storage } = storeWith({}, DEMO_STORAGE_KEY);
    await store.save(newGame());
    expect(storage.data.has(STORAGE_KEY)).toBe(false);
    expect(storage.data.has(DEMO_STORAGE_KEY)).toBe(true);
  });

  it.each([
    ["broken JSON", "{broken"],
    ["another version", JSON.stringify({ version: 2 })],
    ["an empty object", "{}"],
  ])("reports %s as invalid and leaves it in place", async (_name, value) => {
    const { store, storage } = storeWith({ [STORAGE_KEY]: value });
    expect(await codeOf(store.load())).toBe("data-invalid");
    expect(storage.data.get(STORAGE_KEY)).toBe(value);
  });

  it("rejects values outside the rules", async () => {
    const base = { version: 1, ...newGame() };
    const bad = [
      { ...base, coins: -1 },
      { ...base, coins: 1.5 },
      { ...base, owned: ["yarn", "yarn"] },
      { ...base, owned: ["castle"] },
      { ...base, settings: { ...base.settings, learnMinutes: 7 } },
      { ...base, settings: { ...base.settings, units: 9 } },
      { ...base, extra: true },
      { ...base, phase: { kind: "dancing" } },
      { ...base, studyLog: { yesterday: 5 } },
    ];
    for (const value of bad) {
      const { store } = storeWith({ [STORAGE_KEY]: JSON.stringify(value) });
      expect(await codeOf(store.load())).toBe("data-invalid");
    }
  });

  it("reports storage access failures", async () => {
    const failing = () => ({
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("full");
      },
      removeItem: () => {
        throw new Error("denied");
      },
    });
    const store = createBrowserStore(STORAGE_KEY, failing);
    expect(await codeOf(store.load())).toBe("read-failed");
    expect(await codeOf(store.save(newGame()))).toBe("save-failed");
    expect(await codeOf(store.reset())).toBe("reset-failed");
  });

  it("resets only its own key", async () => {
    const { store, storage } = storeWith({
      [STORAGE_KEY]: "{}",
      other: "keep",
    });
    await store.reset();
    expect(storage.data.has(STORAGE_KEY)).toBe(false);
    expect(storage.data.get("other")).toBe("keep");
  });
});

describe("loadDemoEpoch", () => {
  it("keeps the first starting point across reloads", () => {
    const storage = memoryStorage();
    expect(loadDemoEpoch(1000, () => storage)).toBe(1000);
    expect(loadDemoEpoch(9000, () => storage)).toBe(1000);
  });

  it("still gives a time without storage", () => {
    const denied = () => {
      throw new Error("denied");
    };
    expect(loadDemoEpoch(1000, denied)).toBe(1000);
  });
});
