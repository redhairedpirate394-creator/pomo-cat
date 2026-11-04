import { formatClock } from "../format";
import { useMessages } from "../i18n";

/** Each digit gets its own cell, because handwritten digits differ in width. */
export function Timer({ ms, caption }: { ms: number; caption: string }) {
  const m = useMessages();
  const text = formatClock(ms);
  return (
    <div className="timer">
      <div
        className="timer-digits"
        role="timer"
        aria-label={m.timerLabel(text)}
      >
        {[...text].map((char, index) => (
          <span
            // The position is the identity of each cell.
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed layout
            key={index}
            className={char === ":" ? "colon" : "digit"}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </div>
      <p className="timer-caption" aria-live="polite">
        {caption}
      </p>
    </div>
  );
}
