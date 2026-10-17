import { useState } from 'react'
import Modal from './Modal.jsx'
import PriceChart from './PriceChart.jsx'
import { CoinIcon, Change } from './Coin.jsx'
import { useMarket, fmtUsd } from '../market.jsx'
import { useWallet } from '../wallet.jsx'
import { useToast } from '../toast.jsx'
import { Star } from 'lucide-react'

export default function TradeModal({ id, onClose }) {
  const { get } = useMarket()
  const { trade, cash, holdings, watch, toggleWatch } = useWallet()
  const notify = useToast()
  const coin = get(id)
  const [side, setSide] = useState('buy')
  const [mode, setMode] = useState('usd')
  const [amount, setAmount] = useState('')
  const qty = mode === 'usd' ? (+amount || 0) / coin.price : +amount || 0
  const held = holdings[id]?.qty || 0

  const submit = () => { try { trade(id, side, +qty.toFixed(8)); setAmount('') } catch (e) { notify(e.message, 'error') } }

  return (
    <Modal title="" onClose={onClose} width={760}>
      <div className="row between wrap" style={{ marginTop: -40 }}>
        <div className="row"><CoinIcon coin={coin} size={44} /><div><div className="bold" style={{ fontSize: '1.3rem' }}>{coin.name} <span className="muted small">{coin.symbol}</span></div><div className="row"><span className="bold" style={{ fontSize: '1.5rem' }}>{fmtUsd(coin.price)}</span><Change v={coin.change24h} /></div></div></div>
        <button className="btn ghost sm" onClick={() => toggleWatch(id)}><Star size={15} fill={watch.includes(id) ? 'gold' : 'none'} color={watch.includes(id) ? 'gold' : 'currentColor'} /> {watch.includes(id) ? 'Watching' : 'Watch'}</button>
      </div>
      <div className="grid grid-4 mt small">
        <div><div className="muted">Market cap</div><div className="bold">{fmtUsd(coin.marketCap)}</div></div>
        <div><div className="muted">24h volume</div><div className="bold">{fmtUsd(coin.volume)}</div></div>
        <div><div className="muted">24h high</div><div className="bold" style={{ color: 'var(--success)' }}>{fmtUsd(coin.high24h)}</div></div>
        <div><div className="muted">24h low</div><div className="bold" style={{ color: 'var(--danger)' }}>{fmtUsd(coin.low24h)}</div></div>
      </div>
      <div className="mt"><PriceChart coin={coin} height={240} /></div>
      <div className="card mt col">
        <div className="row between wrap">
          <div className="tabs"><button className={side === 'buy' ? 'active' : ''} onClick={() => setSide('buy')}>Buy</button><button className={side === 'sell' ? 'active' : ''} onClick={() => setSide('sell')}>Sell</button></div>
          <div className="tabs"><button className={mode === 'usd' ? 'active' : ''} onClick={() => setMode('usd')}>USD</button><button className={mode === 'coin' ? 'active' : ''} onClick={() => setMode('coin')}>{coin.symbol}</button></div>
        </div>
        <input className="input" type="number" min="0" step="any" placeholder={`Amount in ${mode === 'usd' ? 'USD' : coin.symbol}`} value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="row wrap">{[25, 50, 75, 100].map((p) => (
          <button key={p} className="chip" onClick={() => {
            if (side === 'buy') setAmount(mode === 'usd' ? (cash * p / 100).toFixed(2) : (cash * p / 100 / coin.price).toFixed(6))
            else setAmount(mode === 'usd' ? (held * coin.price * p / 100).toFixed(2) : (held * p / 100).toFixed(8))
          }}>{p}%</button>))}</div>
        <div className="row between small muted"><span>≈ {qty.toFixed(6)} {coin.symbol} · {fmtUsd(qty * coin.price)}</span><span>Cash {fmtUsd(cash)} · Held {held.toFixed(6)} {coin.symbol}</span></div>
        <button className={`btn block ${side === 'sell' ? 'danger' : ''}`} onClick={submit}>{side === 'buy' ? 'Buy' : 'Sell'} {coin.symbol}</button>
      </div>
    </Modal>
  )
}
