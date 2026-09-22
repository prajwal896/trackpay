export function formatINR(amount) {
  const n = Number(amount) || 0
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function formatHours(minutes) {
  const n = Number(minutes) || 0
  return (n / 60).toFixed(1)
}

export function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  const toISO = (d) => d.toISOString().slice(0, 10)
  return { start: toISO(start), end: toISO(end) }
}

export function currentMonthLabel() {
  return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
