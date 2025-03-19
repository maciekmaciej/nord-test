import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_LOGIN_URL,
  DEFAULT_ERROR_MESSAGE,
} from './Auth.constants'
import { AuthContext } from './Auth.context'
import { loginDTO } from './Auth.constants'
import { z } from 'zod'
import { LoginResponseType } from './Auth.types'
import { AuthError } from './Auth.utils'

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  )

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken)
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    }
  }, [accessToken])

  const isAuthorized = Boolean(accessToken)

  const login = useCallback(
    async (loginCredentials: z.infer<typeof loginDTO>) => {
      const response = await fetch(AUTH_LOGIN_URL, {
        method: 'POST',
        body: JSON.stringify(loginCredentials),
        headers: { 'Content-Type': 'application/json' },
      })
      const data: LoginResponseType = await response.json()

      if (!response.ok || 'message' in data) {
        const errorMessage =
          'message' in data ? data.message : DEFAULT_ERROR_MESSAGE

        throw new AuthError(errorMessage)
      }

      setAccessToken(data.token)
    },
    []
  )

  const logout = useCallback(() => setAccessToken(null), [])

  const stateValue = useMemo(
    () => ({ isAuthorized, login, logout }),
    [isAuthorized, login, logout]
  )

  return (
    <AuthContext.Provider value={stateValue}>{children}</AuthContext.Provider>
  )
}
