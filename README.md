# TrackPay

**Track your hours against each client and project, and always know exactly how much you've earned — no spreadsheets.**

TrackPay is a business-management web app built specifically for Indian freelancers. It replaces the spreadsheet-and-memory approach most solo freelancers use to track who they're working for, what they're owed, and how many hours went into each project.

![Status](https://img.shields.io/badge/status-Phase%201%20live-1F6F4A)
![Made for](https://img.shields.io/badge/made%20for-Indian%20freelancers-1F6F4A)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Supabase-1F6F4A)
![License](https://img.shields.io/badge/license-Personal%20project-lightgrey)

🔗 **Live demo:** _add your deployed Vercel URL here_
📦 **Repo:** [github.com/prajwal896/trackpay](https://github.com/prajwal896/trackpay)

---

## Table of contents

- [Why TrackPay exists](#why-trackpay-exists)
- [What TrackPay does (Phase 1)](#what-trackpay-does-phase-1)
- [A typical user journey](#a-typical-user-journey)
- [Design](#design)
- [Tech stack](#tech-stack)
- [Screenshots](#screenshots)
- [Running it locally](#running-it-locally)
- [Environment variables](#environment-variables)
- [Setting up payments (optional, Phase 2)](#setting-up-payments-optional-phase-2)
- [Project structure](#project-structure)
- [Database schema](#database-schema)
- [Security](#security)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Credit](#credit)

---

## Why TrackPay exists

Most freelancers in India juggle client work across scattered WhatsApp chats, half-updated Excel sheets, and memory. By the time payment day rolls around, nobody quite remembers how many hours went into which project, which client already paid, and which is still pending. Existing tools are either built for Western markets (missing GST, INR, and UPI as first-class concepts) or are bloated agency-scale CRMs that are overkill for a single freelancer with five clients.

TrackPay's philosophy: **the freelancer already knows how to do their work — the tool's job is just to manage the business around that work.** Nothing more. No marketplace, no proposal-writing AI, no client-matching algorithm. Just a clean, accurate record of hours, clients, and earnings.

## What TrackPay does (Phase 1)

TrackPay covers one complete loop: **add a client → add a project under them → track hours against it → see what you've earned.**

### 🏠 Landing page
A scroll-driven, Apple-style hero animation — a 240-frame canvas sequence that is scroll-scrubbed rather than autoplaying. It only advances while the person is actively scrolling, freezes the instant they stop, and reverses cleanly on scroll-up. The hero pins in place for the length of the scrub, then releases into normal page scroll, with small text callouts fading in and out in sync with what the animation is showing. Below the hero: a features overview, a three-step "how it works" section, and three pricing tiers.

### 🔐 Sign up / Log in
Email + password auth via Supabase. Sign-up also captures the person's name and how they heard about TrackPay (useful for figuring out which channels actually bring freelancers in). Every account's data is isolated with Postgres Row Level Security — nobody can see another user's clients, projects, or hours, and that's enforced at the database level, not just hidden in the UI.

### 📊 Dashboard
The month at a glance:
- **Total earned** — sum of everything marked "paid" this month
- **Hours worked** — total logged time across every client, this month
- **Active projects** — projects that aren't paused and aren't at 100%
- A **client-by-client breakdown table** for the current month (hours, earned)

### 👥 Clients
- Add / edit / delete clients — name, company, email, phone, state, GST number, payment terms
- Client detail page shows all-time hours and earnings for that client, plus every project under them
- GST and payment-terms fields are captured now specifically so invoicing (Phase 2) doesn't require re-entering client data

### 📁 Projects
- Each project belongs to one client and carries its own hourly rate (₹/hr), estimated hours, and deadline
- Progress is tracked in clean 10% increments (0%, 10%, 20% … 100%) rather than a free-form percentage
- A project can be **paused independently of its progress** — pausing doesn't reset or hide how far along it is, it's just an orthogonal flag
- Project detail page shows total hours, total value, amount earned so far, and every individual time entry logged against it

### ⏱️ Time Tracking
- A **live start/stop timer** tied to a specific client + project — starts a running clock, computes the amount owed the moment you stop (`hours × rate`)
- **Manual time entry** for anything logged after the fact (forgot to start the timer, or bulk-adding a week's work)
- Every time entry can be marked **"paid"** once the client actually settles up — this single flag is what feeds the "Total earned" number on the dashboard, whether the money came in manually now or (later, in Phase 2) through an actual invoice

## A typical user journey

1. Freelancer signs up, lands on an empty dashboard
2. Adds their first client (say, a startup they've been doing design work for) — name, GST number, payment terms
3. Adds a project under that client — "Landing page redesign," ₹800/hr
4. Starts the timer, works for a few hours, stops it — the entry appears instantly with the computed amount
5. At the end of the month, checks the dashboard: total hours, total earned, and exactly which client owes what
6. Client pays via UPI/bank transfer (outside the app, for now) — freelancer marks the relevant time entries as paid
7. Dashboard's "Total earned" updates to reflect it

This loop is the entire Phase 1 product. Nothing else is required to get value from it.

## Design

- **Two visual themes in one app:** the marketing/landing page uses a dark navy hero with violet/blue accents (matching the scroll animation's own palette), while everything past sign-up — the actual app — switches to an off-white base with a deep green accent (`#1F6F4A`) and white text on green surfaces.
- **Typography:** Space Grotesk for headings, Inter for body text — a geometric/technical display face paired with a clean, highly legible workhorse font.
- **Icons:** Material Symbols Outlined throughout the app shell (sidebar, stat cards, buttons).
- **No component framework.** Every page is hand-styled plain CSS, grouped by area (`marketing.css`, `auth.css`, `app.css`, `legal.css`) — chosen deliberately for speed of iteration over a component library's overhead.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite), React Router | Fast dev server, simple client-side routing for a small number of screens |
| Styling | Plain CSS, no framework | Full control over the two distinct themes without fighting a design system |
| Backend | Supabase (Postgres + Auth + Row Level Security) | Real relational data (clients → projects → time entries) with proper foreign keys and aggregate queries — a better fit than a NoSQL store for this data shape |
| Payments | Razorpay, via a Supabase Edge Function | The Edge Function creates orders server-side so the Razorpay secret key never touches the frontend. Built and working, intentionally switched off until Phase 2 |
| Hosting | Vercel | Zero-config deploys for Vite, generous free tier, automatic HTTPS |

No custom backend server anywhere — Supabase and a single Edge Function handle everything that needs to run outside the browser.

## Screenshots

_Add screenshots or a short GIF of the Dashboard, the scroll-scrubbed hero animation, and the Time Tracking timer here — this is the section a video-generation tool will lean on most to script a walkthrough._

## Running it locally

```bash
git clone https://github.com/prajwal896/trackpay.git
cd trackpay
npm install
cp .env.example .env.local   # then fill in real values, see below
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

```bash
npm run build      # production build
npm run preview    # preview the production build locally
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → Data API |
| `VITE_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API Keys (publishable/anon key) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay dashboard → Settings → API Keys (public Key ID — not the secret) |

`.env.local` is gitignored and never committed. All three values above are public-safe (not secrets) — they're kept as env vars so they can be changed per environment (local vs. Vercel) without touching code.

**Deploying to Vercel:** add the same three variables under Project → Settings → Environment Variables, then deploy. Vite bakes env vars in at build time, so a redeploy is needed after changing one. `vercel.json` in this repo handles the client-side routing rewrite React Router needs — without it, refreshing on a route like `/dashboard` would 404.

## Setting up payments (optional, Phase 2)

Payments are fully built but switched off (`PAYMENTS_ENABLED = false` in `src/pages/Dashboard.jsx`) — the app is free for everyone right now, on purpose. To turn it on:

1. Get Razorpay API keys from **Dashboard → Settings → API Keys**. Start in test mode.
2. Install the Supabase CLI (`npm install -g supabase`), then `supabase login` and `supabase link --project-ref <your-project-ref>`.
3. Set the secret server-side (never in frontend code): `supabase secrets set RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=...`
4. Deploy the order-creation function: `supabase functions deploy create-razorpay-order`
5. Set `VITE_RAZORPAY_KEY_ID` (the public key) in `.env.local` / Vercel.
6. Flip `PAYMENTS_ENABLED` to `true` in `src/pages/Dashboard.jsx`.

## Project structure

```
src/
  components/     Hero animation, marketing nav, app sidebar shell, route guard
  pages/          One file per route (Landing, Signup, Login, Dashboard, Clients,
                  ClientDetail, Projects, ProjectDetail, TimeTracking, Privacy, Terms)
  lib/            Supabase client, auth context, formatting helpers, Razorpay helper
  styles/         Plain CSS, grouped by area (marketing, auth, app, legal)
public/
  frames/         240 JPEG frames powering the scroll-scrubbed hero
  favicon*, og-image.png, site.webmanifest, robots.txt, sitemap.xml
supabase/
  functions/      Edge Function source for Razorpay order creation
```

## Database schema

Four tables in Supabase, all with Row Level Security so each user only ever sees their own rows:

```
profiles        id (→ auth.users), full_name, source, created_at
clients         id, user_id, name, company, email, phone, state,
                gst_number, payment_terms, created_at
projects        id, user_id, client_id (→ clients), name, rate_per_hour,
                estimated_hours, deadline, progress_percent (0–100, step 10),
                is_paused, created_at
time_entries    id, user_id, project_id (→ projects), entry_date,
                duration_minutes, source (timer/manual), amount, is_paid,
                created_at
```

A trigger on `auth.users` automatically creates the matching `profiles` row on sign-up, using the name and referral source captured in the sign-up form.

## Security

- **Row Level Security** on every table — a user can only ever read or write rows where `user_id` matches their own auth ID. This is enforced in Postgres itself, not just in the frontend.
- The Supabase URL and publishable/anon key are safe to expose in frontend code by design — RLS is what actually protects the data, not hiding these values.
- The Razorpay **secret** key never appears in frontend code or this repo — it lives only as a Supabase Edge Function secret, set via the CLI.
- `.env.local` (real, working credentials for local dev) is gitignored and has never been committed to this repo.

## Roadmap

- **Phase 1 (live now):** Dashboard, Clients, Projects, Time Tracking
- **Phase 2:** GST-ready invoice generation (CGST/SGST/IGST based on client state), real invoice-based payment status, Razorpay live payments
- **Phase 3:** Leads and follow-up tracking (source, status, next follow-up date), a real custom domain
- **Phase 4:** Reports, exports, and general polish

## FAQ

**Is this a marketplace like Upwork or Fiverr?**
No. TrackPay doesn't help you find clients — it helps you manage the ones you already have.

**Does it generate GST invoices yet?**
Not yet — that's Phase 2. Client GST numbers and payment terms are already captured so nothing needs re-entering once invoicing ships.

**Is it free?**
Yes, entirely, right now. Pricing tiers exist on the landing page as a preview of what's coming, but no payment is currently required or even possible — the "Upgrade to Pro" button is visibly present but intentionally inactive.

## Credit

Built by [Prajwal Adaki](https://www.linkedin.com/in/prajwaladaki) — [Instagram](https://www.instagram.com/prxwlll)
