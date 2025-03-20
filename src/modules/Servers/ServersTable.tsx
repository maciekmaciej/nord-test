import { cn } from '../../lib/utils'
import { useSearchParams } from 'react-router'
import { ArrowIcon } from '../../components/ui/ArrowIcon'
import { API_URL } from '../../lib/constants'
import { useQuery } from '@tanstack/react-query'
import { Server } from './Servers.types'
import { getSortedServers } from './Servers.utils'
import { fetchWithAuth } from '../Auth/Auth.utils'
import { Button } from '../../components/ui/Button'

type SortField = keyof Server
type Order = 'asc' | 'desc'

export const ServersTable = () => {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['servers'],
    queryFn: () => fetchWithAuth<Server[]>(`${API_URL}/servers`),
  })
  const servers = data ?? []

  const [searchParams, setSearchParams] = useSearchParams()
  const sortBy = searchParams.get('sortBy') as SortField
  const order = searchParams.get('order') as Order

  const handleSort = (field: SortField) => {
    setSearchParams(
      (prev) => {
        if (field === sortBy) {
          prev.set('order', order === 'asc' ? 'desc' : 'asc')
        } else {
          prev.set('sortBy', field)
          prev.set('order', 'asc')
        }

        return prev
      },
      { replace: true }
    )
  }

  const sortedData =
    sortBy && order ? getSortedServers(servers, sortBy, order) : servers

  return (
    <div
      className='rounded-lg border border-neutral-200 overflow-hidden'
      data-testid='servers-table'
    >
      <table className='w-full text-sm'>
        <thead className='bg-neutral-50'>
          <tr className='border-b border-neutral-200'>
            <th className='w-[60%] text-left'>
              <button
                data-testid='sort-by-name'
                onClick={() => handleSort('name')}
                className={cn(
                  'flex px-6 py-3 w-full items-center gap-1 font-medium cursor-pointer text-neutral-900 hover:text-neutral-700 flex-wrap hover:bg-neutral-100 duration-200 transition-colors',
                  sortBy === 'name' && 'font-bold'
                )}
              >
                Location
                {sortBy === 'name' && (
                  <>
                    <ArrowIcon
                      className={cn(
                        'size-4',
                        sortBy === 'name' && order === 'desc' && 'rotate-180'
                      )}
                    />
                    <span className='text-xs text-neutral-500 hidden sm:block'>
                      ({order === 'asc' ? 'A-Z' : 'Z-A'})
                    </span>
                  </>
                )}
              </button>
            </th>
            <th>
              <button
                data-testid='sort-by-distance'
                onClick={() => handleSort('distance')}
                className={cn(
                  'flex w-full px-6 py-3 items-center gap-1 font-medium cursor-pointer text-neutral-900 hover:text-neutral-700 hover:bg-neutral-100 duration-200 transition-colors flex-wrap',
                  sortBy === 'distance' && 'font-bold'
                )}
              >
                Distance
                {sortBy === 'distance' && (
                  <>
                    <ArrowIcon
                      className={cn(
                        'size-4',
                        sortBy === 'distance' &&
                          order === 'desc' &&
                          'rotate-180'
                      )}
                    />
                    <span className='text-xs text-neutral-500 hidden sm:block'>
                      ({order === 'asc' ? 'Low-High' : 'High-Low'})
                    </span>
                  </>
                )}
              </button>
            </th>
          </tr>
        </thead>
        <tbody
          className='divide-y divide-neutral-200 bg-white'
          data-testid='servers-list'
        >
          {isError && (
            <tr>
              <td colSpan={2} className='px-6 py-4' data-testid='error-state'>
                <div className='flex flex-col items-center justify-center gap-2 min-h-[200px]'>
                  Error loading servers
                  <Button onClick={() => refetch()}>Retry</Button>
                </div>
              </td>
            </tr>
          )}
          {isLoading ? (
            <tr>
              <td colSpan={2} className='px-6 py-4' data-testid='loading-state'>
                <div className='flex flex-col items-center justify-center gap-2 min-h-[200px]'>
                  Loading...
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((location, index) => (
              <tr
                key={index}
                className='hover:bg-neutral-50 transition-colors duration-200'
              >
                <td className='px-6 py-4 font-medium text-neutral-700'>
                  {location.name}
                </td>
                <td className='px-6 py-4 text-neutral-500'>
                  {location.distance}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
