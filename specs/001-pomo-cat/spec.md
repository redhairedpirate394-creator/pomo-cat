# Feature Specification: Pomo Cat

**Feature Branch**: `001-pomo-cat`

**Created**: 2026-11-04

**Status**: Draft

**Spec Language**: de

**Input**: User description: Pomodoro-Timer im Browser mit einer Katze als Haustier, die man durchs Lernen füttert. Vollständiges Interview in `docs/journal/001-pomo-cat.md`, Entwurf des Lernbildschirms in `docs/design/owner-sketch-learning-screen.jpg`.

**Was stimmen muss, damit es sich lohnt** (Worte der Eigentümerin bzw. des Eigentümers): „Es gibt nicht zu viel Schnick Schnack, sondern eine sehr simple anwendung. 2 D Grafik (selbstgemalt)“

## Clarifications

### Session 2026-11-04

Geklärt im Interview (Fragen Q1 bis Q36, Wortlaut im Journal):

- Q: Belohnung? → A: Münzen pro Lernzeit; die Katze gibt sie beim Füttern; eine fröhliche Katze gibt 50 % mehr (Q1, Q10).
- Q: Shop? → A: wenig Auswahl, niedrige Preise, kostenlose Futtersorten, Snacks je 3 Münzen (Q1, Q11).
- Q: Abbruch? → A: jederzeit, ohne Belohnung und Strafe; die Zeit bis zum Abbruch steht im Lernkalender (Q3).
- Q: Automatik? → A: Einheiten laufen innerhalb eines Durchgangs automatisch weiter, Warnung 30 Sekunden vorher; Anhalten ist möglich; die Anzahl der Einheiten ist einstellbar (Q4, Q13, Q22, Q23).
- Q: Münzen ohne Lernen verhindern? → A: Das Futter-Fenster öffnet sich automatisch; wer bis zum Pausenende nicht füttert, stoppt den Ablauf, behält aber die Münzen der beendeten Einheit (Q27, Q32).
- Q: App geschlossen? → A: Die laufende Einheit bricht ab, außer man kommt innerhalb von 2 Minuten zurück (Q15, Q24).
- Q: Konto? → A: gewünscht, aber als eigener zweiter Schritt; bis dahin bleibt alles im Browser (Q8, Q16).
- Q: Aufbau? → A: nach der Skizze, To-Dos, Shop und Kalender ausklappbar (Q26, Q30, Q33).
- Q: Stil? → A: handgezeichnet; die fertigen Bilder malt die Eigentümerin bzw. der Eigentümer in Farbe, die Skizzen sind Entwürfe (Q5, Q35, Q36).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lernen, füttern, Münzen bekommen (Priority: P1)

Ich öffne die App, gebe meiner Katze einen Namen und starte. Während ich lerne, schläft die Katze neben dem Timer. Ist die Einheit um, höre ich ein Miauen, ein Fenster öffnet sich, ich wähle ein Futter, und die Katze gibt mir Münzen. Nach der Pause geht es von selbst weiter, 30 Sekunden vorher warnt mich ein Miauen. Nach der letzten Einheit und der langen Pause ist der Durchgang zu Ende.

**Why this priority**: Das ist die ganze Idee in ihrer einfachsten Form. Sie prüft, was stimmen muss: Fühlt sich die App sehr einfach an, und macht der Kreislauf aus Lernen, Füttern und Münzen Spaß?

**Independent Test**: Mit kurzen Testzeiten einen Durchgang durchspielen: Name vergeben, starten, füttern, automatische nächste Einheit erleben, einmal nicht füttern, einmal abbrechen, Münzstand prüfen.

**Acceptance Scenarios**:

