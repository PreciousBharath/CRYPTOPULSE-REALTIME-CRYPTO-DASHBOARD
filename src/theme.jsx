import { createContext, useContext, useEffect } from 'react'
import { usePersistentState } from './storage.js'
import { APP } from './config.js'

export const THEMES = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'midnight', name: 'Midnight' },
  { id: 'sepia', name: 'Sepia' },
  { id: 'system', name: 'System' },
]

export const ACCENTS = [
  { name: 'Violet', a: '#7c3aed', b: '#06b6d4' },
  { name: 'Ocean', a: '#2563eb', b: '#22d3ee' },
  { name: 'Sunset', a: '#f97316', b: '#ec4899' },
  { name: 'Emerald', a: '#059669', b: '#84cc16' },
  { name: 'Rose', a: '#e11d48', b: '#f59e0b' },
  { name: 'Indigo', a: '#4f46e5', b: '#a855f7' },
]

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [prefs, setPrefs] = usePersistentState('theme', {
    mode: APP.defaultTheme || 'dark',
    accent: APP.defaultAccent ?? 0,
    radius: 16,
    compact: false,
    motion: true,
  })

  useEffect(() => {
    const apply = () => {
      const mode = prefs.mode === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : prefs.mode
      const root = document.documentElement
      root.dataset.theme = mode
      const acc = ACCENTS[prefs.accent] || ACCENTS[0]
      root.style.setProperty('--accent', acc.a)
      root.style.setProperty('--accent-2', acc.b)
      root.style.setProperty('--radius', `${prefs.radius}px`)
      document.body.classList.toggle('compact', prefs.compact)
      document.body.classList.toggle('no-motion', !prefs.motion)
    }
    apply()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [prefs])

  const update = (patch) => setPrefs((p) => ({ ...p, ...patch }))
  const isDark = prefs.mode === 'dark' || prefs.mode === 'midnight' ||
    (prefs.mode === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const toggle = () => update({ mode: isDark ? 'light' : 'dark' })

  return <ThemeCtx.Provider value={{ prefs, update, toggle, isDark }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
