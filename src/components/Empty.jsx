export default function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="empty fade-up">
      {Icon && <Icon size={56} />}
      <div className="bold" style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{title}</div>
      {text && <p className="small" style={{ margin: '6px 0 16px' }}>{text}</p>}
      {action}
    </div>
  )
}
