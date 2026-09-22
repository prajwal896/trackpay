# TrackPay

Time tracking and business management for Indian freelancers. React + Vite frontend, Supabase for auth and database, Razorpay for payments.

## Run it locally

```
npm install
cp .env.example .env.local   # then fill in the real values (see below)
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

To build a production version:

```
npm run build
npm run preview
```

## Environment variables

Supabase and Razorpay keys are read from env vars, not hardcoded in the code. Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → Data API |
| `VITE_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API Keys (the publishable/anon key) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay dashboard → Settings → API Keys (the public Key ID, not the secret) |

`.env.local` is gitignored — it never gets committed. All three of these are public-safe values (not secrets), but keeping them in env vars means you can change them from the Vercel dashboard without touching code or redeploying manually.

**Deploying to Vercel:** add the same three variables under Project → Settings → Environment Variables, then redeploy. Vercel bakes them into the build at build time (that's how Vite env vars work), so a new deploy is needed after changing one.

## What is already wired up

- **Supabase project**: URL and public key are already set in `src/lib/supabaseClient.js`. These two values are safe to keep in frontend code; your data is protected by Row Level Security policies on the database, not by hiding these values.
- **Database schema**: `profiles`, `clients`, `projects`, `time_entries` tables, already created in your Supabase project with Row Level Security so each person only ever sees their own data.
- **Auth**: signup collects name, email, password, and how the person heard about TrackPay. Login is email and password only.
- **App pages**: Dashboard, Clients, Projects, Time Tracking, all reading and writing real data from Supabase.
- **Marketing site**: the scroll-scrubbed hero animation, features, how it works, and pricing sections, all in `src/pages/Landing.jsx`.
- **Legal pages**: Privacy Policy and Terms and Conditions at `/privacy` and `/terms`. Replace the `[DATE]` and `[SUPPORT EMAIL]` placeholders inside `src/pages/PrivacyPolicy.jsx` and `src/pages/Terms.jsx` before you publish.
- **SEO**: title, meta description, Open Graph tags, structured data, `robots.txt`, and `sitemap.xml` are all in place. They currently point at a placeholder domain, `https://trackpay.in`. Once you have a real domain, replace every occurrence of `trackpay.in` in `index.html`, `public/robots.txt`, and `public/sitemap.xml`.
- **Favicon and icons**: generated and linked in `index.html`, so this is done and you should not need to touch it again.

## One thing to check in Supabase before testing signup

Go to your Supabase dashboard, **Authentication → Providers → Email**, and check the **Confirm email** setting.

- If it is **on**, a new signup will not get a session right away. They will see a "check your inbox" message and need to click the confirmation link before they can log in. This is the safer setting for a real launch.
- If you want to skip that step while testing, turn it **off**. Signups will then get a session immediately and go straight to the dashboard.

## Setting up Razorpay payments

The "Upgrade to Pro" button on the Dashboard calls a Supabase Edge Function that creates a Razorpay order, then opens Razorpay Checkout. The Edge Function is the only safe place to hold your Razorpay secret key, since anything in the frontend code is visible to anyone who opens the browser's dev tools.

1. Create a Razorpay account and get your API keys from **Dashboard → Settings → API Keys**. Start with the test mode keys.
2. Install the Supabase CLI if you do not have it:
   ```
   npm install -g supabase
   ```
3. Log in and link this project:
   ```
   supabase login
   supabase link --project-ref oiwcqasnxfjddrbqzctr
   ```
4. Set your Razorpay secrets (never put these in frontend code):
   ```
   supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   supabase secrets set RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
5. Deploy the function:
   ```
   supabase functions deploy create-razorpay-order
   ```
6. Set `VITE_RAZORPAY_KEY_ID` in `.env.local` (locally) and in Vercel's Environment Variables (in production) to the same public Key ID from step 4 — this one is safe to expose in frontend code, unlike the secret.
7. Rebuild the app.

This gives you a working test-mode checkout you can demo when you apply for full Razorpay approval. Once Razorpay approves your account for live payments, repeat steps 4 and 6 with your live keys instead of test keys.

If you would rather use a different payment provider (Cashfree is a common alternative in India), the same pattern applies: create an Edge Function that holds the secret key and creates an order, and call it from the frontend the same way `handleUpgrade` does in `src/pages/Dashboard.jsx`.

## Project structure

```
src/
  components/     Shared UI: Hero animation, nav, sidebar shell, route guard
  pages/          One file per route
  lib/            Supabase client, auth context, formatting helpers, Razorpay helper
  styles/         Plain CSS, grouped by area (marketing, auth, app, legal)
public/
  frames/         240 JPEG frames for the scroll-scrubbed hero animation
supabase/
  functions/      Edge Function source for Razorpay order creation
```

## What is intentionally not built yet (Phase 2 and later)

- GST invoice generation
- Automatic payment status from an actual invoice (right now, "paid" is set manually per time entry)
- Leads and follow-up tracking

The database and UI copy are written so these can be added later without reworking what already exists.
