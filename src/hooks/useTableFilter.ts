import { useMemo } from 'react'
import type { Company } from '../types'

export interface FilterState {
  sector?: string
  state?:  string
  size?:   string
  region?: string
  search?: string
}

const ALL = 'Todos'

export function useTableFilter(data: Company[], filters: FilterState): Company[] {
  return useMemo(() => {
    const q = (filters.search ?? '').toLowerCase().trim()
    return data.filter((c) => {
      if (filters.sector && filters.sector !== ALL && c.sector !== filters.sector) return false
      if (filters.state  && filters.state  !== ALL && c.state  !== filters.state)  return false
      if (filters.size   && filters.size   !== ALL && c.size   !== filters.size)   return false
      if (filters.region && filters.region !== ALL && c.region !== filters.region) return false
      if (q && !c.name.toLowerCase().includes(q) &&
               !c.sector.toLowerCase().includes(q) &&
               !c.state.toLowerCase().includes(q)) return false
      return true
    })
  }, [data, filters])
}
