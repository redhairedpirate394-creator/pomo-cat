export const FOODS = ["dry", "wet", "tuna"] as const;
export type FoodId = (typeof FOODS)[number];

export const SNACK_PRICE = 5;
export const SNACKS = ["salmon-stick", "crunchy-pillow", "catnip"] as const;
export type SnackId = (typeof SNACKS)[number];

export const ROOM_ITEMS = [
  { id: "yarn", price: 5, playable: true, inShop: true },
  { id: "mouse", price: 5, playable: true, inShop: true },
  { id: "pillow", price: 5, playable: false, inShop: true },
  // Back in the shop with their drawings and the real room; owners keep them.
  { id: "plant", price: 10, playable: false, inShop: false },
  { id: "rug", price: 10, playable: false, inShop: false },
  { id: "scratching-post", price: 20, playable: true, inShop: false },
] as const;
export type RoomItemId = (typeof ROOM_ITEMS)[number]["id"];

export const SHOP_ITEMS = ROOM_ITEMS.filter((item) => item.inShop);

export const ROOM_ITEM_IDS: readonly RoomItemId[] = ROOM_ITEMS.map(
  (item) => item.id,
);
