import type { Sound } from "../domain/game";
import { sounds } from "./assets/manifest";

export type PlaySound = (sound: Sound) => void;

/**
 * Failures are ignored on purpose: every signal is also shown on the screen.
 * Phones allow sound only on an element that was played during a user gesture,
 * so the first tap or key press plays it once, silently.
 */
export function createSoundPlayer(): PlaySound {
  const meow = new Audio(sounds.meow);

  const unlock = () => {
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    meow.muted = true;
    meow
      .play()
      .then(() => {
        meow.pause();
        meow.currentTime = 0;
      })
      .catch(() => undefined)
      .finally(() => {
        meow.muted = false;
      });
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);

  return () => {
    meow.currentTime = 0;
    void meow.play().catch(() => undefined);
  };
}
