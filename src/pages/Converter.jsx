import { useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import { useMarket, fmtUsd } from '../market.jsx'

const FIAT = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.9, JPY: 149.5, AED: 3.67 }

export default function Converter() {
  const { coins } = useMarket()
  const opts = [...coins.map((c) => ({ id: c.id, label: `${c.symbol} · ${c.name}`, usd: c.price })), ...Object.entries(FIAT).map(([k, v]) => ({ id: k, label: `${k} (fiat)`, usd: 1 / v }))]
  const [from, setFrom] = useState('bitcoin')
  const [to, setTo] = useState('INR')
  const [amt, setAmt] = useState(1)
  const f = opts.find((o) => o.id === from), t = opts.find((o) => o.id === to)
  const result = (amt * f.usd) / t.usd

  return (
    <div className="card fade-up col" style={{ maxWidth: 620, margin: '0 auto', gap: 18 }}>
      <div className="section-title">Live currency converter</div>
      <div className="field"><label>Amount</label><input className="input" type="number" value={amt} onChange={(e) => setAmt(+e.target.value)} style={{ fontSize: '1.4rem', fontWeight: 700 }} /></div>
      <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>{opts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
      <button className="btn ghost" style={{ alignSelf: 'center' }} onClick={() => { setFrom(to); setTo(from) }}><ArrowDownUp size={18} /> Swap</button>
      <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>{opts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>
        <div className="small" style={{ opacity: 0.85 }}>{amt} {from.length > 4 ? coins.find((c) => c.id === from)?.symbol : from} =</div>
        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{result.toLocaleString(undefined, { maximumFractionDigits: result < 1 ? 8 : 2 })} {to.length > 4 ? coins.find((c) => c.id === to)?.symbol : to}</div>
        <div className="xs" style={{ opacity: 0.85 }}>Updates live with every price tick · 1 unit ≈ {fmtUsd(f.usd)}</div>
      </div>
    </div>
  )
}
