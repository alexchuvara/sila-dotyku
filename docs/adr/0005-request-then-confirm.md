# ADR-0005: Booking is a request that Wiktoria confirms

- Status: Accepted (owner decision, 2026-10-06)

## Context
Wiktoria also works shifts at Aturi in Katowice and takes private clients; she cannot guarantee that every open slot is still good when someone books it.

## Decision
New bookings start as `pending_approval`. She confirms or declines from the dashboard (phone-first). `business_settings.auto_confirm` exists from day one; turning it on makes new bookings start as `confirmed`. Customer UI wording says "request" until confirmed. The exact address is only revealed in the confirmation.

## Consequences
+ Protects her from conflicts; fits the current reality.
+ Switching to auto-confirm later is a settings change, not a rewrite.
− Slower for customers; mitigated with a response-time promise, reminders and expiry.
− Adds notification requirements (email now; push/Telegram later).