1. **Given** die App wird zum ersten Mal geöffnet, **When** ich einen Namen eingebe, **Then** sehe ich die Katze und kann sofort starten, ohne Anleitung.
2. **Given** Standardeinstellungen, **When** ich starte, **Then** zählt der Timer von 25:00 herunter, darunter steht „Einheit 1 von 4“, die Katze schläft, und die Restzeit steht im Titel des Browser-Tabs.
3. **Given** eine Einheit läuft ab, **When** die Zeit um ist, **Then** ertönt ein Miauen, das Futter-Fenster öffnet sich und die Pause läuft dahinter an.
4. **Given** das Futter-Fenster ist offen, **When** ich eine Futtersorte wähle, **Then** frisst die Katze, ich sehe die Münzen dieser Einheit, und das Fenster schließt sich.
5. **Given** ich habe gefüttert und die kurze Pause läuft, **When** noch 30 Sekunden übrig sind, **Then** miaut die Katze, ein Hinweis mit Stopp-Knopf erscheint, und ohne Eingriff startet danach die nächste Einheit.
6. **Given** das Futter-Fenster ist offen, **When** die Pause endet, ohne dass ich gewählt habe, **Then** startet keine weitere Einheit, die Münzen der beendeten Einheit sind trotzdem da, und es geht erst per Klick weiter.
7. **Given** die letzte Einheit ist beendet und gefüttert, **When** die lange Pause endet, **Then** ertönt ein Ton, und der nächste Durchgang startet erst per Klick.
8. **Given** eine Einheit läuft, **When** ich auf „Stop“ drücke und bestätige, **Then** endet der Durchgang ohne Münzen und ohne Strafe.
9. **Given** eine Einheit läuft, **When** ich die App schließe und nach mehr als 2 Minuten wiederkomme, **Then** ist die Einheit abgebrochen, ohne Münzen.
10. **Given** eine Einheit läuft, **When** ich die App schließe und innerhalb von 2 Minuten wiederkomme, **Then** läuft die Einheit normal weiter.

---

### User Story 2 - Pause mit der Katze (Priority: P2)

In der Pause ist die Katze wach und ich verbringe die Zeit mit ihr statt mit dem Handy. Ich streichle sie, spiele mit ihr, halte den Ablauf an, wenn ich länger weg muss, oder lerne früher weiter. Lerne ich ein paar Tage nicht, wird sie traurig, aber sie stirbt nie.

**Why this priority**: Die Pause ist der zweite Kern der Idee: Sie soll das Doomscrolling ersetzen. Sie baut auf dem Lernkreislauf auf.

**Independent Test**: In einer Pause streicheln, anhalten, die App schließen, wieder öffnen und weitermachen; die Stimmung über vorgestellte Tage prüfen.

**Acceptance Scenarios**:

1. **Given** eine Pause läuft, **When** ich die Katze anklicke, **Then** reagiert sie sichtbar, und die Pause läuft unverändert weiter.
2. **Given** ich habe gefüttert und die kurze Pause läuft, **When** ich „Anhalten“ drücke, **Then** stoppt der Countdown ohne Zeitlimit, und „Weiter“ startet die nächste Einheit, zum Beispiel „Einheit 3 von 4“.
3. **Given** der Ablauf ist angehalten, **When** ich die App schließe und später öffne, **Then** sehe ich, wo ich war, und kann mit „Weiter“ fortfahren.
4. **Given** ich habe gefüttert und eine Pause läuft, **When** ich „Jetzt weiterlernen“ drücke, **Then** endet die Pause sofort, und die nächste Einheit beginnt.
5. **Given** die letzte fertige Einheit liegt mindestens 2 Tage zurück und die Katze war fröhlich, **When** ich die App öffne, **Then** ist sie normal; nach mindestens 4 Tagen ist sie traurig.
6. **Given** die Katze ist traurig, **When** ich eine Einheit beende, **Then** steigt die Stimmung um eine Stufe, und sie stirbt oder verschwindet in keinem Fall.
7. **Given** ich besitze ein Spielzeug, **When** ich es in einer Pause anklicke, **Then** spielt die Katze damit.

---

### User Story 3 - Shop und Katzenraum (Priority: P3)

Mit meinen Münzen kaufe ich der Katze Snacks und richte ihren Raum ein. Die Auswahl ist klein, und schon mit wenigen Münzen ist etwas drin. Auch der Kratzbaum ist nach einem Lerntag erreichbar.

**Why this priority**: Der Shop gibt den Münzen ihren Sinn, braucht aber den funktionierenden Kreislauf.

**Independent Test**: Mit einem vorgegebenen Münzstand Snacks und Einrichtung kaufen; prüfen, dass Sachen am festen Platz stehen und nach dem Neuladen bleiben.

