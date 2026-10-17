import { Navigate } from 'react-router-dom'
import { useAuth } from './auth.jsx'

export const Protected = ({ children }) => (useAuth().user ? children : <Navigate to="/login" replace />)
export const GuestOnly = ({ children }) => (useAuth().user ? <Navigate to="/" replace /> : children)
