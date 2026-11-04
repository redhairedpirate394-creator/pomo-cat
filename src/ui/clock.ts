export interface Clock {
  now(): number;
}

export const systemClock: Clock = { now: () => Date.now() };

/**
 * Runs faster from a fixed starting point, so timestamps saved by the demo stay
 * valid after a reload.
 */
export function createDemoClock(speed: number, epoch: number): Clock {
  return { now: () => epoch + (Date.now() - epoch) * speed };
}
