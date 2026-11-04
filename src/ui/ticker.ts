/**
 * Calls `onTick` regularly, also in hidden tabs. Browsers throttle page timers
 * there to about once a minute, which would delay the meow; worker timers are
 * not throttled. The page interval stays as the fallback. Ticks are harmless if
 * they come twice, because the game compares timestamps.
 */
export function startTicker(onTick: () => void, intervalMs: number) {
  const interval = setInterval(onTick, intervalMs);
  let worker: Worker | undefined;
  let url: string | undefined;
  try {
    url = URL.createObjectURL(
      new Blob([`setInterval(() => postMessage(0), ${intervalMs});`], {
        type: "text/javascript",
      }),
    );
    worker = new Worker(url);
    worker.onmessage = onTick;
  } catch {
    // The interval alone keeps the app working, only later in a hidden tab.
  }
  return () => {
    clearInterval(interval);
    worker?.terminate();
    if (url) URL.revokeObjectURL(url);
  };
}
