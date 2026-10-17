import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, Loader2 } from 'lucide-react'
import { APP } from '../config.js'
import { useAuth } from '../auth.jsx'
import { useToast } from '../toast.jsx'
import AuthHero from './AuthHero.jsx'

export default function Login() {
  const { login } = useAuth()
  const notify = useToast()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e, creds) => {
    e?.preventDefault()
    setError(''); setBusy(true)
    try {
      const u = await login(creds || form)
      notify(`Welcome back, ${u.name.split(' ')[0]}!`, 'success')
      nav('/')
    } catch (err) {
      setError(err.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="auth-page">
      <AuthHero />
      <div className="auth-form-wrap">
        <form className="auth-card col fade-up" style={{ gap: 16 }} onSubmit={submit}>
          <div>
            <h3>Welcome back 👋</h3>
            <p className="muted">Sign in to continue to <span className="gradient-text bold">{APP.name}</span></p>
          </div>
          <div className="field">
            <label>Email</label>
            <div className="input-icon"><Mail size={17} /><input className="input" type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-icon"><Lock size={17} />
              <input className="input" type={show ? 'text' : 'password'} required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
          </div>
          <div className="row between small">
            <label className="row" style={{ cursor: 'pointer' }}><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} style={{ accentColor: 'var(--accent)' }} /> Remember me</label>
            <a className="gradient-text bold" href="#" onClick={(e) => { e.preventDefault(); notify('Password reset is simulated in this demo — use the demo account or register.', 'info') }}>Forgot password?</a>
          </div>
          {error && <div className="error-text fade-up">{error}</div>}
          <button className="btn block" disabled={busy}>{busy ? <Loader2 className="spin" size={18} /> : <LogIn size={18} />} Sign in</button>
          <div className="divider">or</div>
          <button type="button" className="btn outline block" disabled={busy}
            onClick={() => submit(null, { email: APP.demo.email, password: APP.demo.password, remember: true })}>
            <Sparkles size={18} /> Try the demo account
          </button>
          <p className="small muted" style={{ textAlign: 'center' }}>New here? <Link to="/register" className="gradient-text bold">Create an account</Link></p>
        </form>
      </div>
    </div>
  )
}
