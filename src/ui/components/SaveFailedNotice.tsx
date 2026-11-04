import { useLayoutEffect, useRef } from "react";
import { useMessages } from "../i18n";

/**
 * Goes away once a save works again. If its button had focus, the step's main
 * button takes over; it does so here, while the button is still in the page.
 */
export function SaveFailedNotice({ onRetry }: { onRetry: () => void }) {
  const m = useMessages();
  const retry = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const button = retry.current;
    return () => {
      if (document.activeElement !== button) return;
      button
        ?.closest(".side")
        ?.querySelector<HTMLElement>("[data-next-step]")
        ?.focus();
    };
  }, []);

  return (
    <div className="save-failed">
      <p role="alert">{m.saveFailed}</p>
      <button ref={retry} type="button" onClick={onRetry}>
        {m.retry}
      </button>
    </div>
  );
}
