# Phase 1 — Product & UX definition

> Status: **DRAFT for review** · 2026-10-06 · Builds on [00-discovery.md](00-discovery.md) and the owner's answers.
> Items tagged **[CONFIRM]** are placeholders Wiktoria must verify. Nothing here is final copy or final pricing.

---

## 1. Decisions received (changes to the discovery document)

| Topic | Decision | Consequence |
|---|---|---|
| Public name | **Wiktoria** | Used in all Polish copy |
| Booksy / other brands | None. The website replaces Booksy. | No migration; Google Business Profile will link to the new site |
| Address | Currently Wiktoria's **home**. A separate studio is planned. | **Do not publish the street number.** Public: city + district/street name only. Exact address is sent **after she confirms** the booking. See ADR-0009 |
| Employment | Works at **Aturi salon in Katowice** and takes private clients | Availability is irregular → see §4. Naming Aturi publicly needs her (and probably their) OK [CONFIRM] |
| Content | Use Google Business Profile services as a **starting template**; owner will refine with Wiktoria | §3 |
| Signature method | **Energodynamika** (her own method) | Promoted as the hero service. The owner's message said "Termodynamika"; all sources say *Energodynamika* [CONFIRM] |
| Booking confirmation | **Manual**: customer sends a *request*, Wiktoria confirms | New status model, §5. Auto-confirm stays a settings switch for later |
| Account | Guest booking first | As proposed |
| Payment | Cash only first | As proposed |
| Cancellation | Free until 24 h before | As proposed |
| Hosting | Free tier during development, commercial later; no domain yet | ADR-0008 |
| GitHub | `alexchuvara`, private repo, portfolio project | Repo hygiene: see §9 |
| Legal/accounting | Handled by the owner; Wiktoria only massages and confirms bookings | Wiktoria's admin UX must be tiny and phone-friendly |
| Method name | **Energodynamika** (confirmed 2026-10-07) | Resolved |
| Variants | **60 and 90 min for every massage**, no first-visit offer. Services/variants/prices must stay **editable by the owner/Wiktoria at any time** | Admin services CRUD is MVP-critical; prices come from the DB, never from code |
| Availability (private clients) | **Mon and Thu 10:00–19:00.** Other days (incl. weekend) she is at Aturi 12:00–20:00 | Seed weekly template for **home** (Mon/Thu 10–19). Aturi days are shown as *informational* (see next row); per-date overrides cover exceptions |
| Aturi days | Site **mentions that Wiktoria works at Aturi on the other days (12:00–20:00) and shows Aturi's full address** (2026-10-07) | New `location` entity, ADR-0010. Default: informational, not bookable. Address from public listings: ul. Tadeusza Kościuszki 182 lok. 2B, 40-525 Katowice **[CONFIRM]** |
| Minimum notice | **12 h** | Default setting |
| Unanswered requests | **Auto-expire after 12 h, never later than 2 h before start** | As proposed |
| Notifications | **Both** web push and Telegram | Telegram bot first (simple, reliable); web push via installed phone web-app (iOS requires "add to home screen") |
| Aturi | **May be named publicly**; Wiktoria approves her photo being public | Aturi mentioned on About page; portrait OK for a public repo/site |
| Phase 1 | **Approved 2026-10-07** | Proceed to Phase 3 |

---

## 2. Who uses this, and what that means

**Wiktoria (admin)** — a practitioner, not a "dashboard person". She uses it on her phone between clients and shifts. Her three jobs: *(1) answer new requests, (2) see what's today, (3) tell the system when she is free.* Everything else is secondary. Design rule: **if a task needs more than 3 taps on a phone, redesign it.**

**Customer** — local (Gliwice and surroundings), mobile, wants to see price, what the massage is, and a time that works. Needs trust: real face, clear location, clear rules, no surprises. Because she works from home, trust signals matter more than usual (real photo, honest description, explicit "not an intimate massage" line already used on her Google profile).

**Owner/developer (you)** — maintains the system, handles business/legal admin.

