import { useEffect } from "react";
import { remainingMs } from "../domain/game";
import type { GameStore } from "../storage/port";
import type { Clock } from "./clock";
import { FailureScreen } from "./components/FailureScreen";
import { GameScreen } from "./components/GameScreen";
import { formatClock } from "./format";
import { catalogs, type Locale, MessagesProvider, useMessages } from "./i18n";
import type { PlaySound } from "./sounds";
import { useGame } from "./useGame";

function Loading() {
  const m = useMessages();
  return <p className="failure">{m.loading}</p>;
}

export function App({
  store,
  clock,
  play,
  browserLocale,
  demo,
}: {
  store: GameStore;
  clock: Clock;
  play: PlaySound;
  browserLocale: Locale;
  demo: boolean;
}) {
  const { load, now, saveFailed, act, retrySave, retryLoad, startOver } =
    useGame(store, clock, play);
  const state = load.status === "ready" ? load.state : null;
  const locale = state?.settings.language ?? browserLocale;

  const title = catalogs[locale].documentTitle;
  const left = state ? remainingMs(state.phase, now) : null;
  const documentTitle =
    left === null ? title : `${formatClock(left)} · ${title}`;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  return (
    <MessagesProvider locale={locale}>
      {load.status === "loading" && <Loading />}
      {load.status === "failed" && (
        <FailureScreen
          code={load.code}
          onRetry={() => void retryLoad()}
          onStartOver={() => void startOver()}
        />
      )}
      {state && (
        <GameScreen
          state={state}
          now={now}
          act={act}
          demo={demo}
          saveFailed={saveFailed}
          onRetrySave={retrySave}
        />
      )}
    </MessagesProvider>
  );
}
