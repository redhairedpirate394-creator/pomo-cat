import { useEffect, useRef, useState } from "react";
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

/** What just happened; the text comes from the current language. */
type Note =
  | { readonly kind: "fed"; readonly coins: number }
  | { readonly kind: "snack"; readonly snack: SnackId }
  | { readonly kind: "item"; readonly item: RoomItemId }
  | { readonly kind: "play"; readonly item: RoomItemId };

const NOTE_MS = 8000;

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
  const [note, setNote] = useState<Note | null>(null);
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

  // A note belongs to the phase it was made in, and it does not stay for long.
  useEffect(() => {
    if (phase.kind) setNote(null);
  }, [phase.kind]);

  useEffect(() => {
    if (note === null) return;
    const timer = setTimeout(() => setNote(null), NOTE_MS);
    return () => clearTimeout(timer);
  }, [note]);

  const feedOpen = phase.kind === "break" && !phase.fed;

  // The feed window comes first; settings can wait.
  useEffect(() => {
    if (feedOpen) setShowSettings(false);
  }, [feedOpen]);

  // A new step removes the button that led to it, so focus would fall to the
  // page; it goes to the step's main button instead. Focus elsewhere stays.
  const side = useRef<HTMLElement>(null);
  const step = `${cat !== null}:${phase.kind}:${feedOpen}`;
  const lastStep = useRef(step);

  useEffect(() => {
    if (lastStep.current === step) return;
    lastStep.current = step;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    side.current?.querySelector<HTMLElement>("[data-next-step]")?.focus();
  }, [step]);

  if (cat === null) {
    return (
      <main className="game">
        <NameCat onName={(name) => act((s, t) => nameCat(s, name, t))} />
      </main>
    );
  }

  function onFeed(food: FoodId) {
    if (cat === null || phase.kind !== "break") return;
    const coins = phase.coinsEarned;
    act((s) => feed(s, food));
    setNote({ kind: "fed", coins });
    setReaction("eating");
  }

  function onBuySnack(snack: SnackId) {
    let bought = false as boolean;
    act((s, t) => {
      const next = buySnack(s, t);
      bought = next !== s;
      return next;
    });
    if (!bought) return;
    setNote({ kind: "snack", snack });
    setReaction("petted");
  }

  function onBuyItem(item: RoomItemId) {
    let bought = false as boolean;
    act((s) => {
      const next = buyRoomItem(s, item);
      bought = next !== s;
      return next;
    });
    if (bought) setNote({ kind: "item", item });
  }

  function onPlay(item: RoomItemId) {
    setNote({ kind: "play", item });
    setReaction("petted");
  }

  function noteText(current: Note, name: string): string {
    switch (current.kind) {
      case "fed":
        return m.fedNote(name, current.coins);
      case "snack":
        return m.snackNote(name, m.snacks[current.snack]);
      case "item":
        return m.itemNote(m.roomItems[current.item]);
      case "play":
        return m.playNote(name, m.roomItems[current.item]);
    }
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
      <h1 className="visually-hidden">{m.documentTitle}</h1>
      <section className="center">
        <Timer ms={shownMs} caption={caption} />
        <CatStage
          name={cat.name}
          pose={pose}
          owned={state.owned}
          {...(learning ? {} : { onPet: () => setReaction("petted"), onPlay })}
        />
      </section>

      <aside ref={side} className="side">
        {!learning && (
          <p className="coins">
            <img src={icons.coin} alt="" />
            {m.coins(shownCoins)}
          </p>
        )}
        <p className="status" role="status">
          {warning
            ? m.warning
            : note
              ? noteText(note, cat.name)
              : phase.kind === "held"
                ? m.heldNote
                : ""}
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
          <button type="button" data-next-step onClick={() => act(start)}>
            {m.start}
          </button>
        )}
        {phase.kind === "held" && (
          <button type="button" data-next-step onClick={() => act(start)}>
            {m.continueUnit(phase.nextUnit, phase.plan.units)}
          </button>
        )}
        <div className="actions">
          {learning && (
            <button
              type="button"
              data-next-step
              onClick={() => setConfirmStop(true)}
            >
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
            onBuyItem={onBuyItem}
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
