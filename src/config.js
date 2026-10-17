import { Zap, LayoutDashboard, LineChart, Star, Wallet, BellRing, ArrowLeftRight, Radio, ShieldCheck, Activity } from 'lucide-react'

export const APP = {
  key: 'cryptopulse',
  name: 'CryptoPulse',
  logo: Zap,
  defaultTheme: 'midnight',
  defaultAccent: 1,
  demo: { name: 'Demo Trader', email: 'demo@cryptopulse.app', password: 'Demo@1234' },
  hero: {
    title: 'Track the crypto market in real time.',
    subtitle: 'Live prices, interactive charts, paper trading with a $100,000 virtual wallet, smart price alerts and a converter — all in one beautiful dashboard.',
    features: [
      { icon: Radio, text: 'Live prices streaming every few seconds' },
      { icon: Wallet, text: 'Risk-free paper trading portfolio' },
      { icon: BellRing, text: 'Price alerts with instant notifications' },
      { icon: ShieldCheck, text: 'Secure hashed-password accounts' },
    ],
  },
  nav: [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/markets', label: 'Markets', icon: LineChart },
    { to: '/watchlist', label: 'Watchlist', icon: Star },
    { to: '/portfolio', label: 'Portfolio', icon: Wallet },
    { to: '/alerts', label: 'Price Alerts', icon: BellRing },
    { to: '/converter', label: 'Converter', icon: ArrowLeftRight },
    { to: '/activity', label: 'Activity', icon: Activity },
  ],
  notifications: ['Market data streams live — prices flash green/red on every tick', 'Your paper wallet starts with $100,000', 'Set alerts to get notified on price moves'],
}
