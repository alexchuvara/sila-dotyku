# Siła dotyku — Project Discovery & Architecture Proposal

> Status: **v0.2 — owner answers received 2026-10-06; see [01-product-ux.md](01-product-ux.md) and [adr/](adr/) for the resulting decisions** · Original date: 2026-10-01 · Nothing has been built yet.
> Everything marked **[VERIFY]** is a claim I could only partially confirm and must be checked before we rely on it.
> Everything marked **[ASK]** needs a decision from you (collected in section 25).

---

## 0. What I could and could not learn about the existing business

Source: the Google Business Profile you shared (read through the public Google Search knowledge panel — no scraping, no API).

| Item | What the profile shows |
|---|---|
| Name | "Siła dotyku: masaż, który zmienia samopoczucie" |
| Category | Masażysta (massage therapist) |
| City / address | **Gliwice**, Kozielska 106B, 44-100 Gliwice |
| Phone | +48 794 786 705 |
| Hours | Listed as *closed, opening Friday 10:00* — full weekly hours not visible to me |
| Reviews | **None yet** ("Napisz pierwszą opinię") |
| Description | Starts "Profesjonalny masaż – relaks, troska i efekty już po pierwszym zabiegu. Mam na imię Wiktoria, jestem doświadczoną masażystką…" and contains a disclaimer sentence beginning "Należy pamiętać, że nasze usługi nie…" (truncated — probably "are not medical services"; I cannot see the rest) |
| Website link on profile | `sila-dotyku.booksy.com` |

What I found that needs your clarification:

1. **Booksy listing is gone.** `sila-dotyku.booksy.com` now says *"Ten biznes nie jest już dostępny"*. Either the listing was deactivated, or it is hidden. This matters: it tells me I cannot import services/prices from there, and the Google profile still links to a dead page (we will fix that link when the website is live). [ASK]
2. **Name spelling.** Google says *Wiktoria* (Polish spelling). You wrote *Viktoriia* (transliteration). Which spelling is used publicly on the website? [ASK]
3. A Facebook page called **"Dotyk Uśmiechu Masaże Ajurwedyjskie"** (Gliwice, ~100 followers) appeared in the results. I cannot tell whether it is Viktoriia's. If it is, it is an older/alternate brand and affects NAP consistency (Name-Address-Phone) for local SEO. [ASK]
4. **Not available to me:** service list, prices, durations, real opening hours, photos, her biography/qualifications, whether the address is a dedicated studio or shared space. I will not invent any of these; the site will use clearly-marked placeholders until you provide them.

---

## 1. Understanding of the product

A **single-practitioner booking platform with a premium marketing site on top**, for a massage business in Gliwice specialising in Eastern/Ayurvedic massage, launching in Polish.

Two products in one codebase:

- **Public site** — builds trust and ranks locally ("masaż ajurwedyjski Gliwice"). Mostly static content, SEO-critical.
- **Booking application** — customer account + booking flow + payment, and an admin dashboard for Viktoriia.

The defining constraint is **one therapist, one room, one calendar**. That is a gift: it removes 80% of Booksy's complexity (multi-staff, multi-location, marketplace, subscriptions). Our edge over Booksy is: no marketplace noise, no commission, your brand, your SEO, your customer data.

**Where Booksy-style UX is worth borrowing:** service list → pick date → pick time → confirm (3 steps, one screen on mobile); instant confirmation; reminders; one-tap rebooking. **Where we deliberately differ:** no multi-service carts, no staff selection, no marketplace discovery, calmer visual language.

---

## 2. Functional requirements

**Public / visitor**
- FR-1 Browse home, about, services (with duration/price), FAQ, contact + map, legal pages.
- FR-2 See live availability and book without friction.
- FR-3 Switch language (later) and theme (light/dark/system).

**Booking**
- FR-4 Select service → date → time slot → enter details → choose payment method → confirm.
- FR-5 Slots computed from working hours, breaks, time off, existing bookings, service duration and buffer.
- FR-6 Double booking is impossible (enforced in the database).
- FR-7 Confirmation email with calendar file (.ics) and a manage link; reminder email before the appointment.
- FR-8 Cancellation and rescheduling under configurable rules (e.g. free up to 24 h before).

**Customer account**
- FR-9 Register, log in, reset password, edit profile, list upcoming/past bookings, cancel/reschedule, rebook.
- FR-10 Delete account / export data (GDPR).

**Payments**
- FR-11 Choose "pay online" or "pay cash at the studio".
- FR-12 Online payment via a Polish-capable provider (BLIK, card, bank transfer), confirmed only by a verified server-to-server webhook.
- FR-13 Payment state tracked per booking (unpaid / pending / paid / failed / refunded).

