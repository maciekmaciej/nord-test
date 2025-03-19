import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  describe,
  it,
  expect,
  beforeEach,
  afterAll,
  afterEach,
  beforeAll,
} from 'vitest'
import { AuthProvider } from './Auth.provider'
import { LoginForm } from '../../components/LoginForm'
import { BrowserRouter, Route, Routes, MemoryRouter } from 'react-router'
import { AUTH_TOKEN_STORAGE_KEY, loginDTO } from './Auth.constants'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { z } from 'zod'
import { FC, PropsWithChildren } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { useAuth } from './Auth.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const TEST_CREDENTIALS = {
  username: 'testuser',
  password: 'testpassword',
}

const TEST_TOKEN = 'test-token'
const ERROR_MESSAGE = 'Invalid credentials'

const server = setupServer(
  http.post<never, z.infer<typeof loginDTO>>(
    `${import.meta.env.VITE_API_URL}/tokens`,
    async ({ request }) => {
      const { username, password } = await request.json()

      // Simulate a slow response to test loading state
      await new Promise((resolve) => setTimeout(resolve))

      if (
        username === TEST_CREDENTIALS.username &&
        password === TEST_CREDENTIALS.password
      ) {
        return HttpResponse.json({ token: TEST_TOKEN })
      }

      return HttpResponse.json({ message: ERROR_MESSAGE }, { status: 401 })
    }
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const queryClient = new QueryClient()

const TestWrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
)

describe('Authentication', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('LoginForm', () => {
    it('should show validation errors for invalid input', async () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      )

      const loginButton = screen.getByRole('button', { name: /login/i })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(
          screen.getByText(/Username must be at least/)
        ).toBeInTheDocument()
        expect(
          screen.getByText(/Password must be at least/)
        ).toBeInTheDocument()
      })
    })

    it('should handle successful login', async () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      )

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await fireEvent.change(usernameInput, {
        target: { value: TEST_CREDENTIALS.username },
      })
      await fireEvent.change(passwordInput, {
        target: { value: TEST_CREDENTIALS.password },
      })
      await fireEvent.submit(usernameInput.closest('form')!)

      await waitFor(() => {
        expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe(TEST_TOKEN)
      })
    })

    it('should handle login error', async () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      )

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await fireEvent.change(usernameInput, {
        target: { value: 'wronguser' },
      })
      await fireEvent.change(passwordInput, {
        target: { value: 'wrongpassword' },
      })
      await fireEvent.submit(usernameInput.closest('form')!)

      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument()
      })
    })

    it('should display loading state when logging in', async () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      )

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await fireEvent.change(usernameInput, {
        target: { value: TEST_CREDENTIALS.username },
      })
      await fireEvent.change(passwordInput, {
        target: { value: TEST_CREDENTIALS.password },
      })
      await fireEvent.submit(usernameInput.closest('form')!)

      await waitFor(() => {
        expect(screen.getByText(/Logging in.../i)).toBeInTheDocument()
      })
    })
  })

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without auth', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<DashboardLayout />} />
              <Route path='/login' element={<div data-testid='login-page' />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      )

      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })

    it('should allow access to protected route when authenticated', () => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, TEST_TOKEN)

      render(
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<DashboardLayout />}>
                <Route
                  index
                  element={<div data-testid='dashboard-content' />}
                />
              </Route>
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      )

      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument()
    })
  })

  describe('Logout', () => {
    it('should handle logout correctly', () => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, TEST_TOKEN)

      const TestComponent = () => {
        const { logout } = useAuth()
        return <button onClick={logout}>Logout</button>
      }

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )

      fireEvent.click(screen.getByText('Logout'))

      expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull()
    })
  })
})
