import { Server } from './Servers.types'

export const getSortedServers = (
  servers: Server[],
  sortBy: keyof Server,
  order: 'asc' | 'desc'
) => {
  return [...servers].sort((a, b) => {
    const dir = order === 'asc' ? 1 : -1

    // Names look like this "CountryName #11" and sometimes like this "CountryName #2".
    // Condition below sorts them by the country name part first and second by the number
    if (sortBy === 'name') {
      const aCountryName = a.name.split('#')[0]
      const bCountryName = b.name.split('#')[0]

      if (aCountryName === bCountryName) {
        const aNumber = parseInt(a.name.split('#')[1])
        const bNumber = parseInt(b.name.split('#')[1])

        return (aNumber - bNumber) * dir
      }

      return aCountryName.localeCompare(bCountryName) * dir
    } else {
      return (a.distance - b.distance) * dir
    }
  })
}
