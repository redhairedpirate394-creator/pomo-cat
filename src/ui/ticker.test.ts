import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startTicker } from "./ticker";

class FakeWorker {
  static last: FakeWorker | undefined;
  onmessage: (() => void) | null = null;
  terminated = false;

  constructor() {
    FakeWorker.last = this;
  }

  terminate() {
    this.terminated = true;
  }
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("startTicker", () => {
  it("ticks from the worker, which hidden tabs do not throttle", () => {
    vi.stubGlobal("Worker", FakeWorker);
    const onTick = vi.fn();
    const stop = startTicker(onTick, 250);

    FakeWorker.last?.onmessage?.();

    expect(onTick).toHaveBeenCalledTimes(1);
    stop();
  });

  it("falls back to the page interval without a worker", () => {
    vi.stubGlobal("Worker", () => {
      throw new Error("blocked");
    });
    const onTick = vi.fn();
    const stop = startTicker(onTick, 250);

    vi.advanceTimersByTime(250);

    expect(onTick).toHaveBeenCalledTimes(1);
    stop();
  });

  it("stops both sources", () => {
    vi.stubGlobal("Worker", FakeWorker);
    const onTick = vi.fn();
    const stop = startTicker(onTick, 250);

    stop();
    vi.advanceTimersByTime(1000);

    expect(onTick).not.toHaveBeenCalled();
    expect(FakeWorker.last?.terminated).toBe(true);
  });
});
