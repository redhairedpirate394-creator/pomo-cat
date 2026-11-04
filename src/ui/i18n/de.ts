import type { Messages } from "./messages";

const coins = (count: number) => (count === 1 ? "1 Münze" : `${count} Münzen`);

export const de: Messages = {
  documentTitle: "Pomo Cat",
  loading: "Einen Moment …",
  nameTitle: "Wie heißt deine Katze?",
  nameLabel: "Name",
  nameSubmit: "Los geht's",
  start: "Start",
  stop: "Stop",
  stopTitle: "Einheit abbrechen?",
  stopText:
    "Für diese Einheit gibt es dann keine Münzen. Die bisher gelernte Zeit wird gespeichert.",
  stopConfirm: "Ja, abbrechen",
  stopKeep: "Weiterlernen",
  unitOf: (unit, total) => `Einheit ${unit} von ${total}`,
  breakShort: "Kurze Pause",
  breakLong: "Lange Pause",
  timerLabel: "Verbleibende Zeit",
  feedTitle: "Füttern",
  feedQuestion: (name) => `Was bekommt ${name}?`,
  feedTimeLeft: (time) => `Noch ${time} Pause`,
  feedStopNote: "Ohne Futter geht es nach der Pause nicht weiter.",
  foods: { dry: "Trockenfutter", wet: "Nassfutter", tuna: "Thunfisch" },
  fedNote: (name, count) => `${name} gibt dir ${coins(count)}.`,
  warning: "Gleich geht es weiter",
  warningStop: "Stopp",
  heldNote: "Angehalten. Es geht weiter, wenn du bereit bist.",
  continueUnit: (unit, total) => `Weiter mit Einheit ${unit} von ${total}`,
  coins,
  catAsleep: (name) => `${name} schläft`,
  catEating: (name) => `${name} frisst`,
  catMood: (name, mood) =>
    ({
      happy: `${name} ist fröhlich`,
      normal: `${name} sitzt da`,
      sad: `${name} ist traurig`,
    })[mood],
  demoNote: "Probelauf: Die Zeit läuft 30-mal schneller.",
  retry: "Erneut versuchen",
  startOver: "Neu anfangen",
  startOverTitle: "Wirklich neu anfangen?",
  startOverText:
    "Die gespeicherten Daten dieser App werden gelöscht. Das lässt sich nicht rückgängig machen.",
  startOverConfirm: "Ja, alles löschen",
  cancel: "Abbrechen",
  saveFailed: "Dein Fortschritt konnte nicht gespeichert werden.",
  errors: {
    "name-required": "Bitte gib deiner Katze einen Namen.",
    "name-too-long": "Der Name darf höchstens 20 Zeichen lang sein.",
    "read-failed": "Dein Fortschritt konnte nicht gelesen werden.",
    "data-invalid": "Die gespeicherten Daten sind beschädigt.",
    "save-failed": "Dein Fortschritt konnte nicht gespeichert werden.",
    "reset-failed": "Die Daten konnten nicht gelöscht werden.",
    unexpected: "Etwas ist schiefgegangen.",
  },
};
