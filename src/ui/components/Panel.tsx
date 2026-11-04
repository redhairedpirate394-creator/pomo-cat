import { type ReactNode, type Ref, useId, useState } from "react";

/** Closed on every start, so the screen stays calm. */
export function Panel({
  label,
  bodyRef,
  children,
}: {
  label: string;
  bodyRef?: Ref<HTMLDivElement>;
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
        <div ref={bodyRef} id={id} className="panel-body">
          {children}
        </div>
      )}
    </div>
  );
}
