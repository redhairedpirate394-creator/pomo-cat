import { type ReactNode, useId, useLayoutEffect, useRef } from "react";

/**
 * A native modal dialog: it traps focus and keeps the page behind it inert.
 * Escape only asks: `onEscape` decides, and without it the dialog stays. A
 * browser closes a dialog on repeated Escape even when `cancel` is vetoed, so
 * the `close` event is handled too, or the dialog would vanish for good while
 * React still shows it as open. It closes in a layout effect, while it is still
 * in the page: only then does the browser return focus to where it came from.
 */
export function Modal({
  title,
  onEscape,
  focusDialog = false,
  children,
}: {
  title: string;
  onEscape?: () => void;
  /** The window takes focus, not its first button: a key pressed by chance must not choose. */
  focusDialog?: boolean;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const handleEscape = useRef(onEscape);
  handleEscape.current = onEscape;

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    if (focusDialog) element.focus();
    const onClose = () => {
      // React's development double start closes and reopens the dialog; that
      // delayed event finds it open again, and it was no escape.
      if (element.open) return;
      if (handleEscape.current) {
        handleEscape.current();
        return;
      }
      element.showModal();
      if (focusDialog) element.focus();
    };
    element.addEventListener("close", onClose);
    return () => {
      element.removeEventListener("close", onClose);
      element.close();
    };
  }, [focusDialog]);

  return (
    <dialog
      ref={dialog}
      className="modal"
      tabIndex={-1}
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
