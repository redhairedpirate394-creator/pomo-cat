# Feedback, round 2 (C2 / T036)

Written by the team from the owner's chat of 2026-11-04. The owner's words are
quoted unchanged under each item; ids, timing, type and reference are the team's
reading, for triage. Anything the owner did not say is marked **not stated**.

These items arrived while the review ran, before the round report was posted.

**Decision**: not stated
**Publish choice**: as recorded
**Tried**: the trial link on the local address; steps not stated

Timing: `before publish` | `next round` | `later` (backlog).
Type: bug (within the spec) | change (other than specified) | extension (new scope) | question | decision | praise.

| ID | Timing | Type | Reference | Summary |
| --- | --- | --- | --- | --- |
| r07 | next round | bug | FR-040 | Paper still visible around the cat, and inside the stars |
| r08 | next round | change | FR-029 | The cat should sit more on the pillow |
| r09 | next round | bug | FR-012 | The stop button does not work |
| r10 | next round | change | Q41 | SHOP should look like To-Dos and Start |
| r11 | next round | change | FR-041 | Letters on one line, heights may change |
| r12 | next round | change | FR-029 | Room items in sizes that look right together |

## r07, r08, r09, r10

> die Ränder der Katze sind noch nicht alle Transparent (zwischen schwanz und Körper z.B.) auch die Sterne sollen innen transparent sein. die Katze soll bitte mehr auf dem Kissen sitzen.
> Der Stop knopf geht nicht und mach das SHOP bitte so wie To Do und Start

r07: enclosed paper, such as the gap between tail and body and the inside of the
stars, was kept because only paper connected to the image edge was removed. r08: the
cat stands at the pillow's lower edge instead of on it. r09: on the local address the
stop question closes at once: React's development double start closes the dialog,
and that delayed close event then counts as Escape. Production builds, which the
tests use, do not do this, so the tests stayed green. r10 replaces the drawn SHOP
button of Q41 by the normal box and supersedes that part of Q41.

## r11, r12

> kannst du die Schrift ungefähr auf eine Linie bringen, es ist okay wenn es ein bisschen versetzt ist aber du darfst die höhe der Buchstaben gerne verändern, Auch die Größe der Objekte so anpassen, dass es schön aussieht

Letters share one baseline, a little unevenness stays; letter heights may change.
Room items get sizes that look right together.

All of r07 to r12 are built. r09: confirmed by reproduction on the development server
before the fix, and the settings window failed the same way.

## Not stated

- Q1 and Q2 of the round 2 report.
