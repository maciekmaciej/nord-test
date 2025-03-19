import { z } from 'zod'
import { API_URL } from '../constants'

export const AUTH_TOKEN_STORAGE_KEY = 'accessToken'
export const AUTH_LOGIN_URL = `${API_URL}/tokens`

export const DEFAULT_ERROR_MESSAGE = 'Unexpected error. Please try again.'

export const loginDTO = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters long'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}
