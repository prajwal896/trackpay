import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import '../styles/auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="nav-logo"><span className="dot" />TrackPay</div>
        <div className="pitch">
          <h2>Welcome back.</h2>
          <p>Log in to see your hours, your projects and what you have earned.</p>
        </div>
        <div className="foot-note">Built for Indian freelancers</div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <Link className="back-home" to="/">← Back to TrackPay</Link>
          <h1>Log in</h1>
          <p className="sub">Welcome back. Enter your details to continue.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="auth-foot">
            No account yet? <Link to="/signup">Start Free</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
