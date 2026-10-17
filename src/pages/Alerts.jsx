import { useState } from 'react'
import { BellRing, Trash2, Plus, CheckCircle2 } from 'lucide-react'
import Empty from '../components/Empty.jsx'
import { CoinIcon } from '../components/Coin.jsx'
import { useMarket, fmtUsd } from '../market.jsx'
import { useWallet } from '../wallet.jsx'
import { uid } from '../storage.js'
import { useToast } from '../toast.jsx'

export default function Alerts() {
  const { coins, get } = useMarket()
  const { alerts, setAlerts } = useWallet()
  const notify = useToast()
  const [form, setForm] = useState({ coin: 'bitcoin', dir: 'above', target: '' })
  const c = get(form.coin)

  const add = (e) => {
    e.preventDefault()
    if (!(+form.target > 0)) return notify('Enter a target price', 'error')
    setAlerts([{ id: uid(), ...form, target: +form.target, created: Date.now() }, ...alerts])
    setForm({ ...form, target: '' }); notify('Alert created', 'success')
  }

  return (
    <div className="grid grid-2">
      <form className="card col fade-up" onSubmit={add}>
        <div className="section-title"><Plus size={18} /> New price alert</div>
        <div className="field"><label>Coin</label><select className="input" value={form.coin} onChange={(e) => setForm({ ...form, coin: e.target.value })}>{coins.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.symbol})</option>)}</select></div>
        <div className="tabs"><button type="button" className={form.dir === 'above' ? 'active' : ''} onClick={() => setForm({ ...form, dir: 'above' })}>Price goes above</button><button type="button" className={form.dir === 'below' ? 'active' : ''} onClick={() => setForm({ ...form, dir: 'below' })}>Price goes below</button></div>
        <div className="field"><label>Target price (USD) · current {fmtUsd(c.price)}</label><input className="input" type="number" step="any" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} /></div>
        <div className="row wrap">{[-2, -1, -0.5, 0.5, 1, 2].map((p) => <button type="button" key={p} className="chip" onClick={() => setForm({ ...form, dir: p > 0 ? 'above' : 'below', target: (c.price * (1 + p / 100)).toPrecision(6) })}>{p > 0 ? '+' : ''}{p}%</button>)}</div>
        <button className="btn"><BellRing size={17} /> Create alert</button>
        <p className="xs muted">Tip: use ±0.5% to see an alert fire within a minute of live ticks.</p>
      </form>
      <div className="card fade-up">
        <div className="row between mb"><div className="section-title" style={{ margin: 0 }}>Your alerts ({alerts.length})</div>{alerts.some((a) => a.triggered) && <button className="btn ghost sm" onClick={() => setAlerts(alerts.filter((a) => !a.triggered))}>Clear triggered</button>}</div>
        {!alerts.length ? <Empty icon={BellRing} title="No alerts" text="Create one to get notified instantly." /> : (
          <div className="col stagger">{alerts.map((a) => { const x = get(a.coin); const dist = ((a.target - x.price) / x.price) * 100; return (
            <div key={a.id} className="row between card" style={{ padding: 12, opacity: a.triggered ? 0.6 : 1 }}>
              <span className="row"><CoinIcon coin={x} size={30} /><span><b>{x.symbol}</b> {a.dir} {fmtUsd(a.target)}<div className="xs muted">{a.triggered ? `Triggered ${new Date(a.triggered).toLocaleTimeString()}` : `${dist >= 0 ? '+' : ''}${dist.toFixed(2)}% away`}</div></span></span>
              <span className="row">{a.triggered ? <CheckCircle2 color="var(--success)" size={18} /> : <span className="pulse-dot" />}<button className="btn ghost icon" onClick={() => setAlerts(alerts.filter((y) => y.id !== a.id))}><Trash2 size={15} /></button></span>
            </div>) })}</div>
        )}
      </div>
    </div>
  )
}
