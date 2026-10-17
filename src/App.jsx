import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { Protected, GuestOnly } from './guard.jsx'
import { MarketProvider } from './market.jsx'
import { WalletProvider } from './wallet.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Markets from './pages/Markets.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Alerts from './pages/Alerts.jsx'
import Converter from './pages/Converter.jsx'
import Activity from './pages/Activity.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route element={<Protected><MarketProvider><WalletProvider><Layout /></WalletProvider></MarketProvider></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/watchlist" element={<Markets onlyWatch />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/converter" element={<Converter />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
