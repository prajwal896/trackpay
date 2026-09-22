import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--off-white)',
      color: 'var(--ink)', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: 24,
    }}>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', marginBottom: 12 }}>Page not found</h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 24 }}>The page you are looking for does not exist.</p>
      <Link to="/" style={{ color: 'var(--green)', fontWeight: 600 }}>Back to TrackPay</Link>
    </div>
  )
}
