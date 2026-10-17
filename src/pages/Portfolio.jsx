import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Wallet, Coins, TrendingUp, PiggyBank, RotateCcw } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import Empty from '../components/Empty.jsx'
import TradeModal from '../components/TradeModal.jsx'
import { CoinIcon } from '../components/Coin.jsx'
import { useMarket, fmtUsd, pct } from '../market.jsx'
import { useWallet } from '../wallet.jsx'

export default function Portfolio() {
  const { get } = useMarket()
  const { cash, holdings, value, invested, reset } = useWallet()
  const [trade, setTrade] = useState(null)
  const rows = Object.entries(holdings).map(([id, h]) => { const c = get(id); return { c, ...h, val: h.qty * c.price, pnl: h.qty * (c.price - h.avg) } })
  const pnl = value - invested
  const pie = [...rows.map((r) => ({ name: r.c.symbol, value: r.val, color: r.c.color })), { name: 'Cash', value: cash, color: '#94a3b8' }]

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="grid grid-4 stagger">
        <StatCard icon={Wallet} label="Net worth" value={value + cash} prefix="$" decimals={2} />
        <StatCard icon={Coins} label="Holdings value" value={value} prefix="$" decimals={2} />
        <StatCard icon={TrendingUp} label="Unrealised P&L" value={pnl} prefix="$" decimals={2} trend={invested ? (pnl / invested) * 100 : 0} />
        <StatCard icon={PiggyBank} label="Cash balance" value={cash} prefix="$" decimals={2} />
      </div>
      <div className="grid grid-2">
        <div className="card fade-up">
          <div className="section-title">Allocation</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>{pie.map((p) => <Cell key={p.name} fill={p.color} />)}</Pie>
                <Tooltip formatter={(v) => fmtUsd(v)} contentStyle={{ background: 'var(--card-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="row wrap small">{pie.map((p) => <span key={p.name} className="row" style={{ gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />{p.name} {((p.value / (value + cash)) * 100).toFixed(1)}%</span>)}</div>
        </div>
        <div className="card fade-up">
          <div className="row between mb"><div className="section-title" style={{ margin: 0 }}>Holdings</div><button className="btn ghost sm" onClick={() => confirm('Reset paper wallet to $100,000?') && reset()}><RotateCcw size={14} /> Reset</button></div>
          {!rows.length ? <Empty icon={Coins} title="No holdings yet" text="Open any coin from Markets and place your first paper trade." /> : (
            <div className="table-wrap"><table className="table">
              <thead><tr><th>Asset</th><th>Qty</th><th>Avg</th><th>Value</th><th>P&L</th></tr></thead>
              <tbody>{rows.map((r) => (
                <tr key={r.c.id} style={{ cursor: 'pointer' }} onClick={() => setTrade(r.c.id)}>
                  <td><span className="row"><CoinIcon coin={r.c} size={26} /><b>{r.c.symbol}</b></span></td>
                  <td>{r.qty.toFixed(5)}</td><td>{fmtUsd(r.avg)}</td><td className="bold">{fmtUsd(r.val)}</td>
                  <td style={{ color: r.pnl >= 0 ? 'var(--success)' : 'var(--danger)' }} className="bold">{fmtUsd(r.pnl)}<div className="xs">{pct((r.pnl / (r.qty * r.avg)) * 100)}</div></td>
                </tr>))}</tbody>
            </table></div>
          )}
        </div>
      </div>
      {trade && <TradeModal id={trade} onClose={() => setTrade(null)} />}
    </div>
  )
}
