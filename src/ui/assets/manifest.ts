// The only place that names art and sound files. To use a final drawing, replace
// the file under the same name; docs/design/image-list.md lists them all.
import catEating from "./cat-eating.png";
import catHappy from "./cat-happy.png";
import catNormal from "./cat-normal.png";
import catSad from "./cat-sad.png";
import catSleeping from "./cat-sleeping.png";
import meow from "./meow.wav";

export const catImages = {
  sleeping: catSleeping,
  happy: catHappy,
  normal: catNormal,
  sad: catSad,
  eating: catEating,
} as const;

export const sounds = { meow } as const;
