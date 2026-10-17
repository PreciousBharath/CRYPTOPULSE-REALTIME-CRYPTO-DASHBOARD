import { useState } from 'react'
import { Save, KeyRound, Calendar, Mail, Shield } from 'lucide-react'
import { useAuth, passwordStrength } from '../auth.jsx'
import { useToast } from '../toast.jsx'
import { APP } from '../config.js'

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth()
  const notify = useToast()
  const [form, setForm] = useState({ name: user.name, bio: user.bio || '', phone: user.phone || '', location: user.location || '' })
  const [pw, setPw] = useState({ current: '', next: '' })
  const initials = user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

  const save = (e) => { e.preventDefault(); updateProfile(form); notify('Profile updated', 'success') }
  const savePw = async (e) => {
    e.preventDefault()
    if (passwordStrength(pw.next).score < 3) return notify('New password is too weak', 'error')
    try { await changePassword(pw.current, pw.next); setPw({ current: '', next: '' }); notify('Password changed', 'success') } catch (err) { notify(err.message, 'error') }
  }

  return (
    <div className="grid grid-2 stagger">
      <div className="card col" style={{ alignItems: 'center', textAlign: 'center', gap: 14 }}>
        <div className="avatar lg">{initials}</div>
        <div><div className="bold" style={{ fontSize: '1.3rem' }}>{user.name}</div><div className="muted">{user.bio || `${APP.name} member`}</div></div>
        <div className="col small" style={{ width: '100%', textAlign: 'left' }}>
          <div className="row"><Mail size={16} /> {user.email}</div>
          <div className="row"><Calendar size={16} /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
          <div className="row"><Shield size={16} /> Role: <span className="badge">{user.role}</span></div>
        </div>
      </div>
      <form className="card col" onSubmit={save}>
        <div className="section-title">Edit profile</div>
        {['name', 'phone', 'location'].map((k) => (
          <div className="field" key={k}><label style={{ textTransform: 'capitalize' }}>{k}</label><input className="input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
        ))}
        <div className="field"><label>Bio</label><textarea className="input" rows="3" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        <button className="btn"><Save size={17} /> Save changes</button>
      </form>
      <form className="card col" onSubmit={savePw}>
        <div className="section-title"><KeyRound size={18} /> Change password</div>
        <input className="input" type="password" placeholder="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required />
        <input className="input" type="password" placeholder="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required />
        <button className="btn outline">Update password</button>
      </form>
    </div>
  )
}
