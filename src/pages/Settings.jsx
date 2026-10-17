import { Download, Trash2, Palette, Database } from 'lucide-react'
import ThemePanel from '../components/ThemePanel.jsx'
import { useAuth } from '../auth.jsx'
import { useToast } from '../toast.jsx'
import { APP } from '../config.js'

export default function Settings() {
  const { user, deleteAccount } = useAuth()
  const notify = useToast()

  const exportData = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k.startsWith(`${APP.key}_${user.id}_`)) data[k] = JSON.parse(localStorage.getItem(k))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${APP.key}-data.json`
    a.click()
    notify('Data exported', 'success')
  }

  const resetData = () => {
    if (!confirm('Reset all your app data? This cannot be undone.')) return
    Object.keys(localStorage).filter((k) => k.startsWith(`${APP.key}_${user.id}_`)).forEach((k) => localStorage.removeItem(k))
    notify('Data reset — reloading…', 'success')
    setTimeout(() => location.reload(), 800)
  }

  return (
    <div className="grid grid-2 stagger">
      <div className="card"><div className="section-title"><Palette size={18} /> Appearance</div><ThemePanel /></div>
      <div className="card col">
        <div className="section-title"><Database size={18} /> Data & account</div>
        <p className="muted small">All your data is stored securely in this browser and isolated per account.</p>
        <button className="btn ghost" onClick={exportData}><Download size={17} /> Export my data (JSON)</button>
        <button className="btn outline" onClick={resetData}>Reset app data</button>
        <button className="btn danger" onClick={() => confirm('Delete your account permanently?') && deleteAccount()}><Trash2 size={17} /> Delete account</button>
      </div>
    </div>
  )
}
