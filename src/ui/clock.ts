export interface Clock {
  now(): number;
}

export const systemClock: Clock = { now: () => Date.now() };

const DEMO_EPOCH_KEY = "pomo-cat:demo-epoch";

function demoEpoch(): number {
  const real = Date.now();
  try {
    const saved = Number(window.localStorage.getItem(DEMO_EPOCH_KEY));
    if (Number.isFinite(saved) && saved > 0) return saved;
    window.localStorage.setItem(DEMO_EPOCH_KEY, String(real));
  } catch {
    // Without storage the demo still runs; it just restarts its time on reload.
  }
  return real;
}

/**
 * Runs faster from a fixed starting point, so timestamps saved by the demo stay
 * valid after a reload.
 */
export function createDemoClock(speed: number): Clock {
  const epoch = demoEpoch();
  return { now: () => epoch + (Date.now() - epoch) * speed };
}
