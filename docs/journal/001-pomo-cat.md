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

### Interview round 1 (owner's words, unchanged)

Recommendations are in the chat history only in spirit; each answer below names
what it accepts or changes.

- Q1 Belohnungen: "Es soll Münzen geben, aber nicht so viel auswahl möglichkeit
  und auch mit wenigen Münzen schon eine Option geben (nicht ewig lernen damit
  man sich den Kratzbaum kaufen kann). Futter Optionen möchte ich mehr haben
  zwischen denen man wählen kann. Man soll besondere Snacks kaufen können"
- Q2 Traurigsein: "ja" (accepts: moods happy/normal/sad; normal after 2 days
  without learning, sad after 4; a finished unit raises mood one step; a happy
  cat gives an extra portion, a sad one only the normal reward)
- Q3 Abbruch: "Ja, aber es soll einen Lernkalender geben in dem Trotzdem die
  Zeit nach dem abgebrochen wurde eingetragen wird." (accepts: cancel any time,
  no reward, no penalty)
- Q4 Pause: "Ja, aber die nächste einheit startet automatisch. es wird 30
  sekunden vor beginn durch ein miauen gewarnt dass es weiter geht" (accepts:
  cat room opens with the break countdown; feed, pet, play with toys)
- Q5 Grafiken: "Ja" (accepts: placeholders first, image list with sizes at the
  first round, few single images per mood, public visibility of the art is fine)
- Q6 Zeiten: "Ich möchte eigene Zeit einstellungen aber in 5 minuten schritten"
- Q7 Signal: "Ja" (accepts: short sound and remaining time in the tab title,
  sound can be switched off, no browser notifications for now)
- Q8 Speicherort: "Ich möchte ein Konto, dass man überall nutzen kann." (rejects
  browser-only storage; conflicts with the foundation and with bootstrap answer
  2 "no personal data", to be resolved in round 2)
- Q9 Erster Start: "Ja" (accepts: name the cat once, no tutorial, language from
  the browser, switch between German and English in the app)

### Account research for interview round 2 (2026-11-04)

An account departs from the foundation (static site, no auth, no backend):
constitution VI and VII and ADR 002 require an ADR, approved identity, privacy,
retention, cost and operations rules, and the owner's yes. No provider chosen.

- Supabase free plan (supabase.com/pricing): $0, 50,000 monthly active users,
  500 MB per project, 2 active projects, paused after 1 week of inactivity, Pro
  from $25/month. Default auth email reaches only organization members since
  2024-09-26, so other users need custom SMTP (included on the free plan).
- Firebase Spark: third-party sources only, and they disagree on auth limits
  (10,000 vs 50,000); no card required; a product stops at its quota instead of
  billing. Verify on official pages before choosing. EU data location for auth
  not confirmed for either provider.

### Interview round 2 (owner's words, unchanged)

- Q10 Kreislauf: "ja" (accepts: a finished unit makes the cat hungry; the owner
  picks a food, the cat gives 1 coin per 5 learned minutes; a happy cat gives
  50 % more, rounded up. Replaces the extra portion of Q2.)
- Q11 Shop: "Snacks je 3 Münzen, sonst passt" (accepts: free foods dry food, wet
  food, tuna; snacks salmon stick, crunchy pillow, catnip, one-time, special
  reaction, mood one step up; room: yarn ball, toy mouse, pillow 5 each, plant
  and rug 10 each, scratching post 20, permanent)
- Q12 Kalender: "Ja, Lernserie kann es geben, aber ohne Druck" (accepts: month
  view, learned time per day including cancelled units, no breaks, no
  leaderboards; a streak is allowed, without pressure)
- Q13 Automatik: "Ja, man kann sich entscheiden ob man Statt der 5 min Pause
  pausieren möchte um später zurück zu kehren. Man soll auch die Anzahl der
  einheiten einstellen können, falls man weniger Zeit hat" (accepts: automatic
  inside a block, click after the long break, stop button during the warning,
  screen-only warning with sound off)
- Q14 Zeiten: "ja" (accepts: 5-minute steps, learn 5-60, short break 5-30, long
  break 5-60, defaults 25/5/15; "always after four units" is superseded by Q13)
- Q15 App zu: "wenn die App geschlossen wird, bricht es ab" (rejects: time keeps
  running and the unit counts)
- Q16 Konto wann: "ja" (accepts: timer, cat, shop and calendar first without an
  account, the account as the second step, progress moves into the account)
- Q17 Wer: "ja, andere nur über link, freunde" (accepts: first only the owner;
  others only through a link, friends)
- Q18 Anmeldung: "ja, google geht auch" (accepts email and password with reset;
  Google is also fine)
- Q19 Daten: "Ja" (accepts: email, cat name, settings, coins, purchases, mood,
  calendar; no ads or analytics; EU servers where possible, checked before
  choosing a provider; delete-account button removes everything)