**Acceptance Scenarios**:

1. **Given** keine Einheit läuft, **When** ich den Shop aufklappe, **Then** sehe ich die Snacks und Raum-Sachen mit Preisen.
2. **Given** ich habe mindestens 3 Münzen, **When** ich einen Snack kaufe, **Then** wird er sofort verfüttert, die Katze reagiert besonders, und die Stimmung steigt um eine Stufe.
3. **Given** ich habe genug Münzen, **When** ich eine Raum-Sache kaufe, **Then** steht sie dauerhaft an ihrem festen Platz und kann nicht ein zweites Mal gekauft werden.
4. **Given** ich habe zu wenig Münzen, **When** ich den Shop ansehe, **Then** sehe ich den Preis, kann aber nicht kaufen.
5. **Given** eine Einheit läuft, **When** ich auf die App schaue, **Then** sind Shop und Kalender nicht erreichbar.

---

### User Story 4 - Lernkalender und Lernserie (Priority: P4)

In einem Kalender sehe ich, wie viel ich an jedem Tag gelernt habe, auch aus abgebrochenen Einheiten. Eine kleine Lernserie zeigt, wie viele Tage ich in Folge dabei war, ohne Druck.

**Why this priority**: Der Kalender macht das Lernen sichtbar, ist aber nicht nötig, damit der Kreislauf funktioniert.

**Independent Test**: Vorhandene Lerntage anzeigen, eine abgebrochene Einheit prüfen, durch die Monate blättern, Serie mit einer Lücke prüfen.

**Acceptance Scenarios**:

1. **Given** ich habe an einem Tag gelernt, **When** ich den Kalender aufklappe, **Then** sehe ich in der Monatsansicht die Lernzeit dieses Tages.
2. **Given** ich breche eine Einheit nach 12 Minuten ab, **When** ich den Kalender ansehe, **Then** sind diese 12 Minuten eingerechnet.
3. **Given** eine Pause lief, **When** ich den Kalender ansehe, **Then** zählt die Pausenzeit nicht.
4. **Given** ich habe an drei Tagen in Folge je mindestens 5 Minuten gelernt, **When** ich den Kalender ansehe, **Then** steht dort klein „3 Tage in Folge“.
5. **Given** ein Tag fehlte, **When** ich wieder lerne, **Then** beginnt die Serie ohne Meldung neu.

---

### User Story 5 - To-Do-Liste (Priority: P5)

Neben dem Timer kann ich eine einfache Liste aufklappen, damit ich weiß, was ich lernen will.

**Why this priority**: Sie steht in der Skizze und hilft beim Lernen, ist aber vom Kreislauf unabhängig.

**Independent Test**: Liste aufklappen, Aufgaben eintragen, abhaken, löschen, neu laden.

**Acceptance Scenarios**:

1. **Given** die App ist offen, **When** ich die To-Do-Liste aufklappe, **Then** kann ich eine Aufgabe eintragen, auch während eine Einheit läuft.
2. **Given** eine Aufgabe steht in der Liste, **When** ich sie abhake, **Then** ist sie durchgestrichen und bringt keine Münzen.
3. **Given** eine Aufgabe steht in der Liste, **When** ich sie lösche, **Then** ist sie weg.
4. **Given** ich habe Aufgaben eingetragen, **When** ich die App neu öffne, **Then** sind sie noch da, und die Liste ist zugeklappt.

---

### User Story 6 - Einstellungen und Sprache (Priority: P6)

Über das Zahnrad stelle ich Zeiten, Anzahl der Einheiten, Ton und Sprache ein, weil ich nicht immer gleich viel Zeit habe.

**Why this priority**: Die Standardwerte funktionieren auch ohne Einstellungen; deshalb kommt dies zuletzt, gehört aber zum fertigen Produkt.

**Independent Test**: Werte ändern, prüfen, wann sie wirken, Sprache wechseln, Ton ausschalten.

**Acceptance Scenarios**:

