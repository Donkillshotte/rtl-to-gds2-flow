"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Locale = "it" | "en";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: <T extends Localized>(obj: T) => LocalizedValue<T>;
}

export type Localized<T = string> = { it: T; en: T };
export type LocalizedValue<T> = T extends string[] ? string[] : string;

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("it");

  useEffect(() => {
    const saved = localStorage.getItem("pd-locale") as Locale | null;
    if (saved === "it" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("pd-locale", l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    <T extends Localized>(obj: T): LocalizedValue<T> => {
      return obj[locale] as LocalizedValue<T>;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function loc<T = string>(it: T, en: T): Localized<T> {
  return { it, en };
}
