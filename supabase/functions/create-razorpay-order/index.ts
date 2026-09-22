// Supabase Edge Function: create-razorpay-order
//
// This runs on Supabase's servers (Deno runtime), not in the browser, so it
// is the only safe place to hold your Razorpay KEY SECRET. The frontend
// calls this function to get an order_id, then opens Razorpay Checkout
// with that order_id.
//
// SETUP:
// 1. Install the Supabase CLI: npm install -g supabase
// 2. From the project root, log in and link this project:
//      supabase login
//      supabase link --project-ref oiwcqasnxfjddrbqzctr
// 3. Set your Razorpay secrets (get these from Razorpay Dashboard -> Settings -> API Keys):
//      supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
//      supabase secrets set RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
// 4. Deploy the function:
//      supabase functions deploy create-razorpay-order
// 5. Update RAZORPAY_KEY_ID in src/lib/razorpay.js to match your public key.
//
// PLANS: adjust PLAN_AMOUNTS below to match your actual pricing.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const PLAN_AMOUNTS_PAISE = {
  pro: 49900,    // ₹499.00
  team: 129900,  // ₹1299.00
}

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') ?? ''
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan } = await req.json()
    const amount = PLAN_AMOUNTS_PAISE[plan]

    if (!amount) {
      return new Response(JSON.stringify({ error: 'Unknown plan' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const auth = 'Basic ' + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)

    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `trackpay_${plan}_${Date.now()}`,
      }),
    })

    const order = await razorpayRes.json()

    if (!razorpayRes.ok) {
      return new Response(JSON.stringify({ error: order }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ orderId: order.id, amount: order.amount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
