# Siła dotyku — masaż, który zmienia samopoczucie

Website and online booking platform for **Wiktoria's** Ayurvedic and Eastern massage practice in Gliwice, Poland.
Polish first; English, Ukrainian and Russian planned.

> **Status:** Phase 3 — project setup. Nothing is deployed yet. See the [roadmap](docs/00-discovery.md#24-development-roadmap-adjusted).

## What it will do

- Present Wiktoria, her massage methods (including her own method, *Energodynamika*), prices and locations.
- Let customers **request** a time slot as a guest (Wiktoria confirms each request); cash payment at first, online payment later.
- Give Wiktoria a phone-friendly dashboard: new requests, today's schedule, availability, services, customers.
- Notify her by Telegram and web push.

## Planned stack

Next.js (App Router) · TypeScript (strict) · Tailwind CSS · Motion · PostgreSQL · Drizzle ORM · Better Auth · next-intl · Resend · Vitest · Playwright.
Reasons for each choice are recorded in [docs/adr](docs/adr/).

## Documentation

| Document | Contents |
|---|---|
| [docs/00-discovery.md](docs/00-discovery.md) | Requirements, architecture, data model, security, roadmap |
| [docs/01-product-ux.md](docs/01-product-ux.md) | Owner decisions, services, availability, booking lifecycle, wireframes |
| [docs/adr/](docs/adr/) | Architecture decision records |

## Getting started

Setup instructions will be added with the project scaffold. Prerequisites: Node.js 20.9+ (24 recommended), pnpm 10.

Environment variables are documented in [.env.example](.env.example). Never commit real values.

## Workflow

- `main` is always deployable. Work happens on short-lived branches (`feat/…`, `fix/…`, `chore/…`, `docs/…`) and lands through pull requests.
- [Conventional Commits](https://www.conventionalcommits.org/): `feat(booking): …`, `fix(auth): …`, `docs: …`.
- Database changes only through version-controlled migrations.

## License

Private project. License to be decided.
