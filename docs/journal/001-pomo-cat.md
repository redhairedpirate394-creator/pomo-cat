# Journal: 001-pomo-cat

Append-only. Commands, outcomes, evidence and history; state lives in
`docs/STATUS.md`.

## 2026-11-04 Bootstrap

Session context at start: small (fresh session).

### Machine check

- Node 24.22.0 (pin was 24.21.0), git 2.56.0, gh 2.102.0 (latest 2.103.3, one
  minor behind, released 2026-09-30: no warning), logged in. Lead tier: opus.
- pnpm was missing; the owner ran `npm install -g pnpm@10.34.7`.
- `pnpm install --frozen-lockfile` refused with ERR_PNPM_UNSUPPORTED_ENGINE:
  `engine-strict` plus the exact pin rejects any other Node version, even a
  newer minor of the same LTS line. Pin raised to 24.22.0.
- `pnpm lint` failed with 23 errors: Git for Windows defaults to
  `core.autocrlf=true`, the checkout had CRLF and Biome expects LF. Replaced
  `.gitattributes` with `* text=auto eol=lf`, renormalized, restored the
  worktree. Five `.specify` JSON files had been committed with CRLF.
- `pnpm exec playwright install --with-deps chromium`: exit 0.
- `pnpm verify` on branch `001-pomo-cat`: exit 0 (lint, typecheck, architecture,
  15 unit tests, build, 8 browser scenarios). This is starter demo code, not
  product progress.
- GitHub Pages: `POST repos/.../pages -f build_type=workflow` succeeded,
  https://redhairedpirate394-creator.github.io/pomo-cat/ (nothing deployed yet).

Retro candidates for the first accepted checkpoint: a fresh template clone on
Windows fails `pnpm verify` out of the box (CRLF), and the exact Node pin with
`engine-strict` blocks owners on any newer patch or minor.

### Bootstrap answers (owner's words, unchanged)

1. Idee: "Ein Pomodoro Timer im Browser. Es soll eine Katze als Haustier geben,
   die man Füttern kann in dem man lernt. Man kann außerdem Spielzeug/
   Einrichtung für den Katzenraum bekommen durchs lernen. In den Pausen soll man
   angehalten sein, mit der Katze zeit zu verbringen, anstatt zu doomscrollen
   etc. Die Katze soll durchs nicht lernen nicht sterben, nur traurig werden/
   weniger Belohnungen geben."
2. Erste Nutzer: "Ja" (accepts: first only the owner, no personal data)
3. MUST BE TRUE: "Es gibt nicht zu viel Schnick Schnack, sondern eine sehr
   simple anwendung. 2 D Grafik (selbstgemalt)"
4. Sprache: "Deutsch sprechen wir, das Spiel soll Englisch und Deutsch
   unterstützen"
5. Veröffentlichung: "Ja" (accepts: publish automatically)
6. Technik: "Ich verstehe nix vom programmieren und bin nur fürs Design und die
   Idee hier" (recorded as `owner_experience: plain`)
7. Name: "Pomo Cat/ Pomo Pet später, eventuell andere Tiere verfügbar, andere
   Räume"
