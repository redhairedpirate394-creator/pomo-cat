export type Language = "de" | "en";

export interface Settings {
  readonly learnMinutes: number;
  readonly shortBreakMinutes: number;
  readonly longBreakMinutes: number;
  readonly units: number;
  readonly sound: boolean;
  /** null follows the browser. */
  readonly language: Language | null;
}

/** The timing a run keeps from its start, so changes apply to the next run. */
export interface Plan {
  readonly learnMinutes: number;
  readonly shortBreakMinutes: number;
  readonly longBreakMinutes: number;
  readonly units: number;
}

export const MINUTE_STEP = 5;

export const LIMITS = {
  learnMinutes: { min: 5, max: 60 },
  shortBreakMinutes: { min: 5, max: 30 },
  longBreakMinutes: { min: 5, max: 60 },
  units: { min: 1, max: 8 },
} as const;

export const DEFAULT_SETTINGS: Settings = {
  learnMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  units: 4,
  sound: true,
  language: null,
};

export function isValidMinutes(
  value: number,
  limit: { readonly min: number; readonly max: number },
): boolean {
  return (
    Number.isInteger(value) &&
    value >= limit.min &&
    value <= limit.max &&
    value % MINUTE_STEP === 0
  );
}

export function isValidUnits(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= LIMITS.units.min &&
    value <= LIMITS.units.max
  );
}

export function planFrom(settings: Settings): Plan {
  return {
    learnMinutes: settings.learnMinutes,
    shortBreakMinutes: settings.shortBreakMinutes,
    longBreakMinutes: settings.longBreakMinutes,
    units: settings.units,
  };
}
