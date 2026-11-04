import { createContext, type ReactNode, useContext } from "react";
import { CatError } from "../../domain/cat";
import { TodoError } from "../../domain/todos";
import { StoreError } from "../../storage/port";
import { de } from "./de";
import { en } from "./en";
import type { ErrorCode, Messages } from "./messages";

export { GLYPHS, LANGUAGE_NAMES, type Messages } from "./messages";

// Add a locale by adding its catalog here; the spec language is the default.
export const catalogs = { de, en } satisfies Record<string, Messages>;
export type Locale = keyof typeof catalogs;
export const defaultLocale: Locale = "de";

/** The first browser language the app knows; German otherwise. */
export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const base = language.toLowerCase().split("-")[0];
    if (base === "de" || base === "en") return base;
  }
  return defaultLocale;
}

const MessagesContext = createContext<Messages>(catalogs[defaultLocale]);

export function MessagesProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <MessagesContext.Provider value={catalogs[locale]}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages(): Messages {
  return useContext(MessagesContext);
}

export function errorCode(cause: unknown): ErrorCode {
  return cause instanceof CatError ||
    cause instanceof TodoError ||
    cause instanceof StoreError
    ? cause.code
    : "unexpected";
}
