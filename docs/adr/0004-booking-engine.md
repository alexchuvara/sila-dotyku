# ADR-0004: Derived availability and database-enforced no-overlap

- Status: Accepted in principle; details refined in Phase 8

## Context
One therapist, irregular availability (works shifts at another salon), manual approval of requests, future online payment holds.

## Decision
1. **Availability is derived, never stored as free slots.**
   `free = open windows (weekly template + per-date additions) − time off − active bookings (+ buffer)`; default state of a day is **closed**.
2. A pure function `computeSlots(input)` (no DB, `now` injected) produces slots on a configurable step (default 15 min), respecting minimum notice and maximum horizon. All timestamps are UTC `timestamptz`; windows are local wall-clock times in `Europe/Warsaw`; DST transitions are tested.
3. **The database prevents double booking** with an exclusion constraint:
   `EXCLUDE USING gist (tstzrange(starts_at, blocks_until) WITH &&) WHERE (status IN ('pending_approval','confirmed'))`
   (`blocks_until` = end + buffer). The app maps the violation to a friendly "slot just taken" response.
4. **Services have variants** (duration + price). A booking snapshots service name, variant label, duration and price so later edits never rewrite history.
5. **Status lifecycle:** `pending_approval → confirmed → completed`; plus `declined`, `expired`, `cancelled_by_customer`, `cancelled_by_studio`, `no_show`. Pending requests block their slot; they expire after a configurable time.
6. Single therapist ⇒ no `staff_id`; adding one later is a migration.

## Consequences
+ Correct under concurrency without locks in application code.
+ Easy to test: pure function + one integration test firing parallel inserts.
− The exclusion constraint is hand-written SQL in a migration (ORMs don't model it).
− Expiry needs a scheduled job or on-read cleanup; start with on-read + a daily cron.

## Alternatives considered
Pre-generated slot rows (drift, storage, hard to change rules); application-level locking (unsafe across serverless instances).