1. **Given** ich öffne die Einstellungen, **When** ich die Lernzeit ändere, **Then** kann ich nur Werte von 5 bis 60 Minuten in 5-Minuten-Schritten wählen.
2. **Given** ein Durchgang läuft, **When** ich Zeiten oder Einheiten ändere, **Then** gelten sie erst ab dem nächsten Start.
3. **Given** ein Durchgang läuft, **When** ich Ton oder Sprache ändere, **Then** gilt das sofort.
4. **Given** der Ton ist aus, **When** noch 30 Sekunden Pause übrig sind, **Then** sehe ich die Warnung nur auf dem Bildschirm.
5. **Given** mein Browser ist auf Deutsch oder Englisch eingestellt, **When** ich die App zum ersten Mal öffne, **Then** erscheint sie in dieser Sprache.

---

### Edge Cases

- **Einheit endet im Hintergrund**: Der Timer bleibt in einem anderen Tab genau; Ton und Tab-Titel melden das Ende, das Futter-Fenster wartet beim Zurückkommen.
- **Handy gesperrt**: Die Einheit läuft weiter, aber der Browser kann keinen Ton abspielen. Beendet das Handy die Seite für mehr als 2 Minuten, zählt das als Abbruch.
- **Tab versehentlich neu geladen**: Innerhalb von 2 Minuten läuft alles weiter.
- **App während einer Pause geschlossen**: Bei Rückkehr nach mehr als 2 Minuten ist der Ablauf angehalten, die nächste Einheit startet per Klick.
- **Lange Pause ohne Füttern**: Das Fenster schließt sich am Pausenende, die Münzen sind trotzdem da.
- **Einheit endet, während die App zu ist**: Innerhalb der 2 Minuten zählt sie als fertig; danach gilt der Abbruch.
- **App in zwei Tabs offen**: Nur ein Tab führt den Timer; der andere zeigt einen Hinweis, damit keine Münzen doppelt entstehen.
- **Gespeicherte Daten unlesbar oder Speichern nicht möglich**: Die App zeigt das verständlich, bietet einen neuen Versuch an und löscht niemals still den Fortschritt.
- **Einheit über Mitternacht**: Die Zeit zählt für den Tag, an dem die Einheit begonnen hat.
- **Andere Browsersprache als Deutsch oder Englisch**: Die App startet auf Deutsch.

## Requirements *(mandatory)*

### Functional Requirements

**Start und Aufbau**

- **FR-001**: Beim ersten Öffnen MUSS die App einmalig nach dem Namen der Katze fragen und danach ohne Anleitung startbereit sein.
- **FR-002**: Die App MUSS aus einem einzigen Hauptbildschirm nach der Skizze bestehen: Timer und „Einheit X von Y“ oben mittig, die Katze darunter, rechts die ausklappbare To-Do-Liste, darunter die Knöpfe; auf schmalen Bildschirmen steht alles untereinander.
- **FR-003**: To-Do-Liste, Shop und Kalender MÜSSEN ausklappbar und beim Öffnen der App zugeklappt sein.

**Timer und Ablauf**

- **FR-004**: Der Timer MUSS Minuten und Sekunden herunterzählen und auch in Hintergrund-Tabs genau bleiben.
- **FR-005**: Die Restzeit MUSS im Titel des Browser-Tabs stehen, solange eine Einheit oder Pause läuft.
- **FR-006**: Standardwerte MÜSSEN 25 Minuten Lernen, 5 Minuten kurze Pause, 15 Minuten lange Pause und 4 Einheiten pro Durchgang sein.
- **FR-007**: Nach einer Einheit, auf die eine weitere folgt, MUSS die kurze Pause beginnen und danach automatisch die nächste Einheit starten.
- **FR-008**: 30 Sekunden vor dem automatischen Start MUSS die Katze miauen und ein sichtbarer Hinweis mit Stopp-Knopf erscheinen; Stopp hält den Ablauf an.
- **FR-009**: Nach der letzten Einheit eines Durchgangs MUSS die lange Pause beginnen; der nächste Durchgang darf nur per Klick starten.
- **FR-010**: Das Ende einer Einheit und das Ende der langen Pause MÜSSEN mit einem kurzen Ton gemeldet werden, sofern der Ton an ist. Browser-Benachrichtigungen gibt es nicht.
- **FR-011**: Während einer Einheit MÜSSEN nur Timer, schlafende Katze, „Stop“, Zahnrad und die ausklappbare To-Do-Liste erreichbar sein; Shop, Kalender, Füttern und Spielen MÜSSEN gesperrt sein.
- **FR-012**: „Stop“ während einer Einheit MUSS nach einer kurzen Bestätigung die Einheit und den Durchgang beenden, ohne Münzen und ohne Strafe.
- **FR-013**: Das Schließen der App während einer Einheit MUSS diese abbrechen, außer man kommt innerhalb von 2 Minuten zurück; dann läuft sie nach der Uhr weiter.
- **FR-014**: Tab-Wechsel und Bildschirmsperre DÜRFEN eine Einheit nicht abbrechen, solange die Seite weiterbesteht.
- **FR-015**: Wird die App während einer Pause für mehr als 2 Minuten geschlossen, MUSS der Ablauf bei Rückkehr angehalten sein, und die nächste Einheit darf nur per Klick starten.

