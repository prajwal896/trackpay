import { createClient } from '@supabase/supabase-js'

// These two values are safe to expose in frontend code — they are the
// public URL and the publishable/anon key. Actual data access is locked
// down by Row Level Security policies on the database side, not by hiding
// these values. They're read from env vars so they can be managed per
// environment (local vs. Vercel) without touching code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase env vars. Copy .env.example to .env.local (or set ' +
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in your Vercel project) and restart the dev server.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
