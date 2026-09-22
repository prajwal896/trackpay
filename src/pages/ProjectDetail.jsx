import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { supabase } from '../lib/supabaseClient'
import { formatINR, formatHours, formatDate } from '../lib/format'

const PROGRESS_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data: projectData } = await supabase.from('projects').select('*, clients(id, name)').eq('id', id).single()
    const { data: entriesData } = await supabase.from('time_entries').select('*').eq('project_id', id).order('entry_date', { ascending: false })
    setProject(projectData)
    setEntries(entriesData || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function updateProgress(value) {
    await supabase.from('projects').update({ progress_percent: value }).eq('id', id)
    load()
  }

  async function togglePaused() {
    await supabase.from('projects').update({ is_paused: !project.is_paused }).eq('id', id)
    load()
  }

  async function togglePaid(entryId, current) {
    await supabase.from('time_entries').update({ is_paid: !current }).eq('id', entryId)
    load()
  }

  async function handleDelete() {
    if (!confirm('Delete this project and all its time entries? This cannot be undone.')) return
    await supabase.from('projects').delete().eq('id', id)
    navigate('/projects')
  }

  if (loading || !project) {
    return <AppShell title="Project"><div className="empty-state">Loading...</div></AppShell>
  }

  const totalMinutes = entries.reduce((s, e) => s + (e.duration_minutes || 0), 0)
  const totalEarned = entries.filter((e) => e.is_paid).reduce((s, e) => s + Number(e.amount || 0), 0)
  const totalValue = entries.reduce((s, e) => s + Number(e.amount || 0), 0)

  return (
    <AppShell title={project.name}>
      <Link className="detail-back" to="/projects">← All projects</Link>

      <div className="panel">
        <div className="panel-head">
          <h2>{project.clients?.name} · ₹{project.rate_per_hour}/hr</h2>
          <button className={`btn-toggle ${project.is_paused ? 'on' : ''}`} onClick={togglePaused}>
            {project.is_paused ? 'Paused · resume' : 'Pause project'}
          </button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
            <span>Progress</span>
            <span>{project.progress_percent}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${project.progress_percent}%` }} />
          </div>
          <div className="field" style={{ marginTop: 16, maxWidth: 180 }}>
            <label>Update progress</label>
            <select value={project.progress_percent} onChange={(e) => updateProgress(Number(e.target.value))}>
              {PROGRESS_STEPS.map((s) => <option key={s} value={s}>{s}%</option>)}
            </select>
          </div>
          {project.deadline && <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>Deadline: {formatDate(project.deadline)}</p>}
        </div>
      </div>

      <div className="stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label"><span className="stat-label-text">Total hours</span><span className="stat-icon-box"><span className="material-symbols-outlined">schedule</span></span></div>
          <div className="stat-value">{formatHours(totalMinutes)}<span>hrs</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><span className="stat-label-text">Total value</span><span className="stat-icon-box"><span className="material-symbols-outlined">account_balance_wallet</span></span></div>
          <div className="stat-value">{formatINR(totalValue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><span className="stat-label-text">Earned so far</span><span className="stat-icon-box"><span className="material-symbols-outlined">payments</span></span></div>
          <div className="stat-value">{formatINR(totalEarned)}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Time entries</h2>
          <Link className="btn-text" to="/time-tracking">+ Log time</Link>
        </div>
        {entries.length === 0 ? (
          <div className="panel-empty">No time logged for this project yet.</div>
        ) : (
          <table>
            <thead><tr><th>Date</th><th>Duration</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="cell-muted">{formatDate(e.entry_date)}</td>
                  <td className="cell-muted">{formatHours(e.duration_minutes)} hrs</td>
                  <td>{formatINR(e.amount)}</td>
                  <td>
                    <button className={`btn-toggle ${e.is_paid ? 'on' : ''}`} onClick={() => togglePaid(e.id, e.is_paid)}>
                      {e.is_paid ? 'Paid' : 'Mark as paid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="btn-danger-text" onClick={handleDelete}>Delete this project</button>
    </AppShell>
  )
}