---

## 3. Service catalogue (starting template from the Google profile)

Source: screenshots of the Google Business Profile service list. Prices are what Google shows; **"from" means variants exist** and we need the variants.

| # | Service (PL) | Google price | Duration | Notes |
|---|---|---|---|---|
| 1 | **Energodynamika** (autorska metoda) | od 150 zł | **[CONFIRM]** | Her signature: classical + Ayurvedic + Thai + Chinese techniques; oil massage, stretching, acupressure. Cheapest entry price → good first-visit offer. **Feature first on the site** |
| 2 | Masaż relaksacyjny | 220 zł (fixed) | 1 h | Gentle full-body relaxation |
| 3 | Masaż indyjski **Abhyanga** (ajurwedyjski) | od 220 zł | **[CONFIRM]** | Warm-oil ceremonial massage |
| 4 | Masaż indyjski **Udwartana** (ajurwedyjski z ziołami) | od 240 zł | **[CONFIRM]** | Herbal powder massage, gentle body exfoliation |
| 5 | Masaż ciepłymi **woreczkami ziołowymi** | od 250 zł | **[CONFIRM]** | Warm herbal compresses |

**Data model consequence:** a service has **variants** (duration + price), e.g. *Abhyanga — 60 min — 220 zł / 90 min — … zł*. A booking references a **variant**, never just a service. (Added to the schema in ADR-0004.)

**My suggestions (for discussion with Wiktoria, not decisions):**
1. Offer **60 and 90 min** variants for each massage; keep prices anchored to what she charges today. Her current range (150–250 zł) sits in the mid-to-upper range of what I saw for Gliwice (a typical local classic massage listing: 90–230 zł). I do **not** recommend changing prices before she and you decide; the system makes changing them trivial.
2. **Lead with Energodynamika** as "the thing you can only get here" — it is the differentiator versus every other Gliwice listing.
3. Add a **first-visit** entry point (e.g. a shorter Energodynamika session) only if she wants one **[CONFIRM]**.
4. **Copy wording — important:** two phrases on the current descriptions make *health claims* ("leczy bezsenność" in Abhyanga; "nie powodują reakcji alergicznych" for herbal bags). Claims like these are risky in Polish/EU advertising and may be untrue for some customers. Proposed softer rewrites: *"pomaga się wyciszyć i poprawia komfort snu"* and *"delikatne dla skóry; poinformuj nas o alergiach przed zabiegiem"*. Also add one standing line: *masaż relaksacyjny, nie jest zabiegiem medycznym ani leczniczym.* Not legal advice — worth a quick check by you.
5. Keep her own line **"Pracuję na rezultat – Twoje ciało powie »Dziękuję«"** — it is good brand voice. Candidate for the hero tagline area (the official name/slogan stays as is).
6. **Bio:** the Aturi text is their website copy. I will write original text from the facts (≈5 years of practice; classical, Ayurvedic and Thai massage; own method Energodynamika combining oil massage, stretching and acupressure) and ask Wiktoria to approve it. Do not paste the Aturi text.

---

## 4. Availability model (the thing that makes this project different from a template)

Wiktoria is **not** open Mon–Sat 10–19 for private clients: the Google profile hours exist, but she is at Aturi on shifts. So:

- Two locations (ADR-0010): **home** is bookable (Mon/Thu 10–19); **Aturi** days (12–20) are shown on the site as where to find her, with the public address, but are not bookable here by default.
- Default state of every day = **closed**. She *opens* windows.
- **Weekly template** (e.g. "Mon & Wed 17:00–21:00, Sat 10:00–16:00") covers the recurring pattern.
- **Per-date overrides**: *"open this extra day 12:00–18:00"* or *"close next Friday"* — two taps from the phone.
- Both feed the same slot calculator (ADR-0004).
- Booking rules: **minimum notice** (default 12 h, [CONFIRM]), **max horizon** (default 60 days), **buffer** after each massage (default 15 min), **slot step** 15 min.
- Google Business Profile hours should be changed to *"by appointment"*/matched to reality when the site launches (an action for the owner, not the code).

