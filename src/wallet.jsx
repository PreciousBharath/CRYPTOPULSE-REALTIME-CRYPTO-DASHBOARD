import { createContext, useContext, useEffect } from 'react'
import { useAuth } from './auth.jsx'
import { useUserState, uid } from './storage.js'
import { useMarket, fmtUsd } from './market.jsx'
import { useToast } from './toast.jsx'

const WalletCtx = createContext(null)

/** Paper-trading wallet, watchlist and price alerts — all stored per user. */
export function WalletProvider({ children }) {
  const { user } = useAuth()
  const { coins, get } = useMarket()
  const notify = useToast()
  const isDemo = user?.id === 'demo'
  const [cash, setCash] = useUserState(user, 'cash', isDemo ? 100000 - 31000 - 12400 - 8400 : 100000)
  const [holdings, setHoldings] = useUserState(user, 'holdings', isDemo
    ? { bitcoin: { qty: 0.5, avg: 62000 }, ethereum: { qty: 4, avg: 3100 }, solana: { qty: 60, avg: 140 } } : {})
  const [txs, setTxs] = useUserState(user, 'txs', [])
  const [watch, setWatch] = useUserState(user, 'watch', ['bitcoin', 'ethereum', 'solana'])
  const [alerts, setAlerts] = useUserState(user, 'alerts', [])

  const trade = (id, side, qty) => {
    const c = get(id)
    const cost = qty * c.price
    if (qty <= 0) throw new Error('Enter a valid amount')
    const h = holdings[id] || { qty: 0, avg: 0 }
    if (side === 'buy') {
      if (cost > cash) throw new Error('Insufficient virtual balance')
      setCash(cash - cost)
      setHoldings({ ...holdings, [id]: { qty: h.qty + qty, avg: (h.qty * h.avg + cost) / (h.qty + qty) } })
    } else {
      if (qty > h.qty + 1e-12) throw new Error(`You only hold ${h.qty} ${c.symbol}`)
      setCash(cash + cost)
      const left = h.qty - qty
      const next = { ...holdings }
      if (left <= 1e-10) delete next[id]; else next[id] = { ...h, qty: left }
      setHoldings(next)
    }
    setTxs([{ id: uid(), coin: id, symbol: c.symbol, side, qty, price: c.price, total: cost, at: Date.now() }, ...txs])
    notify(`${side === 'buy' ? 'Bought' : 'Sold'} ${qty} ${c.symbol} for ${fmtUsd(cost)}`, 'success')
  }

  const toggleWatch = (id) => setWatch(watch.includes(id) ? watch.filter((x) => x !== id) : [...watch, id])

  // Alert engine: fires when live price crosses a target.
  useEffect(() => {
    let changed = false
    const next = alerts.map((a) => {
      if (a.triggered) return a
      const c = get(a.coin)
      if (!c) return a
      const hit = a.dir === 'above' ? c.price >= a.target : c.price <= a.target
      if (hit) { changed = true; notify(`🔔 ${c.symbol} is ${a.dir} ${fmtUsd(a.target)} (now ${fmtUsd(c.price)})`, 'success'); return { ...a, triggered: Date.now() } }
      return a
    })
    if (changed) setAlerts(next)
  }, [coins]) // eslint-disable-line

  const value = Object.entries(holdings).reduce((s, [id, h]) => s + h.qty * (get(id)?.price || 0), 0)
  const invested = Object.values(holdings).reduce((s, h) => s + h.qty * h.avg, 0)
  return (
    <WalletCtx.Provider value={{ cash, holdings, txs, trade, watch, toggleWatch, alerts, setAlerts, value, invested, reset: () => { setCash(100000); setHoldings({}); setTxs([]) } }}>
      {children}
    </WalletCtx.Provider>
  )
}

export const useWallet = () => useContext(WalletCtx)
