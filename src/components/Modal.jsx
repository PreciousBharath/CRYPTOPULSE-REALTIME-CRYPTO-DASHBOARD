import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, width }) {
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={width ? { width: `min(${width}px, 100%)` } : undefined}>
        <div className="row between mb">
          <h3 style={{ fontWeight: 800 }}>{title}</h3>
          <button className="btn ghost icon" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
