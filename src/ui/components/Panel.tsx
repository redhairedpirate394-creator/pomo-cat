import { type ReactNode, useId, useState } from "react";

/** Closed on every start, so the screen stays calm. */
export function Panel({
  label,
  toggle,
  children,
}: {
  label: string;
  /** A drawn button replaces the text; `label` stays its accessible name. */
  toggle?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="panel">
      <button
        type="button"
        className={toggle ? "panel-toggle drawn" : "panel-toggle"}
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen(!open)}
      >
        {toggle ?? label}
      </button>
      {open && (
        <div id={id} className="panel-body">
          {children}
        </div>
      )}
    </div>
  );
}
