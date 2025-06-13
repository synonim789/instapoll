import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from './AuthContext'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
export default PrivateRoute
