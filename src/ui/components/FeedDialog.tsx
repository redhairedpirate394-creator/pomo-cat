import { FOODS, type FoodId } from "../../domain/catalog";
import { foodImages } from "../assets/manifest";
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
    <Modal title={m.feedTitle} focusDialog>
      <p>{m.feedQuestion(name)}</p>
      <div className="foods">
        {FOODS.map((food) => (
          <button key={food} type="button" onClick={() => onFeed(food)}>
            <span className="bowl">
              <img src={foodImages.bowl} alt="" />
              <img className="on-bowl" src={foodImages[food]} alt="" />
            </span>
            {m.foods[food]}
          </button>
        ))}
      </div>
      <p className="note">{m.feedTimeLeft(timeLeft)}</p>
      {warned && (
        <p className="note" role="alert">
          {m.feedStopNote}
        </p>
      )}
    </Modal>
  );
}
