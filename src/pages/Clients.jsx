import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh',
  'Puducherry', 'Other',
]

export default function Clients() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [projectCounts, setProjectCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm())

  function emptyForm() {
    return { name: '', company: '', email: '', phone: '', state: '', gst_number: '', payment_terms: '' }
  }

  async function load() {
    setLoading(true)
    const [clientsRes, projectsRes] = await Promise.all([
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, client_id'),
    ])
    setClients(clientsRes.data || [])
    const counts = {}
    ;(projectsRes.data || []).forEach((p) => { counts[p.client_id] = (counts[p.client_id] || 0) + 1 })
    setProjectCounts(counts)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('clients').insert({ ...form, user_id: user.id })
    setSaving(false)
    if (!error) {
      setShowForm(false)
      setForm(emptyForm())
      load()
    }
  }

  return (
    <AppShell title="Clients">
      <div className="page-head">
        <p>{clients.length} client{clients.length === 1 ? '' : 's'}</p>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add client</button>
      </div>

      <div className="panel">
        {loading ? (
          <div className="panel-empty">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <p>No clients yet. Add your first client to start tracking work against them.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add client</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Company</th><th>Projects</th><th>State</th></tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="cell-name-row">
                      <span className="cell-avatar">{c.name.trim().charAt(0).toUpperCase()}</span>
                      <Link className="cell-link" to={`/clients/${c.id}`}>{c.name}</Link>
                    </div>
                  </td>
                  <td className="cell-muted">{c.company || '—'}</td>
                  <td className="cell-muted">{projectCounts[c.id] || 0}</td>
                  <td className="cell-muted">{c.state || '—'}</td>
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
              <h3>Add client</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Client's name" />
              </div>
              <div className="field">
                <label>Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name (optional)" />
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@company.com" />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" />
                </div>
              </div>
              <div className="field">
                <label>State</label>
                <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field">
                <label>GST number</label>
                <input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} placeholder="Optional, for invoicing later" />
              </div>
              <div className="field">
                <label>Payment terms</label>
                <input value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} placeholder="e.g. Net 15, on completion" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save client'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}
