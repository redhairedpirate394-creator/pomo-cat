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
