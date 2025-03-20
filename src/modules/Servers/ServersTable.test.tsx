import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { ServersTable } from './ServersTable'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { API_URL } from '../../lib/constants'
import { PropsWithChildren } from 'react'
import { FC } from 'react'

const TEST_SERVERS = [
  { name: 'Germany #11', distance: 10 },
  { name: 'Germany #2', distance: 20 },
  { name: 'France #1', distance: 5 },
  { name: 'France #2', distance: 15 },
]

const server = setupServer(
  http.get(`${API_URL}/servers`, async () => {
    // Simulate a slow response to test loading state
    await new Promise((resolve) => setTimeout(resolve))

    return HttpResponse.json(TEST_SERVERS)
  })
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  queryClient.clear()
})
afterAll(() => server.close())

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
  },
})

const TestWrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={['/servers']}>{children}</MemoryRouter>
  </QueryClientProvider>
)

describe('ServersTable', () => {
  it('should show loading state initially', async () => {
    render(
      <TestWrapper>
        <ServersTable />
      </TestWrapper>
    )

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })
  })

  it('should render servers data correctly', async () => {
    render(
      <TestWrapper>
        <ServersTable />
      </TestWrapper>
    )

    await waitFor(() => {
      const serversList = screen.getByTestId('servers-list')
      const rows = serversList.querySelectorAll('tr')

      TEST_SERVERS.forEach((server, index) => {
        const cells = rows[index].querySelectorAll('td')
        expect(cells[0]).toHaveTextContent(server.name)
        expect(cells[1]).toHaveTextContent(server.distance.toString())
      })
    })
  })

  it('should sort by name in ascending order', async () => {
    render(
      <TestWrapper>
        <ServersTable />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })

    const sortByNameButton = screen.getByTestId('sort-by-name')
    fireEvent.click(sortByNameButton)

    await waitFor(() => {
      const serversList = screen.getByTestId('servers-list')
      const rows = serversList.querySelectorAll('tr')
      const cells = Array.from(rows).map((row) => row.querySelectorAll('td')[0])

      // Verify order: France #1, France #2, Germany #2, Germany #11
      expect(cells[0]).toHaveTextContent('France #1')
      expect(cells[1]).toHaveTextContent('France #2')
      expect(cells[2]).toHaveTextContent('Germany #2')
      expect(cells[3]).toHaveTextContent('Germany #11')
    })
  })

  it('should sort by name in descending order', async () => {
    render(
      <TestWrapper>
        <ServersTable />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })

    const sortByNameButton = screen.getByTestId('sort-by-name')
    fireEvent.click(sortByNameButton)

    await waitFor(() => {
      const serversList = screen.getByTestId('servers-list')
      const rows = serversList.querySelectorAll('tr')
      const cells = Array.from(rows).map((row) => row.querySelectorAll('td')[0])
      expect(cells[0]).toHaveTextContent('France #1')
    })

    fireEvent.click(sortByNameButton)

    await waitFor(() => {
      const serversList = screen.getByTestId('servers-list')
      const rows = serversList.querySelectorAll('tr')
      const cells = Array.from(rows).map((row) => row.querySelectorAll('td')[0])

      // Verify reverse order: Germany #11, Germany #2, France #2, France #1
      expect(cells[0]).toHaveTextContent('Germany #11')
      expect(cells[1]).toHaveTextContent('Germany #2')
      expect(cells[2]).toHaveTextContent('France #2')
      expect(cells[3]).toHaveTextContent('France #1')
    })
  })

  it('should sort by distance in ascending order', async () => {
    render(
      <TestWrapper>
        <ServersTable />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })

    const sortByDistanceButton = screen.getByTestId('sort-by-distance')
    fireEvent.click(sortByDistanceButton)

    await waitFor(() => {
      const serversList = screen.getByTestId('servers-list')
      const rows = serversList.querySelectorAll('tr')
      const cells = Array.from(rows).map((row) => row.querySelectorAll('td')[1])

      // Verify order: 5, 10, 15, 20
      expect(cells[0]).toHaveTextContent('5')
      expect(cells[1]).toHaveTextContent('10')
      expect(cells[2]).toHaveTextContent('15')
      expect(cells[3]).toHaveTextContent('20')
    })
  })

  it('should sort by distance in descending order', async () => {
    render(
      <TestWrapper>
        <ServersTable />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })

    const sortByDistanceButton = screen.getByTestId('sort-by-distance')
    fireEvent.click(sortByDistanceButton)

    await waitFor(() => {
      const serversList = screen.getByTestId('servers-list')
      const rows = serversList.querySelectorAll('tr')
      const cells = Array.from(rows).map((row) => row.querySelectorAll('td')[1])
      expect(cells[0]).toHaveTextContent('5')
    })

    fireEvent.click(sortByDistanceButton)

    await waitFor(() => {
      const serversList = screen.getByTestId('servers-list')
      const rows = serversList.querySelectorAll('tr')
      const cells = Array.from(rows).map((row) => row.querySelectorAll('td')[1])

      // Verify reverse order: 20, 15, 10, 5
      expect(cells[0]).toHaveTextContent('20')
      expect(cells[1]).toHaveTextContent('15')
      expect(cells[2]).toHaveTextContent('10')
      expect(cells[3]).toHaveTextContent('5')
    })
  })

  it('should handle server error', async () => {
    server.use(
      http.get(`${API_URL}/servers`, () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(
      <TestWrapper>
        <ServersTable />
      </TestWrapper>
    )

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(screen.getByText('Error loading servers')).toBeInTheDocument()
    })

    server.use(
      http.get(`${API_URL}/servers`, () => {
        return HttpResponse.json(TEST_SERVERS)
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-state')).not.toBeInTheDocument()

      const serversList = screen.getByTestId('servers-list')
      const rows = serversList.querySelectorAll('tr')
      expect(rows).toHaveLength(TEST_SERVERS.length)
      expect(screen.queryByTestId('error-state')).not.toBeInTheDocument()
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })
  })
})
