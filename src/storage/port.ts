import type { GameState } from "../domain/game";

export interface GameStore {
  /** null means there is no saved game yet. */
  load(): Promise<GameState | null>;
  save(state: GameState): Promise<void>;
  reset(): Promise<void>;
}

export type StoreErrorCode =
  | "read-failed"
  | "data-invalid"
  | "save-failed"
  | "reset-failed";

// Adapters report codes, not user-facing text; the UI localizes them.
export class StoreError extends Error {
  readonly code: StoreErrorCode;

  constructor(code: StoreErrorCode) {
    super(code);
    this.name = "StoreError";
    this.code = code;
  }
}
