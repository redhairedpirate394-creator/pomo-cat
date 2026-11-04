import { useMessages } from "../i18n";

/** Only after feeding; the warning's stop replaces the plain hold button. */
export function BreakControls({
  canHold,
  warning,
  onHold,
  onLearnNow,
}: {
  canHold: boolean;
  warning: boolean;
  onHold: () => void;
  onLearnNow: () => void;
}) {
  const m = useMessages();
  return (
    <>
      {canHold && (
        <button type="button" data-next-step onClick={onHold}>
          {warning ? m.warningStop : m.hold}
        </button>
      )}
      <button
        type="button"
        data-next-step={canHold ? undefined : true}
        onClick={onLearnNow}
      >
        {m.learnNow}
      </button>
    </>
  );
}
