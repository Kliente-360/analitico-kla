import { useMemo } from 'react'
import type { Company, DimensionKey, MetricKey } from '../types'

// Métricas que devem ser calculadas por média, não por soma
const AVG_METRICS: MetricKey[] = [
  'taxDeltaPercent',
  'effectiveRateCurrent',
  'effectiveRateReform',
]

export function getDimValue(c: Company, dim: DimensionKey): string {
  switch (dim) {
    case 'sector': return c.sector
    case 'state':  return c.state
    case 'region': return c.region
    case 'size':   return c.size
    case 'decade': return `${Math.floor(c.founded / 10) * 10}s`
  }
}

function aggregate(cs: Company[], metric: MetricKey): number {
  if (cs.length === 0) return 0
  const vals = cs.map((c) => c[metric] as number)
  const total = vals.reduce((s, v) => s + v, 0)
  return AVG_METRICS.includes(metric) ? total / vals.length : total
}

export interface PivotResult {
  rowVals:   string[]
  colVals:   string[]
  cells:     Record<string, Record<string, number>>
  rowTotals: Record<string, number>
  colTotals: Record<string, number>
  grand:     number
  hasCol:    boolean
}

export function usePivotTable(
  data:    Company[],
  rowDim:  DimensionKey,
  colDim:  DimensionKey | 'none',
  metric:  MetricKey,
): PivotResult {
  return useMemo(() => {
    const hasCol  = colDim !== 'none' && colDim !== rowDim
    const rowVals = [...new Set(data.map((c) => getDimValue(c, rowDim)))].sort()
    const colVals = hasCol
      ? [...new Set(data.map((c) => getDimValue(c, colDim as DimensionKey)))].sort()
      : ['Total']

    const cells:     Record<string, Record<string, number>> = {}
    const rowTotals: Record<string, number> = {}
    const colTotals: Record<string, number> = {}
    let grand = 0

    for (const rv of rowVals) {
      cells[rv] = {}
      for (const cv of colVals) {
        const slice = data.filter(
          (c) =>
            getDimValue(c, rowDim) === rv &&
            (!hasCol || getDimValue(c, colDim as DimensionKey) === cv),
        )
        cells[rv][cv] = aggregate(slice, metric)
      }
      rowTotals[rv] = hasCol
        ? colVals.reduce((s, cv) => s + (cells[rv][cv] ?? 0), 0)
        : (cells[rv]['Total'] ?? 0)
    }

    for (const cv of colVals) {
      colTotals[cv] = rowVals.reduce((s, rv) => s + (cells[rv][cv] ?? 0), 0)
    }
    grand = rowVals.reduce((s, rv) => s + rowTotals[rv], 0)

    return { rowVals, colVals, cells, rowTotals, colTotals, grand, hasCol }
  }, [data, rowDim, colDim, metric])
}
