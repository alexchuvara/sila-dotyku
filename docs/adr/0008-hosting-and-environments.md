# ADR-0008: Free hosting while building, commercial plan before real customers

- Status: Accepted (owner decision, 2026-10-06)

## Context
Owner wants to start on free tiers; no domain yet. Vercel's free Hobby plan is for non-commercial use.

## Decision
- **Development / portfolio phase:** Vercel Hobby + Neon free + Resend free + Sentry free. No real customers or commercial activity on Hobby.
- **Before Launch A (public site with a real domain) or at the latest Launch B (real bookings):** move to a commercial arrangement (Vercel Pro ≈ $20/month, or re-evaluate Cloudflare). [VERIFY current terms at that time]
- Domain: not needed for development (`*.vercel.app`); choose a `.pl` domain before Launch A. Brand-consistent options to discuss later (not checked for availability).
- Environments: local → Preview (per PR) → Production; secrets only in the host's env settings; `.env.example` committed.

## Consequences
+ Zero cost during development.
− A planned migration step before launch; tracked as a roadmap task.
