import { Link } from 'react-router-dom'

export default function MarketingNav({ scrolled }) {
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <span className="dot" />TrackPay
      </div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#how-it-works">How it Works</a>
      </div>
      <div className="nav-right">
        <Link className="btn-login" to="/login">Log in</Link>
      </div>
    </nav>
  )
}
