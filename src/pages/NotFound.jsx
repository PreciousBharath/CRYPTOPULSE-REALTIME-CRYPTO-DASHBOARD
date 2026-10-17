import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="empty fade-up">
      <div className="gradient-text" style={{ fontSize: '6rem', fontWeight: 800 }}>404</div>
      <p className="mb">This page drifted into space.</p>
      <Link to="/" className="btn">Back home</Link>
    </div>
  )
}
