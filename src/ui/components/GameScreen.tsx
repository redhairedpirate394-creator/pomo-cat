import { useEffect, useState } from "react";
import { currentMood } from "../../domain/cat";
import type { FoodId } from "../../domain/catalog";
import {
  feed,
  type GameState,
  hold,
  nameCat,
  remainingMs,
  start,
  stop,
} from "../../domain/game";
import { formatClock } from "../format";
import { useMessages } from "../i18n";
import type { ErrorCode } from "../i18n/messages";
import { type CatPose, CatStage } from "./CatStage";
import { FeedDialog } from "./FeedDialog";
import { NameCat } from "./NameCat";
import { StopDialog } from "./StopDialog";
import { Timer } from "./Timer";

const EATING_MS = 3000;

type Act = (
  event: (current: GameState, time: number) => GameState,
) => ErrorCode | null;

export function GameScreen({
  state,
  now,
  act,
  demo,
  saveFailed,
  onRetrySave,
}: {
  state: GameState;
  now: number;
  act: Act;
  demo: boolean;
  saveFailed: boolean;
  onRetrySave: () => void;
}) {
  const m = useMessages();
  const [confirmStop, setConfirmStop] = useState(false);
  const [eating, setEating] = useState(false);
  const [note, setNote] = useState("");
  const { cat, phase, settings } = state;

  useEffect(() => {
    if (!eating) return;
    const timer = setTimeout(() => setEating(false), EATING_MS);
    return () => clearTimeout(timer);
  }, [eating]);

  const learning = phase.kind === "learning";

  // The stop question makes no sense once the unit has ended on its own.
  useEffect(() => {
    if (!learning) setConfirmStop(false);
  }, [learning]);

  // A note about the last meal should not linger into the next unit.
  useEffect(() => {
    if (learning) setNote("");
  }, [learning]);

  if (cat === null) {
    return (
      <main className="game">
        <NameCat onName={(name) => act((s, t) => nameCat(s, name, t))} />
      </main>
    );
  }

  function onFeed(food: FoodId) {
    if (cat === null || phase.kind !== "break") return;
    setNote(m.fedNote(cat.name, phase.coinsEarned));
    setEating(true);
    act((s) => feed(s, food));
  }

  const left = remainingMs(phase, now);
  const pose: CatPose = learning
    ? "sleeping"
    : eating
      ? "eating"
      : currentMood(cat, now);

  let caption = "";
  let shownMs = settings.learnMinutes * 60_000;
  if (phase.kind === "learning") {
    caption = m.unitOf(phase.unit, phase.plan.units);
    shownMs = left ?? 0;
  } else if (phase.kind === "break") {
    caption = phase.length === "long" ? m.breakLong : m.breakShort;
    shownMs = left ?? 0;
  } else if (phase.kind === "held") {
    caption = m.unitOf(phase.nextUnit, phase.plan.units);
    shownMs = phase.plan.learnMinutes * 60_000;
  }

  const warning = phase.kind === "break" && phase.warned && phase.fed;

  return (
    <main className="game">
      <section className="center">
        <Timer ms={shownMs} caption={caption} />
        <CatStage name={cat.name} pose={pose} />
      </section>

      <aside className="side">
        {!learning && <p className="coins">{m.coins(state.coins)}</p>}
        <p className="status" role="status">
          {warning ? m.warning : note}
        </p>
        {warning && (
          <button type="button" onClick={() => act(hold)}>
            {m.warningStop}
          </button>
        )}
        {phase.kind === "idle" && (
          <button type="button" onClick={() => act(start)}>
            {m.start}
          </button>
        )}
        {phase.kind === "held" && (
          <button type="button" onClick={() => act(start)}>
            {m.continueUnit(phase.nextUnit, phase.plan.units)}
          </button>
        )}
        {learning && (
          <button type="button" onClick={() => setConfirmStop(true)}>
            {m.stop}
          </button>
        )}
        {saveFailed && (
          <div className="save-failed">
            <p role="alert">{m.saveFailed}</p>
            <button type="button" onClick={onRetrySave}>
              {m.retry}
            </button>
          </div>
        )}
        {demo && <p className="note">{m.demoNote}</p>}
      </aside>

      {phase.kind === "break" && !phase.fed && (
        <FeedDialog
          name={cat.name}
          timeLeft={formatClock(left ?? 0)}
          warned={phase.warned}
          onFeed={onFeed}
        />
      )}
      {confirmStop && learning && (
        <StopDialog
          onKeep={() => setConfirmStop(false)}
          onConfirm={() => {
            setConfirmStop(false);
            act(stop);
          }}
        />
      )}
    </main>
  );
}
