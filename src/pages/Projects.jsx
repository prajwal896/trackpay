import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

const PROGRESS_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export default function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm())

  function emptyForm() {
    return { client_id: '', name: '', rate_per_hour: '', estimated_hours: '', deadline: '', progress_percent: 0, is_paused: false }
  }

  async function load() {
    setLoading(true)
    const [projectsRes, clientsRes] = await Promise.all([
      supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').order('name'),
    ])
    setProjects(projectsRes.data || [])
    setClients(clientsRes.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('projects').insert({
      ...form,
      rate_per_hour: Number(form.rate_per_hour),
      estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null,
      deadline: form.deadline || null,
      user_id: user.id,
    })
    setSaving(false)
    if (!error) {
      setShowForm(false)
      setForm(emptyForm())
      load()
    }
  }

  function statusLabel(p) {
    if (p.is_paused) return `Paused · ${p.progress_percent}%`
    if (p.progress_percent === 100) return 'Completed'
    return `${p.progress_percent}% in progress`
  }

  return (
    <AppShell title="Projects">
      <div className="page-head">
        <p>{projects.length} project{projects.length === 1 ? '' : 's'}</p>
        <button className="btn-primary" onClick={() => setShowForm(true)} disabled={clients.length === 0}>+ Add project</button>
      </div>

      {clients.length === 0 && !loading && (
        <div className="panel"><div className="panel-empty">Add a client first, then come back to create a project for them. <Link className="btn-text" to="/clients">Go to clients</Link></div></div>
      )}

      <div className="panel">
        {loading ? (
          <div className="panel-empty">Loading...</div>
        ) : projects.length === 0 ? (
          clients.length > 0 && (
            <div className="empty-state">
              <p>No projects yet. Add one to start tracking hours.</p>
              <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add project</button>
            </div>
          )
        ) : (
          <table>
            <thead><tr><th>Project</th><th>Client</th><th>Rate</th><th>Status</th></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="cell-name-row">
                      <span className="cell-avatar">{p.name.trim().charAt(0).toUpperCase()}</span>
                      <Link className="cell-link" to={`/projects/${p.id}`}>{p.name}</Link>
                    </div>
                  </td>
                  <td className="cell-muted">{p.clients?.name || '—'}</td>
                  <td className="cell-muted">₹{p.rate_per_hour}/hr</td>
                  <td>
                    <span className={`status-pill ${p.is_paused ? 'paused' : p.progress_percent === 100 ? 'paid' : 'pending'}`}>
                      {statusLabel(p)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-card">
            <div className="modal-head">
              <h3>Add project</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Client</label>
                <select required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
                  <option value="">Select client</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Project name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website redesign" />
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Rate (₹ per hour)</label>
                  <input required type="number" min="0" value={form.rate_per_hour} onChange={(e) => setForm({ ...form, rate_per_hour: e.target.value })} placeholder="800" />
                </div>
                <div className="field">
                  <label>Estimated hours</label>
                  <input type="number" min="0" value={form.estimated_hours} onChange={(e) => setForm({ ...form, estimated_hours: e.target.value })} placeholder="Optional" />
                </div>
              </div>
              <div className="field">
                <label>Deadline</label>
                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div className="field">
                <label>Progress</label>
                <select value={form.progress_percent} onChange={(e) => setForm({ ...form, progress_percent: Number(e.target.value) })}>
                  {PROGRESS_STEPS.map((s) => <option key={s} value={s}>{s}%</option>)}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}
