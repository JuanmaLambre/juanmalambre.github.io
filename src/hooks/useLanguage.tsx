import { createContext, useContext, useState } from "react";
import { es } from "../i18n/es";
import { en } from "../i18n/en";

export type Lang = "es" | "en";
export type Translations = typeof es;

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({ lang: "es", t: es, toggle: () => {} });

function getInitialLang(): Lang {
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "en" || param === "es") return param;
  return (localStorage.getItem("lang") as Lang) ?? "es";
}

function setLangParam(lang: Lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  history.replaceState(null, "", url);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  const t = lang === "es" ? es : en;

  const toggle = () => {
    const next: Lang = lang === "es" ? "en" : "es";
    setLang(next);
    localStorage.setItem("lang", next);
    setLangParam(next);
  };

  return <LangContext.Provider value={{ lang, t, toggle }}>{children}</LangContext.Provider>;
}

export const useLanguage = () => useContext(LangContext);
