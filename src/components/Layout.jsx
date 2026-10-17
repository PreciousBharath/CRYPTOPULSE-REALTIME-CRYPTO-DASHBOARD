import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Moon, Sun, Palette, LogOut, User, Settings, PanelLeftClose, PanelLeftOpen, Bell } from 'lucide-react'
import { APP } from '../config.js'
import { useAuth } from '../auth.jsx'
import { useTheme } from '../theme.jsx'
import ThemePanel from './ThemePanel.jsx'

export default function Layout() {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [panel, setPanel] = useState(null)
  const loc = useLocation()
  const nav = useNavigate()
  const ref = useRef()
  const Logo = APP.logo

  useEffect(() => { setOpen(false); setPanel(null) }, [loc.pathname])
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setPanel(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const all = [...APP.nav, { to: '/profile', label: 'Profile', icon: User }, { to: '/settings', label: 'Settings', icon: Settings }]
  const current = all.find((n) => (n.to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(n.to)))
  const initials = user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <div className="bg-blobs"><span /><span /><span /></div>
      <div className="app-shell">
        <aside className={`sidebar ${open ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
          <div className="brand">
            <div className="brand-logo"><Logo size={22} /></div>
            <span className="brand-name">{APP.name}</span>
          </div>
          {APP.nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className="nav-link" title={label}>
              <Icon size={19} /> <span className="label">{label}</span>
            </NavLink>
          ))}
          <div className="side-foot">
            <NavLink to="/profile" className="nav-link" title="Profile"><User size={19} /><span className="label">Profile</span></NavLink>
            <NavLink to="/settings" className="nav-link" title="Settings"><Settings size={19} /><span className="label">Settings</span></NavLink>
            <button className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)} title="Collapse">
              {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}<span className="label">Collapse</span>
            </button>
          </div>
        </aside>
        <div className="main">
          <header className="topbar">
            <button className="btn ghost icon mobile-toggle" onClick={() => setOpen(!open)} aria-label="Menu"><Menu size={18} /></button>
            <h1>{current?.label || APP.name}</h1>
            <div className="spacer" />
            <div className="row" ref={ref} style={{ position: 'relative' }}>
              <button className="btn ghost icon" onClick={toggle} title="Toggle dark mode">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
              <button className="btn ghost icon" onClick={() => setPanel(panel === 'theme' ? null : 'theme')} title="Themes"><Palette size={18} /></button>
              <button className="btn ghost icon" onClick={() => setPanel(panel === 'bell' ? null : 'bell')} title="Notifications"><Bell size={18} /></button>
              <button className="avatar" style={{ border: 'none', cursor: 'pointer' }} onClick={() => setPanel(panel === 'user' ? null : 'user')}>{initials}</button>
              {panel === 'theme' && <div className="dropdown"><ThemePanel /></div>}
              {panel === 'bell' && (
                <div className="dropdown col">
                  <div className="bold">Notifications</div>
                  {(APP.notifications || []).map((n, i) => (
                    <div key={i} className="row small" style={{ alignItems: 'flex-start' }}><span className="pulse-dot" style={{ marginTop: 6 }} /><span>{n}</span></div>
                  ))}
                </div>
              )}
              {panel === 'user' && (
                <div className="dropdown col">
                  <div><div className="bold">{user.name}</div><div className="muted small">{user.email}</div></div>
                  <button className="btn ghost sm" onClick={() => nav('/profile')}><User size={15} /> Profile</button>
                  <button className="btn ghost sm" onClick={() => nav('/settings')}><Settings size={15} /> Settings</button>
                  <button className="btn danger sm" onClick={logout}><LogOut size={15} /> Logout</button>
                </div>
              )}
            </div>
          </header>
          <main className="content" key={loc.pathname}><Outlet /></main>
        </div>
      </div>
    </>
  )
}
