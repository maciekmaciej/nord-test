import { NavLink } from 'react-router'
import { cn } from '../lib/utils'
import { Button } from './ui/Button'
import { useAuth } from '../modules/Auth/Auth.context'

const NAV_ITEMS = [{ label: 'Servers', to: '/servers' }]

export const Header = () => {
  const { isAuthorized, logout } = useAuth()

  return (
    <header className='h-16 shadow-sm shadow-neutral-200/50 bg-white'>
      <div className='container flex items-center justify-between h-full'>
        <h1 className='text-base sm:text-xl font-semibold'>
          📚{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-60% to-neutral-700'>
            Nord Servers
          </span>
        </h1>
        <nav
          className='flex self-stretch [--gap:1rem] sm:[--gap:2rem] [--half-gap:calc(var(--gap)/2)]'
          aria-label='Primary'
        >
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'h-full px-(--half-gap) flex items-center text-sm font-medium focus-visible:bg-sky-50 focus-visible:text-sky-700 focus-visible:outline-none last-of-type:-mr-(--half-gap)',
                  isActive ? 'text-neutral-900' : 'text-neutral-500'
                )
              }
            >
              {label}
            </NavLink>
          ))}
          {isAuthorized && (
            <Button
              className='self-center ml-(--gap) aspect-square sm:aspect-auto px-0 sm:px-5'
              onClick={logout}
            >
              <span className='sr-only sm:not-sr-only'>Logout</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                fill='currentColor'
                className='size-4 -mr-0.5'
              >
                <path
                  fillRule='evenodd'
                  d='M2 4.75A2.75 2.75 0 0 1 4.75 2h3a2.75 2.75 0 0 1 2.75 2.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 1 1.5 0v.5A2.75 2.75 0 0 1 7.75 14h-3A2.75 2.75 0 0 1 2 11.25v-6.5Zm9.47.47a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H5.25a.75.75 0 0 1 0-1.5h7.19l-.97-.97a.75.75 0 0 1 0-1.06Z'
                  clipRule='evenodd'
                />
              </svg>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
