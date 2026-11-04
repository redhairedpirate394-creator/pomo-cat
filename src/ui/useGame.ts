import { useCallback, useEffect, useRef, useState } from "react";
import {
  advance,
  type GameState,
  newGame,
  resumeAfterClose,
} from "../domain/game";
import type { GameStore } from "../storage/port";
import type { Clock } from "./clock";
import { errorCode } from "./i18n";
import type { ErrorCode } from "./i18n/messages";
import type { PlaySound } from "./sounds";
import type { TabGuard } from "./tabGuard";
import { startTicker } from "./ticker";

const TICK_MS = 250;
const HEARTBEAT_MS = 15_000;

export type Load =
  | { readonly status: "loading" }
  | { readonly status: "waiting" }
  | { readonly status: "failed"; readonly code: ErrorCode }
  | { readonly status: "ready"; readonly state: GameState };

export function useGame(
  store: GameStore,
  clock: Clock,
  play: PlaySound,
  guard: TabGuard,
) {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [now, setNow] = useState(() => clock.now());
  const [saveFailed, setSaveFailed] = useState(false);
  const state = useRef<GameState | null>(null);
  const pending = useRef<GameState | null>(null);
  const saving = useRef(false);
  const lastBeat = useRef(0);

  // The first save runs synchronously up to the adapter's write, so a save
  // started while the page is closing still reaches localStorage.
  const persist = useCallback(
    async (next: GameState) => {
      pending.current = { ...next, lastSeenAt: clock.now() };
      lastBeat.current = clock.now();
      if (saving.current) return;
      saving.current = true;
      try {
        while (pending.current) {
          const document = pending.current;
          pending.current = null;
          await store.save(document);
        }
        setSaveFailed(false);
      } catch {
        setSaveFailed(true);
      } finally {
        saving.current = false;
      }
    },
    [store, clock],
  );

  const commit = useCallback(
    (next: GameState) => {
      state.current = next;
      setLoad({ status: "ready", state: next });
      void persist(next);
    },
    [persist],
  );

  const open = useCallback(async () => {
    state.current = null;
    setLoad({ status: "loading" });
    try {
      const saved = await store.load();
      commit(resumeAfterClose(saved ?? newGame(), clock.now()));
    } catch (cause) {
      setLoad({ status: "failed", code: errorCode(cause) });
    }
  }, [store, clock, commit]);

  useEffect(
    () =>
      guard(
        () => void open(),
        () => setLoad({ status: "waiting" }),
      ),
    [guard, open],
  );

  const isReady = load.status === "ready";

  useEffect(() => {
    if (!isReady) return;
    return startTicker(() => {
      const current = state.current;
      if (current === null) return;
      const time = clock.now();
      const step = advance(current, time);
      if (step.state !== current) commit(step.state);
      const sound = step.sounds.at(-1);
      if (sound && step.state.settings.sound) play(sound);
      const running =
        step.state.phase.kind === "learning" ||
        step.state.phase.kind === "break";
      if (running && time - lastBeat.current >= HEARTBEAT_MS) {
        void persist(step.state);
      }
      setNow(time);
    }, TICK_MS);
  }, [isReady, clock, commit, persist, play]);

  useEffect(() => {
    if (!isReady) return;
    const save = () => {
      if (state.current) void persist(state.current);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") save();
    };
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isReady, persist]);

  /** Applies a game event; returns the failure instead of throwing. */
  const act = useCallback(
    (event: (current: GameState, time: number) => GameState) => {
      const current = state.current;
      if (current === null) return null;
      try {
        const time = clock.now();
        const next = event(current, time);
        if (next !== current) commit(next);
        setNow(time);
        return null;
      } catch (cause) {
        return errorCode(cause);
      }
    },
    [clock, commit],
  );

  const retrySave = useCallback(() => {
    if (state.current) void persist(state.current);
  }, [persist]);

  const startOver = useCallback(async () => {
    try {
      await store.reset();
    } catch (cause) {
      setLoad({ status: "failed", code: errorCode(cause) });
      return;
    }
    await open();
  }, [store, open]);

  return { load, now, saveFailed, act, retrySave, retryLoad: open, startOver };
}
