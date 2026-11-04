import { useState } from "react";
import { useMessages } from "../i18n";
import type { ErrorCode } from "../i18n/messages";
import { Modal } from "./Modal";

/** Nothing is ever deleted from here without a deliberate confirmation. */
export function FailureScreen({
  code,
  onRetry,
  onStartOver,
}: {
  code: ErrorCode;
  onRetry: () => void;
  onStartOver: () => void;
}) {
  const m = useMessages();
  const [confirming, setConfirming] = useState(false);
  return (
    <main className="failure">
      <h1 className="visually-hidden">{m.documentTitle}</h1>
      <p role="alert">{m.errors[code]}</p>
      <div className="choices">
        <button type="button" onClick={onRetry}>
          {m.retry}
        </button>
        {code === "data-invalid" && (
          <button type="button" onClick={() => setConfirming(true)}>
            {m.startOver}
          </button>
        )}
      </div>
      {confirming && (
        <Modal title={m.startOverTitle} onEscape={() => setConfirming(false)}>
          <p>{m.startOverText}</p>
          <div className="choices">
            <button type="button" onClick={() => setConfirming(false)}>
              {m.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                onStartOver();
              }}
            >
              {m.startOverConfirm}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
