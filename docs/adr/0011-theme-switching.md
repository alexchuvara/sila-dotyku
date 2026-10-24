# ADR-0011: Light/dark theme via CSS tokens, `data-theme` and an inline script

- Status: Accepted

## Context
The site needs light and dark themes, following the system preference by default, with a user override that persists, and no flash of the wrong theme. Pages should stay statically rendered for SEO and speed.

## Decision
1. Colours are semantic CSS variables (`--background`, `--primary`, ...) defined in `globals.css` and exposed to Tailwind via `@theme inline`.
2. **No attribute = follow the system**, implemented in pure CSS: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }`.
3. **Explicit choice** = `data-theme="light"|"dark"` on `<html>`, stored in `localStorage` under the key `theme`. Choosing "system" removes both the attribute and the stored value.
4. A tiny synchronous inline script in `<head>` (from `src/lib/theme.ts`) applies the stored choice before first paint. `<html>` has `suppressHydrationWarning` because that script changes it before React hydrates.
5. The toggle is a Client Component that calls shared helpers from `src/lib/theme.ts`, and re-applies the stored value in `useLayoutEffect` (React Strict Mode remounts in development clear attributes set by the script).
6. The theme is **not** stored in a cookie read by the server: calling `cookies()` in the root layout would make every page dynamic and lose static rendering.

Reference: the bundled Next.js guide `01-app/02-guides/preventing-flash-before-hydration.md`.

## Consequences
+ Pages stay static; system-preference visitors need no JavaScript to get the right theme.
+ A returning visitor with an explicit choice sees no flash.
− Dark token values are written twice in CSS (system-dark and explicit-dark); keep them in sync.
− Inline scripts need a nonce if we ever adopt a strict Content-Security-Policy.

## Alternatives considered
`next-themes` library (well-tested but one more dependency, and hides the mechanism we want to learn); server-side cookie (loses static rendering).