**Füttern und Münzen**

- **FR-016**: Nach jeder fertigen Einheit MUSS sich automatisch ein Fenster mit den Futtersorten Trockenfutter, Nassfutter und Thunfisch öffnen. Die Sorten sind kostenlos und unterscheiden sich nur im Geschmack.
- **FR-017**: Das Fenster MUSS während der ganzen Pause offen bleiben, der Countdown läuft dahinter sichtbar weiter.
- **FR-018**: Wird bis zum Ende der Pause nicht gewählt, MUSS das Fenster schließen; nach einer kurzen Pause MUSS der Ablauf angehalten sein.
- **FR-019**: Eine fertige Einheit MUSS 1 Münze pro 5 Minuten Lernzeit bringen, unabhängig davon, ob gefüttert wird. War die Katze beim Ende der Einheit fröhlich, sind es 50 % mehr, aufgerundet (25 Minuten: 5 oder 8 Münzen).
- **FR-020**: Beim Füttern MUSS die Katze sichtbar fressen, und die Münzen dieser Einheit MÜSSEN angezeigt werden. Der Münzstand MUSS außerhalb einer Einheit sichtbar sein.

**Pause und Katze**

- **FR-021**: In Pausen MUSS die Katze wach sein und auf Streicheln reagieren, ohne dass dies Münzen oder Stimmung verändert.
- **FR-022**: Nach dem Füttern MÜSSEN in der Pause „Anhalten“ und „Jetzt weiterlernen“ verfügbar sein, außerdem Shop und Kalender. „Anhalten“ stoppt den Countdown ohne Zeitlimit und bleibt über das Schließen der App hinweg erhalten.
- **FR-023**: Die Stimmung MUSS fröhlich, normal oder traurig sein. Eine neue Katze ist normal.
- **FR-024**: Eine fertige Einheit und ein Snack MÜSSEN die Stimmung um eine Stufe heben. Nach 2 Tagen (48 Stunden) ohne solches Ereignis MUSS eine fröhliche Katze normal sein, nach 4 Tagen (96 Stunden) MUSS die Katze traurig sein.
- **FR-025**: Die Katze DARF NICHT sterben, verschwinden oder Besitz verlieren, egal wie lange nicht gelernt wird.
- **FR-026**: Die Stimmung MUSS an der Katze sichtbar sein.

**Shop und Raum**

- **FR-027**: Der Shop MUSS außerhalb von Einheiten erreichbar sein und genau enthalten: die Snacks Lachsstick, Knusperkissen und Katzenminze für je 3 Münzen; Wollknäuel, Spielmaus und Kissen für je 5 Münzen; Pflanze und Teppich für je 10 Münzen; Kratzbaum für 20 Münzen.
- **FR-028**: Ein gekaufter Snack MUSS sofort verfüttert werden; es gibt keinen Vorrat.
- **FR-029**: Raum-Sachen MÜSSEN dauerhaft an festen Plätzen rund um die Katze stehen, nicht verschiebbar und nur einmal kaufbar.
- **FR-030**: Wollknäuel, Spielmaus und Kratzbaum MÜSSEN in Pausen anklickbar sein, und die Katze spielt damit.
- **FR-031**: Ein Kauf MUSS bei zu wenig Münzen unmöglich sein; der Münzstand DARF NICHT negativ werden.

