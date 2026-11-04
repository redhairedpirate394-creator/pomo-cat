# Feedback, round 3 (C3 / T043)

Written by the team from the owner's chat of 2026-11-04. The owner's words are
quoted unchanged under each item; ids, timing, type and reference are the team's
reading, for triage. Anything the owner did not say is marked **not stated**.

These items arrived before the round 3 report was posted, while the 60-minute
measurement ran.

**Decision**: not stated
**Publish choice**: as recorded
**Tried**: not stated

Timing: `before publish` | `next round` | `later` (backlog).
Type: bug (within the spec) | change (other than specified) | extension (new scope) | question | decision | praise.

Timing below is the team's proposal until the owner decides it.

| ID | Timing | Type | Reference | Summary |
| --- | --- | --- | --- | --- |
| r17 | before publish | change | Q11, US3 | Snacks cost 5 coins instead of 3 |
| r18 | before publish | change | FR-040 | Food in the bowls at the delivered proportions, without the thin white rim |
| r19 | next round | change | Q41, r10, r15 | Frames in a drawn look; same size and thickness; two rounded corners |
| r20 | before publish | extension | SC-002 | Question mark top left that explains how to keep the cat happy |
| r21 | next round | extension | US3, FR-029 | A real room to furnish and click around in, with the owner's designs |
| r22 | next round | extension | FR-010, FR-036, FR-038 | New cat sounds with their own controls; the alert stays and can be turned off |
| r23 | before publish | change | SC-002, FR-036 | Gear beside the question mark; both always available |

## r17, r18 Futter

> 1.	Futter
> -	Die Snacks sollen doch 5 Münzen kosten
> -	Das Futter in den Näpfen soll genau das größenverhältnis haben das ich geschickt habe. Vielleicht bekommst du den dünnen weißen Rand außenrum weg

r17 changes Q11 and the shop scenario; a snack stays affordable after one unit, so
SC-006 holds. r18: on `food-sheet.jpg` each food is about 85 % of the bowl's width,
the app shows 64 %. The white rim is paper left at the edge of the cut-out food.

## r19 Die Rahmen

> 2.	Die Rahmen
> -	Ich möchte, dass die Rahmen auch in einem Gezeichneten Look sind. Kriegst du das mit den zeichnungen die ich dir gegeben hab hin oder brauchst du neue. Die Größe passt und auch die Dicke. Ich mag es das zwei ecken abgerundet sind.

The delivered sheet has two frames, gear and SHOP: thin lines, square corners, fixed
shapes. They do not match the wanted thickness and rounded corners, so one new
drawing is the better source. It can then stretch to every box size.

## r20 Fragezeichen

> Neue Sachen:
> 1.	Ein Fragezeichen Symbol oben links in der Ecke. Hier soll erklärt werden wir alles funktioniert. Hier soll drin stehen:
> So bleibt deine Katze glücklich:
> 1.	Lernen, um sie zu füttern. Lernst du eine Zeit nicht, wird sie traurig :(
> 2.	Ab  und zu ein leckerer Snack. Deine Katze wird durch diese glücklicher
> 3.	Ganz viele Streicheleinheiten!!!

A window with this text, also in English. It adds a control while learning, which
SC-002 excludes, so SC-002 changes with r23.

## r21 Richtiger Raum

> 2.	Ich möchte einen richtigen Raum gestalten, in dem man herumklicken kann. Dass wird schwerer. Dort soll dann z.B. rechts in der Ecke ein Kratzbaum sein. Links ein Sofa. Die Designs dafür schicke ich dir dann.

The owner sent a drawing with this message, saved as
`docs/design/owner/room-draft.jpg`: an empty room with a door on the left, a window
on the right and a dark floor. The team reads it as the first design of this room;
the owner did not say so. Needs an interview before it can be specified.

## r22 Neue Geräusche

> 3.	Neue geräusche: 
> 
> -	Schmatzen während dem essen
> -	Schnurren während des schlafens
> -	Miau bei Streicheln
> -	Ab und zu ein kleiner katzen nieser wäre niedlich
> -	Diese Geräusche soll man alle einzeln togglen können (lautstäkeregler) 
> 	In einer Kategorie sind hier Schmatzen, Miau beim streicheln und niesen  und Schnurren (Obername: Katzengeräusche)
> 	Das Alertgeräusch soll bleiben, man sollte es aber auch Auschalten können

Open: whether each sound gets its own switch or slider, or the category one slider.
Sound sources, and how purring during a unit fits with learning, are also open.

## r23 Zahnrad

> 4.	Die Position des Zahnrades
> -	Pack das einfach neben das Fragezeichen beides soll immer zu verfügung stehen

## Not stated

- Whether C3 is accepted, and whether these wishes come before or after acceptance.
- What the sent room drawing is meant to be.
- r22: the controls per sound or per category.
