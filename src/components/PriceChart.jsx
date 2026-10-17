import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtUsd } from '../market.jsx'

const RANGES = { '5M': 5, '30M': 30, '1H': 60, '2H': 120, 'ALL': 9999 }

export default function PriceChart({ coin, height = 300 }) {
  const [range, setRange] = useState('1H')
  const cutoff = Date.now() - RANGES[range] * 60000
  const data = coin.history.filter((p) => p.t >= cutoff)
  const up = data.length > 1 && data[data.length - 1].price >= data[0].price
  const color = up ? '#10b981' : '#ef4444'
  return (
    <div>
      <div className="tabs mb">{Object.keys(RANGES).map((r) => <button key={r} className={range === r ? 'active' : ''} onClick={() => setRange(r)}>{r}</button>)}</div>
      <div style={{ height }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs><linearGradient id="pc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={0.4} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="t" tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} stroke="var(--muted)" fontSize={11} minTickGap={40} />
            <YAxis domain={['auto', 'auto']} tickFormatter={(v) => fmtUsd(v)} stroke="var(--muted)" fontSize={11} width={80} />
            <Tooltip contentStyle={{ background: 'var(--card-solid)', border: '1px solid var(--border)', borderRadius: 12 }} labelFormatter={(t) => new Date(t).toLocaleTimeString()} formatter={(v) => [fmtUsd(v), 'Price']} />
            <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2.5} fill="url(#pc)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