---

## 5. Booking lifecycle (request → confirm)

```
                 customer submits
                       │
                       ▼
              ┌─────────────────┐   Wiktoria approves   ┌───────────┐   done    ┌───────────┐
              │ pending_approval│ ─────────────────────▶│ confirmed │──────────▶│ completed │
              └─────────────────┘                       └───────────┘           └───────────┘
                │      │                                  │      │
     declined   │      │ no answer in N hours             │      └──▶ no_show
                ▼      ▼                                  ▼
            declined  expired                   cancelled_by_customer / cancelled_by_studio
```

- **A pending request blocks its slot** (otherwise two people could be promised the same hour). The database exclusion constraint covers `pending_approval` and `confirmed`.
- **If she doesn't answer** within N hours (default 12 h, and never later than 2 h before the start) the request **expires**, the slot is released and the customer is told. She gets reminder emails before that. **[CONFIRM N]**
- **Customer-facing language is honest:** the screen says *"Prośba wysłana — Wiktoria potwierdzi"*, never "Zarezerwowano".
- **Exact address** appears only in the *confirmed* email and account page.
- Cancellation: free until 24 h before; later cancellations are allowed but **flagged** for Wiktoria to handle.
- Switching to automatic confirmation later = one setting (`auto_confirm`) that makes new bookings skip `pending_approval`.
- Notifications for Wiktoria: **email first**. Candidates for v1.1: web-push in the installed phone web-app, or a Telegram message — whichever she'll actually notice **[CONFIRM]**.

---

## 6. Site map (Polish, MVP)

```
/                         Home
/masaze                   All massages + variants + prices
/masaze/energodynamika    Signature method (long-form, SEO)
/masaze/abhyanga          …and one page per service
/masaze/udwartana
/masaze/woreczki-ziolowe
/masaze/masaz-relaksacyjny
/o-wiktorii               About
/rezerwacja               Booking flow
/rezerwacja/[id]          Booking status (via signed link, guests)
/faq                      Questions (incl. "Czy to masaż intymny? Nie.")
/kontakt                  Contact, approximate location, hours
/polityka-prywatnosci     Privacy policy
/regulamin                Terms
/konto                    Customer account (later milestone)
/admin                    Dashboard (role-protected, noindex)
```

**Home page sections:** hero (name, slogan, "Zarezerwuj", real portrait) → Energodynamika feature → services strip with "od … zł" → how a visit works (3 steps) → about Wiktoria (portrait + 2 sentences) → ingredients/atmosphere imagery → FAQ teaser → location (approximate) + booking CTA.

---

## 7. Wireframes

### 7.1 Customer booking (mobile)

See the four-screen sketch above in the conversation: *service/variant → day & time → details & payment → "request sent"*. Principles:
- Whole flow ≤ 3 steps; progress always visible; sticky bottom CTA (thumb reach, ≥ 44 px).
- Time chips show only free slots; unavailable days dimmed; "no times this day" has an empty state with next available day.
- Guest details: name, phone, email, optional note, marketing consent unchecked, privacy consent required. Notes field warns **not to enter health details**.
- Payment step in MVP shows a single option, **Gotówka na miejscu**, as a styled radio so online payment slots in later without redesign.
- Error states: slot taken meanwhile → friendly message + refreshed times; network error → retry + phone fallback.

### 7.2 Admin (phone-first)

