import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../lib/auth/Auth.context'

export const DashboardLayout = () => {
  const { isAuthorized } = useAuth()

  if (!isAuthorized) {
    return <Navigate to='/login' />
  }

  return <Outlet />
}
