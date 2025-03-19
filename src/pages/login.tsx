import { Navigate } from 'react-router'
import { LoginForm } from '../modules/Auth/LoginForm'
import { useAuth } from '../modules/Auth/Auth.context'

export const LoginPage = () => {
  const { isAuthorized } = useAuth()

  if (isAuthorized) {
    return <Navigate to='/dashboard' />
  }

  return <LoginForm />
}