**Admin (Viktoriia)**
- FR-14 Secure login. Overview: today, upcoming, free slots, basic stats.
- FR-15 Calendar day/week views with bookings and blocked time.
- FR-16 Manage bookings: create manually (phone/Instagram bookings), edit, reschedule, cancel, change status, mark paid/no-show.
- FR-17 Manage services (CRUD, duration, buffer, price, active flag, translations).
- FR-18 Manage working hours, breaks, days off, one-off blocks; booking rules.
- FR-19 Customer list + detail + history + private notes.

---

## 3. Non-functional requirements

| Area | Requirement |
|---|---|
| **Correctness** | No double booking under concurrent requests; money in integer grosze, never floats; times stored as UTC instants, interpreted in `Europe/Warsaw` |
| **Security** | Managed auth, server-side authorization on every admin/customer action, validated input, rate limits, verified webhooks, no secrets in git |
| **Privacy** | GDPR-aware by design (data minimisation, retention, export/delete, processors in EU where possible) |
| **Performance** | Mobile-first; LCP < 2.5 s on 4G, CLS < 0.1, INP < 200 ms; public pages statically rendered/cached |
| **Accessibility** | WCAG 2.2 AA target; keyboard-operable booking flow; visible focus; `prefers-reduced-motion` respected |
| **SEO** | Server-rendered semantic HTML, structured data, sitemap, fast |
| **i18n** | Polish now; EN/UK/RU later with zero component rewrites; fonts must cover Latin Extended **and Cyrillic** |
| **Maintainability** | One repo, one deployable, strict TypeScript, migrations in version control, CI on every PR |
| **Cost** | Realistic for a one-person business: target ≈ €0–25/month at launch (see §22) |
| **Availability** | Booking must degrade gracefully (clear error + phone number fallback) |

---

## 4. User roles

| Role | Description | Access |
|---|---|---|
| **Visitor** | Anonymous | Public pages, availability, start booking |
| **Customer** | Registered | Own profile and own bookings only |
| **Admin** | Viktoriia | Everything in the dashboard |
| *(Guest customer)* | Books without account, identified by email + signed manage link | Only the booking(s) they hold a link for |
| *(Future)* Staff / Receptionist | Not in MVP. The `role` column leaves room for it | — |

Authorization rule: **roles are checked on the server, in one central place**, never by hiding buttons.

---

## 5. Core user journeys

**J1 — New customer books (mobile, 90 seconds)**
Google → landing page → "Zarezerwuj" → pick massage → pick date (calendar strip) → pick time (chips) → name/phone/email (+ optional "create account") → payment method → confirmation page + email.

**J2 — Returning customer** logs in → "Book again" prefills last service → pick time → done.

**J3 — Customer cancels/reschedules** via account or email link; rules shown plainly ("free cancellation until 24 h before").

**J4 — Viktoriia's morning** opens dashboard on phone → today's schedule → taps a booking → marks "completed / no-show / paid cash".

**J5 — Viktoriia changes availability** → blocks next Friday afternoon → slots disappear instantly; conflicting existing bookings are **flagged, not silently cancelled**.

**J6 — Phone booking** → Viktoriia adds the booking manually in 20 seconds so the calendar stays the single source of truth.

**J7 — Online payment failure** → customer returns, slot is held for N minutes, can retry or switch to cash.

---

## 6. MVP definition

**Goal of MVP: Viktoriia can stop managing bookings in her head/DMs, and customers find her on Google.**

In MVP:
1. Public site in Polish: home, services/pricing, about, Ayurvedic massage explainer, FAQ, contact + map, privacy policy + terms.
2. Light/dark theme, i18n infrastructure (Polish only), brand emblem.
3. Booking engine (single therapist) with DB-enforced no-double-booking.
4. Guest booking **and** optional account; email confirmation + reminder.
5. **Cash at the studio** payment option.
6. Admin: today/upcoming list, week calendar, booking status management, manual booking, services CRUD, working hours/breaks/time off, customers list.
7. SEO fundamentals + LocalBusiness schema, sitemap, robots.
8. CI, tests for the booking core, preview + production deploys.

**Recommended staged launch (my proposal):**
- **Launch A (early, ~milestone 3):** public site only, with phone/WhatsApp CTA. Starts SEO indexing and gives Google Business Profile a real website to link to.
- **Launch B (MVP):** booking + admin + cash.
- **Launch C (v1.1):** online payments (BLIK/card), SMS reminders.

---

## 7. Features that should NOT be in the MVP

- Online payments (design for them now, ship in v1.1 — see §14) **[ASK]**
- Multiple staff, rooms, or locations
- Gift vouchers, packages/memberships, loyalty points, promo codes
- Customer reviews on-site (Google reviews cover this; fake-looking testimonials are a liability)
- Blog/CMS (static MDX later if wanted for SEO)
- SMS/WhatsApp notifications (v1.1+)
- Google Calendar two-way sync (v1.1: one-way .ics feed is cheap and enough)
- Advanced analytics/revenue forecasting
- Native mobile app (PWA-installable admin is enough)
- Languages other than Polish (infrastructure yes, translations later)
- Deposit/partial payment and no-show fees (the data model allows it; policy to be decided)

