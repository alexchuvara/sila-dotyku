# ADR-0003: Better Auth for authentication

- Status: Proposed (verify maturity at setup)

## Context
Need customer accounts (later), a protected admin, password reset, sessions. We must not implement password storage or crypto ourselves.

## Decision
Better Auth, running inside the app, storing users/sessions in our Postgres. Roles: `customer`, `admin`. Admin is created via a seed script, never through a public form. Guest bookings need no account: they are identified by a high-entropy manage link whose hash is stored.
Authorization is enforced **on the server** (`requireUser`, `requireAdmin`, ownership checks). The Next.js proxy only redirects for UX and is not a security boundary.

## Consequences
+ No per-user pricing, no vendor lock-in, data stays in our DB.
− We own more configuration than with a hosted provider; re-evaluate if the library proves immature.

## Alternatives considered
Clerk (excellent, but lock-in and pricing); Auth.js (less actively favoured for new projects); Supabase Auth (ties us to Supabase).
