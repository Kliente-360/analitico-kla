import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTableFilter } from '../hooks/useTableFilter'
import type { Company } from '../types'

const base: Company = {
  id: '1', name: 'Alpha Tech', sector: 'Tecnologia', state: 'SP',
  region: 'Sudeste', size: 'Média', revenue: 50_000, employees: 300, founded: 2010,
  irpj: 1250, csll: 500, pis: 825, cofins: 3800, iss: 1500, icms: 0,
  totalTaxCurrent: 7875, effectiveRateCurrent: 15.75,
  cbs: 4400, ibs: 1750, isTax: 0,
  totalTaxReform: 7650, effectiveRateReform: 15.3,
  taxDelta: -225, taxDeltaPercent: -2.86,
}

const companies: Company[] = [
  base,
  { ...base, id: '2', name: 'Beta Varejo', sector: 'Varejo', state: 'RJ', region: 'Sudeste', size: 'Grande' },
  { ...base, id: '3', name: 'Gama Agro',  sector: 'Agronegócio', state: 'GO', region: 'Centro-Oeste', size: 'Pequena' },
]

describe('useTableFilter', () => {
  it('returns all companies when no filters set', () => {
    const { result } = renderHook(() => useTableFilter(companies, {}))
    expect(result.current).toHaveLength(3)
  })

  it('filters by sector', () => {
    const { result } = renderHook(() => useTableFilter(companies, { sector: 'Varejo' }))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Beta Varejo')
  })

  it('filters by state', () => {
    const { result } = renderHook(() => useTableFilter(companies, { state: 'GO' }))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].sector).toBe('Agronegócio')
  })

  it('filters by size', () => {
    const { result } = renderHook(() => useTableFilter(companies, { size: 'Grande' }))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('2')
  })

  it('filters by region', () => {
    const { result } = renderHook(() => useTableFilter(companies, { region: 'Centro-Oeste' }))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].state).toBe('GO')
  })

  it('filters by search term (name)', () => {
    const { result } = renderHook(() => useTableFilter(companies, { search: 'alpha' }))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('filters by search term (sector)', () => {
    const { result } = renderHook(() => useTableFilter(companies, { search: 'varejo' }))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('2')
  })

  it('returns empty array when no match', () => {
    const { result } = renderHook(() => useTableFilter(companies, { sector: 'Financeiro' }))
    expect(result.current).toHaveLength(0)
  })

  it('combines multiple filters (AND logic)', () => {
    const { result } = renderHook(() => useTableFilter(companies, { region: 'Sudeste', size: 'Média' }))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('ignores "Todos" as a filter value', () => {
    const { result } = renderHook(() => useTableFilter(companies, { sector: 'Todos', state: 'Todos' }))
    expect(result.current).toHaveLength(3)
  })
})
