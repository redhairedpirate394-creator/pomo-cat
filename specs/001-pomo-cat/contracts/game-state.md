# Contract: persisted game state

- Key: `pomo-cat:game:v1`; demo link: `pomo-cat:demo:v1`. Only these keys are ever
  touched.
- Value: JSON `{ "version": 1, ...GameState }` (see [data-model.md](../data-model.md)).
- Absent key: new game. Invalid JSON, wrong shape or another version:
  `data-invalid`. Storage access failure: `read-failed`. Write failure: `save-failed`.
- Validation is strict at the boundary; ranges match the domain limits. Unknown
  fields are invalid.
- Future format changes are explicit tested migrations, never a silent reset. The
  account feature adds another `GameStore` adapter.

Port:

```ts
interface GameStore {
  load(): Promise<GameState | null>;
  save(state: GameState): Promise<void>;
  reset(): Promise<void>; // only after an explicit confirmation on the error screen
}
```
