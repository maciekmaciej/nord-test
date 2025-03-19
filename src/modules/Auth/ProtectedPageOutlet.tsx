import { Navigate, Outlet } from 'react-router'
import { useAuth } from './Auth.context'

export const ProtectedPageOutlet = () => {
  const { isAuthorized } = useAuth()

  if (!isAuthorized) {
    return <Navigate to='/login' />
  }

  return <Outlet />
}
