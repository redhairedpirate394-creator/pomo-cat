import {
  ROOM_ITEMS,
  type RoomItemId,
  SNACK_PRICE,
  SNACKS,
  type SnackId,
} from "../../domain/catalog";
import { icons, snackImages } from "../assets/manifest";
import { useMessages } from "../i18n";
import { Panel } from "./Panel";

export function ShopPanel({
  coins,
  owned,
  onBuySnack,
  onBuyItem,
}: {
  coins: number;
  owned: readonly RoomItemId[];
  onBuySnack: (snack: SnackId) => void;
  onBuyItem: (item: RoomItemId) => void;
}) {
  const m = useMessages();
  return (
    <Panel label={m.shop} toggle={<img src={icons.shop} alt="" />}>
      <h3>{m.snacksHeading}</h3>
      <ul className="shop-list">
        {SNACKS.map((snack) => (
          <li key={snack}>
            <button
              type="button"
              disabled={coins < SNACK_PRICE}
              onClick={() => onBuySnack(snack)}
            >
              {snackImages[snack] && (
                <img className="snack" src={snackImages[snack]} alt="" />
              )}
              {m.buy(m.snacks[snack], m.coins(SNACK_PRICE))}
            </button>
          </li>
        ))}
      </ul>
      <h3>{m.roomHeading}</h3>
      <ul className="shop-list">
        {ROOM_ITEMS.map(({ id, price }) => (
          <li key={id}>
            {owned.includes(id) ? (
              <p>{m.ownedItem(m.roomItems[id])}</p>
            ) : (
              <button
                type="button"
                disabled={coins < price}
                onClick={() => onBuyItem(id)}
              >
                {m.buy(m.roomItems[id], m.coins(price))}
              </button>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
