import type { Mood } from "../../domain/cat";
import { ROOM_ITEMS, type RoomItemId } from "../../domain/catalog";
import { catImages, roomImages } from "../assets/manifest";
import { useMessages } from "../i18n";

export type CatPose = "sleeping" | "eating" | "petted" | Mood;

export function CatStage({
  name,
  pose,
  owned,
  onPet,
  onPlay,
}: {
  name: string;
  pose: CatPose;
  owned: readonly RoomItemId[];
  /** Left out while the cat must not be disturbed. */
  onPet?: () => void;
  onPlay?: (item: RoomItemId) => void;
}) {
  const m = useMessages();
  const alt = {
    sleeping: m.catAsleep(name),
    eating: m.catEating(name),
    petted: m.catPetted(name),
    happy: m.catMood(name, "happy"),
    normal: m.catMood(name, "normal"),
    sad: m.catMood(name, "sad"),
  }[pose];
  const cat = <img src={catImages[pose]} alt={alt} />;
  const lying = pose === "sleeping" || pose === "eating";
  const place = [
    "cat",
    owned.includes("pillow") && "on-pillow",
    lying && "lying",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="stage">
      {ROOM_ITEMS.filter((item) => owned.includes(item.id)).map((item) =>
        item.playable && onPlay ? (
          <button
            key={item.id}
            type="button"
            className={`room-item item-${item.id}`}
            aria-label={m.playWith(m.roomItems[item.id])}
            onClick={() => onPlay(item.id)}
          >
            <img src={roomImages[item.id]} alt="" />
          </button>
        ) : (
          <img
            key={item.id}
            className={`room-item item-${item.id}`}
            src={roomImages[item.id]}
            alt={m.roomItems[item.id]}
          />
        ),
      )}
      {onPet ? (
        <button
          type="button"
          className={place}
          aria-label={m.petCat(name)}
          onClick={onPet}
        >
          {cat}
        </button>
      ) : (
        <div className={place}>{cat}</div>
      )}
    </div>
  );
}
