import { type ReactNode, useId, useState } from "react";

/** Closed on every start, so the screen stays calm. */
export function Panel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="panel">
      <button
        type="button"
        className="panel-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {label}
      </button>
      {open && (
        <div id={id} className="panel-body">
          {children}
        </div>
      )}
    </div>
  );
}
