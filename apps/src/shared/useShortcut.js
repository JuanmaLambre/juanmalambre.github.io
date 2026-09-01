import { useEffect, useRef } from "react";

function shouldIgnore(event) {
  if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return true;
  const target = event.target;
  if (target instanceof HTMLElement && target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName);
}

export function useShortcut(key, action, { enabled = true } = {}) {
  const latest = useRef(action);
  useEffect(() => {
    latest.current = action;
  }, [action]);

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (shouldIgnore(event)) return;
      event.preventDefault();
      latest.current(event);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, enabled]);
}
