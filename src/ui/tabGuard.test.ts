import { afterEach, describe, expect, it, vi } from "vitest";
import { createTabGuard } from "./tabGuard";

afterEach(() => {
  vi.unstubAllGlobals();
});

function settle() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("createTabGuard", () => {
  it("runs at once without the Locks API", () => {
    vi.stubGlobal("navigator", {});
    const onActive = vi.fn();
    createTabGuard("x")(onActive, vi.fn());
    expect(onActive).toHaveBeenCalledTimes(1);
  });

  it("runs when it gets the lock", async () => {
    vi.stubGlobal("navigator", {
      locks: {
        request: (
          _name: string,
          _options: unknown,
          callback: (lock: unknown) => unknown,
        ) => Promise.resolve(callback({})),
      },
    });
    const onActive = vi.fn();
    const onWaiting = vi.fn();
    const stop = createTabGuard("x")(onActive, onWaiting);
    await settle();
    expect(onActive).toHaveBeenCalledTimes(1);
    expect(onWaiting).not.toHaveBeenCalled();
    stop();
  });

  it("waits while another tab holds the lock, then takes over", async () => {
    let free = () => {};
    vi.stubGlobal("navigator", {
      locks: {
        request: (
          _name: string,
          options: { ifAvailable?: boolean },
          callback: (lock: unknown) => unknown,
        ) =>
          options.ifAvailable
            ? Promise.resolve(callback(null))
            : new Promise((resolve) => {
                free = () => resolve(callback({}));
              }),
      },
    });
    const onActive = vi.fn();
    const onWaiting = vi.fn();
    const stop = createTabGuard("x")(onActive, onWaiting);
    await settle();
    expect(onWaiting).toHaveBeenCalledTimes(1);
    expect(onActive).not.toHaveBeenCalled();
    free();
    expect(onActive).toHaveBeenCalledTimes(1);
    stop();
  });

  it("runs anyway when the lock service fails", async () => {
    vi.stubGlobal("navigator", {
      locks: { request: () => Promise.reject(new Error("SecurityError")) },
    });
    const onActive = vi.fn();
    createTabGuard("x")(onActive, vi.fn());
    await settle();
    expect(onActive).toHaveBeenCalledTimes(1);
  });

  it("stays quiet after being stopped", async () => {
    vi.stubGlobal("navigator", {
      locks: { request: () => Promise.reject(new Error("AbortError")) },
    });
    const onActive = vi.fn();
    createTabGuard("x")(onActive, vi.fn())();
    await settle();
    expect(onActive).not.toHaveBeenCalled();
  });
});
