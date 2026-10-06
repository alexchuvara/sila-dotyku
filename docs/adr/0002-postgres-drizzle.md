# ADR-0002: PostgreSQL with Drizzle ORM and SQL migrations

- Status: Proposed (default accepted unless owner objects)

## Context
Bookings need transactions and a hard guarantee against overlapping appointments.

## Decision
Managed PostgreSQL in an EU region (default: Neon; Supabase-as-plain-Postgres is an equal alternative). Access through Drizzle ORM; schema in TypeScript; migrations as SQL files in `drizzle/`, committed to git. Hand-written SQL migrations are allowed and expected for constructs the ORM cannot express (the `btree_gist` extension and the exclusion constraint, see ADR-0004).

## Consequences
+ The database enforces invariants; the app cannot corrupt them by bug.
+ Types derive from the schema; SQL stays visible (good for learning).
− Neon/Supabase free tiers have limits (pausing/cold starts); acceptable for development.
− No local Docker on the dev machine: development uses a Neon dev branch (needs internet).

## Alternatives considered
Prisma (friendlier, but hides SQL and constraints); Supabase client with Row-Level Security as the API (business logic in policies is harder to test and learn).
