import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePivotTable, getDimValue } from '../hooks/usePivotTable'
import type { Company } from '../types'

const mkCompany = (overrides: Partial<Company> & Pick<Company, 'id' | 'sector' | 'state' | 'region' | 'size' | 'founded'>): Company => ({
  name: `Company ${overrides.id}`,
  revenue: 100_000, employees: 500,
  irpj: 2500, csll: 1000, pis: 1650, cofins: 7600, iss: 3000, icms: 0,
  totalTaxCurrent: 15750, effectiveRateCurrent: 15.75,
  cbs: 8800, ibs: 3500, isTax: 0,
  totalTaxReform: 15300, effectiveRateReform: 15.3,
  taxDelta: -450, taxDeltaPercent: -2.86,
  ...overrides,
})

const data: Company[] = [
  mkCompany({ id: '1', sector: 'Tecnologia', state: 'SP', region: 'Sudeste', size: 'Grande', founded: 2005 }),
  mkCompany({ id: '2', sector: 'Tecnologia', state: 'RJ', region: 'Sudeste', size: 'Média',  founded: 2012 }),
  mkCompany({ id: '3', sector: 'Varejo',     state: 'RS', region: 'Sul',     size: 'Grande', founded: 1998 }),
]

describe('getDimValue', () => {
  const c = data[0]

  it('returns sector', () => expect(getDimValue(c, 'sector')).toBe('Tecnologia'))
  it('returns state',  () => expect(getDimValue(c, 'state')).toBe('SP'))
  it('returns region', () => expect(getDimValue(c, 'region')).toBe('Sudeste'))
  it('returns size',   () => expect(getDimValue(c, 'size')).toBe('Grande'))
  it('formats decade', () => {
    expect(getDimValue(c, 'decade')).toBe('2000s')
    expect(getDimValue(data[2], 'decade')).toBe('1990s')
  })
})

describe('usePivotTable', () => {
  it('produces correct row values for sector dimension', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'none', 'revenue'))
    expect(result.current.rowVals.sort()).toEqual(['Tecnologia', 'Varejo'])
  })

  it('sums revenue correctly per sector', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'none', 'revenue'))
    expect(result.current.rowTotals['Tecnologia']).toBe(200_000) // 2 companies × 100k
    expect(result.current.rowTotals['Varejo']).toBe(100_000)
  })

  it('computes grand total', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'none', 'revenue'))
    expect(result.current.grand).toBe(300_000)
  })

  it('uses average for taxDeltaPercent', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'none', 'taxDeltaPercent'))
    // All companies have the same taxDeltaPercent (-2.86), so avg should also be -2.86
    expect(result.current.rowTotals['Tecnologia']).toBeCloseTo(-2.86)
    expect(result.current.rowTotals['Varejo']).toBeCloseTo(-2.86)
  })

  it('creates column breakdown when colDim is set', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'region', 'revenue'))
    expect(result.current.hasCol).toBe(true)
    expect(result.current.colVals).toContain('Sudeste')
    expect(result.current.colVals).toContain('Sul')
  })

  it('cells contain correct values for cross-tab', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'region', 'revenue'))
    expect(result.current.cells['Tecnologia']['Sudeste']).toBe(200_000)
    expect(result.current.cells['Varejo']['Sul']).toBe(100_000)
    expect(result.current.cells['Tecnologia']['Sul'] ?? 0).toBe(0)
  })

  it('hasCol is false when colDim is "none"', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'none', 'revenue'))
    expect(result.current.hasCol).toBe(false)
  })

  it('hasCol is false when colDim equals rowDim', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'sector', 'revenue'))
    expect(result.current.hasCol).toBe(false)
  })

  it('col totals sum correctly', () => {
    const { result } = renderHook(() => usePivotTable(data, 'sector', 'region', 'revenue'))
    expect(result.current.colTotals['Sudeste']).toBe(200_000)
    expect(result.current.colTotals['Sul']).toBe(100_000)
  })
})
