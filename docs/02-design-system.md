# Design system (Phase 4)

> Status: **v1, approved by owner and Wiktoria (2026-10-24)**: emblem option B, gold accent lines (olive rejected).

## Principles

- Calm, warm, premium. Purple is the **identity colour, not the background colour**.
- Rough proportions: ~60% warm neutrals, ~25% aubergine/violet, ~10% lavender tints, <=5% garnet and gold.
- **Components use semantic tokens only** (`bg-background`, `text-muted`, `bg-primary`...). Never raw hex values and never `dark:` classes in components. Themes change token values, not component code.
- Gold is **decorative only** (thin rules, ornaments). It has 2.9:1 contrast on ivory, so never use it for text or essential UI.

## Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#FAF6EF` ivory | `#17101F` plum-black | Page |
| `surface` | `#EFE6D8` sand | `#221829` | Cards, panels |
| `foreground` | `#2A1F2D` | `#F1E9E1` | Body text |
| `muted` | `#5A4B5E` | `#B9AEC0` | Secondary text |
| `border` | `#E0D3BF` | `#33253D` | Hairlines |
| `primary` | `#3D2455` aubergine | `#CDB9F0` lavender | Primary buttons, headings |
| `primary-foreground` | `#FAF6EF` | `#1B1226` | Text on primary |
| `link` | `#6B4E9B` violet | `#BBA5E6` | Links, secondary buttons |
| `tint` | `#E4DCF0` lavender mist | `#3A2A55` | Selected states, soft fills |
| `accent` | `#8E2B3E` garnet | `#F0A0AF` rose | Small highlights, tags |
| `accent-soft` | `#F3DDE1` | `#3A1B26` | Background behind accent text |
| `gold` | `#B88A3E` | `#D9AE5E` | Decorative lines only |
| `ring` | `#6B4E9B` | `#BBA5E6` | Keyboard focus outline |

Dark mode is designed, not inverted: the primary button becomes light lavender with dark text, and the page is plum-black (`#17101F`), never pure black.

### Verified contrast (WCAG 2.2, computed 2026-10-24)

| Pair | Light | Dark |
|---|---|---|
| foreground on background | 14.6 | 15.5 |
| muted on background / surface | 7.5 / 6.5 | 8.7 / 8.0 |
| primary-foreground on primary | 12.3 | 10.2 |
| link on background / surface | 6.1 / 5.3 | 8.5 / 7.8 |
| accent on accent-soft | 6.3 | 7.6 |

All text pairs pass AA (4.5:1). Re-check whenever a token changes.

## Typography

- **Display (headings):** Cormorant Garamond 500/600.
- **Body and UI:** Manrope.
- Both are loaded through `next/font/google` (self-hosted at build time, no runtime request to Google) with `latin`, `latin-ext` (Polish letters) and `cyrillic` (future Ukrainian/Russian).
- Tailwind utilities: `font-display`, `font-sans` (default).

## Emblem

- **Chosen: option B, a single-colour yin-yang with an outline ring.** Works in one colour for favicon, stamps and print, and in both themes.
- Component: `src/components/brand/Emblem.tsx` (follows theme tokens). Favicon: `src/app/icon.svg` (switches colours with the browser's colour scheme).
- Rationale for yin-yang: balance of energy, and Wiktoria's method (Energodynamika) combines Chinese, Ayurvedic and Thai techniques.
- Open item: a PNG apple-touch icon for iOS home screens and a social-share image (Phase 14).

## Theme architecture

See [ADR-0011](adr/0011-theme-switching.md). In short: system preference by default (pure CSS, no JavaScript); an explicit choice is stored in `localStorage` and applied by a tiny inline script before first paint.
