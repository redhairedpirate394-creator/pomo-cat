import { useState } from "react";
import { monthDays, type StudyLog, streak } from "../../domain/studyLog";
import { GLYPHS, useMessages } from "../i18n";
import { Panel } from "./Panel";

const MONDAY_WEEK = [1, 2, 3, 4, 5, 6, 7].map((day) => new Date(2024, 0, day));

export function CalendarPanel({ log, now }: { log: StudyLog; now: number }) {
  const m = useMessages();
  const [offset, setOffset] = useState(0);
  const today = new Date(now);
  const shown = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const year = shown.getFullYear();
  const month = shown.getMonth();
  const days = monthDays(log, year, month);
  const firstColumn = ((shown.getDay() + 6) % 7) + 1;
  const dayFormat = new Intl.DateTimeFormat(m.intlLocale, {
    day: "numeric",
    month: "long",
  });
  const running = streak(log, now);
  const weekday = new Intl.DateTimeFormat(m.intlLocale, { weekday: "narrow" });

  return (
    <Panel label={m.calendar}>
      <div className="month">
        <button
          type="button"
          aria-label={m.previousMonth}
          onClick={() => setOffset(offset - 1)}
        >
          {GLYPHS.previous}
        </button>
        <h2>
          {new Intl.DateTimeFormat(m.intlLocale, {
            month: "long",
            year: "numeric",
          }).format(shown)}
        </h2>
        <button
          type="button"
          aria-label={m.nextMonth}
          disabled={offset >= 0}
          onClick={() => setOffset(offset + 1)}
        >
          {GLYPHS.next}
        </button>
      </div>
      <ol className="calendar weekdays" aria-hidden="true">
        {MONDAY_WEEK.map((date) => (
          <li key={date.getDate()}>{weekday.format(date)}</li>
        ))}
      </ol>
      <ol className="calendar">
        {days.map(({ day, minutes }) => {
          const date = dayFormat.format(new Date(year, month, day));
          return (
            <li
              key={day}
              className={minutes > 0 ? "learned" : undefined}
              style={day === 1 ? { gridColumnStart: firstColumn } : undefined}
              aria-label={m.dayMinutes(date, minutes)}
            >
              <span>{day}</span>
              {minutes > 0 && <small>{minutes}</small>}
            </li>
          );
        })}
      </ol>
      {running > 0 && <p className="note">{m.streak(running)}</p>}
    </Panel>
  );
}
