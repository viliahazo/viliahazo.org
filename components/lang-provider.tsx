"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary, Lang } from "@/lib/i18n";

type LangContextValue = { lang: Lang; t: Dictionary };

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({
  lang,
  t,
  children,
}: LangContextValue & { children: ReactNode }) {
  return <LangContext.Provider value={{ lang, t }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang must be used inside <LangProvider>");
  return value;
}
