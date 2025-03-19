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
import { Input } from './ui/Input'
import { InputLabel } from './ui/InputLabel'
import { InputError } from './ui/InputError'
import { useMutation } from '@tanstack/react-query'

export const LoginForm = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<z.inferFormattedError<
    typeof loginDTO
  > | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const { login: loginMutationFn } = useAuth()
  const { mutate: login, isPending } = useMutation({
    mutationFn: loginMutationFn,
    onSuccess: () => {
      navigate('/dashboard')
    },
    onError: (error) => {
      if (error instanceof AuthError) {
        setServerError(error.message)

        return
      }

      setServerError(DEFAULT_ERROR_MESSAGE)
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors(null)
    setServerError(null)

    const formData = new FormData(event.currentTarget)
    const result = loginDTO.safeParse({
      username: formData.get('username'),
      password: formData.get('password'),
    })

    if (!result.success) {
      setErrors(result.error.format())

      return
    }

    login(result.data)
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
            <InputLabel htmlFor='username'>Username</InputLabel>
            <Input
              id='username'
              name='username'
              placeholder='Enter your username'
              type='text'
            />
            {errors?.username?._errors.map((error, index) => (
              <InputError key={index}>{error}</InputError>
            ))}
          </div>

          <div className='flex flex-col gap-2'>
            <InputLabel htmlFor='password'>Password</InputLabel>
            <Input
              id='password'
              name='password'
              placeholder='Enter your password'
              type='password'
            />
            {errors?.password?._errors.map((error, index) => (
              <InputError key={index}>{error}</InputError>
            ))}
          </div>

          {serverError && <InputError>{serverError}</InputError>}

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </section>
  )
}
