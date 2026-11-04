import { type ReactNode, useEffect, useId, useRef } from "react";

/** A native modal dialog: it traps focus and keeps the page behind it inert. */
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

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onEscape?.();
      }}
    >
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  );
}
