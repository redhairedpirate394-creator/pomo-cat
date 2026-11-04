# Contract: screen states and controls

The Playwright journeys use these accessible names (German catalog; English in
`en.ts`).

| State | Visible |
| --- | --- |
| first start | dialog "Wie heißt deine Katze?", field "Name", button "Los geht's" |
| idle | cat awake, button "Start", panels "Shop", "Kalender", "To-Dos", gear "Einstellungen", coin count |
| learning | timer, "Einheit X von Y", sleeping cat, "To-Dos", "Stop", gear; no coin count |
| stop confirmation | dialog "Einheit abbrechen?", "Ja, abbrechen", "Weiterlernen" |
| break, unfed | timer, dialog "Füttern" with one button per food |
| break, fed | cat awake, "Anhalten", "Jetzt weiterlernen", panels, coin count |
| warning | status "Gleich geht es weiter" and button "Stopp" when fed; an unfed break shows "Ohne Futter geht es nach der Pause nicht weiter." in the feed dialog |
| held | status "Angehalten. Es geht weiter, wenn du bereit bist.", "Weiter mit Einheit X von Y", panels |
| other tab active | notice only, no controls |
| store error | message, "Erneut versuchen"; on invalid data also "Neu anfangen" with a confirmation |

All dialogs trap focus and are labelled. Status changes use a polite live region.
The document title is `MM:SS · Pomo Cat` during a unit or break, else `Pomo Cat`.
