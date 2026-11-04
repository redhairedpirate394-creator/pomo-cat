import { type ReactNode, useEffect, useId, useRef } from "react";

/**
 * A native modal dialog: it traps focus and keeps the page behind it inert.
 * Escape only asks: `onEscape` decides, and without it the dialog stays. A
 * browser closes a dialog on repeated Escape even when `cancel` is vetoed, so
 * the `close` event is handled too, or the dialog would vanish for good while
 * React still shows it as open.
 */
export function Modal({
  title,
  onEscape,
  children,
}: {
  title: string;
  onEscape?: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const handleEscape = useRef(onEscape);
  handleEscape.current = onEscape;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    const onClose = () => {
      if (handleEscape.current) handleEscape.current();
      else element.showModal();
    };
    element.addEventListener("close", onClose);
    return () => {
      element.removeEventListener("close", onClose);
      element.close();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        handleEscape.current?.();
      }}
    >
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  );
}
