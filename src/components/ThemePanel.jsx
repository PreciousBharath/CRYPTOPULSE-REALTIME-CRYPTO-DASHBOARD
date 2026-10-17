import { Check } from 'lucide-react'
import { ACCENTS, THEMES, useTheme } from '../theme.jsx'

export default function ThemePanel() {
  const { prefs, update } = useTheme()
  return (
    <div className="col" style={{ gap: 14 }}>
      <div>
        <div className="small bold mb" style={{ marginBottom: 8 }}>Theme</div>
        <div className="row wrap">
          {THEMES.map((t) => (
            <button key={t.id} className={`chip ${prefs.mode === t.id ? 'active' : ''}`} onClick={() => update({ mode: t.id })}>{t.name}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="small bold" style={{ marginBottom: 8 }}>Accent colour</div>
        <div className="row wrap">
          {ACCENTS.map((a, i) => (
            <button key={a.name} title={a.name} className={`swatch ${prefs.accent === i ? 'active' : ''}`}
              style={{ background: `linear-gradient(135deg, ${a.a}, ${a.b})`, display: 'grid', placeItems: 'center' }}
              onClick={() => update({ accent: i })}>{prefs.accent === i && <Check size={14} color="#fff" />}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="small bold" style={{ marginBottom: 8 }}>Corner radius: {prefs.radius}px</div>
        <input type="range" min="4" max="26" value={prefs.radius} onChange={(e) => update({ radius: +e.target.value })} style={{ width: '100%', accentColor: 'var(--accent)' }} />
      </div>
      <div className="row between"><span className="small bold">Compact mode</span><button className={`switch ${prefs.compact ? 'on' : ''}`} onClick={() => update({ compact: !prefs.compact })} /></div>
      <div className="row between"><span className="small bold">Animations</span><button className={`switch ${prefs.motion ? 'on' : ''}`} onClick={() => update({ motion: !prefs.motion })} /></div>
    </div>
  )
}
