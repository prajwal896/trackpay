import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { formatINR, formatHours, formatDate } from '../lib/format'

export default function TimeTracking() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedProject, setSelectedProject] = useState('')
  const [running, setRunning] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(0)
  const startRef = useRef(null)
  const intervalRef = useRef(null)

  const [showManual, setShowManual] = useState(false)
  const [manualForm, setManualForm] = useState({ project_id: '', entry_date: new Date().toISOString().slice(0, 10), hours: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const [projectsRes, entriesRes] = await Promise.all([
      supabase.from('projects').select('id, name, rate_per_hour, clients(name)').order('name'),
      supabase.from('time_entries').select('*, projects(name, clients(name))').order('entry_date', { ascending: false }).limit(30),
    ])
    setProjects(projectsRes.data || [])
    setEntries(entriesRes.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - startRef.current) / 1000))
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function startTimer() {
    if (!selectedProject) return
    startRef.current = Date.now()
    setElapsedSec(0)
    setRunning(true)
  }

  async function stopTimer() {
    setRunning(false)
    const project = projects.find((p) => p.id === selectedProject)
    if (!project) return
    const minutes = Math.max(1, Math.round(elapsedSec / 60))
    const amount = (minutes / 60) * Number(project.rate_per_hour)

    await supabase.from('time_entries').insert({
      user_id: user.id,
      project_id: project.id,
      entry_date: new Date().toISOString().slice(0, 10),
      duration_minutes: minutes,
      source: 'timer',
      amount,
      is_paid: false,
    })
    setElapsedSec(0)
    load()
  }

  function formatTimer(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0')
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  async function handleManualSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const project = projects.find((p) => p.id === manualForm.project_id)
    const minutes = Math.round(Number(manualForm.hours) * 60)
    const amount = (minutes / 60) * Number(project.rate_per_hour)

    const { error } = await supabase.from('time_entries').insert({
      user_id: user.id,
      project_id: manualForm.project_id,
      entry_date: manualForm.entry_date,
      duration_minutes: minutes,
      source: 'manual',
      amount,
      is_paid: false,
    })
    setSaving(false)
    if (!error) {
      setShowManual(false)
      setManualForm({ project_id: '', entry_date: new Date().toISOString().slice(0, 10), hours: '' })
      load()
    }
  }

  async function togglePaid(entryId, current) {
    await supabase.from('time_entries').update({ is_paid: !current }).eq('id', entryId)
    load()
  }

  if (projects.length === 0 && !loading) {
    return (
      <AppShell title="Time Tracking">
        <div className="panel"><div className="empty-state">
          <p>You need at least one project before you can track time.</p>
          <Link className="btn-primary" to="/projects" style={{ display: 'inline-flex', marginTop: 16 }}>Go to projects</Link>
        </div></div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Time Tracking">
      <div className="timer-panel">
        <div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 8 }}>
            {running ? 'Tracking now' : 'Timer'}
          </div>
          <div className="timer-display">{formatTimer(elapsedSec)}</div>
        </div>
        <div className="timer-select">
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} disabled={running}>
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.clients?.name} — {p.name}</option>
            ))}
          </select>
          {!running ? (
            <button className="timer-btn" onClick={startTimer} disabled={!selectedProject}>Start</button>
          ) : (
            <button className="timer-btn stop" onClick={stopTimer}>Stop</button>
          )}
        </div>
      </div>

      <div className="page-head">
        <p>Recent time entries</p>
        <button className="btn-secondary" onClick={() => setShowManual(true)}>+ Add time manually</button>
      </div>

      <div className="panel">
        {loading ? (
          <div className="panel-empty">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="panel-empty">No time logged yet.</div>
        ) : (
          <table>
            <thead><tr><th>Date</th><th>Project</th><th>Duration</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="cell-muted">{formatDate(e.entry_date)}</td>
                  <td>{e.projects?.clients?.name} — {e.projects?.name}</td>
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

      {showManual && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowManual(false)}>
          <div className="modal-card">
            <div className="modal-head">
              <h3>Add time manually</h3>
              <button className="modal-close" onClick={() => setShowManual(false)}>✕</button>
            </div>
            <form onSubmit={handleManualSubmit}>
              <div className="field">
                <label>Project</label>
                <select required value={manualForm.project_id} onChange={(e) => setManualForm({ ...manualForm, project_id: e.target.value })}>
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.clients?.name} — {p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Date</label>
                  <input type="date" required value={manualForm.entry_date} onChange={(e) => setManualForm({ ...manualForm, entry_date: e.target.value })} />
                </div>
                <div className="field">
                  <label>Hours</label>
                  <input type="number" step="0.25" min="0.25" required value={manualForm.hours} onChange={(e) => setManualForm({ ...manualForm, hours: e.target.value })} placeholder="e.g. 2.5" />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowManual(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add entry'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}
