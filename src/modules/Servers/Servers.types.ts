export type Server = { name: string; distance: number }

export type SortField = keyof Server
export type Order = 'asc' | 'desc'
