import { FOODS, type FoodId } from "../../domain/catalog";
import { useMessages } from "../i18n";
import { Modal } from "./Modal";

export function FeedDialog({
  name,
  timeLeft,
  warned,
  onFeed,
}: {
  name: string;
  timeLeft: string;
  warned: boolean;
  onFeed: (food: FoodId) => void;
}) {
  const m = useMessages();
  return (
    <Modal title={m.feedTitle}>
      <p>{m.feedQuestion(name)}</p>
      <div className="choices">
        {FOODS.map((food) => (
          <button key={food} type="button" onClick={() => onFeed(food)}>
            {m.foods[food]}
          </button>
        ))}
      </div>
      <p className="note">{m.feedTimeLeft(timeLeft)}</p>
      {warned && <p className="note">{m.feedStopNote}</p>}
    </Modal>
  );
}
