# ADR-0001: Next.js (App Router) with TypeScript

- Status: Accepted (owner approved 2026-10-06)

## Context
Local-SEO-driven public site + booking app + admin, built by one developer, hosted cheaply.

## Decision
Next.js (current major, App Router), React, strict TypeScript, Tailwind CSS v4, Motion. One deployable. Domain logic lives in plain TypeScript modules (`src/server/*`) with no Next.js imports so it is unit-testable and portable.

## Consequences
+ Server rendering/static output for SEO; server actions and route handlers remove the need for a separate API.
+ One repo, one deploy, preview per PR.
− More concepts than a SPA (server vs client components, caching). Mitigated by the learning map in `01-product-ux.md`.
− Framework churn; pin versions, read release notes when upgrading.

## Alternatives considered
Vite SPA + separate API (weaker SEO, two deployables); Astro + islands (two paradigms for a small app).
