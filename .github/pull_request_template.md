## What and why

<!-- What changed, and the reason. Link the issue if there is one. -->

## How to test

<!-- Steps a reviewer can follow. -->

## Checklist

- [ ] Lint, typecheck and tests pass locally
- [ ] Tests added or updated for new behaviour
- [ ] No user-facing strings hardcoded in components (i18n keys used)
- [ ] Works in light and dark theme, on a phone-width viewport
- [ ] Database change? A migration is included (never edit the DB by hand)
- [ ] No secrets committed; `.env.example` updated if new variables were added
- [ ] Docs / ADR updated if a decision changed
