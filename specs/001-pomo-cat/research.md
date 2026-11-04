# Research: Pomo Cat

## R1 Time source and hidden tabs

- Decision: all phases store absolute timestamps (`endsAt`); a tick only compares
  them with `now`. Ticks come from a small Blob worker plus a `setInterval`
  fallback.
- Rationale: Chrome throttles timers in hidden tabs to about once a minute, which
  would delay the end-of-unit meow. Worker timers are not throttled, and the
  fallback keeps `page.clock` tests working, because they mock the page's timers.
- Alternatives: a silent audio loop (fragile), the Notifications API (excluded, Q7).

## R2 Detecting "app closed"

- Decision: store `lastSeenAt` on every heartbeat (15 s), on `visibilitychange` to
  hidden and on `pagehide`. A closed app is recognised only when the page loads
  again: the gap `now - lastSeenAt` decides between continuing (at most 2 minutes)
  and cancelling at `lastSeenAt`.
- Rationale: a browser cannot run anything after closing, so the decision has to
  happen on the next load. A frozen page on a locked phone never reloads, so it
  continues by the clock, which matches FR-014.
- Alternatives: `beforeunload` (unreliable on phones, cannot tell reloads apart).

## R3 Single active tab

- Decision: Web Locks API (`navigator.locks`). The tab holding the lock runs the
  game; another tab shows a notice and takes over when the lock is released. If
  the API is missing, the tab runs alone.
- Rationale: prevents double coins and competing writes (ADR 002 names that risk).
- Alternatives: `storage` events with a manual lease (more code, more races).

## R4 Replaceable art

- Decision: PNG files with transparency in `src/ui/assets/`, imported only by
  `manifest.ts`. Motion is a swap between files. Placeholders use the same names.
- Rationale: the owner replaces files one to one (FR-040, SC-010). Placeholders are
  rendered from the owner's sketch and hand-drawn SVGs through Playwright, so no
  image dependency enters the project.

## R5 Trying the loop without waiting

- Decision: a demo link, `?probelauf`, runs the clock 60 times faster and uses a
  separate storage key.
- Rationale: the owner cannot judge the loop if each try takes half an hour, and
  demo progress must never touch real progress (FR-048).
- Alternatives: seconds in the settings (contradicts the owner's 5-minute steps).

## R6 Handwriting font

- Decision: Patrick Hand, bundled through `@fontsource/patrick-hand` (OFL-1.1).
- Rationale: legible, has German umlauts, and bundling avoids a request to a font
  service (FR-044).
- Alternatives: Caveat (thinner at small sizes).

## R7 Sound

- Decision: a placeholder meow synthesised by the team as a WAV file, so no third
  party license applies. Playback failures are ignored, the visual signal remains.
- Rationale: browsers block sound before the first interaction on a page; pressing
  Start or Continue satisfies that.
