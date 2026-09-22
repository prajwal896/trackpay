// Loads the Razorpay Checkout script once and opens the payment modal.
// Order creation happens server-side (see supabase/functions/create-razorpay-order)
// because it needs the Razorpay secret key, which must never live in
// frontend code.

let scriptPromise = null

function loadRazorpayScript() {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Could not load Razorpay checkout'))
    document.body.appendChild(script)
  })
  return scriptPromise
}

// RAZORPAY_KEY_ID here is the PUBLIC key (starts with rzp_test_ or rzp_live_),
// safe to expose in frontend code. Set it via the VITE_RAZORPAY_KEY_ID env
// var (see .env.example) so it can be swapped between test/live without
// touching code.
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_REPLACE_WITH_YOUR_KEY_ID'

export async function openRazorpayCheckout({ orderId, amountInPaise, name, email, description, onSuccess, onDismiss }) {
  await loadRazorpayScript()

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise,
    currency: 'INR',
    name: 'TrackPay',
    description: description || 'TrackPay subscription',
    order_id: orderId,
    prefill: { name, email },
    theme: { color: '#1F6F4A' },
    handler: function (response) {
      if (onSuccess) onSuccess(response)
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss()
      },
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}
