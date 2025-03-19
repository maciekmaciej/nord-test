import { AUTH_TOKEN_STORAGE_KEY } from './Auth.constants'

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export const fetchWithAuth = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

  const response = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await response.json()

  return json
}