**Kalender**

- **FR-032**: Der Kalender MUSS eine Monatsansicht mit der Lernzeit pro Tag zeigen und das Blättern zu früheren Monaten erlauben.
- **FR-033**: Lernzeit MUSS fertige und abgebrochene Einheiten umfassen, in ganzen Minuten; Pausen zählen nicht.
- **FR-034**: Die Lernserie MUSS klein als „X Tage in Folge“ erscheinen. Ein Tag zählt ab 5 Minuten Lernzeit. Reißt sie, beginnt sie ohne Meldung neu. Es gibt keine Erinnerungen und keine Ranglisten, und die Stimmung hängt nicht von ihr ab.

**To-Dos**

- **FR-035**: Nutzerinnen und Nutzer MÜSSEN Aufgaben eintragen, abhaken und löschen können, auch während einer Einheit. Aufgaben bringen keine Münzen und bleiben gespeichert. Abgehakte Aufgaben bleiben durchgestrichen stehen, bis man sie löscht.

**Einstellungen und Sprache**

- **FR-036**: Das Zahnrad MUSS immer erreichbar sein und Lernzeit (5 bis 60), kurze Pause (5 bis 30), lange Pause (5 bis 60), jeweils in 5-Minuten-Schritten, sowie die Anzahl der Einheiten (1 bis 8), den Ton und die Sprache einstellen.
- **FR-037**: Zeiten und Anzahl MÜSSEN ab dem nächsten Durchgang gelten, Ton und Sprache sofort.
- **FR-038**: Ist der Ton aus, MÜSSEN alle Warnungen weiterhin auf dem Bildschirm sichtbar sein.
- **FR-039**: Die gesamte App MUSS auf Deutsch und Englisch verfügbar sein. Die Startsprache richtet sich nach dem Browser, sonst Deutsch.

**Aussehen**

- **FR-040**: Alle Grafiken MÜSSEN austauschbare Einzelbilder sein, damit Entwürfe ohne weitere Änderungen durch die fertigen farbigen Bilder ersetzt werden können. Bewegung entsteht durch Bildwechsel.
- **FR-041**: Timer und Knöpfe MÜSSEN eine gut lesbare handschriftliche Schrift nutzen.
- **FR-042**: Zur Testrunde MUSS eine Liste aller benötigten Bilder mit Maßen vorliegen.

**Daten und Zuverlässigkeit**

- **FR-043**: Der gesamte Fortschritt MUSS im Browser gespeichert werden und ein Neuladen überstehen: Katze, Stimmung, Münzen, Käufe, Kalender, To-Dos, Einstellungen, Ablaufstand.
- **FR-044**: Die App DARF keine Konten, Werbung, Auswertungen oder Verbindungen zu fremden Diensten nutzen.
- **FR-045**: Können Daten nicht gelesen oder gespeichert werden, MUSS die App das verständlich zeigen, einen neuen Versuch anbieten und DARF den Fortschritt nicht still löschen.
- **FR-046**: Ist die App in zwei Tabs offen, DARF nur einer den Timer führen, und Münzen DÜRFEN nicht doppelt entstehen.
- **FR-047**: Alle Funktionen MÜSSEN per Tastatur bedienbar sein, und Fenster MÜSSEN für Screenreader verständlich beschriftet sein.
- **FR-048**: Es MUSS einen eigenen Probelauf-Link geben, in dem die Zeit 60-mal schneller läuft und der den echten Fortschritt nicht berührt, damit sich der Ablauf in Testrunden ausprobieren lässt, ohne jeweils 25 Minuten zu warten.

### Key Entities *(include if feature involves data)*

