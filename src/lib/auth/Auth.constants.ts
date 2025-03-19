import { z } from 'zod'
import { API_URL } from '../constants'

export const AUTH_TOKEN_KEY = 'accessToken'
export const AUTH_URL = `${API_URL}/tokens`

export const DEFAULT_ERROR_MESSAGE = 'Unexpected error. Please try again.'

export const loginDTO = z.object({
  username: z.string().min(4),
  password: z.string().min(8),
})

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}
