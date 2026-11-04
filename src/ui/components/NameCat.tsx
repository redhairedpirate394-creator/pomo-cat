import { type FormEvent, useState } from "react";
import { NAME_MAX } from "../../domain/cat";
import { useMessages } from "../i18n";
import type { ErrorCode } from "../i18n/messages";
import { Modal } from "./Modal";

export function NameCat({
  onName,
}: {
  onName: (name: string) => ErrorCode | null;
}) {
  const m = useMessages();
  const [name, setName] = useState("");
  const [error, setError] = useState<ErrorCode | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    setError(onName(name));
  }

  return (
    <Modal title={m.nameTitle}>
      <form onSubmit={submit}>
        <label>
          {m.nameLabel}
          <input
            value={name}
            maxLength={NAME_MAX}
            autoComplete="off"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        {error && (
          <p className="error" role="alert">
            {m.errors[error]}
          </p>
        )}
        <button type="submit">{m.nameSubmit}</button>
      </form>
    </Modal>
  );
}
