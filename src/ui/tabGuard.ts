export type TabGuard = (
  onActive: () => void,
  onWaiting: () => void,
) => () => void;

/**
 * Only the tab holding the lock runs the game, so coins cannot be earned twice
 * and two tabs cannot overwrite each other. A waiting tab takes over by itself
 * when the other one closes. Without the Locks API the tab simply runs.
 */
export function createTabGuard(name: string): TabGuard {
  return (onActive, onWaiting) => {
    const locks = navigator.locks;
    if (!locks) {
      onActive();
      return () => undefined;
    }
    let release = () => {};
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    const controller = new AbortController();
    let stopped = false;
    const run = () => {
      if (stopped) return undefined;
      onActive();
      return held;
    };
    void locks
      .request(name, { ifAvailable: true }, (lock) => (lock ? run() : "busy"))
      .then((result) => {
        if (result !== "busy" || stopped) return;
        onWaiting();
        return locks.request(name, { signal: controller.signal }, run);
      })
      .catch(() => {
        // Our own abort sets `stopped`; any other failure means no lock
        // service, and a running app beats an endless wait.
        if (!stopped) onActive();
      });
    return () => {
      stopped = true;
      controller.abort();
      release();
    };
  };
}
