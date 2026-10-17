import { APP } from '../config.js'

export default function AuthHero() {
  const Logo = APP.logo
  return (
    <section className="auth-hero">
      <div className="row" style={{ gap: 12, position: 'relative' }}>
        <div className="brand-logo" style={{ background: 'rgba(255,255,255,.2)' }}><Logo size={22} /></div>
        <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>{APP.name}</span>
      </div>
      <h2 className="fade-up" style={{ position: 'relative' }}>{APP.hero.title}</h2>
      <p className="fade-up" style={{ opacity: 0.9, maxWidth: 480, position: 'relative' }}>{APP.hero.subtitle}</p>
      <div className="col stagger" style={{ gap: 12, position: 'relative' }}>
        {APP.hero.features.map(({ icon: Icon, text }) => (
          <div key={text} className="feature"><Icon size={20} /> <span className="bold">{text}</span></div>
        ))}
      </div>
    </section>
  )
}
