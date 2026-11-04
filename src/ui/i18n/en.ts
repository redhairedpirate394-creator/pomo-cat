import type { Messages } from "./messages";

const coins = (count: number) => (count === 1 ? "1 coin" : `${count} coins`);

export const en: Messages = {
  documentTitle: "Pomo Cat",
  loading: "One moment …",
  nameTitle: "What is your cat called?",
  nameLabel: "Name",
  nameSubmit: "Let's go",
  start: "Start",
  stop: "Stop",
  stopTitle: "Cancel this unit?",
  stopText:
    "You get no coins for this unit. The time you have learned so far is saved.",
  stopConfirm: "Yes, cancel",
  stopKeep: "Keep learning",
  unitOf: (unit, total) => `Unit ${unit} of ${total}`,
  breakShort: "Short break",
  breakLong: "Long break",
  timerLabel: "Time left",
  feedTitle: "Feed",
  feedQuestion: (name) => `What does ${name} get?`,
  feedTimeLeft: (time) => `${time} of break left`,
  feedStopNote: "Without food, it won't continue after the break.",
  foods: { dry: "Dry food", wet: "Wet food", tuna: "Tuna" },
  fedNote: (name, count) => `${name} gives you ${coins(count)}.`,
  warning: "Starting again soon",
  warningStop: "Stop",
  heldNote: "Paused. It continues when you are ready.",
  continueUnit: (unit, total) => `Continue with unit ${unit} of ${total}`,
  coins,
  catAsleep: (name) => `${name} is asleep`,
  catEating: (name) => `${name} is eating`,
  catMood: (name, mood) =>
    ({
      happy: `${name} is happy`,
      normal: `${name} is sitting there`,
      sad: `${name} is sad`,
    })[mood],
  demoNote: "Trial run: time passes 30 times faster.",
  retry: "Try again",
  startOver: "Start over",
  startOverTitle: "Really start over?",
  startOverText:
    "This app's saved data will be deleted. This cannot be undone.",
  startOverConfirm: "Yes, delete everything",
  cancel: "Cancel",
  saveFailed: "Your progress could not be saved.",
  errors: {
    "name-required": "Please give your cat a name.",
    "name-too-long": "The name can be at most 20 characters long.",
    "read-failed": "Your progress could not be read.",
    "data-invalid": "The saved data is damaged.",
    "save-failed": "Your progress could not be saved.",
    "reset-failed": "The data could not be deleted.",
    unexpected: "Something went wrong.",
  },
};
