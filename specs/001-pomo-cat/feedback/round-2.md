# Feedback, round 2 (C2 / T036)

Written by the team from the owner's chat of 2026-11-04. The owner's words are
quoted unchanged under each item; ids, timing, type and reference are the team's
reading, for triage. Anything the owner did not say is marked **not stated**.

These items arrived while the review ran, before the round report was posted.

**Decision**: approve with follow-ups
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
| r13 | before publish | change | FR-029 | The mouse looks odd beside the sleeping cat |
| r14 | before publish | bug | FR-040 | The hind feet must be filled, not see-through |
| r15 | before publish | change | Q41 | Gear without its drawn frame, in a square box like To-Dos and Start |

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

## r13, r14, r15

> 1: Ja
> 2: die maus ist komisch bei der schlafenden Katze. Die hinteren Füße der Katze sollen ausgemalt und nicht transparent sein. Mache das Zahnrad symbol OHNE rand auch in einen Kasten wie ToDO/ Start nut Quadratisch

Q1 approves the round and the publish. Under 2 the owner wrote these wishes; they do
not say whether the four details of Q2 fit, so Q2 stays open. r14 came from the
cut-out rule of r07, which also removed small enclosed areas that belong to the cat.
r15 supersedes the gear part of Q41.

## Not stated

- None left. Q2, answered 2026-11-04, the owner's words unchanged: "2: passt alles".
