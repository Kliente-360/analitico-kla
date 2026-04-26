import { useState, useMemo } from 'react'
import { ArrowUpDown, Download } from 'lucide-react'
import { branches } from '../data/mockData'
import { usePivotTable } from '../hooks/usePivotTable'
import { fmtVal } from '../utils/formatters'
import type { DimensionKey, MetricKey } from '../types'
import { SkeletonPivotPage } from '../components/Skeleton'
import { usePageReady } from '../hooks/usePageReady'

const DIMENSIONS: { key: DimensionKey; label: string }[] = [
  { key: 'sector', label: 'Linha de negócio' },
  { key: 'city',   label: 'Cidade'            },
  { key: 'state',  label: 'Estado'            },
  { key: 'region', label: 'Região'            },
  { key: 'size',   label: 'Porte'             },
  { key: 'decade', label: 'Década'            },
]

const METRICS: { key: MetricKey; label: string; fmt: 'money' | 'pct' | 'int' | 'float'; group: 'atual' | 'reforma' | 'delta' | 'base' }[] = [
  { key: 'revenue',              label: 'Receita (R$ M)',        fmt: 'money', group: 'base'   },
  { key: 'employees',            label: 'Colaboradores',         fmt: 'int',   group: 'base'   },
  { key: 'totalTaxCurrent',      label: 'Carga atual (R$ M)',    fmt: 'money', group: 'atual'  },
  { key: 'effectiveRateCurrent', label: 'Alíquota efetiva atual',fmt: 'float', group: 'atual'  },
  { key: 'irpj',   label: 'IRPJ (R$ M)',    fmt: 'money', group: 'atual'  },
  { key: 'csll',   label: 'CSLL (R$ M)',    fmt: 'money', group: 'atual'  },
  { key: 'pis',    label: 'PIS (R$ M)',     fmt: 'money', group: 'atual'  },
  { key: 'cofins', label: 'COFINS (R$ M)',  fmt: 'money', group: 'atual'  },
  { key: 'iss',    label: 'ISS (R$ M)',     fmt: 'money', group: 'atual'  },
  { key: 'icms',   label: 'ICMS (R$ M)',    fmt: 'money', group: 'atual'  },
  { key: 'totalTaxReform',       label: 'Carga reforma (R$ M)',  fmt: 'money', group: 'reforma'},
  { key: 'effectiveRateReform',  label: 'Alíquota efetiva reform',fmt:'float', group: 'reforma'},
  { key: 'cbs',    label: 'CBS (R$ M)',     fmt: 'money', group: 'reforma'},
  { key: 'ibs',    label: 'IBS (R$ M)',     fmt: 'money', group: 'reforma'},
  { key: 'taxDelta',             label: 'Variação R$ (M)',       fmt: 'money', group: 'delta'  },
  { key: 'taxDeltaPercent',      label: 'Variação (%)',          fmt: 'float', group: 'delta'  },
]

const AVG_METRICS: MetricKey[] = ['taxDeltaPercent', 'effectiveRateCurrent', 'effectiveRateReform']
const DELTA_METRICS: MetricKey[] = ['taxDelta', 'taxDeltaPercent']

function heatBg(value: number, max: number, isDelta: boolean): string {
  if (max === 0) return 'transparent'
  const intensity = Math.min(Math.abs(value) / max, 1)
  if (isDelta) {
    if (value < 0) return `rgba(31, 122, 90, ${0.05 + intensity * 0.30})`  // accent-down
    if (value > 0) return `rgba(208, 74, 59, ${0.05 + intensity * 0.30})`  // accent-up
    return 'transparent'
  }
  return `rgba(227, 6, 19, ${0.04 + intensity * 0.22})`
}

