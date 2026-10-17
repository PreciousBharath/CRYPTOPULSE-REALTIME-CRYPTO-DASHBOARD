import { createContext, useContext, useEffect, useState } from 'react'
import { APP } from './config.js'
import { load, save, uid } from './storage.js'

const AuthCtx = createContext(null)
const SESSION_KEY = `${APP.key}_session`

/** SHA-256 hash with a per-user salt (Web Crypto API). Passwords are never stored in plain text. */
async function hash(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function passwordStrength(pw = '') {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return { score: s, label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][s], color: ['#ef4444', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'][s] }
}

const readSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = readSession()
    if (!s) return null
    return load('users', []).find((u) => u.id === s.id) || null
  })

  // Seed a demo account so the app can be explored instantly.
  useEffect(() => {
    const users = load('users', [])
    if (!users.some((u) => u.email === APP.demo.email)) {
      const salt = uid()
      hash(APP.demo.password, salt).then((h) => {
        const fresh = load('users', [])
        if (fresh.some((u) => u.email === APP.demo.email)) return
        save('users', [...fresh, { id: 'demo', name: APP.demo.name, email: APP.demo.email, salt, hash: h, role: APP.demo.role || 'user', createdAt: new Date().toISOString(), bio: 'Demo account' }])
      })
    }
  }, [])

  const persistSession = (u, remember) => {
    const payload = JSON.stringify({ id: u.id, at: Date.now() })
    try {
      localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY)
      ;(remember ? localStorage : sessionStorage).setItem(SESSION_KEY, payload)
    } catch { /* ignore */ }
  }

  const register = async ({ name, email, password, role }) => {
    const users = load('users', [])
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error('An account with this email already exists')
    const salt = uid()
    const u = { id: uid(), name, email, salt, hash: await hash(password, salt), role: role || 'user', createdAt: new Date().toISOString(), bio: '' }
    save('users', [...users, u])
    persistSession(u, true)
    setUser(u)
    return u
  }

  const login = async ({ email, password, remember }) => {
    const u = load('users', []).find((x) => x.email.toLowerCase() === email.toLowerCase())
    if (!u || (await hash(password, u.salt)) !== u.hash) throw new Error('Invalid email or password')
    persistSession(u, remember)
    setUser(u)
    return u
  }

  const logout = () => {
    try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
    setUser(null)
  }

  const updateProfile = (patch) => {
    const users = load('users', []).map((u) => (u.id === user.id ? { ...u, ...patch } : u))
    save('users', users)
    setUser((u) => ({ ...u, ...patch }))
  }

  const changePassword = async (current, next) => {
    if ((await hash(current, user.salt)) !== user.hash) throw new Error('Current password is incorrect')
    const salt = uid()
    updateProfile({ salt, hash: await hash(next, salt) })
  }

  const deleteAccount = () => {
    save('users', load('users', []).filter((u) => u.id !== user.id))
    logout()
  }

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, updateProfile, changePassword, deleteAccount }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
