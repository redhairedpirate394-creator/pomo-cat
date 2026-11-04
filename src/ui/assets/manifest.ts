// The only place that names art and sound files. To use a final drawing, replace
// the file under the same name; docs/design/image-list.md lists them all.
import buttonShop from "./button-shop.png";
import catEating from "./cat-eating.png";
import catHappy from "./cat-happy.png";
import catNormal from "./cat-normal.png";
import catSad from "./cat-sad.png";
import catSleeping from "./cat-sleeping.png";
import iconCoin from "./icon-coin.png";
import iconGear from "./icon-gear.png";
import itemMouse from "./item-mouse.png";
import itemPillow from "./item-pillow.png";
import itemYarn from "./item-yarn.png";
import meow from "./meow.wav";

export const catImages = {
  sleeping: catSleeping,
  happy: catHappy,
  normal: catNormal,
  sad: catSad,
  eating: catEating,
  // The owner's heart eyes stand for happy and for petted.
  petted: catHappy,
} as const;

export const icons = {
  coin: iconCoin,
  gear: iconGear,
  shop: buttonShop,
} as const;

export const roomImages = {
  yarn: itemYarn,
  mouse: itemMouse,
  pillow: itemPillow,
} as const;

export const sounds = { meow } as const;
