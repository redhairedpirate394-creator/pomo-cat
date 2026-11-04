import type { Mood } from "../../domain/cat";
import { catImages } from "../assets/manifest";
import { useMessages } from "../i18n";

export type CatPose = "sleeping" | "eating" | Mood;

export function CatStage({ name, pose }: { name: string; pose: CatPose }) {
  const m = useMessages();
  const alt =
    pose === "sleeping"
      ? m.catAsleep(name)
      : pose === "eating"
        ? m.catEating(name)
        : m.catMood(name, pose);
  return (
    <div className="stage">
      <img src={catImages[pose]} alt={alt} width={600} height={400} />
    </div>
  );
}