- Q20 Kosten: "ja" (accepts: stays free, no cost without the owner's explicit yes)

### Interview round 3 (owner's words, unchanged)

- Q21 Lernserie: "ja" (accepts: small "X days in a row" in the calendar; a day
  counts with at least 5 learned minutes, cancelled units included; breaks
  silently; no reminders; mood does not depend on it)
- Q22 Anhalten: "ja" (accepts: "pause" button in the cat room stops the
  countdown, no time limit, "continue" starts the next unit, survives closing
  the app; "learn now" ends a break early)
- Q23 Anzahl: "ja" (accepts: 1 to 8 units, default 4; long break after the last
  unit, then a click; changes apply from the next start)
- Q24 Schließen: "ja" (accepts: tab switch and phone lock do not cancel; closing
  cancels with no reward, time so far goes to the calendar; back within 2
  minutes continues; a phone ending the page for longer counts as cancelled)
- Q25 Beim Lernen: "ja" (accepts: only timer, sleeping cat, cancel button;
  settings part is superseded by the sketch in Q26, see round 4)
- Q26 Aufbau: "siehe PNG" (sketch saved as
  `docs/design/owner-sketch-learning-screen.jpg`: timer "00:25" and "Einheit X"
  at the top centre, sleeping cat with "zzz" on a rug below, on the right a
  "To-Dos:" panel with a "Stop" button and a gear button under it, plain black
  lines on white. The to-do list is new scope.)
- Q27 Füttern: "Füttern passiert automatisch nach der Einheit durch ein Fenster
  dass sich öffnet, da kann man wählen was gefüttert werden soll. Wird nicht
  gefüttert bricht die EInheit ab und läuft nicht weiter, um du versichern dass
  man nicht AFK geld schäffelt. Das geld für die Vorherige einheit gibts
  trotzdem. Gekaufte Snacks werden direkt gefüttert."
- Q28 Töne: "ja" (accepts: free placeholder sound, own meow possible later)
- Q29 Freunde: "ja" (accepts: one single-use personal link per person, separate
  cats, nobody sees anybody else, invitations unlocked after the legal check)

### Interview round 4 (owner's words, unchanged)

- Q30 To-Do-Liste: **not stated** (the owner's reply skipped it; asked again)
- Q31 Zahnrad: "Ja" (accepts: gear always reachable; sound and language apply at
  once, times and units from the next start; shop and calendar locked while
  learning)
- Q32 Futter-Fenster: "Ja" (accepts: window stays open for the whole break,
  countdown runs behind it; no choice by the end of the break stops the run and
  the next unit needs a click; "pause" only after feeding)
- Q33 Andere Ansichten: "Ja, To do/ shop und kalender sollen ausklappbar sein,
  damit das nicht so überflutet ist" (accepts: same places in the break, cat
  awake, items on fixed spots, phones stacked)
- Q34 Anzeige: "Ja" (accepts: minutes and seconds counting down, "Einheit 2 von 4")
- Q35 Stil: "Handgezeichnet, aber ich mache dass dan farbig das sind nur
  entwürfe." (final art is hand-drawn and in colour; the sketches are drafts.
  Handwriting font: not stated.)

### Interview closing (owner's words, unchanged)

- Q30 To-Do-Liste: "Ja" (accepts: collapsed at first, can be opened while
  learning; add, tick, delete; no coins; saved; joins the account data; shop and
  calendar also collapsed at first)
- Q36 Schrift: "Ja" (accepts: legible handwriting font for timer and buttons)

The summary posted in chat said it applies once Q30 and Q36 are answered yes, so
it stands as the shared understanding. Interview frontier empty.

### Spec, plan, tasks, analyze (2026-11-04)

- `/speckit-specify`: 6 stories, FR-001 to FR-048, SC-001 to SC-010, no open
  markers. FR-048 (demo link) added by the team during planning.
- `/speckit-clarify` skipped: nothing left open by the interview.
- `/speckit-plan`: Delivery Mode Full. ADR 013 written. New package: Patrick Hand.
- `/speckit-tasks`: 43 tasks; `/speckit-analyze`: 1 gap found and fixed (FR-014
  had no task, added to T013), 1 contract detail clarified (the warning's stop
  button exists only after feeding). 0 critical issues, coverage 100 %.

### C1 implementation and review (2026-11-04)

- T001-T017 done. First `pnpm verify`: exit 0 (77 unit tests, 32 browser scenarios).
- Reviewer (fresh context): walked the steps in real time at 1280x800 and Pixel 7,
  20 screenshots in `specs/001-pomo-cat/review/round-1/`. Mutation checks on a
  scratch copy showed the worker, pagehide/visibility save and heartbeat were each
  unproven by tests.
- Fixed: report step 1 wording (B1); Escape removing the name and feed windows
  (S1); short trial windows stated in the report (S2); demo epoch moved behind the
  storage boundary and the contract updated (S3); tests for ticker, demo clock,
  pagehide, visibility, heartbeat, failed reset, read retry (S4); STATUS, journal
  and contract truth (S5); report template lines and limits (S6). Also from the
  notes: audio unlock on the first gesture (note 1), held screen explains itself
  (3), stale coin note (4), spec edge case wording (7), optional icons in the image
  list (9), coins appear with the meal (12), layout test covers more states (13).
