import { createContext, useContext, useEffect, useRef, useState } from 'react'

/* Seed data — replaced by live CoinGecko data when the API is reachable. */
const SEED = [
  ['bitcoin', 'Bitcoin', 'BTC', 67250, '#f7931a', 1.33e12],
  ['ethereum', 'Ethereum', 'ETH', 3420, '#627eea', 4.1e11],
  ['tether', 'Tether', 'USDT', 1, '#26a17b', 1.18e11],
  ['binancecoin', 'BNB', 'BNB', 585, '#f3ba2f', 8.6e10],
  ['solana', 'Solana', 'SOL', 158, '#9945ff', 7.3e10],
  ['ripple', 'XRP', 'XRP', 0.58, '#23292f', 3.2e10],
  ['usd-coin', 'USDC', 'USDC', 1, '#2775ca', 3.4e10],
  ['cardano', 'Cardano', 'ADA', 0.45, '#0033ad', 1.6e10],
  ['dogecoin', 'Dogecoin', 'DOGE', 0.14, '#c2a633', 2.0e10],
  ['tron', 'TRON', 'TRX', 0.16, '#ff060a', 1.4e10],
  ['avalanche-2', 'Avalanche', 'AVAX', 31, '#e84142', 1.25e10],
  ['chainlink', 'Chainlink', 'LINK', 14.2, '#2a5ada', 8.6e9],
  ['polkadot', 'Polkadot', 'DOT', 6.1, '#e6007a', 8.9e9],
  ['shiba-inu', 'Shiba Inu', 'SHIB', 0.000018, '#ffa409', 1.05e10],
  ['litecoin', 'Litecoin', 'LTC', 72, '#345d9d', 5.4e9],
  ['near', 'NEAR Protocol', 'NEAR', 5.2, '#00c08b', 5.8e9],
  ['uniswap', 'Uniswap', 'UNI', 8.4, '#ff007a', 5.0e9],
  ['matic-network', 'Polygon', 'MATIC', 0.55, '#8247e5', 5.2e9],
  ['stellar', 'Stellar', 'XLM', 0.1, '#14b6e7', 2.9e9],
  ['cosmos', 'Cosmos', 'ATOM', 6.8, '#2e3148', 2.6e9],
]

const buildHistory = (price, points = 120, vol = 0.004) => {
  const out = []
  let p = price * (1 - (Math.random() - 0.5) * 0.08)
  for (let i = points; i > 0; i--) {
    p = p * (1 + (Math.random() - 0.5) * vol * 2) + (price - p) * 0.03
    out.push({ t: Date.now() - i * 60000, price: p })
  }
  out.push({ t: Date.now(), price })
  return out
}

const initial = () => SEED.map(([id, name, symbol, price, color, cap]) => ({
  id, name, symbol, price, color, marketCap: cap,
  change24h: (Math.random() - 0.45) * 10,
  volume: cap * (0.03 + Math.random() * 0.08),
  high24h: price * 1.04, low24h: price * 0.96,
  history: buildHistory(price), flash: null,
  image: null,
}))

const MarketCtx = createContext(null)

export function MarketProvider({ children }) {
  const [coins, setCoins] = useState(initial)
  const [source, setSource] = useState('simulated')
  const [paused, setPaused] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  // Sync with the real market (CoinGecko public API) every 60s.
  useEffect(() => {
    let alive = true
    const sync = async () => {
      try {
        const ids = SEED.map((s) => s[0]).join(',')
        const r = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`)
        if (!r.ok) throw new Error('rate limited')
        const data = await r.json()
        if (!alive || !Array.isArray(data) || !data.length) return
        setCoins((prev) => prev.map((c) => {
          const d = data.find((x) => x.id === c.id)
          if (!d) return c
          const rebased = c.source === 'live' ? c.history : buildHistory(d.current_price)
          return { ...c, source: 'live', price: d.current_price, change24h: d.price_change_percentage_24h ?? c.change24h, marketCap: d.market_cap, volume: d.total_volume, high24h: d.high_24h, low24h: d.low_24h, image: d.image, history: [...rebased.slice(-200), { t: Date.now(), price: d.current_price }] }
        }))
        setSource('live'); setLastSync(new Date())
      } catch { setSource((s) => (s === 'live' ? 'live' : 'simulated')) }
    }
    sync()
    const id = setInterval(sync, 60000)
    return () => { alive = false; clearInterval(id) }
  }, [])

  // Real-time tick engine: micro-movements between API syncs (stablecoins stay pegged).
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return
      setCoins((prev) => prev.map((c) => {
        if (['USDT', 'USDC'].includes(c.symbol)) return { ...c, flash: null }
        if (Math.random() < 0.35) return { ...c, flash: null }
        const move = (Math.random() - 0.5) * 0.006
        const price = c.price * (1 + move)
        return {
          ...c, price, flash: move >= 0 ? 'up' : 'down',
          change24h: c.change24h + move * 100,
          high24h: Math.max(c.high24h, price), low24h: Math.min(c.low24h, price),
          history: [...c.history.slice(-240), { t: Date.now(), price }],
        }
      }))
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const get = (id) => coins.find((c) => c.id === id)
  const stats = {
    totalCap: coins.reduce((s, c) => s + c.marketCap, 0),
    totalVol: coins.reduce((s, c) => s + c.volume, 0),
    btcDominance: (coins[0].marketCap / coins.reduce((s, c) => s + c.marketCap, 0)) * 100,
  }
  return <MarketCtx.Provider value={{ coins, get, stats, source, paused, setPaused, lastSync }}>{children}</MarketCtx.Provider>
}

export const useMarket = () => useContext(MarketCtx)

export const fmtUsd = (n) => {
  if (n == null) return '—'
  if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  const d = Math.abs(n) < 0.01 ? 8 : Math.abs(n) < 1 ? 4 : 2
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`
}
export const pct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
