import { useMessages } from "../i18n";
import { Modal } from "./Modal";

export function HelpDialog({ onClose }: { onClose: () => void }) {
  const m = useMessages();
  return (
    <Modal title={m.helpTitle} onEscape={onClose}>
      <ol className="help">
        {m.helpPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ol>
      <button type="button" onClick={onClose}>
        {m.close}
      </button>
    </Modal>
  );
}
