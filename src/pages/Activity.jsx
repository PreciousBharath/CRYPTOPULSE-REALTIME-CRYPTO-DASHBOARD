import { useState } from 'react'
import { Activity as Act, Download } from 'lucide-react'
import Empty from '../components/Empty.jsx'
import { fmtUsd } from '../market.jsx'
import { useWallet } from '../wallet.jsx'

export default function Activity() {
  const { txs } = useWallet()
  const [side, setSide] = useState('all')
  const list = txs.filter((t) => side === 'all' || t.side === side)
  const csv = () => {
    const rows = [['Date', 'Side', 'Symbol', 'Qty', 'Price', 'Total'], ...txs.map((t) => [new Date(t.at).toISOString(), t.side, t.symbol, t.qty, t.price, t.total])]
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' }))
    a.download = 'cryptopulse-trades.csv'; a.click()
  }
  return (
    <div className="card fade-up">
      <div className="row between wrap mb">
        <div className="tabs">{['all', 'buy', 'sell'].map((s) => <button key={s} className={side === s ? 'active' : ''} onClick={() => setSide(s)} style={{ textTransform: 'capitalize' }}>{s}</button>)}</div>
        <button className="btn ghost sm" onClick={csv} disabled={!txs.length}><Download size={15} /> Export CSV</button>
      </div>
      {!list.length ? <Empty icon={Act} title="No trades yet" text="Your paper-trading history appears here." /> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Time</th><th>Side</th><th>Asset</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>{list.map((t) => (
            <tr key={t.id}><td className="small">{new Date(t.at).toLocaleString()}</td><td><span className={`badge ${t.side === 'buy' ? 'green' : 'red'}`}>{t.side.toUpperCase()}</span></td><td className="bold">{t.symbol}</td><td>{t.qty}</td><td>{fmtUsd(t.price)}</td><td className="bold">{fmtUsd(t.total)}</td></tr>))}</tbody>
        </table></div>
      )}
    </div>
  )
}
