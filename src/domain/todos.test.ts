import { describe, expect, it } from "vitest";
import { addTodo, deleteTodo, TODO_MAX, toggleTodo } from "./todos";

describe("todos", () => {
  it("adds a trimmed task at the end", () => {
    const todos = addTodo(
      [{ id: "a", text: "Eins", done: true }],
      "  Zwei ",
      "b",
    );
    expect(todos.map((todo) => todo.text)).toEqual(["Eins", "Zwei"]);
    expect(todos[1]).toEqual({ id: "b", text: "Zwei", done: false });
  });

  it("needs a text", () => {
    expect(() => addTodo([], "   ", "a")).toThrow("todo-required");
  });

  it("limits the length after trimming", () => {
    expect(addTodo([], ` ${"a".repeat(TODO_MAX)} `, "a")).toHaveLength(1);
    expect(() => addTodo([], "a".repeat(TODO_MAX + 1), "a")).toThrow(
      "todo-too-long",
    );
  });

  it("ticks and unticks one task", () => {
    const todos = addTodo(addTodo([], "Eins", "a"), "Zwei", "b");
    const ticked = toggleTodo(todos, "b");
    expect(ticked.map((todo) => todo.done)).toEqual([false, true]);
    expect(toggleTodo(ticked, "b")[1]?.done).toBe(false);
  });

  it("deletes one task", () => {
    const todos = addTodo(addTodo([], "Eins", "a"), "Zwei", "b");
    expect(deleteTodo(todos, "a").map((todo) => todo.id)).toEqual(["b"]);
  });
});
