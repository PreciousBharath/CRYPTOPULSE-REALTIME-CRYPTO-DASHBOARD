import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'
import { APP } from '../config.js'
import { useAuth, passwordStrength } from '../auth.jsx'
import { useToast } from '../toast.jsx'
import AuthHero from './AuthHero.jsx'

export default function Register() {
  const { register } = useAuth()
  const notify = useToast()
  const nav = useNavigate()
  const roles = APP.roles || null
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: roles?.[0]?.id, terms: false })
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const st = passwordStrength(form.password)

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (st.score < 3) e.password = 'Use 8+ chars with upper/lower case, a number and a symbol'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!form.terms) e.terms = 'Please accept the terms'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setBusy(true)
    try {
      await register(form)
      notify('Account created successfully 🎉', 'success')
      nav('/')
    } catch (err) {
      setErrors({ email: err.message })
    } finally { setBusy(false) }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="auth-page">
      <AuthHero />
      <div className="auth-form-wrap">
        <form className="auth-card col fade-up" style={{ gap: 14 }} onSubmit={submit} noValidate>
          <div>
            <h3>Create account</h3>
            <p className="muted">Join <span className="gradient-text bold">{APP.name}</span> in less than a minute</p>
          </div>
          {roles && (
            <div className="tabs" style={{ width: '100%' }}>
              {roles.map((r) => (
                <button type="button" key={r.id} style={{ flex: 1 }} className={form.role === r.id ? 'active' : ''} onClick={() => setForm({ ...form, role: r.id })}>{r.label}</button>
              ))}
            </div>
          )}
          <div className="field"><label>Full name</label>
            <div className="input-icon"><User size={17} /><input className="input" placeholder="Jane Doe" value={form.name} onChange={set('name')} /></div>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="field"><label>Email</label>
            <div className="input-icon"><Mail size={17} /><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} /></div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="field"><label>Password</label>
            <div className="input-icon"><Lock size={17} />
              <input className="input" type={show ? 'text' : 'password'} placeholder="Create a strong password" value={form.password} onChange={set('password')} />
              <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            {form.password && (
              <div className="col" style={{ gap: 4 }}>
                <div className="strength">{[0, 1, 2, 3].map((i) => <span key={i} style={{ background: i < st.score ? st.color : undefined }} />)}</div>
                <span className="xs bold" style={{ color: st.color }}>{st.label}</span>
              </div>
            )}
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <div className="field"><label>Confirm password</label>
            <div className="input-icon"><Lock size={17} /><input className="input" type={show ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} /></div>
            {errors.confirm && <span className="error-text">{errors.confirm}</span>}
          </div>
          <label className="row small" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} style={{ accentColor: 'var(--accent)' }} />
            I agree to the Terms of Service and Privacy Policy
          </label>
          {errors.terms && <span className="error-text">{errors.terms}</span>}
          <button className="btn block" disabled={busy}>{busy ? <Loader2 className="spin" size={18} /> : <UserPlus size={18} />} Create account</button>
          <p className="small muted" style={{ textAlign: 'center' }}>Already have an account? <Link to="/login" className="gradient-text bold">Sign in</Link></p>
        </form>
      </div>
    </div>
  )
}
