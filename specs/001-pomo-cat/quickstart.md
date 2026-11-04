# Quickstart: validating Pomo Cat

Prerequisites: `pnpm install --frozen-lockfile`, Chromium for Playwright.

```sh
pnpm verify
pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

Manual walk-through at `http://127.0.0.1:5173/?probelauf` (1 minute passes in
1 second):

1. Name the cat, press Start: timer, "Einheit 1 von 4", sleeping cat.
2. Wait 25 seconds: meow, feed window. Pick a food: coins appear.
3. Let the break run: warning, then unit 2 starts by itself.
4. In the next feed window pick nothing: at the end of the break it waits for a
   click, and the coins of that unit are still there.
5. Press Stop during a unit: no coins, nothing else lost.

Expected results per story: acceptance scenarios in [spec.md](spec.md). Story
journeys: `e2e/*.spec.ts`.
