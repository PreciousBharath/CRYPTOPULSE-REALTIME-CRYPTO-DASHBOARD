import { useMemo, useState } from 'react'
import { Search, Star, ArrowUpDown, LayoutGrid, List } from 'lucide-react'
import { CoinIcon, Sparkline, Change } from '../components/Coin.jsx'
import TradeModal from '../components/TradeModal.jsx'
import { useMarket, fmtUsd } from '../market.jsx'
import { useWallet } from '../wallet.jsx'

export default function Markets({ onlyWatch = false }) {
  const { coins } = useMarket()
  const { watch, toggleWatch } = useWallet()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState({ key: 'marketCap', dir: -1 })
  const [view, setView] = useState('table')
  const [trade, setTrade] = useState(null)

  const list = useMemo(() => coins
    .filter((c) => !onlyWatch || watch.includes(c.id))
    .filter((c) => `${c.name} ${c.symbol}`.toLowerCase().includes(q.toLowerCase()))
    .filter((c) => filter === 'all' || (filter === 'gainers' ? c.change24h > 0 : filter === 'losers' ? c.change24h < 0 : ['USDT', 'USDC'].includes(c.symbol)))
    .sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir), [coins, q, filter, sort, watch, onlyWatch])

  const th = (key, label) => <th style={{ cursor: 'pointer' }} onClick={() => setSort({ key, dir: sort.key === key ? -sort.dir : -1 })}>{label} <ArrowUpDown size={11} /></th>

  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="row between wrap">
        <div className="input-icon" style={{ width: 'min(340px, 100%)' }}><Search size={17} /><input className="input" placeholder="Search coins…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="row wrap">
          {['all', 'gainers', 'losers', 'stable'].map((f) => <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>)}
          <button className="btn ghost icon" onClick={() => setView(view === 'table' ? 'grid' : 'table')} title="Toggle view">{view === 'table' ? <LayoutGrid size={17} /> : <List size={17} />}</button>
        </div>
      </div>
      {!list.length && <div className="empty">No coins here yet{onlyWatch ? ' — star coins in Markets to add them.' : '.'}</div>}
      {view === 'table' ? (
        <div className="card table-wrap fade-up">
          <table className="table">
            <thead><tr><th></th><th>#</th>{th('name', 'Coin')}{th('price', 'Price')}{th('change24h', '24h')}{th('marketCap', 'Market cap')}{th('volume', 'Volume')}<th>Trend</th><th></th></tr></thead>
            <tbody>{list.map((c, i) => (
              <tr key={c.id}>
                <td><button onClick={() => toggleWatch(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Star size={16} fill={watch.includes(c.id) ? 'gold' : 'none'} color={watch.includes(c.id) ? 'gold' : 'var(--muted)'} /></button></td>
                <td className="muted">{i + 1}</td>
                <td><span className="row"><CoinIcon coin={c} size={30} /><span><b>{c.name}</b> <span className="muted small">{c.symbol}</span></span></span></td>
                <td><span className={`bold ${c.flash ? `flash-${c.flash}` : ''}`} style={{ padding: '2px 6px', borderRadius: 6 }}>{fmtUsd(c.price)}</span></td>
                <td><Change v={c.change24h} /></td>
                <td>{fmtUsd(c.marketCap)}</td>
                <td>{fmtUsd(c.volume)}</td>
                <td><Sparkline data={c.history} up={c.change24h >= 0} /></td>
                <td><button className="btn sm" onClick={() => setTrade(c.id)}>Trade</button></td>
              </tr>))}</tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-3 stagger">{list.map((c) => (
          <div key={c.id} className="card hover col" style={{ cursor: 'pointer' }} onClick={() => setTrade(c.id)}>
            <div className="row between"><span className="row"><CoinIcon coin={c} /><b>{c.name}</b></span><Change v={c.change24h} /></div>
            <div className={`bold ${c.flash ? `flash-${c.flash}` : ''}`} style={{ fontSize: '1.4rem' }}>{fmtUsd(c.price)}</div>
            <Sparkline data={c.history} up={c.change24h >= 0} width="100%" height={60} />
            <div className="row between small muted"><span>MCap {fmtUsd(c.marketCap)}</span><span>Vol {fmtUsd(c.volume)}</span></div>
          </div>))}</div>
      )}
      {trade && <TradeModal id={trade} onClose={() => setTrade(null)} />}
    </div>
  )
}