- The new failed-reset test found one more bug: the confirmation stayed open over
  the error. Fixed in `FailureScreen.tsx`.
- Final `pnpm verify`: exit 0 (84 unit tests, 52 browser scenarios, 26 on each
  project). Walk-through script rerun on the fixed app, exit 0, screenshots
  refreshed, no external requests.
- Dev server up at http://127.0.0.1:5173/?probelauf, HTTP 200, loopback only.

Not verified: an audible meow (headless browsers do not enforce autoplay rules, and
nobody on the team can listen), hidden-tab timing in a real browser (T039), iOS.
Sound unlock code has no automated proof either.

Carried to later tasks: focus after feeding and accidental feeding by key press
(T037); back/forward cache restore needs a `pageshow` reload of the state and a test
(T034); plurals through `Intl` (T038); four ticks per second from two sources is
harmless but wasteful; trial mood decay also runs 30 times faster.

Context at this handoff: large, roughly 200k tokens by estimate; the exact figure
is not available to the lead.

### C1 decision and triage (2026-11-04)

Owner approved round 1 and the publish (feedback/round-1.md). Triage:

- r01, r02: no change; r02 answered in chat.
- r03, r04, r05, Q38-Q41: decisions, folded into C2 as tasks in tasks.md: art,
  fitted cat stage, owner's lettering.
- Q37: the owner heard the meow in a real browser, which closes that open point
  on desktop; iOS is still unverified.

### Publish of C1 (2026-11-04)

`pnpm ship --mode auto-merge`: exit 0. PR #1 merged by rebase, `main` at 9dd0ad9,
CI verify and Pages deploy passed. Live check in Chromium at desktop and Pixel 7:
trial link works, sleeping cat image and font load, no failed or external requests.
CI warns that the pinned actions target Node 20 and that `ubuntu-latest` moves to
Ubuntu 26; both only warnings, worth a template update.

Session end: context is large after the interview, C1 and the handoff; the owner is
advised to start C2 fresh.

### C2 progress (2026-11-04)

Owner art: `make-art` cut the drawings by flood-filling paper from the edges, so
white inside a drawing stays. The font came from `alphabet-sheet.jpg`: columns split
by gaps per row, 6x upscale, potrace, opentype.js with integer coordinates; contours
inside an odd number of others are reversed, because fonts fill by winding and the
tracer assumes even-odd. Both scripts lived in the scratchpad, not the repository.
Rebuilding needs them written again; the result is `src/ui/assets/pomo-hand.otf`.

Stories 3 to 6 share one commit because they share the side column and catalogs.
Final `pnpm verify`: exit 0 (101 unit tests, 130 browser scenarios). Stopped at a
story boundary because the session context is large, by estimate past the 250k
limit; the exact figure is not available.

### C2 review and handoff (2026-11-04)

- Reviewer (fresh context): walked the steps in real time at both widths, plus a
  production build. Two blockers: on the development server the double effect start
  queued a close event that counted as Escape, so Stop and Settings closed at once;
  and the scratching post could not be clicked, because the cat button lay above it.
  Owner hit the first one independently (r09). Mutation checks: 2 of 13 survived.
- Fixed: both blockers; race in report step 2 by reordering it; food labels on
  phones; lock failure no longer leaves the app waiting; notes stored as data, so
  they follow the language and show while held; rug under pillow; mouse hit area;
  both surviving mutants; keyboard journey now covers the whole game; settings close
  when the feed window opens; weekday header; singular minute; spec, image list.
  New test project `dev` runs a smoke test on the development server.
- r07 to r12 built. Cat cut-outs: paper regions under 3.5 % of the image are removed,
  rims become see-through ink, specks are dropped. Font rebuilt with one baseline.
- Not fixed, moved on: focus after delete, hold and buy (T037); strings in `×`, `‹`,
  `›` and language names (T038); plurals through `Intl` (T038); reloading a tab
  while another waits swaps them; back/forward cache has no `pageshow` handling,
  though holding a Web Lock keeps Chromium from using it; four CSS lint warnings.
- Final `pnpm verify`: exit 0 (106 unit tests, 150 browser scenarios). Owner steps
  repeated by script in real time on the development URL at both widths after the
  fixes: all passed, no console errors, 17 screenshots in `review/round-2/`. The
  independent reviewer did not re-review the fixes.

Context: large, by estimate well past the 250k limit; exact figure not available.

### C2 decision and triage (2026-11-04)

Owner approved round 2 (Q1) and sent r13 to r15, built before the publish: the mouse
was stretched while learning, because the bigger tap area also applied to the plain
image, now only the button and tested; enclosed ears and feet stay white, stars stay
see-through; gear alone in a square box. Q2 is not stated and is asked again. These
three changes had no independent review; `pnpm verify` and a visual check only.
