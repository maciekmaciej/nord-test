import { Button } from './ui/Button'
import { useState } from 'react'
import { z } from 'zod'
import { useAuth } from '../lib/auth/Auth.context'
import { useNavigate } from 'react-router'
import {
  AuthError,
  DEFAULT_ERROR_MESSAGE,
  loginDTO,
} from '../lib/auth/Auth.constants'

export const LoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<z.inferFormattedError<
    typeof loginDTO
  > | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors(null)
    setServerError(null)

    const result = loginDTO.safeParse({
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    })

    if (!result.success) {
      setErrors(result.error.format())

      return
    }

    try {
      await login(result.data)
      navigate('/dashboard')
    } catch (error) {
      if (error instanceof AuthError) {
        setServerError(error.message)

        return
      }

      setServerError(DEFAULT_ERROR_MESSAGE)
    }
  }

  return (
    <section className='rounded-xl my-auto shadow-xs shadow-neutral-200 bg-white mx-auto w-full max-w-md'>
      <div className='p-5 sm:p-12 flex flex-col'>
        <h2 className='text-xl font-bold text-center'>Login to your account</h2>
        <p className='text-neutral-500 text-xs mt-1 text-center'>
          Enter your email below to login to your account
        </p>

        <form className='flex gap-4 mt-8 flex-col' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='string'
              className='text-xs font-medium text-neutral-500 leading-none'
            >
              Username
            </label>
            <input
              type='text'
              name='username'
              id='username'
              placeholder='Enter your username'
              className='h-9 rounded-md border border-neutral-200 px-3 py-2 text-base sm:text-sm placeholder:text-neutral-400 shadow shadow-neutral-100 outline-sky-500 ['
            />
            {errors?.username?._errors.map((error, index) => (
              <p
                key={index}
                className='text-red-500 text-xs rounded-md px-3 py-2 font-medium bg-red-50'
              >
                {error}
              </p>
            ))}
          </div>
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='password'
              className='text-xs font-medium text-neutral-500 leading-none'
            >
              Password
            </label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Enter your password'
              className='h-9 rounded-md border border-neutral-200 px-3 py-2 text-base sm:text-sm placeholder:text-neutral-400 shadow shadow-neutral-100 outline-sky-500 ['
            />
            {errors?.password?._errors.map((error, index) => (
              <p
                key={index}
                className='text-red-500 text-xs rounded-md px-3 py-2 font-medium bg-red-50'
              >
                {error}
              </p>
            ))}
          </div>
          {serverError && (
            <p className='text-red-500 text-xs rounded-md px-3 py-2 font-medium bg-red-50'>
              {serverError}
            </p>
          )}
          <Button type='submit'>Login</Button>
        </form>
      </div>
    </section>
  )
}
