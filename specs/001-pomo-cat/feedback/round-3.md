# Feedback, round 3 (C3 / T043)

Written by the team from the owner's chat of 2026-11-04. The owner's words are
quoted unchanged under each item; ids, timing, type and reference are the team's
reading, for triage. Anything the owner did not say is marked **not stated**.

These items arrived before the round 3 report was posted, while the 60-minute
measurement ran.

**Decision**: not stated for acceptance; order of the wishes decided, see r24
**Publish choice**: as recorded
**Tried**: not stated

Timing: `before publish` | `next round` | `later` (backlog).
Type: bug (within the spec) | change (other than specified) | extension (new scope) | question | decision | praise.

| ID | Timing | Type | Reference | Summary |
| --- | --- | --- | --- | --- |
| r17 | before publish | change | Q11, US3 | Snacks cost 5 coins instead of 3 |
| r18 | before publish | change | FR-040 | Food in the bowls at the delivered proportions, without the thin white rim |
| r19 | next round | change | Q41, r10, r15 | Frames in a drawn look; same size and thickness; two rounded corners |
| r20 | before publish | extension | SC-002 | Question mark top left that explains how to keep the cat happy |
| r21 | next round | extension | US3, FR-029 | A real room to furnish and click around in, with the owner's designs |
| r22 | next round | extension | FR-010, FR-036, FR-038 | New cat sounds with their own controls; the alert stays and can be turned off |
| r23 | before publish | change | SC-002, FR-036 | Gear beside the question mark; both always available |
| r24 | before publish | decision | r17 to r23 | Team's order accepted; one volume slider for cat sounds, one for alerts; new frame drawing sent |
| r25 | before publish | decision | r21, FR-027, SC-006 | Leave the furniture out for now, remember it for later |
| r26 | before publish | change | Q42, FR-027, T040 | Drawing of the third snack delivered |
| r27 | before publish | decision | r25, r26 | Plant, rug and scratching post leave the shop for now; third snack is Knusperstangen |

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

## r24 Antworten

> ja aber 4.: mache es bitte so wie ich gesagt habe. Ein lautstärkeregler für katzengeräusche und einer für alerts

Answers the four questions asked in chat: (1) the snack price, the food in the
bowls, the question mark and the gear come before acceptance, the room and the
sounds become their own next section; (2) yes, and the owner sent the frame drawing
with this message, saved as `docs/design/owner/frame.jpg`; since it is here, r19
comes before acceptance too; (3) the room drawing is the first design of the room;
(4) overrides the team's recommendation: no switch per sound, exactly two volume
sliders, "Katzengeräusche" and alerts. Turning a sound off means sliding it to zero;
the team reads this from "Auschalten" in r22 and reads it back.

The frame drawing's corners are nearly square, while r19 likes two rounded corners.
The team builds it as drawn and asks the owner to judge it in the app.

## r25, r26 Möbel und dritter Snack

> kannst du die möbel erstmal rauslassen aber dir für später merken. anbei ist der 3. Snack

r25: "die möbel" can mean the plant, rug and scratching post in today's shop, which
are placeholders, or only the sofa and the like of the coming room (r21). The team
asks which. Removing the scratching post would change SC-006. r26: the drawing, saved
as `docs/design/owner/snack-third.jpg`, shows three brown sticks. The third snack is
called Knusperkissen so far, so the name may no longer fit.

## r27 Antwort

> Ja

Takes both recommendations asked in chat: plant, rug and scratching post leave the
shop until their drawings and the real room exist, yarn, mouse and pillow stay; the
third snack is called Knusperstangen, in English Crunchy sticks.

## Not stated

- Whether C3 is accepted.
- Whether the frame's corners should stay as drawn or two of them be rounded.