---

## 8. Recommended technology stack (2026)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + React + TypeScript (strict)** | Server rendering for SEO, route handlers/server actions for the API, one deployable, huge ecosystem **[VERIFY exact versions at setup]** |
| Styling | **Tailwind CSS v4** + CSS variables for design tokens | Fast, themeable via variables, matches your preference |
| Components | **Radix primitives / shadcn-style components we own** | Accessible dialogs, popovers, selects without writing a11y plumbing; code lives in our repo |
| Animation | **Motion** (the successor name of Framer Motion; `motion/react`) | Your preference holds. Used sparingly; CSS for simple hover states |
| Database | **PostgreSQL** (managed: Neon *or* Supabase-as-plain-Postgres) | Relational + transactions + **exclusion constraints** for double-booking |
| ORM / migrations | **Drizzle ORM + drizzle-kit** | Thin, SQL-like, TypeScript types derived from schema, SQL migration files in git. Teaches real SQL. |
| Auth | **Better Auth** (runs in our app, stores users in our DB) | Email+password, email verification, reset, sessions, rate limiting, roles; no vendor lock-in, no per-user pricing **[VERIFY maturity before committing]** |
| Validation | **Zod** (shared client/server schemas) | One source of truth for form + API validation |
| Forms | **React Hook Form + Zod resolver** | Standard, light |
| Data fetching | Server Components + Server Actions; **TanStack Query** only where client interactivity needs it (admin calendar) | Avoid a client state library until needed |
| i18n | **next-intl** | Best-supported i18n for the App Router; ICU plurals matter for Polish/Ukrainian/Russian |
| Email | **Resend** (+ React Email templates) | Simple DX, EU region option |
| Payments (v1.1) | See §14 — recommendation: **Stripe** behind a thin provider interface; Przelewy24 as the alternative |
| Testing | **Vitest** (unit/integration), **Testing Library**, **Playwright** (E2E), **axe** (a11y), real Postgres in tests | See §21 |
| Tooling | pnpm, ESLint, Prettier, TypeScript strict, Husky + lint-staged (light), GitHub Actions | |
| Hosting | **Vercel** (app) + managed Postgres in EU region (Frankfurt) | You know it; preview deployments per PR. **Caveat:** Vercel's free Hobby plan is for non-commercial use, so a real business site should be on Pro (~$20/mo) **[VERIFY current terms]** |
| Monitoring | Sentry (errors), Vercel Analytics or Plausible (cookieless), uptime ping | |

**What I deliberately do NOT recommend:** Redux/Zustand (no need), a separate Express/Nest backend (two deployables for no gain), microservices, GraphQL/tRPC (server actions + typed functions are enough), Supabase RLS-as-API (puts business logic in policies — harder for a learner to test and reason about), Clerk (great, but per-user pricing and lock-in for a tiny business).

---

## 9. Alternative stacks worth considering

**Option A — React + Vite SPA + separate API (e.g. Hono/Express) + Postgres**
- ✅ Pure "React learning" path; simpler mental model (client vs. API).
- ❌ SEO needs extra work (prerendering/SSR bolt-ons); two deployables; auth cookies across origins; more glue code.
- Verdict: good for a dashboard, weaker for a local-SEO-driven public site.

**Option B — Next.js (recommended)**
- ✅ One codebase, SSR/static for SEO, server-side booking logic next to the UI, easiest deployment.
- ❌ More concepts to learn (Server vs Client Components, caching rules). Framework churn risk.
- Mitigation: keep business logic in plain TypeScript modules (`src/server/booking/*`) with **no Next.js imports**, so it is portable and unit-testable.

**Option C — Astro (public site) + React islands + separate API**
- ✅ Best raw performance for content pages.
- ❌ Two worlds for one small project; booking/auth pages would be islands anyway.

**Recommendation: B.** You said you are learning React — Next.js still *is* React; Server Components are the one new idea, and I'll teach them as we hit them.

**Database alternative:** Supabase (Postgres + dashboard + storage) vs Neon (serverless Postgres, branching for previews). Both are plain Postgres to us. Default: **Neon** for per-PR DB branches, *or* Supabase if you want a friendlier GUI and file storage later. Minor decision; I'll default to Neon unless you object.

---

## 10. Recommended architecture

```
Browser ──► Next.js (Vercel, region fra1)
              ├─ Public pages (static/ISR, localized)         ← SEO
              ├─ Booking UI (Client Components, minimal JS)
              ├─ Customer account pages (auth-protected)
              ├─ Admin dashboard (role = admin, protected)
              └─ Server layer
                   ├─ Server Actions / Route Handlers  (thin: parse → authorize → call domain)
                   ├─ Domain modules (pure TS): booking, availability, pricing, policies
                   ├─ Data layer: Drizzle → PostgreSQL (Neon, Frankfurt)
                   ├─ Auth: Better Auth (sessions in DB, httpOnly cookies)
                   ├─ Email: Resend
                   └─ Payments: provider adapter + webhook route (signature verified)
```

