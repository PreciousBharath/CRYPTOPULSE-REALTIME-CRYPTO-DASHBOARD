import { useState } from 'react'
import { Globe, BarChart3, Bitcoin, Wallet, Pause, Play, TrendingUp, TrendingDown } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import PriceChart from '../components/PriceChart.jsx'
import TradeModal from '../components/TradeModal.jsx'
import { CoinIcon, Change } from '../components/Coin.jsx'
import { useMarket, fmtUsd } from '../market.jsx'
import { useWallet } from '../wallet.jsx'
import { useAuth } from '../auth.jsx'

export default function Dashboard() {
  const { coins, stats, source, paused, setPaused, lastSync } = useMarket()
  const { value, cash } = useWallet()
  const { user } = useAuth()
  const [sel, setSel] = useState('bitcoin')
  const [trade, setTrade] = useState(null)
  const coin = coins.find((c) => c.id === sel)
  const sorted = [...coins].sort((a, b) => b.change24h - a.change24h)
  const hour = new Date().getHours()

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="row between wrap fade-up">
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Good {hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}, <span className="gradient-text">{user.name.split(' ')[0]}</span></h2>
          <div className="row small muted"><span className="pulse-dot" style={paused ? { background: 'var(--warning)', animation: 'none' } : undefined} />
            {paused ? 'Stream paused' : 'Streaming live'} · source: <b>{source === 'live' ? 'CoinGecko API + live ticks' : 'simulated market'}</b>{lastSync && ` · synced ${lastSync.toLocaleTimeString()}`}</div>
        </div>
        <button className="btn ghost" onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />} {paused ? 'Resume' : 'Pause'} stream</button>
      </div>

      <div className="card" style={{ padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 34, width: 'max-content', animation: 'ticker 40s linear infinite' }}>
          {[...coins, ...coins].map((c, i) => (
            <span key={i} className="row small" style={{ gap: 6 }}><b>{c.symbol}</b> {fmtUsd(c.price)} <span style={{ color: c.change24h >= 0 ? 'var(--success)' : 'var(--danger)' }}>{c.change24h >= 0 ? '▲' : '▼'}{Math.abs(c.change24h).toFixed(2)}%</span></span>
          ))}
        </div>
        <style>{'@keyframes ticker { to { transform: translateX(-50%); } }'}</style>
      </div>

      <div className="grid grid-4 stagger">
        <StatCard icon={Globe} label="Market cap (top 20)" value={stats.totalCap / 1e9} prefix="$" suffix="B" decimals={1} />
        <StatCard icon={BarChart3} label="24h volume" value={stats.totalVol / 1e9} prefix="$" suffix="B" decimals={1} />
        <StatCard icon={Bitcoin} label="BTC dominance" value={stats.btcDominance} suffix="%" decimals={2} />
        <StatCard icon={Wallet} label="Your net worth" value={value + cash} prefix="$" decimals={2} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,2fr) minmax(280px,1fr)', gap: 18 }}>
        <div className="card fade-up">
          <div className="row between wrap mb">
            <div className="row"><CoinIcon coin={coin} /><div><div className="bold">{coin.name}</div><div className="row"><span className={`bold ${coin.flash ? `flash-${coin.flash}` : ''}`} style={{ fontSize: '1.4rem', padding: '0 4px', borderRadius: 6 }}>{fmtUsd(coin.price)}</span><Change v={coin.change24h} /></div></div></div>
            <div className="row wrap">
              <select className="select input" style={{ width: 170 }} value={sel} onChange={(e) => setSel(e.target.value)}>{coins.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              <button className="btn" onClick={() => setTrade(sel)}>Trade</button>
            </div>
          </div>
          <PriceChart coin={coin} />
        </div>
        <div className="col" style={{ gap: 18 }}>
          {[['Top gainers', sorted.slice(0, 4), TrendingUp], ['Top losers', sorted.slice(-4).reverse(), TrendingDown]].map(([title, list, Icon]) => (
            <div className="card fade-up" key={title}>
              <div className="section-title"><Icon size={18} /> {title}</div>
              <div className="col">{list.map((c) => (
                <button key={c.id} className="row between" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 10 }} onClick={() => setSel(c.id)}>
                  <span className="row"><CoinIcon coin={c} size={28} /><b>{c.symbol}</b></span>
                  <span className="row small">{fmtUsd(c.price)} <Change v={c.change24h} /></span>
                </button>))}</div>
            </div>
          ))}
        </div>
      </div>
      {trade && <TradeModal id={trade} onClose={() => setTrade(null)} />}
      <style>{'@media (max-width: 1000px) { .content .grid[style*="2fr"] { grid-template-columns: 1fr !important; } }'}</style>
    </div>
  )
}
