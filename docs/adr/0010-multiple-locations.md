# ADR-0010: Locations — home studio and Aturi salon

- Status: **Accepted** (owner decisions, 2026-10-07 and 2026-10-08)
- Confirmed 2026-10-08: Aturi stays `informational`; Aturi's owner has agreed to being named and to the salon address being shown. The Aturi section tells visitors that Wiktoria's appointments **at Aturi are booked on Aturi's own platforms (Booksy or Fresha)** and links there. When Wiktoria leaves Aturi, her availability moves to the home/own-studio location (Mon and Thu pattern, adjustable) and the Aturi section is removed or archived.

## Context
Wiktoria works from two places:
- **Home** (private clients) — Mon and Thu, 10:00–19:00. Address is private (ADR-0009).
- **Aturi Orient Massage, Katowice** — the other days, 12:00–20:00. Owner wants the site to say she is available there and to show the salon's **full public address**. Public listings give: ul. Tadeusza Kościuszki 182 lok. 2B, 40-525 Katowice **[CONFIRM before publishing]**.
Aturi runs its own online booking (Booksy/Fresha). Appointments made there are invisible to this system.

## Decision
1. Introduce a `location` entity: `slug`, `kind` (`home` | `salon`), `name`, `public_label`, `public_address` (nullable), `private_address` (nullable), `show_public_address`, `booking_mode`, optional `phone`, `external_url`.
2. `booking_mode` is either **`bookable`** (slots offered by this system) or **`informational`** (the site shows days/hours and address, and links/calls the venue; no slots).
3. **Defaults:** Home = `bookable`. Aturi = `informational` — this matches "mention that she is available there and give the address", and avoids double booking between two independent calendars. Flipping Aturi to `bookable` later is a setting, not a rewrite.
4. Weekly availability intervals reference a `location_id`; a booking stores `location_id` and snapshots the public label. The slot picker shows the location with each day/time.
5. The no-overlap constraint stays global (one person, one calendar across locations), so a future bookable Aturi cannot clash with home bookings.
6. If Aturi becomes bookable, price/variant overrides per location are a small addition (table `variant_location_price`); not built now.

## Consequences
+ Site can honestly present both places; the public Aturi address is shown, the home address stays hidden.
+ Customers see where they will be treated before they book.
− Risk if Aturi is later made bookable: conflicts with appointments booked in Aturi's own system. Needs a process decision (e.g. Wiktoria blocks time here for Aturi shifts) before enabling.
− Relationship with Aturi: naming them and publishing their address on a marketing site for private clients is a business matter the owner should confirm with Aturi.
