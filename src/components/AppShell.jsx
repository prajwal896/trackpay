import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import '../styles/app.css'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/clients', label: 'Clients', icon: 'groups' },
  { to: '/projects', label: 'Projects', icon: 'business_center' },
  { to: '/time-tracking', label: 'Time Tracking', icon: 'timer' },
]

export default function AppShell({ title, children }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initial = (user?.user_metadata?.full_name || user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="nav-logo"><span className="dot" />TrackPay</div>
        <nav className="sidebar-links">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          {user && (
            <div className="sidebar-user-card">
              <div className="sidebar-avatar">{initial}</div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-email">{user.email}</span>
                <span className="sidebar-plan-badge">Free plan</span>
              </div>
            </div>
          )}
          <button className="sidebar-logout" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Log out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-topbar">
          <h1>{title}</h1>
        </div>
        <div className="app-content">{children}</div>
      </main>
    </div>
  )
}