Principles:
1. **Thin edges, fat domain.** Actions/handlers only parse, authorize, and delegate. Business rules live in domain modules.
2. **Database is the last line of defence** for invariants (no overlap, valid status, positive price).
3. **Server is the source of truth** for availability and price — the client never sends a price or end time.
4. **Config over constants:** slot step, notice period, cancellation window, buffer → `business_settings` table.
5. **Provider interfaces** for payment and email so we can swap vendors.

---

## 11. Initial database model (PostgreSQL)

```
user ──< session                (Better Auth tables: user, session, account, verification)
user 1──0..1 customer           (customer exists without user for guests; linked when they register)
customer 1──< booking >──1 service
service 1──< service_translation   (locale, name, description)
booking 1──< payment
payment_event                       (webhook idempotency log)
working_interval                    (weekday, start_time, end_time; local time)
time_off                            (starts_at, ends_at, reason)
business_settings                   (single row)
audit_log                           (who changed what)
email_outbox                        (reliable, retryable notifications)
```

Key tables (essentials only):

**user** (managed by Better Auth) — id, email (unique), email_verified, name, **role** (`customer|admin`), locale, created_at.
**customer** — id, user_id (nullable, unique), full_name, email, phone, marketing_consent, locale, admin_notes (private), created_at.
**service** — id, slug (unique), duration_min, buffer_after_min, price_grosz (int), currency (`PLN`), is_active, sort_order.
**service_translation** — service_id, locale, name, short_description, long_description; PK (service_id, locale). *Relational translations rather than JSON so locale uniqueness is enforced and adding a language is just data.*
**working_interval** — id, weekday (1–7), start_time, end_time (local wall-clock). **Breaks are simply gaps between intervals** (09:00–13:00 + 14:00–18:00). No separate break table.
**time_off** — id, starts_at (timestamptz), ends_at (timestamptz), reason, created_by. Covers days off, holidays, one-off blocks.
**booking**
- id (uuid), customer_id, service_id
- starts_at, ends_at (timestamptz, UTC)
- **service_name_snapshot, price_grosz_snapshot** (history must not change if the service is edited later)
- status: `pending_payment | confirmed | completed | cancelled_by_customer | cancelled_by_studio | no_show`
- payment_method: `cash | online`
- customer_note, admin_note, cancelled_at, cancel_reason
- hold_expires_at (for pending_payment)
- manage_token_hash (guest manage link; only the hash is stored)
- created_at, updated_at
- **EXCLUDE USING gist (tstzrange(starts_at, ends_at + buffer) WITH &&) WHERE (status IN ('pending_payment','confirmed'))** ← the anti-double-booking guarantee (requires `btree_gist`; written as a hand-authored SQL migration, since ORMs don't model this natively)

**payment** — id, booking_id, provider, provider_reference (unique per provider), amount_grosz, currency, status (`pending|paid|failed|refunded|partially_refunded`), created_at, updated_at.
**payment_event** — provider, event_id (**unique**), type, payload (jsonb), processed_at → makes webhooks idempotent.
**business_settings** — timezone (`Europe/Warsaw`), slot_step_min (15), min_notice_hours, max_advance_days, cancellation_window_hours, auto_confirm, payment_hold_minutes, plus public business info (name, address, phone, NIP — **only data you supply**).
**audit_log** — actor_user_id, action, entity, entity_id, before/after (jsonb), at.

Indexes: booking(starts_at), booking(customer_id), booking(status, starts_at), unique(customer.email) for non-guest linking rules, payment(provider, provider_reference).

Why a separate **customer** table: guest bookings, phone-created bookings and registered users all need a customer record; account creation then *links* rather than duplicates.

Single therapist ⇒ no `staff_id`/`room_id`. Adding one later is a migration, not a rewrite.

---

## 12. Booking-system architecture

**Core idea:** availability is **derived**, never stored as a list of free slots.

```
free = working_intervals(day, in Europe/Warsaw → UTC)
       − time_off
       − (active bookings, each extended by its service buffer)
slots = every `slot_step` start where [start, start+duration(+buffer)] fits entirely inside `free`
        and start ≥ now + min_notice and start ≤ now + max_advance
```

- Implemented as a **pure function** `computeSlots(input) → Slot[]` — no DB, no clock; `now` injected. This is the most heavily tested code in the project.
- **Creating a booking** (one transaction):
  1. Validate input (Zod), load service (active, price from DB).
  2. Re-run slot check for the exact requested start on the server.
  3. `INSERT` booking. The exclusion constraint rejects overlaps even under concurrent requests → map the error to a friendly "slot just taken" (HTTP 409) and refresh slots.
  4. Cash → `confirmed` (or `pending` if Viktoriia must approve **[ASK]**). Online → `pending_payment` with `hold_expires_at`.
- **Holds:** an unpaid online booking blocks the slot for N minutes (default 15). A cleanup job/query treats expired holds as free (the exclusion constraint's `WHERE` + a status flip by cron/on-read).
- **Cancel/reschedule:** policy function `canCancel(booking, now, settings)`. Reschedule = atomic "move" in one transaction (new range checked by the same constraint), not cancel-then-create.
- **Admin changes that conflict with existing bookings** (e.g. blocking a day) → show conflicts, require explicit action. Never silently cancel customers.
- **Timezones:** store UTC `timestamptz`; working hours are *local wall-clock* rules. DST edge cases (last Sunday of March/October, Poland) get explicit tests, including a 02:00–03:00 gap and a repeated 02:00–03:00 hour.
- **Money:** integer grosze; formatted with `Intl.NumberFormat`.
- **Concurrency test:** an integration test fires 20 simultaneous bookings for one slot against real Postgres and asserts exactly one succeeds.

---

## 13. Authentication & authorization strategy

- **Better Auth**, email + password with email verification and reset. Passwords hashed by the library (scrypt/argon-class) — we never touch crypto.
- Sessions in our database, `httpOnly`, `Secure`, `SameSite=Lax` cookies. No tokens in localStorage.
- Optional later: Google sign-in, passkeys. (Not MVP.)
- **Roles:** `customer` default; `admin` assigned only via a seed/CLI script, never via a public form.
- **Authorization enforced server-side** by helpers like `requireUser()` / `requireAdmin()` called at the start of every action/handler, plus **ownership checks** (a customer can only read `booking.customer.user_id = me`). Middleware only redirects for UX; it is not the security boundary.
- Admin account: strong password + **2FA (TOTP)** — Better Auth supports it **[VERIFY]**.
- Rate limiting on login, register, reset, and booking creation.
- Guest manage links: high-entropy random token, only its hash stored, expires after the appointment.

---

## 14. Payment strategy

Facts below come from public provider pages and third-party summaries — **[VERIFY all fees against current price lists before choosing]**.

| | **Stripe** | **Przelewy24 (P24)** | **PayU** |
|---|---|---|---|
| Methods in PL | Cards, **BLIK**, P24, Apple/Google Pay | P24 bank transfers, **BLIK**, cards | Cards, **BLIK**, transfers, Apple/Google Pay |
| BLIK fee (approx.) | ~0.9% (reported) | ~1.29% + 0.30 PLN (reported) | negotiated / ~comparable |
| Integration | Best docs + test mode, hosted Checkout, strong webhooks | Good, more manual; Polish-first | Good; Polish-first |
| Onboarding | Fast online; works for sole traders | Polish contract flow | Polish contract flow |
| Fit for tiny business | Excellent DX, predictable | Often cheapest for transfers/BLIK at low volume | Solid, widely known by Polish customers |

**Recommendation:** build a `PaymentProvider` interface and implement **Stripe Checkout (hosted page)** first, because (a) hosted pages mean card data **never touches our servers** (PCI scope SAQ-A), (b) test mode + CLI webhooks make it learnable, (c) it supports BLIK. Re-evaluate P24 if fees at real volume matter. Hosted redirect, not embedded card fields, for MVP simplicity.

Flow: create booking `pending_payment` (slot held) → create Checkout Session → redirect → customer pays → **webhook** (signature verified, idempotent via `payment_event`) flips booking to `confirmed`/payment `paid`. The browser "success" redirect is **never** trusted.

Business questions to settle with an accountant (not for me to decide): fiscal receipt/invoice obligations for online vs. cash payments, VAT/zwolnienie status. [ASK]

---

## 15. Internationalization strategy

- **next-intl**, locale-prefixed routes: `/pl/...` (Polish default; we decide whether `/` redirects or serves `pl` directly), `/en`, `/uk`, `/ru` later. Each page emits `hreflang` alternates.
- UI strings in `messages/pl.json` (source) → `en.json`, etc. **Zero user-facing strings inline in components.** ICU message format for plurals (Polish/Ukrainian/Russian have complex plural rules).
- **DB content** (service names/descriptions) via `service_translation`.
- Formatting through `Intl` (dates, PLN currency) per locale.
- Emails are templated per locale.
- Enforced by an ESLint rule / CI check that every key exists in all enabled locales.
- **Font requirement:** choose fonts with **Latin Extended + Cyrillic** now so UK/RU don't force a rebrand.
- Slugs: Polish URLs first (`/masaz-ajurwedyjski`); localized slugs later via next-intl pathnames.

---

## 16. Design direction

**Concept — "Warm stillness".** Calm, editorial, generous whitespace, soft light. Ayurvedic influence appears as *quiet motifs* (lotus-petal geometry, circles/bindu, fine line patterns, warm botanical tones) — no mandalas everywhere, no om symbols, no stock "zen stones".

**Palette (proposal, to be refined in Phase 4 with real swatches):**

| Token | Light | Role |
|---|---|---|
| Ivory | `#FAF6EF` | page background |
| Sand | `#EFE6D8` | surfaces/cards |
| Aubergine (brand) | `#3D2455` | headings, primary buttons |
| Violet | `#6B4E9B` | links, interactive accents |
| Lavender mist | `#DCD2EC` | tints, selected states |
| Saffron/brass | `#B88A3E` | sparing highlight (never large fills) |
| Clay | `#A3664A` | warm secondary accent |
| Ink | `#231A2E` | body text |

Purple is the **identity colour, not the background colour**: ~60% warm neutrals, ~25% aubergine/violet, ~10% lavender, ≤5% brass.

**Dark mode (designed, not inverted):** background deep plum-charcoal `#171120` (not pure black), surfaces `#211832`, lavender text accents, brass slightly desaturated, photographs get a subtle dim, contrast re-verified for AA.

**Typography:** serif display (e.g. Cormorant Garamond or similar high-contrast serif) + humanist sans for UI (e.g. Manrope/Inter) — both have Polish diacritics and Cyrillic. Final pairing decided visually in Phase 4.

**System:** 4/8 px spacing scale, 12–16 px radius on cards, 44 px minimum touch targets, one primary-button style, quiet outlined secondary, soft layered shadows, form fields with visible labels (no placeholder-only), clear inline errors.

**Imagery:** real photos of the studio and hands (warm, natural light, shallow depth), oils/herbs/textiles detail shots; **no faceless stock**. We need real photography — placeholder gradients until then. [ASK]

**Iconography:** one consistent line set (Lucide), custom lotus/hand glyphs only for the emblem.

**Motion principles:** purposeful, slow-in/slow-out (≈250–500 ms), reveal on scroll once, hover = subtle lift/tint, booking steps slide gently, a gentle breathing glow on the hero is the only ambient motion; everything disabled/simplified under `prefers-reduced-motion`.

---

## 17. Logo / emblem direction

Three candidate directions; I will draw them as SVG in Phase 4 and we pick together:

1. **Lotus-hand** — an abstract lotus of 3–5 petals whose centre petal reads as an open palm/touch. Circle enclosure optional.
2. **Bindu & arc** — a solid dot (the bindu) beneath a single sweeping arc/wave: minimal, very scalable, works at 16 px.
3. **SD monogram** — "SD" ligature inside a soft arch (Eastern doorway shape).

Requirements: single-path-friendly, 1-colour fallback, works at 16×16 favicon, on dark and light, embroidery/signage-friendly. Delivered as SVG (`currentColor` for theming), plus PNG/ICO/Apple-touch exports and social avatar variant. Wordmark: "Siła dotyku" in the display serif; the long slogan used as a tagline, not part of the logo.

---

## 18. Light / dark mode strategy

- Semantic CSS variables (`--bg`, `--surface`, `--text`, `--primary`, `--accent`, …) defined per theme; components only reference semantic tokens, never raw colours.
- Three states: **system (default) / light / dark**, persisted (cookie so SSR renders the right theme with no flash), implemented via `next-themes` or equivalent.
- Tailwind v4 `@theme` tokens bound to those variables.
- Every component is verified in both themes; screenshot tests for key pages in both (Playwright).

---

## 19. SEO strategy

- Server-rendered, semantic HTML, one `<h1>` per page, logical heading structure.
- Metadata API: unique titles/descriptions, canonical URLs, Open Graph/Twitter cards (generated OG images).
- **Structured data (JSON-LD):** `LocalBusiness`-family type (e.g. `HealthAndBeautyBusiness`/`DaySpa` — to be chosen carefully), `Service`/`Offer` for each massage, `FAQPage`, `BreadcrumbList`. **No fabricated `aggregateRating`** — only real, visible reviews.
- Pages targeting real intent: `/masaz-ajurwedyjski-gliwice`, per-service pages, `/o-mnie`, `/cennik`, `/faq`, `/kontakt`.
- Sitemap + robots.txt generated; `noindex` on account/admin/booking-confirmation pages.
- **NAP consistency:** identical name/address/phone across site, Google profile, Facebook; keep the exact business name consistent with how Google shows it (note Google guidelines discourage keyword-stuffed names — the long slogan as the *listing name* is something to review later).
- Local: embed Google Map (consent-aware), link "Wyznacz trasę", point the Business Profile's website + booking links to the site (replacing the dead Booksy link), ask happy customers for Google reviews via a post-visit email.
- Images via `next/image` (AVIF/WebP, sizes, lazy loading, explicit dimensions).
- Google Business Profile API access (if ever wanted for reviews display) requires an API application/approval and owner authorisation — not needed for MVP. We will not scrape Google.

---

## 20. Security & GDPR considerations

**Security checklist (applied per phase, reviewed formally in Phase 15):**
- Input validation (Zod) on every boundary; parameterised queries via Drizzle (SQL injection); React escaping + no `dangerouslySetInnerHTML` with user data (XSS); CSP, HSTS, X-Content-Type-Options, Referrer-Policy headers.
- CSRF: Server Actions + `SameSite` cookies + origin checks; custom route handlers verify `Origin`.
- Rate limiting (auth, booking, contact), bot protection on public forms (e.g. Turnstile — privacy-friendly).
- Secrets only in env vars (Vercel env), `.env*` git-ignored, `.env.example` committed, secret scanning enabled in GitHub.
- Least-privilege DB user; no DB access from the browser.
- Webhook signature verification + idempotency; logs never contain card data, tokens, or full PII.
- Dependency audit (Dependabot) and lockfile.
- Backups: managed Postgres point-in-time recovery; restore tested once before launch.

**GDPR — areas needing attention (not legal advice):**
- Customer data = names, phones, emails, appointment history. **Free-text notes about health complaints can be special-category (health) data** → in the MVP the booking form will *not* ask about medical conditions; we use a neutral note field with a warning, and Viktoriia should decide how she handles health information (consent, retention).
- Privacy policy, terms (regulamin), cookie policy; lawful basis per purpose; **separate, unticked** marketing consent.
- Data minimisation, retention period, export + deletion on request (account page + admin tool).
- Processors (Vercel, DB, Resend, Stripe, Sentry) → data-processing terms, EU regions where available.
- Prefer **cookieless analytics** so a heavy consent banner isn't needed; essential cookies (session, theme) only. Google Maps embed loads after click/consent.
- Consumer-law details for online booking/cancellation/withdrawal should be reviewed by someone qualified. [ASK]

---

## 21. Testing strategy

| Level | Tool | What |
|---|---|---|
| Unit | Vitest | `computeSlots`, price/format utils, cancellation policy, timezone/DST |
| Integration | Vitest + **real Postgres** (container or Neon test branch) | booking creation, **exclusion constraint**, 20-way concurrent booking, reschedule atomicity, webhook idempotency, authorization (customer ↛ admin, customer ↛ other's booking) |
| Component | Testing Library | slot picker, forms, validation messages |
| E2E | Playwright | full booking journey on mobile viewport, cancel/reschedule, admin blocks a slot, payment success/failure (provider test mode), cash flow |
| Accessibility | axe in Playwright | each key page, both themes |
| Visual | Playwright screenshots | key pages in light/dark |
| Performance | Lighthouse CI | budgets on public pages |

Rule: **booking logic is written test-first** (I'll write the scenarios list; you implement some of them — good learning exercise). CI runs lint, typecheck, unit/integration, and E2E on every PR.

---

## 22. Deployment strategy

- **Environments:** local (Docker Postgres or Neon dev branch) → **Preview** (every PR, own DB branch) → **Production**.
- Vercel for the app (Frankfurt function region), managed Postgres in Frankfurt/EU, domain via a registrar of your choice (DNS at registrar or Cloudflare).
- Migrations run in CI/deploy step (`drizzle-kit migrate`), **never** edited by hand in production; destructive migrations follow expand/contract.
- Env vars per environment; Stripe test keys in Preview/Dev, live keys only in Production.
- Rough monthly cost: Vercel Pro ~$20 (or Hobby for pre-launch dev), Postgres free→~$5–20, Resend free tier initially, domain ~€10–15/yr. Alternative cheaper path: Cloudflare Pages/Workers or a small VPS — more ops work for you, so not recommended unless budget is the priority. [ASK]
- Uptime check + Sentry alerts to your email.

---

## 23. Git / GitHub workflow

- Repo: `sila-dotyku` (private at first, can be opened later). The folder already exists at `…/GitHub/sila-dotyku`; `git init` happens at the start of Phase 3 after your approval.
- **Trunk-based with short-lived feature branches**: `main` is always deployable and protected (PR + passing CI required — yes, even solo; it's the professional habit).
- Branch names: `feat/booking-slot-engine`, `fix/…`, `chore/…`, `docs/…`.
- **Conventional Commits:** `feat(booking): compute available slots`, `fix(auth): …`, `docs: …`, `test: …`, `chore: …`. Atomic commits; before each important commit I'll tell you *what / why / how to test / what it represents*.
- PR template + checklist (tests, a11y, i18n keys, migration included, docs updated).
- GitHub Issues for the backlog, labelled by phase; a GitHub Project board (Backlog → Ready → In progress → Review → Done); milestones = roadmap phases. I'll create these through the `gh` CLI **after you confirm the GitHub account/repo name** (I'll check whether `gh` is authenticated on this machine before assuming).
- Dependabot, secret scanning, CodeQL (free for private repos? **[VERIFY]**).
- ADRs (short Architecture Decision Records) in `docs/adr/` for each major choice from this document.

Proposed repo layout:

```
sila-dotyku/
├─ docs/               discovery, ADRs, roadmap
├─ drizzle/            SQL migrations (generated + hand-written)
├─ messages/           pl.json (en/uk/ru later)
├─ public/             static assets, emblem
├─ src/
│  ├─ app/[locale]/    routes: (public) (account) (admin) booking
│  ├─ components/      ui/ (design system), booking/, admin/, layout/
│  ├─ server/          domain: booking/, availability/, payments/, auth/, email/  (no Next imports in domain)
│  ├─ db/              schema, client, seed
│  ├─ lib/             utils (time, money, validation schemas)
│  ├─ i18n/            routing, request config
│  └─ styles/          tokens, globals
├─ tests/              e2e/, integration/
├─ .github/            workflows/, PR template
├─ .env.example
└─ README.md
```

---

## 24. Development roadmap (adjusted)

I kept your 17 phases and made three changes: (1) **Phases 1–2 are produced right now** as this document + ADRs; (2) the **public site ships before the booking engine** (early SEO, early feedback); (3) **Database and Auth move before Booking, and Payments come last among features** so core flows are solid first.

| # | Phase | Milestone output | Done when |
|---|---|---|---|
| 0 | Discovery & requirements | this document, answers to §25 | you approve scope |
| 1–2 | Product/UX + technical architecture | wireframes of booking + admin, ADRs | approved |
| 3 | Project setup | repo, Next.js, TS strict, lint, CI, preview deploy, README | CI green, "hello" deployed |
| 4 | Design system & branding | tokens, light/dark, type, emblem, UI kit page | brand approved |
| 5 | Public website (**Launch A**) | all public pages, i18n infra, SEO, legal stubs | Lighthouse ≥ 90, live on domain |
| 6 | Database | schema, migrations, seed, exclusion constraint | migration tests pass |
| 7 | Authentication | register/login/reset/verify, roles, admin seed | authz tests pass |
| 8 | Booking engine | `computeSlots`, booking API, holds, cancel/reschedule, emails | concurrency test passes |
| 9 | Customer account | profile, my bookings, manage | E2E journey passes |
| 10 | Admin dashboard | overview, calendar, bookings, services, hours, customers | Viktoriia can run a week with it |
| — | **Launch B (MVP: booking + cash)** | | |
| 11 | Payments (**Launch C**) | provider adapter, Checkout, webhooks, refunds basics | failure/success E2E pass |
| 12 | Testing hardening | coverage of critical paths, load/concurrency | targets met |
| 13 | Accessibility & performance | audit + fixes | WCAG AA checks, CWV green |
| 14 | SEO polish | schema validation, GBP linkage | Rich Results test OK |
| 15 | Security & GDPR review | checklist from §20 | no open high findings |
| 16 | Production deployment | domain, prod env, backups tested | go-live |
| 17 | Monitoring & maintenance | alerts, dependency updates, runbook | documented |

Phases 6–10 are where I'll hand you well-scoped tasks to implement yourself (e.g. the price formatter, a Zod schema, a `Button` component, the cancellation-policy function with tests I've written).

---

## 25. Questions that require your decision

*(Grouped; each has my default so you can answer "defaults are fine".)*

**A. Facts about the business** (cannot be guessed)
1. Public spelling: **Wiktoria** or **Viktoriia**? *(Default: Wiktoria on the Polish site, as on Google.)*
2. Booksy: was the listing intentionally removed? Does she want to keep Booksy in parallel? Is "Dotyk Uśmiechu" her old brand?
3. Is Kozielska 106B a dedicated studio or a shared/home space, and is the exact address public? *(affects the map, schema, privacy)*
4. Please send/confirm: services list with durations and prices, working hours, short bio and qualifications, and whether real photos exist.

**B. Product decisions that change the build**
5. **Guest booking vs. account required?** *Default: guest booking allowed, account optional (lowest friction; account gives history and one-tap rebooking).*
6. **Auto-confirm bookings, or Viktoriia approves each?** *Default: auto-confirm for free slots (it's a single calendar guarded by the DB), with a minimum-notice setting.*
7. **Online payment in the first release?** *Default: launch with cash-only (Launch B), add online payment in Launch C — but the data model and flow are designed for it from day one.*
8. **Cancellation rule:** *Default: free until 24 h before; later cancellation flagged for her to handle manually.*

**C. Stack and budget**
9. OK with **Next.js** instead of Vite? *(recommended; reasons in §9)*
10. OK with ~$20/month hosting (Vercel Pro) for a commercial site, a domain, and a small Postgres? Do you already own a domain?
11. Your GitHub username and whether the repo should be private. *(I will first check whether `gh` is authenticated here.)*

**D. Legal/admin (you or Viktoriia, with an accountant)**
12. Business registration status and invoice/fiscal-receipt rules for online payments, plus who reviews the privacy policy and terms.

Answer in any form, even "1: Wiktoria, 5–8 defaults, 9 yes". After that I'll produce Phase 1: wireframes and the ADR set, still before any code.
