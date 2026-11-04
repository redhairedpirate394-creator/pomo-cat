import { type FormEvent, useState } from "react";
import { TODO_MAX, type Todo } from "../../domain/todos";
import { useMessages } from "../i18n";
import type { ErrorCode } from "../i18n/messages";
import { Panel } from "./Panel";

export function TodoPanel({
  todos,
  onAdd,
  onToggle,
  onDelete,
}: {
  todos: readonly Todo[];
  onAdd: (text: string) => ErrorCode | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const m = useMessages();
  const [text, setText] = useState("");
  const [error, setError] = useState<ErrorCode | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const failure = onAdd(text);
    setError(failure);
    if (failure === null) setText("");
  }

  return (
    <Panel label={m.todos}>
      <form className="todo-form" onSubmit={submit}>
        <label>
          {m.todoLabel}
          <input
            value={text}
            maxLength={TODO_MAX}
            autoComplete="off"
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <button type="submit">{m.todoAdd}</button>
      </form>
      {error && (
        <p className="error" role="alert">
          {m.errors[error]}
        </p>
      )}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label className={todo.done ? "done" : undefined}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggle(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button
              type="button"
              aria-label={m.todoDelete(todo.text)}
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
