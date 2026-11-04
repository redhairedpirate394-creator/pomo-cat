export interface Todo {
  readonly id: string;
  readonly text: string;
  readonly done: boolean;
}

export const TODO_MAX = 120;

export type TodoErrorCode = "todo-required" | "todo-too-long";

export class TodoError extends Error {
  readonly code: TodoErrorCode;

  constructor(code: TodoErrorCode) {
    super(code);
    this.name = "TodoError";
    this.code = code;
  }
}

export function addTodo(
  todos: readonly Todo[],
  text: string,
  id: string,
): readonly Todo[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) throw new TodoError("todo-required");
  if (trimmed.length > TODO_MAX) throw new TodoError("todo-too-long");
  return [...todos, { id, text: trimmed, done: false }];
}

export function toggleTodo(
  todos: readonly Todo[],
  id: string,
): readonly Todo[] {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo,
  );
}

export function deleteTodo(
  todos: readonly Todo[],
  id: string,
): readonly Todo[] {
  return todos.filter((todo) => todo.id !== id);
}
