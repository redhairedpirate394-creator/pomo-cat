import {
  ROOM_ITEMS,
  type RoomItemId,
  SNACK_PRICE,
  SNACKS,
  type SnackId,
} from "../../domain/catalog";
import { snackImages } from "../assets/manifest";
import { useMessages } from "../i18n";
import { Panel } from "./Panel";
import { useKeepFocus } from "./useKeepFocus";

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
  // With nothing left to buy, the panel's own button is the nearest place.
  const body = useKeepFocus<HTMLDivElement>(coins, (root) =>
    root?.parentElement?.querySelector("button"),
  );
  return (
    <Panel label={m.shop} bodyRef={body.root}>
      <h2>{m.snacksHeading}</h2>
      <ul className="shop-list">
        {SNACKS.map((snack) => (
          <li key={snack}>
            <button
              type="button"
              disabled={coins < SNACK_PRICE}
              onClick={(event) => {
                body.keep(event.currentTarget);
                onBuySnack(snack);
              }}
            >
              {snackImages[snack] && (
                <img className="snack" src={snackImages[snack]} alt="" />
              )}
              {m.buy(m.snacks[snack], m.coins(SNACK_PRICE))}
            </button>
          </li>
        ))}
      </ul>
      <h2>{m.roomHeading}</h2>
      <ul className="shop-list">
        {ROOM_ITEMS.map(({ id, price }) => (
          <li key={id}>
            {owned.includes(id) ? (
              <p>{m.ownedItem(m.roomItems[id])}</p>
            ) : (
              <button
                type="button"
                disabled={coins < price}
                onClick={(event) => {
                  body.keep(event.currentTarget);
                  onBuyItem(id);
                }}
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
