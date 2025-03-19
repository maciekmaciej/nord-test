import { useContext } from 'react'
import { createContext } from 'react'
import { loginDTO } from './Auth.constants'
import { z } from 'zod'

export const AuthContext = createContext<{
  isAuthorized: boolean
  login: (loginCredentials: z.infer<typeof loginDTO>) => Promise<void>
  logout: () => void
} | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
