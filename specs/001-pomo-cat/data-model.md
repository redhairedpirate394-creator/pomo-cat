# Data Model: Pomo Cat

One document, `GameState`. Format details: [contracts/game-state.md](contracts/game-state.md).

## GameState

| Field | Type | Notes |
| --- | --- | --- |
| cat | Cat or null | null until named (FR-001) |
| coins | integer, at least 0 | FR-019, FR-031 |
| owned | RoomItemId[] | unique, FR-029 |
| studyLog | day key to minutes | FR-033 |
| todos | Todo[] | FR-035 |
| settings | Settings | FR-036 |
| phase | Phase | see below |
| lastSeenAt | timestamp or null | research R2 |

- **Cat**: `name` (1 to 20 characters after trimming), `mood` (`happy`, `normal`,
  `sad`), `moodAt` (timestamp of the last raise, or of naming).
- **Settings**: `learnMinutes` 5-60, `shortBreakMinutes` 5-30, `longBreakMinutes`
  5-60, all multiples of 5; `units` 1-8; `sound` boolean; `language` `de`, `en` or
  null (follow the browser).
- **Plan**: snapshot of the four timing settings, taken when a run starts (FR-037).
- **Todo**: `id`, `text` (1 to 120 characters after trimming), `done`.

## Phase

| Kind | Fields | Meaning |
| --- | --- | --- |
| `idle` | none | nothing runs |
| `learning` | plan, unit, startedAt, endsAt | a unit runs |
| `break` | plan, unit (just finished), length (`short` or `long`), endsAt, fed, coinsEarned, warned | a break runs; the feed window is open while `fed` is false |
| `held` | plan, nextUnit | waiting for a click; survives closing |

## Transitions

| From | Event | To | Effects |
| --- | --- | --- | --- |
| idle | start | learning, unit 1 | plan snapshot |
| held | continue | learning, nextUnit | |
| learning | time up | break (`short`, or `long` after the last unit) | coins credited, minutes logged, mood raised, sound `unit-end` |
| learning | stop | idle | floor(minutes) logged, no coins |
| break | feed | break, `fed` true | coins shown |
| break, short, 30 s left | time passes | same, `warned` true | sound `warning` |
| break, short, fed | time up | learning, next unit | |
| break, short, not fed | time up | held, next unit | |
| break, long | time up | idle | sound `long-break-end` |
| break, short, fed | hold | held | |
| break, fed | learn now | learning next unit, or unit 1 of a new run after the long break | |
| any but idle | reopened after more than 2 minutes | learning: idle, logging until lastSeenAt; short break: held; long break: idle | no coins for the open unit |
| any | reopened within 2 minutes | advances by the clock | |

`advance(state, now)` repeats until no phase has expired, so a device that slept
through several phases ends in a defined state; an unfed break always stops the
chain (SC-005).

## Rules

- **Coins**: `learnMinutes / 5`; happy at the end of the unit, before raising:
  `ceil(base * 1.5)`.
- **Mood now**: at least 96 h since `moodAt`: sad; at least 48 h and stored happy:
  normal; otherwise stored mood.
- **Raise** (finished unit or snack): one step up from mood now, `moodAt` = now.
- **Streak**: consecutive days with at least 5 minutes, ending today or yesterday.
- **Day key**: local date of the unit's start.
