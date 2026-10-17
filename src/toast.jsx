import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const notify = useCallback((message, type = 'info') => {
    const id = Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  const Icon = { success: CheckCircle2, error: XCircle, info: Info }
  return (
    <ToastCtx.Provider value={notify}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => {
          const I = Icon[t.type] || Info
          return (
            <div key={t.id} className={`toast ${t.type}`}>
              <I size={20} color={t.type === 'success' ? 'var(--success)' : t.type === 'error' ? 'var(--danger)' : 'var(--accent)'} />
              <span className="small bold">{t.message}</span>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