```
┌ Dziś · wt 13 paź ────────────┐        ┌ Prośby (2) ──────────────────┐
│ ▍ 17:15  Anna K.             │        │ Anna K. · Energodynamika 60' │
│   Energodynamika 60'  ✔      │        │ wt 13.10 17:15 · 150 zł      │
│ ▍ 19:00  Marek P.            │        │ [ Potwierdź ]  [ Odrzuć ]    │
│   Abhyanga 90'        ⏳     │        │ ──────────────────────────── │
│                              │        │ Marek P. · Abhyanga 90'      │
│ Wolne: 16:00–17:00 · 20:30+  │        │ …                            │
└──────────────────────────────┘        └──────────────────────────────┘
┌ Dostępność ─────────────────┐        ┌ Usługi ──────────────────────┐
│ Tydzień 12–18 paź            │        │ Energodynamika    aktywna ▸  │
│ Pn  17:00–21:00     ▸        │        │  60' — 150 zł                │
│ Wt  zamknięte  [+ Otwórz]    │        │  90' — … zł      [+ wariant] │
│ Śr  17:00–21:00     ▸        │        └──────────────────────────────┘
│ …  [Zablokuj dzień]          │
└──────────────────────────────┘
```

Admin sections: **Dziś**, **Prośby**, **Kalendarz** (day/week), **Dostępność**, **Usługi**, **Klienci**, **Ustawienia**. Desktop shows the same pages with a sidebar.

---

## 8. Next.js learning map

You asked for deeper explanations of specific Next.js topics *at the moment we need them*. Here is where each one appears, so nothing is taught in the abstract:

| Concept | First used in | What you will implement yourself |
|---|---|---|
| **App Router, pages, layouts** (file-system routing, nested/shared layouts, route groups) | Phase 3 setup → Phase 5 | A `[locale]` layout with header/footer; a simple static page |
| **Server vs Client Components** (the "use client" boundary, what can run where) | Phase 5 | Make a theme toggle a client component while the page stays on the server |
| **Metadata** (static + `generateMetadata`, Open Graph, JSON-LD) | Phase 5 / 14 | Metadata and LocalBusiness JSON-LD for the home page |
| **Data fetching** in Server Components (query the DB directly, no API layer) | Phase 6 | Render the services list from Postgres |
| **Caching & revalidation** (static vs dynamic rendering, tags, `revalidateTag`, the Next 16 caching model) | Phase 6–8 | Cache the services list; invalidate when admin edits a service |
| **Forms & Server Actions** (progressive enhancement, validation, pending states) | Phase 7–8 | The contact form, then the booking details form with Zod |
| **Route Handlers** (`route.ts`: webhooks, `.ics` calendar download, cron) | Phase 8–11 | The `.ics` endpoint |
| **Proxy (formerly middleware)** (Next 16 renamed it; request-level redirects, locale routing) | Phase 5 (locale), Phase 7 (auth UX redirects) | Locale redirect rules; note why it is *not* our security boundary |

I will verify exact API names against the installed Next version at setup time, because this area changes between releases.

---

## 9. Assets and portfolio hygiene

- **Real portrait of Wiktoria** (provided): usable, she should approve its use. Because the repo is meant to be part of your **public portfolio** later, personal photos should either live outside git (Vercel/Blob/storage) or the repo stays private until Wiktoria agrees [CONFIRM].
- **Stock photos** (11 supplied): useful as placeholders. Before any public use we need **license + source for each one** recorded in `docs/assets.md`. Specifically:
  - one image shows a **third-party brand label** (a "BOTAVIKOS" candle) → exclude;
  - two lavender/oil still-lifes look **AI-generated** → fine as mood placeholders, but not as claims about her studio;
  - several show **faces of other people receiving massage** → stock model photos can feel misleading on a one-person site; prefer hands-only/detail shots.
- Honest imagery will convert better than stock: customers visit a flat, so **real photos of the treatment room, her oils and herbs** (the teal tray with potli bag, anise, cinnamon and candle is already close to her style) should replace stock before launch.
- Originals copied to `design/inbox/` (will be git-ignored until curated).

---

## 10. Phase 1 definition of done

- [x] Owner's decisions recorded
- [x] Service template and availability model defined
- [x] Booking lifecycle defined
- [x] Site map and wireframes drafted
- [x] ADRs 0001–0009 written
- [x] Owner approves → Phase 3 starts (repo creation, scaffolding)
