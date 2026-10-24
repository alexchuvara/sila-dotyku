// Theme helpers shared by the root layout (inline script) and the theme toggle.
// Design: docs/adr/0011-theme-switching.md

export const THEME_STORAGE_KEY = "theme";

export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/**
 * Runs synchronously in <head>, before first paint, so a stored choice never flashes.
 * "system" is represented by having no attribute and no stored value.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

/** Client only. Returns "system" when nothing valid is stored or storage is unavailable. */
export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

/** Client only. Updates <html data-theme> without touching storage. */
export function setThemeAttribute(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

/** Client only. Applies a theme and remembers the choice. */
export function applyTheme(theme: Theme): void {
  setThemeAttribute(theme);
  try {
    if (theme === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The choice then lasts for this visit only.
  }
}
