import { useMessages } from "../i18n";
import { Modal } from "./Modal";

export function StopDialog({
  onConfirm,
  onKeep,
}: {
  onConfirm: () => void;
  onKeep: () => void;
}) {
  const m = useMessages();
  return (
    <Modal title={m.stopTitle} onEscape={onKeep}>
      <p>{m.stopText}</p>
      <div className="choices">
        <button type="button" onClick={onKeep}>
          {m.stopKeep}
        </button>
        <button type="button" onClick={onConfirm}>
          {m.stopConfirm}
        </button>
      </div>
    </Modal>
  );
}
