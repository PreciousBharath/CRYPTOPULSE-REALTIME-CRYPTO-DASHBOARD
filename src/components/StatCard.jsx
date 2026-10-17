import { useEffect, useState } from 'react'

/** Animated count-up statistic card. */
export default function StatCard({ icon: Icon, label, value, prefix = '', suffix = '', decimals = 0, trend, color }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf, start
    const target = Number(value) || 0
    const step = (t) => {
      start ??= t
      const p = Math.min((t - start) / 900, 1)
      setN(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return (
    <div className="card hover stat">
      <div className="stat-icon" style={color ? { background: color } : undefined}><Icon size={22} /></div>
      <div>
        <div className="muted small">{label}</div>
        <div className="stat-value">{prefix}{n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</div>
        {trend !== undefined && <div className={`xs bold`} style={{ color: trend >= 0 ? 'var(--success)' : 'var(--danger)' }}>{trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(2)}%</div>}
      </div>
    </div>
  )
}