export default function PivotTablePage() {
  const ready = usePageReady()

  const [rowDim,  setRowDim]  = useState<DimensionKey>('city')
  const [colDim,  setColDim]  = useState<DimensionKey | 'none'>('none')
  const [metric,  setMetric]  = useState<MetricKey>('totalTaxCurrent')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const metaDef = METRICS.find((m) => m.key === metric)!
  const { rowVals, colVals, cells, rowTotals, colTotals, grand, hasCol } =
    usePivotTable(branches, rowDim, colDim, metric)

  const sortedRows = useMemo(
    () => [...rowVals].sort((a, b) =>
      sortDir === 'desc' ? rowTotals[b] - rowTotals[a] : rowTotals[a] - rowTotals[b],
    ),
    [rowVals, rowTotals, sortDir],
  )

  const maxCellVal = useMemo(() => {
    let max = 0
    for (const rv of rowVals) {
      for (const cv of colVals) {
        const v = Math.abs(cells[rv]?.[cv] ?? 0)
        if (v > max) max = v
      }
    }
    return max
  }, [rowVals, colVals, cells])

  const rowLabel = DIMENSIONS.find((d) => d.key === rowDim)?.label ?? rowDim
  const isDelta  = DELTA_METRICS.includes(metric)

  // Insight strip computations
  const topRow    = sortedRows[0]
  const topRowPct = grand ? ((rowTotals[topRow] ?? 0) / grand) * 100 : 0

  // Detect anomaly: find a dimension value where delta is positive (burden increase)
  const anomalyRow = isDelta
    ? sortedRows.find((rv) => (rowTotals[rv] ?? 0) > 0)
    : undefined

  const csvDownload = () => {
    const header = [rowLabel, ...colVals, hasCol ? 'Total' : ''].filter(Boolean).join(',')
    const body   = sortedRows.map((rv) => [
      `"${rv}"`,
      ...colVals.map((cv) => (cells[rv]?.[cv] ?? 0).toFixed(2)),
      ...(hasCol ? [(rowTotals[rv] ?? 0).toFixed(2)] : []),
    ].join(',')).join('\n')
    const blob = new Blob([header + '\n' + body], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `pivot-${metric}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  if (!ready) return <SkeletonPivotPage />

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-ink-900 tracking-tight">Análise Multidimensional</h2>
        <p className="text-sm text-ink-400 mt-0.5">
          Cruze qualquer dimensão dos seus dados. Células coloridas indicam intensidade.
        </p>
      </div>

      {/* Controls */}
      <div className="card p-3 sm:p-4 print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">Linhas</label>
            <select className="select-field text-xs" value={rowDim} onChange={(e) => setRowDim(e.target.value as DimensionKey)}>
              {DIMENSIONS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">Colunas</label>
            <select className="select-field text-xs" value={colDim} onChange={(e) => setColDim(e.target.value as DimensionKey | 'none')}>
              <option value="none">— Sem colunas —</option>
              {DIMENSIONS.filter((d) => d.key !== rowDim).map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">Métrica</label>
            <select className="select-field text-xs" value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)}>
              {METRICS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </div>
          <div className="flex-1" />
          <button
            className="btn-secondary text-xs px-3 py-2"
            onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
          >
            <ArrowUpDown size={13} />
            {sortDir === 'desc' ? 'Maior → Menor' : 'Menor → Maior'}
          </button>
          <button className="btn-secondary text-xs px-3 py-2" onClick={csvDownload}>
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* Insight strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card p-3">
          <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">Maior valor</p>
          <p className="text-sm font-semibold text-ink-900 truncate">{topRow}</p>
          <p className="text-xs text-ink-400 mt-0.5">
            {fmtVal(rowTotals[topRow] ?? 0, metaDef.fmt)} · {topRowPct.toFixed(0)}% do total
          </p>
        </div>
        <div className="card p-3">
          <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">Total geral</p>
          <p className="text-sm font-semibold text-primary-700 font-mono">{fmtVal(grand, metaDef.fmt)}</p>
          <p className="text-xs text-ink-400 mt-0.5">
            {AVG_METRICS.includes(metric) ? 'média' : 'soma'} · {branches.length} filiais
          </p>
        </div>
        {anomalyRow ? (
          <div className="card p-3 bg-amber-50/40">
            <p className="text-[10px] font-semibold text-accent-warn uppercase tracking-widest mb-1.5">Aumento de carga</p>
            <p className="text-sm font-semibold text-ink-900 truncate">{anomalyRow}</p>
            <p className="text-xs text-accent-up mt-0.5 font-semibold">
              +{fmtVal(rowTotals[anomalyRow] ?? 0, metaDef.fmt)}
            </p>
          </div>
        ) : (
          <div className="card p-3">
            <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">Dimensões</p>
            <p className="text-sm font-semibold text-ink-900">{rowVals.length} valores</p>
            <p className="text-xs text-ink-400 mt-0.5">{colVals.length} {hasCol ? 'colunas' : 'coluna'}</p>
          </div>
        )}
      </div>

      {/* Mobile list */}
      <div className="md:hidden card overflow-hidden">
        {sortedRows.map((rv, ri) => {
          const v   = rowTotals[rv] ?? 0
          const cls = isDelta && v < 0 ? 'text-accent-down' : isDelta && v > 0 ? 'text-accent-up' : 'text-ink-800'
          return (
            <div key={rv} className={`flex items-center justify-between px-4 py-3 ${ri > 0 ? 'border-t border-ink-100' : ''} ${ri % 2 === 0 ? '' : 'bg-ink-50'}`}>
              <span className="text-sm font-medium text-ink-700">{rv}</span>
              <span className={`text-sm font-semibold ${cls}`}>{fmtVal(v, metaDef.fmt)}</span>
            </div>
          )
        })}
        <div className="flex items-center justify-between px-4 py-3 bg-ink-100 border-t-2 border-ink-300 font-semibold">
          <span className="text-sm text-ink-700">TOTAL</span>
          <span className="text-sm text-primary-700 font-mono">{fmtVal(grand, metaDef.fmt)}</span>
        </div>
      </div>

      {/* Full pivot table */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-ink-50 border-b border-ink-200">
                <th className="text-left px-4 py-3 font-semibold text-ink-500 uppercase tracking-wider text-[11px] sticky left-0 bg-ink-50 z-10 min-w-[160px]">
                  {rowLabel}
                </th>
                {colVals.map((cv) => (
                  <th key={cv} className="text-right px-4 py-3 font-semibold text-ink-500 uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[110px]">
                    {cv}
                  </th>
                ))}
                {hasCol && (
                  <th className="text-right px-4 py-3 font-semibold text-primary-700 uppercase tracking-wider text-[11px] bg-primary-100 min-w-[110px]">
                    Total
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((rv, ri) => (
                <tr key={rv} className="border-b border-ink-100 hover:bg-ink-50/50 transition-colors">
                  <td className={`px-4 py-2.5 font-medium text-ink-700 sticky left-0 z-10 ${ri % 2 === 0 ? 'bg-paper' : 'bg-ink-50'}`}>
                    {rv}
                  </td>
                  {colVals.map((cv) => {
                    const v = cells[rv]?.[cv] ?? 0
                    return (
                      <td
                        key={cv}
                        className="text-right px-4 py-2.5 font-mono text-ink-900"
                        style={{ background: heatBg(v, maxCellVal, isDelta) }}
                      >
                        {fmtVal(v, metaDef.fmt)}
                      </td>
                    )
                  })}
                  {hasCol && (
                    <td className="text-right px-4 py-2.5 font-semibold font-mono text-primary-700 bg-primary-100/60">
                      {fmtVal(rowTotals[rv] ?? 0, metaDef.fmt)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-ink-100 border-t-2 border-ink-300 font-semibold">
                <td className="px-4 py-3 text-ink-700 sticky left-0 bg-ink-100 z-10 text-[11px] uppercase tracking-wider">
                  Total
                </td>
                {colVals.map((cv) => (
                  <td key={cv} className="text-right px-4 py-3 font-mono text-ink-700">
                    {fmtVal(colTotals[cv] ?? 0, metaDef.fmt)}
                  </td>
                ))}
                {hasCol && (
                  <td className="text-right px-4 py-3 font-mono font-bold text-white bg-primary-700">
                    {fmtVal(grand, metaDef.fmt)}
                  </td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="px-4 py-2 bg-ink-50 border-t border-ink-100 flex justify-between text-[11px] text-ink-400">
          <span>{branches.length} filiais · {colVals.length} {hasCol ? 'colunas' : 'coluna'} · {AVG_METRICS.includes(metric) ? 'agregação por média' : 'agregação por soma'}</span>
          <span className="font-mono">atualizado 25/04/2026 09:14</span>
        </div>
      </div>
    </div>
  )
}