- **Katze**: Name, Stimmung, Zeitpunkt des letzten stimmungshebenden Ereignisses.
- **Durchgang**: Die aktuelle Folge von Einheiten mit den beim Start gültigen Zeiten, der Nummer der Einheit, dem Zustand (Einheit, Pause, angehalten, nichts läuft) und den Zeitpunkten, aus denen sich die Restzeit ergibt.
- **Geldbeutel**: aktueller Münzstand.
- **Raum-Sache**: Art, Preis, fester Platz, gekauft oder nicht, spielbar oder nicht.
- **Lerntag**: Kalendertag mit gelernten Minuten.
- **Aufgabe**: Text, abgehakt oder nicht.
- **Einstellungen**: Zeiten, Anzahl der Einheiten, Ton, Sprache.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Vom ersten Öffnen bis zur laufenden Einheit braucht man höchstens zwei Schritte (Name eingeben, Start) und unter 30 Sekunden.
- **SC-002**: Beim Lernen sind genau die Elemente der Skizze sichtbar: Timer, Einheit, Katze, To-Do-Knopf, Stop, Zahnrad. Es gibt keine weiteren Bedienelemente.
- **SC-003**: Die Eigentümerin bzw. der Eigentümer bewertet die App in der ersten Testrunde als „sehr simpel, ohne Schnickschnack“.
- **SC-004**: Der Timer weicht über 60 Minuten um höchstens 1 Sekunde ab, auch in einem Hintergrund-Tab.
- **SC-005**: Ohne jede Eingabe entstehen nach dem Start höchstens die Münzen einer einzigen Einheit.
- **SC-006**: Der Kratzbaum ist mit Standardeinstellungen nach höchstens 4 fertigen Einheiten bezahlbar, ein Snack nach einer Einheit.
- **SC-007**: Nach dem Neuladen an beliebiger Stelle geht kein Fortschritt verloren.
- **SC-008**: Alle Texte erscheinen vollständig auf Deutsch und auf Englisch.
- **SC-009**: Die App ist auf Handy- und Computerbildschirmen ohne seitliches Scrollen nutzbar.
- **SC-010**: Der Austausch aller Platzhalter gegen fertige Bilder erfordert keine Änderung am Verhalten der App.

## Assumptions

Vom Team gewählte Kleinigkeiten, die das Interview offen ließ. Sie werden in der ersten Testrunde vorgelegt und lassen sich leicht ändern.

- Der Name der Katze ist Pflicht und höchstens 20 Zeichen lang; eine Aufgabe höchstens 120 Zeichen.
- „Stop“ fragt einmal kurz nach, damit keine Einheit versehentlich endet. Danach beginnt der nächste Start wieder bei Einheit 1.
- Ein Bonus richtet sich nach der Stimmung beim Ende der Einheit, bevor sie steigt. Eine neue Katze bekommt ihn also ab der zweiten Einheit.
- Ein Snack setzt die 48- und 96-Stunden-Frist zurück wie eine fertige Einheit.
- Die Lernzeit einer abgebrochenen Einheit wird auf ganze Minuten abgerundet. Bei geschlossener App zählt der letzte Moment, in dem sie noch offen war.
- Kissen, Pflanze und Teppich sind reine Einrichtung, zum Spielen dienen Wollknäuel, Spielmaus und Kratzbaum.
- Die Decke unter der schlafenden Katze aus der Skizze gehört von Anfang an dazu; der Teppich aus dem Shop kommt zusätzlich.
- Eine Lerneinheit über Mitternacht zählt für den Tag, an dem sie begonnen hat.
- Diese erste Version kommt ohne Knopf zum Zurücksetzen aus. Nur wenn die gespeicherten Daten unlesbar sind, bietet der Fehlerbildschirm nach einer Rückfrage „Neu anfangen“ an.
- Nutzung zuerst nur durch die Eigentümerin bzw. den Eigentümer, ohne persönliche Daten. Daten bleiben im jeweiligen Browser: getrennte Katzen pro Gerät, und das Löschen der Browserdaten löscht auch die Katze.
- Für das Miauen wird zunächst ein frei verwendbarer Platzhalter-Ton genutzt.
- Die englischen Texte schreibt das Team.

### Ausgeschlossen aus dieser Funktion

- Konto, Anmeldung und Nutzung auf mehreren Geräten: eigener zweiter Schritt, inklusive Übernahme des Fortschritts (Q16 bis Q20).
- Freunde und Einladungslinks (Q17, Q29).
- Andere Tiere, andere Räume und der Name Pomo Pet (Bootstrap-Antwort 7).
- Browser-Benachrichtigungen (Q7).
- Verschieben von Einrichtung, Fellauswahl, Ranglisten.
