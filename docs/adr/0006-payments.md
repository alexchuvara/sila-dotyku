# ADR-0006: Cash first; payment provider behind an interface

- Status: Accepted for MVP; provider choice deferred to Phase 11

## Decision
Launch with **cash at the studio** only. Data model and UI already include `payment_method` and a `payment` table. In Phase 11 we implement a `PaymentProvider` interface; first adapter proposed: Stripe Checkout (hosted page, BLIK/cards, test mode), Przelewy24 as the alternative. Card data never touches our servers. The browser redirect is never trusted; only a verified, idempotent webhook marks a payment paid.

## Consequences
+ Faster launch, less compliance surface.
− No online prepayment, so no-show protection relies on the cancellation policy until Phase 11.
− Provider fees and accounting/fiscal rules must be confirmed with the owner's accountant before enabling online payments.
