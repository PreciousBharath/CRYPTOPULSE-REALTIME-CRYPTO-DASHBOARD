import { useEffect, useState } from 'react'
import { APP } from './config.js'

const k = (key) => `${APP.key}_${key}`

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(k(key))
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try { localStorage.setItem(k(key), JSON.stringify(value)) } catch { /* storage unavailable */ }
}

export function remove(key) {
  try { localStorage.removeItem(k(key)) } catch { /* ignore */ }
}

/** useState that persists to localStorage (namespaced per app). */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => load(key, typeof initial === 'function' ? initial() : initial))
  useEffect(() => { save(key, value) }, [key, value])
  return [value, setValue]
}

/** Per-user persistent state: data is isolated for each logged-in account. */
export function useUserState(user, key, initial) {
  return usePersistentState(`${user?.id || 'guest'}_${key}`, initial)
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
