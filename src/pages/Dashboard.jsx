import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { formatINR, formatHours, monthRange, currentMonthLabel } from '../lib/format'
import { openRazorpayCheckout } from '../lib/razorpay'

// Flip this to true once the create-razorpay-order Edge Function is deployed
// with real (even test-mode) Razorpay keys. Until then, the button is
// hidden so people do not hit a checkout that cannot actually work yet.
const PAYMENTS_ENABLED = false

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [entries, setEntries] = useState([])
  const [upgrading, setUpgrading] = useState(false)

  async function handleUpgrade() {
    setUpgrading(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { plan: 'pro' },
      })
      if (error || !data?.orderId) {
        alert('Could not start checkout. Make sure the create-razorpay-order function is deployed with valid Razorpay keys.')
        setUpgrading(false)
        return
      }
      await openRazorpayCheckout({
        orderId: data.orderId,
        amountInPaise: data.amount,
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        description: 'TrackPay Pro — monthly',
        onSuccess: () => {
          alert('Payment successful. Thank you for upgrading to Pro.')
          setUpgrading(false)
        },
        onDismiss: () => setUpgrading(false),
      })
    } catch {
      setUpgrading(false)
    }
  }

  useEffect(() => {
    async function load() {
      const { start, end } = monthRange()

      const [clientsRes, projectsRes, entriesRes] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('time_entries').select('*').gte('entry_date', start).lt('entry_date', end),
      ])

      setClients(clientsRes.data || [])
      setProjects(projectsRes.data || [])
      setEntries(entriesRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const totalMinutes = entries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0)
  const totalEarned = entries.filter((e) => e.is_paid).reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const activeProjects = projects.filter((p) => !p.is_paused && p.progress_percent < 100).length

  const projectClientMap = {}
  projects.forEach((p) => { projectClientMap[p.id] = p.client_id })

  const byClient = {}
  clients.forEach((c) => { byClient[c.id] = { name: c.name, minutes: 0, earned: 0 } })
  entries.forEach((e) => {
    const clientId = projectClientMap[e.project_id]
    if (clientId && byClient[clientId]) {
      byClient[clientId].minutes += e.duration_minutes || 0
      if (e.is_paid) byClient[clientId].earned += Number(e.amount || 0)
    }
  })
  const clientRows = Object.values(byClient).filter((c) => c.minutes > 0 || c.earned > 0)

  return (
    <AppShell title="Dashboard">
      {loading ? (
        <div className="empty-state">Loading your dashboard...</div>
      ) : (
        <>
          <div className="page-head">
            <div>
              <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>{currentMonthLabel()}</p>
            </div>
            {PAYMENTS_ENABLED ? (
              <button className="btn-secondary" onClick={handleUpgrade} disabled={upgrading}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>bolt</span>
                {upgrading ? 'Opening checkout...' : 'Upgrade to Pro — ₹499/mo'}
              </button>
            ) : (
              <button className="btn-secondary" disabled title="Payments are not turned on yet — everything is free for now">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>bolt</span>
                Upgrade to Pro <span className="badge-soon">Coming soon</span>
              </button>
            )}
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-label">
                <span className="stat-label-text">Total earned</span>
                <span className="stat-icon-box"><span className="material-symbols-outlined">payments</span></span>
              </div>
              <div className="stat-value">{formatINR(totalEarned)}</div>
              <div className="stat-sub">Marked as paid this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">
                <span className="stat-label-text">Hours worked</span>
                <span className="stat-icon-box"><span className="material-symbols-outlined">schedule</span></span>
              </div>
              <div className="stat-value">{formatHours(totalMinutes)}<span>hrs</span></div>
              <div className="stat-sub">Across all clients this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">
                <span className="stat-label-text">Active projects</span>
                <span className="stat-icon-box"><span className="material-symbols-outlined">business_center</span></span>
              </div>
              <div className="stat-value">{activeProjects}</div>
              <div className="stat-sub">Not paused, not completed</div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2>This month, by client</h2>
              <Link className="btn-text" to="/clients">View all clients</Link>
            </div>
            {clientRows.length === 0 ? (
              <div className="panel-empty">No time logged yet this month. Start tracking to see your totals here.</div>
            ) : (
              <table>
                <thead>
                  <tr><th>Client</th><th>Hours</th><th>Earned</th></tr>
                </thead>
                <tbody>
                  {clientRows.map((c, i) => (
                    <tr key={i}>
                      <td>{c.name}</td>
                      <td className="cell-muted">{formatHours(c.minutes)} hrs</td>
                      <td>{formatINR(c.earned)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AppShell>
  )
}
