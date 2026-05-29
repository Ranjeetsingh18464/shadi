import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ModeratorRoute({ children }) {
  const { user, loading, role } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/auth/login" replace />
  if (role !== 'moderator' && role !== 'admin' && role !== 'superadmin' && role !== 'super-admin') return <Navigate to="/dashboard" replace />

  return children
}
