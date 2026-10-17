import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'

export function CoinIcon({ coin, size = 34 }) {
  if (coin.image) return <img src={coin.image} alt={coin.symbol} width={size} height={size} style={{ borderRadius: '50%' }} />
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: coin.color, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: size * 0.32, flexShrink: 0 }}>
      {coin.symbol.slice(0, 3)}
    </div>
  )
}

export function Sparkline({ data, up, height = 40, width = 120 }) {
  const color = up ? 'var(--success)' : 'var(--danger)'
  const id = `g${Math.random().toString(36).slice(2, 7)}`
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer>
        <AreaChart data={data.slice(-40)}>
          <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={0.35} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient></defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area type="monotone" dataKey="price" stroke={color} fill={`url(#${id})`} strokeWidth={2} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export const Change = ({ v }) => <span className={`badge ${v >= 0 ? 'green' : 'red'}`}>{v >= 0 ? '▲' : '▼'} {Math.abs(v).toFixed(2)}%</span>
