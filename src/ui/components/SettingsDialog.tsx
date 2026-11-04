import {
  type Language,
  LIMITS,
  MINUTE_STEP,
  type Settings,
} from "../../domain/settings";
import { useMessages } from "../i18n";
import { Modal } from "./Modal";

function steps(min: number, max: number, step: number): number[] {
  const values: number[] = [];
  for (let value = min; value <= max; value += step) values.push(value);
  return values;
}

function NumberChoice({
  label,
  value,
  values,
  format,
  onChange,
}: {
  label: string;
  value: number;
  values: readonly number[];
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {values.map((option) => (
          <option key={option} value={option}>
            {format(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SettingsDialog({
  settings,
  language,
  onChange,
  onClose,
}: {
  settings: Settings;
  language: Language;
  onChange: (patch: Partial<Settings>) => void;
  onClose: () => void;
}) {
  const m = useMessages();
  const { learnMinutes, shortBreakMinutes, longBreakMinutes, units } = LIMITS;
  return (
    <Modal title={m.settings} onEscape={onClose}>
      <div className="settings">
        <NumberChoice
          label={m.settingLearn}
          value={settings.learnMinutes}
          values={steps(learnMinutes.min, learnMinutes.max, MINUTE_STEP)}
          format={m.minutes}
          onChange={(value) => onChange({ learnMinutes: value })}
        />
        <NumberChoice
          label={m.settingShortBreak}
          value={settings.shortBreakMinutes}
          values={steps(
            shortBreakMinutes.min,
            shortBreakMinutes.max,
            MINUTE_STEP,
          )}
          format={m.minutes}
          onChange={(value) => onChange({ shortBreakMinutes: value })}
        />
        <NumberChoice
          label={m.settingLongBreak}
          value={settings.longBreakMinutes}
          values={steps(
            longBreakMinutes.min,
            longBreakMinutes.max,
            MINUTE_STEP,
          )}
          format={m.minutes}
          onChange={(value) => onChange({ longBreakMinutes: value })}
        />
        <NumberChoice
          label={m.settingUnits}
          value={settings.units}
          values={steps(units.min, units.max, 1)}
          format={String}
          onChange={(value) => onChange({ units: value })}
        />
        <p className="note">{m.settingsNote}</p>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(event) => onChange({ sound: event.target.checked })}
          />
          {m.settingSound}
        </label>
        <label>
          {m.settingLanguage}
          <select
            value={language}
            onChange={(event) =>
              onChange({ language: event.target.value as Language })
            }
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
      <button type="button" onClick={onClose}>
        {m.close}
      </button>
    </Modal>
  );
}
