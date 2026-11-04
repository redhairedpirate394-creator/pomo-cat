import { useEffect, useRef } from "react";

const TARGETS = "button:not(:disabled)";

/**
 * A button that removes or disables itself drops keyboard focus to the page.
 * `keep` remembers its place; once `changed` differs, the button now at that
 * place takes over, or the last one, or `fallback` when none is left.
 */
export function useKeepFocus<Root extends HTMLElement>(
  changed: unknown,
  fallback: (root: Root | null) => HTMLElement | null | undefined,
) {
  const root = useRef<Root>(null);
  const place = useRef<number | null>(null);
  const fallbackNow = useRef(fallback);
  fallbackNow.current = fallback;

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when `changed` does
  useEffect(() => {
    const index = place.current;
    place.current = null;
    if (index === null) return;
    const active = document.activeElement;
    const kept =
      active instanceof HTMLElement &&
      active !== document.body &&
      !active.matches(":disabled");
    if (kept) return;
    const targets = root.current?.querySelectorAll<HTMLElement>(TARGETS);
    const next = targets?.[index] ?? targets?.[targets.length - 1];
    (next ?? fallbackNow.current(root.current))?.focus();
  }, [changed]);

  function keep(control: HTMLElement) {
    const targets = root.current?.querySelectorAll<HTMLElement>(TARGETS);
    place.current = targets ? [...targets].indexOf(control) : null;
  }

  return { root, keep };
}
