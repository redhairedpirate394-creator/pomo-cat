import "@fontsource/patrick-hand/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserStore,
  DEMO_STORAGE_KEY,
  STORAGE_KEY,
} from "./storage/browser";
import { App } from "./ui/App";
import { createDemoClock, systemClock } from "./ui/clock";
import { detectLocale } from "./ui/i18n";
import { createSoundPlayer } from "./ui/sounds";
import "./ui/style.css";

const DEMO_SPEED = 30;

const demo = new URLSearchParams(window.location.search).has("probelauf");
const clock = demo ? createDemoClock(DEMO_SPEED) : systemClock;
const store = createBrowserStore(demo ? DEMO_STORAGE_KEY : STORAGE_KEY);

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root.");
createRoot(root).render(
  <StrictMode>
    <App
      store={store}
      clock={clock}
      play={createSoundPlayer()}
      browserLocale={detectLocale(navigator.languages)}
      demo={demo}
    />
  </StrictMode>,
);
