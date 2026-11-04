import { useEffect, useState } from "react";
import { currentMood } from "../../domain/cat";
import type { FoodId, RoomItemId, SnackId } from "../../domain/catalog";
import {
  buyRoomItem,
  buySnack,
  feed,
  type GameState,
  hold,
  learnNow,
  nameCat,
  remainingMs,
  start,
  stop,
  updateSettings,
} from "../../domain/game";
import type { Language, Settings } from "../../domain/settings";
import { addTodo, deleteTodo, toggleTodo } from "../../domain/todos";
import { icons } from "../assets/manifest";
import { formatClock } from "../format";
import { useMessages } from "../i18n";
import type { ErrorCode } from "../i18n/messages";
import { BreakControls } from "./BreakControls";
import { CalendarPanel } from "./CalendarPanel";
import { type CatPose, CatStage } from "./CatStage";
import { FeedDialog } from "./FeedDialog";
import { NameCat } from "./NameCat";
import { SettingsDialog } from "./SettingsDialog";
import { ShopPanel } from "./ShopPanel";
import { StopDialog } from "./StopDialog";
import { Timer } from "./Timer";
import { TodoPanel } from "./TodoPanel";

const REACTION_MS = 3000;

type Act = (
  event: (current: GameState, time: number) => GameState,
) => ErrorCode | null;

/** A short reaction of the cat; it never changes the game. */
type Reaction = "eating" | "petted" | null;

export function GameScreen({
  state,
  now,
  act,
  demo,
  language,
  saveFailed,
  onRetrySave,
}: {
  state: GameState;
  now: number;
  act: Act;
  demo: boolean;
  language: Language;
  saveFailed: boolean;
  onRetrySave: () => void;
}) {
  const m = useMessages();
  const [confirmStop, setConfirmStop] = useState(false);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [note, setNote] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const { cat, phase, settings } = state;

  useEffect(() => {
    if (reaction === null) return;
    const timer = setTimeout(() => setReaction(null), REACTION_MS);
    return () => clearTimeout(timer);
  }, [reaction]);

  const learning = phase.kind === "learning";

  // The stop question makes no sense once the unit has ended on its own.
  useEffect(() => {
    if (!learning) setConfirmStop(false);
  }, [learning]);

  // A note belongs to the phase it was made in.
  useEffect(() => {
    if (phase.kind !== "break") setNote("");
  }, [phase.kind]);

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
    setReaction("eating");
    act((s) => feed(s, food));
  }

  function onBuySnack(snack: SnackId) {
    if (cat === null) return;
    setNote(m.snackNote(cat.name, m.snacks[snack]));
    setReaction("petted");
    act(buySnack);
  }

  function onPlay(item: RoomItemId) {
    if (cat === null) return;
    setNote(m.playNote(cat.name, m.roomItems[item]));
    setReaction("petted");
  }

  function onSettings(patch: Partial<Settings>) {
    act((s) => updateSettings(s, patch));
  }

  const left = remainingMs(phase, now);
  const pose: CatPose = learning
    ? "sleeping"
    : (reaction ?? currentMood(cat, now));

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

  const fedBreak = phase.kind === "break" && phase.fed;
  const warning = fedBreak && phase.warned;
  // The cat hands the coins over at the meal, so they appear only then.
  const shownCoins =
    phase.kind === "break" && !phase.fed
      ? state.coins - phase.coinsEarned
      : state.coins;

  return (
    <main className="game">
      <section className="center">
        <Timer ms={shownMs} caption={caption} />
        <CatStage
          name={cat.name}
          pose={pose}
          owned={state.owned}
          {...(learning ? {} : { onPet: () => setReaction("petted"), onPlay })}
        />
      </section>

      <aside className="side">
        {!learning && (
          <p className="coins">
            <img src={icons.coin} alt="" />
            {m.coins(shownCoins)}
          </p>
        )}
        <p className="status" role="status">
          {warning ? m.warning : phase.kind === "held" ? m.heldNote : note}
        </p>
        <TodoPanel
          todos={state.todos}
          onAdd={(text) =>
            act((s) => ({
              ...s,
              todos: addTodo(s.todos, text, crypto.randomUUID()),
            }))
          }
          onToggle={(id) =>
            act((s) => ({ ...s, todos: toggleTodo(s.todos, id) }))
          }
          onDelete={(id) =>
            act((s) => ({ ...s, todos: deleteTodo(s.todos, id) }))
          }
        />
        {fedBreak && (
          <BreakControls
            canHold={phase.length === "short"}
            warning={warning}
            onHold={() => act(hold)}
            onLearnNow={() => act(learnNow)}
          />
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
        <div className="actions">
          {learning && (
            <button type="button" onClick={() => setConfirmStop(true)}>
              {m.stop}
            </button>
          )}
          <button
            type="button"
            className="gear"
            aria-label={m.settings}
            onClick={() => setShowSettings(true)}
          >
            <img src={icons.gear} alt="" />
          </button>
        </div>
        {!learning && (
          <ShopPanel
            coins={state.coins}
            owned={state.owned}
            onBuySnack={onBuySnack}
            onBuyItem={(item) => act((s) => buyRoomItem(s, item))}
          />
        )}
        {!learning && <CalendarPanel log={state.studyLog} now={now} />}
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
      {showSettings && (
        <SettingsDialog
          settings={settings}
          language={language}
          onChange={onSettings}
          onClose={() => setShowSettings(false)}
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
