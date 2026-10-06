# ADR-0009: Do not publish the home address

- Status: Accepted (owner decision, 2026-10-06)

## Context
Wiktoria currently works from her flat. A separate studio is planned.

## Decision
- Public pages, structured data and the map show **city / street name only** (no building or flat number). Google Business Profile should be configured the same way (service-area/hidden address) — an owner action in Google.
- The settings table stores two values: `public_location_label` and `private_address`. Only the **confirmed-booking** email and the booking page for that customer reveal `private_address`.
- When a real studio opens, change the two values and enable the public address; no code changes.
- LocalBusiness structured data uses the public label until then; we will not invent an address.

## Consequences
+ Protects her privacy and safety.
− Slightly weaker local-SEO signals until a public address exists; compensated by city-level content and the Business Profile service area.
