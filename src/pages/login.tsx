import { Navigate } from 'react-router'
import { LoginForm } from '../components/LoginForm'
import { useAuth } from '../lib/auth/Auth.context'

export const LoginPage = () => {
  const { isAuthorized } = useAuth()

  if (isAuthorized) {
    return <Navigate to='/dashboard' />
  }

  return <LoginForm />
}
