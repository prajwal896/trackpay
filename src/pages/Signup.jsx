import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import '../styles/auth.css'

const SOURCES = ['Instagram', 'YouTube', 'LinkedIn', 'Referral', 'Google Search', 'Other']

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, source },
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      navigate('/dashboard')
    } else {
      // Email confirmation is turned on for this project, so there is no
      // session yet. The person needs to click the link in their inbox
      // before they can log in.
      setNeedsConfirmation(true)
    }
  }

  if (needsConfirmation) {
    return (
      <div className="auth-page">
        <AuthSide />
        <div className="auth-form-side">
          <div className="auth-card">
            <Link className="back-home" to="/">← Back to TrackPay</Link>
            <h1>Check your inbox</h1>
            <p className="sub">We sent a confirmation link to {email}. Click it to activate your account, then come back and log in.</p>
            <div className="auth-success">
              Once your email is confirmed, head to the login page to get started.
            </div>
            <div className="auth-foot">
              <Link to="/login">Go to login</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <AuthSide />
      <div className="auth-form-side">
        <div className="auth-card">
          <Link className="back-home" to="/">← Back to TrackPay</Link>
          <h1>Create your account</h1>
          <p className="sub">Set up TrackPay in under a minute.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>
            <div className="field">
              <label htmlFor="source">How did you hear about us?</label>
              <select id="source" required value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="" disabled>Select one</option>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="auth-foot">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthSide() {
  return (
    <div className="auth-side">
      <div className="nav-logo"><span className="dot" />TrackPay</div>
      <div className="pitch">
        <h2>Every hour, every client, one clear total.</h2>
        <p>TrackPay keeps your freelance work organised so you always know what you have earned.</p>
      </div>
      <div className="foot-note">Built for Indian freelancers</div>
    </div>
  )
}
