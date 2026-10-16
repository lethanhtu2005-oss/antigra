"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const A11yContext = createContext(null);
export function useA11y() { const ctx = useContext(A11yContext); if (!ctx) throw new Error("useA11y phải nằm trong A11yProvider"); return ctx; }

export default function A11yProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [contrast, setContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [speechRate, setSpeechRateState] = useState(1);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("we-theme") || (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setThemeState(savedTheme);
      setContrast(localStorage.getItem("dl-contrast") === "1");
      setLargeText(localStorage.getItem("dl-textsize") === "large");
      setReduceMotion(localStorage.getItem("dl-motion") === "reduce");
      const savedRate = Number(localStorage.getItem("we-speech-rate"));
      if (savedRate >= 0.6 && savedRate <= 1.6) setSpeechRateState(savedRate);
    } catch (_) {}
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    if (theme === "dark") {
      el.setAttribute("data-theme", "dark");
      el.classList.add("dark");
    } else {
      el.removeAttribute("data-theme");
      el.classList.remove("dark");
    }
    try { localStorage.setItem("we-theme", theme); } catch (_) {}
  }, [theme]);

  useEffect(() => { const el = document.documentElement; reduceMotion ? el.setAttribute("data-reduce", "reduce") : el.removeAttribute("data-reduce"); try { localStorage.setItem("dl-motion", reduceMotion ? "reduce" : "no"); } catch (_) {} }, [reduceMotion]);
  useEffect(() => { const el = document.documentElement; contrast ? el.setAttribute("data-contrast", "high") : el.removeAttribute("data-contrast"); try { localStorage.setItem("dl-contrast", contrast ? "1" : "0"); } catch (_) {} }, [contrast]);
  useEffect(() => { const el = document.documentElement; largeText ? el.setAttribute("data-textsize", "large") : el.removeAttribute("data-textsize"); try { localStorage.setItem("dl-textsize", largeText ? "large" : "normal"); } catch (_) {} }, [largeText]);

  const setSpeechRate = useCallback((rate) => { const safe = Math.max(0.6, Math.min(1.6, Number(rate) || 1)); setSpeechRateState(safe); try { localStorage.setItem("we-speech-rate", String(safe)); } catch (_) {} }, []);

  const speak = useCallback((text) => {
    if (!text) return;
    setAnnouncement("");
    window.requestAnimationFrame(() => setAnnouncement(text));
    try {
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "vi-VN";
        u.rate = speechRate;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    } catch (_) {}
  }, [speechRate]);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value = {
    theme, contrast, largeText, reduceMotion, speechRate,
    toggleTheme,
    setTheme: (newTheme) => setThemeState(newTheme === "dark" ? "dark" : "light"),
    toggleContrast: () => setContrast((v) => !v),
    toggleLargeText: () => setLargeText((v) => !v),
    setContrastEnabled: (enabled) => setContrast(Boolean(enabled)),
    setLargeTextEnabled: (enabled) => setLargeText(Boolean(enabled)),
    toggleReduceMotion: () => setReduceMotion((v) => !v),
    setSpeechRate, speak,
    stop: () => { try { window.speechSynthesis?.cancel(); } catch (_) {} },
  };

  return <A11yContext.Provider value={value}>{children}<div aria-live="assertive" role="status" className="sr-only">{announcement}</div></A11yContext.Provider>;
}
