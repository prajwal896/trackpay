import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { supabase } from '../lib/supabaseClient'
import { formatINR, formatHours } from '../lib/format'

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [projects, setProjects] = useState([])
  const [totals, setTotals] = useState({ minutes: 0, earned: 0 })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)

  async function load() {
    setLoading(true)
    const { data: clientData } = await supabase.from('clients').select('*').eq('id', id).single()
    const { data: projectsData } = await supabase.from('projects').select('*').eq('client_id', id).order('created_at', { ascending: false })
    setClient(clientData)
    setForm(clientData)
    setProjects(projectsData || [])

    if (projectsData && projectsData.length > 0) {
      const projectIds = projectsData.map((p) => p.id)
      const { data: entries } = await supabase.from('time_entries').select('duration_minutes, amount, is_paid').in('project_id', projectIds)
      const minutes = (entries || []).reduce((s, e) => s + (e.duration_minutes || 0), 0)
      const earned = (entries || []).filter((e) => e.is_paid).reduce((s, e) => s + Number(e.amount || 0), 0)
      setTotals({ minutes, earned })
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function handleSave(e) {
    e.preventDefault()
    const { error } = await supabase.from('clients').update({
      name: form.name, company: form.company, email: form.email, phone: form.phone,
      state: form.state, gst_number: form.gst_number, payment_terms: form.payment_terms,
    }).eq('id', id)
    if (!error) { setEditing(false); load() }
  }

  async function handleDelete() {
    if (!confirm('Delete this client and all their projects and time entries? This cannot be undone.')) return
    await supabase.from('clients').delete().eq('id', id)
    navigate('/clients')
  }

  if (loading || !client) {
    return <AppShell title="Client"><div className="empty-state">Loading...</div></AppShell>
  }

  return (
    <AppShell title={client.name}>
      <Link className="detail-back" to="/clients">← All clients</Link>

      <div className="stats" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="stat-card">
          <div className="stat-label"><span className="stat-label-text">Total hours</span><span className="stat-icon-box"><span className="material-symbols-outlined">schedule</span></span></div>
          <div className="stat-value">{formatHours(totals.minutes)}<span>hrs</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><span className="stat-label-text">Total earned</span><span className="stat-icon-box"><span className="material-symbols-outlined">payments</span></span></div>
          <div className="stat-value">{formatINR(totals.earned)}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Client details</h2>
          {!editing && <button className="btn-text" onClick={() => setEditing(true)}>Edit</button>}
        </div>
        {editing ? (
          <form onSubmit={handleSave} style={{ padding: '20px 24px' }}>
            <div className="form-row">
              <div className="field"><label>Name</label><input required value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="field"><label>Company</label><input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="field"><label>Email</label><input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="field"><label>Phone</label><input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="field"><label>State</label><input value={form.state || ''} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
              <div className="field"><label>GST number</label><input value={form.gst_number || ''} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} /></div>
            </div>
            <div className="field"><label>Payment terms</label><input value={form.payment_terms || ''} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} /></div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => { setEditing(false); setForm(client) }}>Cancel</button>
              <button type="submit" className="btn-primary">Save changes</button>
            </div>
          </form>
        ) : (
          <table>
            <tbody>
              <tr><td className="cell-muted">Company</td><td>{client.company || '—'}</td></tr>
              <tr><td className="cell-muted">Email</td><td>{client.email || '—'}</td></tr>
              <tr><td className="cell-muted">Phone</td><td>{client.phone || '—'}</td></tr>
              <tr><td className="cell-muted">State</td><td>{client.state || '—'}</td></tr>
              <tr><td className="cell-muted">GST number</td><td>{client.gst_number || '—'}</td></tr>
              <tr><td className="cell-muted">Payment terms</td><td>{client.payment_terms || '—'}</td></tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Projects</h2>
          <Link className="btn-text" to="/projects">+ Add project</Link>
        </div>
        {projects.length === 0 ? (
          <div className="panel-empty">No projects yet for this client.</div>
        ) : (
          <table>
            <thead><tr><th>Project</th><th>Rate</th><th>Progress</th></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td><Link className="cell-link" to={`/projects/${p.id}`}>{p.name}</Link></td>
                  <td className="cell-muted">₹{p.rate_per_hour}/hr</td>
                  <td className="cell-muted">{p.is_paused ? 'Paused · ' : ''}{p.progress_percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="btn-danger-text" onClick={handleDelete}>Delete this client</button>
    </AppShell>
  )
}
