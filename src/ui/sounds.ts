import type { Sound } from "../domain/game";
import { sounds } from "./assets/manifest";

export type PlaySound = (sound: Sound) => void;

/** Failures are ignored on purpose: every signal is also shown on the screen. */
export function createSoundPlayer(): PlaySound {
  const meow = new Audio(sounds.meow);
  return () => {
    meow.currentTime = 0;
    void meow.play().catch(() => undefined);
  };
}
