import { useState, useMemo } from 'react'
import { ArrowUpDown, Download } from 'lucide-react'
import { branches } from '../data/mockData'
import { usePivotTable } from '../hooks/usePivotTable'
import { fmtVal } from '../utils/formatters'
import type { DimensionKey, MetricKey } from '../types'

const DIMENSIONS: { key: DimensionKey; label: string }[] = [
  { key: 'sector', label: 'Setor' },
  { key: 'state',  label: 'Estado' },
  { key: 'region', label: 'Região' },
  { key: 'size',   label: 'Porte' },
  { key: 'city',   label: 'Cidade' },
  { key: 'decade', label: 'Década de Fundação' },
]

const METRICS: { key: MetricKey; label: string; fmt: 'money' | 'pct' | 'int' | 'float' }[] = [
  { key: 'revenue',              label: 'Receita (R$ M)',            fmt: 'money' },
  { key: 'employees',            label: 'Funcionários',              fmt: 'int'   },
  { key: 'totalTaxCurrent',      label: 'Carga atual (R$ M)',        fmt: 'money' },
  { key: 'totalTaxReform',       label: 'Carga reforma (R$ M)',      fmt: 'money' },
  { key: 'taxDelta',             label: 'Variação R$ (M)',           fmt: 'money' },
  { key: 'taxDeltaPercent',      label: 'Variação (%)',              fmt: 'float' },
  { key: 'effectiveRateCurrent', label: 'Alíquota efetiva atual',    fmt: 'float' },
  { key: 'effectiveRateReform',  label: 'Alíquota efetiva reforma',  fmt: 'float' },
  { key: 'irpj',   label: 'IRPJ (R$ M)',   fmt: 'money' },
  { key: 'csll',   label: 'CSLL (R$ M)',   fmt: 'money' },
  { key: 'pis',    label: 'PIS (R$ M)',    fmt: 'money' },
  { key: 'cofins', label: 'COFINS (R$ M)', fmt: 'money' },
  { key: 'iss',    label: 'ISS (R$ M)',    fmt: 'money' },
  { key: 'icms',   label: 'ICMS (R$ M)',   fmt: 'money' },
  { key: 'cbs',    label: 'CBS (R$ M)',    fmt: 'money' },
  { key: 'ibs',    label: 'IBS (R$ M)',    fmt: 'money' },
]

const DELTA_METRICS: MetricKey[] = ['taxDelta', 'taxDeltaPercent']
const AVG_METRICS:   MetricKey[] = ['taxDeltaPercent', 'effectiveRateCurrent', 'effectiveRateReform']

function heatBg(value: number, max: number, isDelta: boolean): string {
  if (max === 0) return ''
  const intensity = Math.min(Math.abs(value) / max, 1)
  if (isDelta) {
    if (value < 0) return `rgba(31, 122, 90, ${0.06 + intensity * 0.20})`
    if (value > 0) return `rgba(208, 74, 59, ${0.06 + intensity * 0.20})`
    return ''
  }
  return `rgba(227, 6, 19, ${0.04 + intensity * 0.22})`
}

function csvDownload(
  rows: string[],
  cols: string[],
  cells: Record<string, Record<string, number>>,
  rowTotals: Record<string, number>,
  colTotals: Record<string, number>,
  grand: number,
  metaLabel: string,
  rowLabel: string,
  hasCol: boolean,
) {
  const header   = [rowLabel, ...cols, ...(hasCol ? ['Total'] : [])].join(',')
  const dataRows = rows.map((rv) => {
    const vals  = cols.map((cv) => (cells[rv]?.[cv] ?? 0).toFixed(2))
    const total = hasCol ? [(rowTotals[rv] ?? 0).toFixed(2)] : []
    return [rv, ...vals, ...total].join(',')
  })
  const totRow = ['TOTAL', ...cols.map((cv) => (colTotals[cv] ?? 0).toFixed(2)), ...(hasCol ? [grand.toFixed(2)] : [])].join(',')
  const csv = [header, ...dataRows, totRow].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a   = document.createElement('a')
  a.href = url
  a.download = `pivot-${metaLabel.replace(/[^a-z0-9]/gi, '_')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function PivotTablePage() {
  const [rowDim,  setRowDim]  = useState<DimensionKey>('sector')
  const [colDim,  setColDim]  = useState<DimensionKey | 'none'>('region')
  const [metric,  setMetric]  = useState<MetricKey>('totalTaxCurrent')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const metaDef  = METRICS.find((m) => m.key === metric)!
  const isDelta  = DELTA_METRICS.includes(metric)
  const { rowVals, colVals, cells, rowTotals, colTotals, grand, hasCol } =
    usePivotTable(branches, rowDim, colDim, metric)

  const sortedRows = useMemo(
    () => [...rowVals].sort((a, b) =>
      sortDir === 'desc' ? rowTotals[b] - rowTotals[a] : rowTotals[a] - rowTotals[b],
    ),
    [rowVals, rowTotals, sortDir],
  )

  const colMax   = useMemo(() => Math.max(...Object.values(colTotals), grand || 0), [colTotals, grand])
  const rowLabel = DIMENSIONS.find((d) => d.key === rowDim)?.label ?? rowDim
  const topRowKey = sortedRows[0]
  const topRowVal = topRowKey ? (rowTotals[topRowKey] ?? 0) : 0

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Tabela Dinâmica</h2>
          <p className="text-sm text-ink-500">Combine dimensões e métricas para análises personalizadas.</p>
        </div>
        <button
          className="btn-secondary print:hidden flex items-center gap-2"
          onClick={() => csvDownload(sortedRows, colVals, cells, rowTotals, colTotals, grand, metaDef.label, rowLabel, hasCol)}
        >
          <Download size={14} />
          CSV
        </button>
      </div>

      {/* Insight strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3">
          <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-1">Maior valor</p>
          <p className="text-sm font-semibold text-ink-900 truncate">{topRowKey ?? '—'}</p>
          <p className="text-xs text-ink-500 mt-0.5">{fmtVal(topRowVal, metaDef.fmt)}</p>
        </div>
        <div className="card p-3">
          <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-1">Grand total</p>
          <p className="text-sm font-semibold text-primary-700">{fmtVal(grand, metaDef.fmt)}</p>
          <p className="text-xs text-ink-500 mt-0.5">{branches.length} filiais</p>
        </div>
        <div className="card p-3">
          <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-1">Dimensões</p>
          <p className="text-sm font-semibold text-ink-900">{rowVals.length} × {hasCol ? colVals.length : 1}</p>
          <p className="text-xs text-ink-500 mt-0.5">{AVG_METRICS.includes(metric) ? 'Média' : 'Soma'}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-3 sm:p-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Linhas</label>
            <select className="select-field" value={rowDim} onChange={(e) => setRowDim(e.target.value as DimensionKey)}>
              {DIMENSIONS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">
              Colunas <span className="hidden sm:inline text-ink-400 normal-case font-normal">(desktop)</span>
            </label>
            <select className="select-field" value={colDim} onChange={(e) => setColDim(e.target.value as DimensionKey | 'none')}>
              <option value="none">— Sem colunas —</option>
              {DIMENSIONS.filter((d) => d.key !== rowDim).map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Métrica</label>
            <select className="select-field" value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)}>
              {METRICS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Ordenar</label>
            <button
              className="btn-secondary w-full flex items-center justify-center gap-2"
              onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
            >
              <ArrowUpDown size={14} />
              {sortDir === 'desc' ? 'Maior → Menor' : 'Menor → Maior'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        <p className="text-xs text-ink-400 px-1">
          Vista resumida — {metaDef.label} por {rowLabel}
          {hasCol ? '. Gire o dispositivo ou acesse pelo computador para ver a tabela completa.' : ''}
        </p>
        <div className="card overflow-hidden">
          {sortedRows.map((rv, ri) => {
            const v  = rowTotals[rv] ?? 0
            const bg = heatBg(v, topRowVal, isDelta)
            return (
              <div
                key={rv}
                className={`flex items-center justify-between px-4 py-3 ${ri > 0 ? 'border-t border-ink-100' : ''}`}
                style={{ background: bg || undefined }}
              >
                <span className="text-sm font-medium text-ink-700">{rv}</span>
                <span className={`text-sm font-semibold ${isDelta && v < 0 ? 'text-accent-down' : isDelta && v > 0 ? 'text-accent-up' : 'text-ink-900'}`}>
                  {fmtVal(v, metaDef.fmt)}
                </span>
              </div>
            )
          })}
          <div className="flex items-center justify-between px-4 py-3 bg-ink-100 border-t-2 border-ink-300 font-semibold">
            <span className="text-sm text-ink-700">TOTAL</span>
            <span className="text-sm text-primary-700">{fmtVal(grand, metaDef.fmt)}</span>
          </div>
        </div>
      </div>

      {/* Full pivot table */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary-700 text-white">
                <th className="text-left px-4 py-3 font-semibold sticky left-0 bg-primary-700 z-10 min-w-[140px]">
                  {rowLabel}
                </th>
                {colVals.map((cv) => (
                  <th key={cv} className="text-right px-4 py-3 font-semibold whitespace-nowrap min-w-[110px]">{cv}</th>
                ))}
                {hasCol && (
                  <th className="text-right px-4 py-3 font-semibold bg-primary-800 min-w-[110px]">Total</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((rv, ri) => (
                <tr key={rv} className={ri % 2 === 0 ? 'bg-paper' : 'bg-ink-50'}>
                  <td className={`px-4 py-2.5 font-medium text-ink-700 sticky left-0 z-10 ${ri % 2 === 0 ? 'bg-paper' : 'bg-ink-50'}`}>
                    {rv}
                  </td>
                  {colVals.map((cv) => {
                    const v  = cells[rv]?.[cv] ?? 0
                    const bg = heatBg(v, colMax, isDelta)
                    return (
                      <td
                        key={cv}
                        className={`text-right px-4 py-2.5 text-xs font-medium ${isDelta && v < 0 ? 'text-accent-down' : isDelta && v > 0 ? 'text-accent-up' : 'text-ink-700'}`}
                        style={{ background: bg || undefined }}
                      >
                        {fmtVal(v, metaDef.fmt)}
                      </td>
                    )
                  })}
                  {hasCol && (() => {
                    const rv2 = rv
                    const tot = rowTotals[rv2] ?? 0
                    return (
                      <td
                        className={`text-right px-4 py-2.5 font-semibold ${isDelta && tot < 0 ? 'text-accent-down' : isDelta && tot > 0 ? 'text-accent-up' : 'text-ink-900'}`}
                        style={{ background: heatBg(tot, colMax, isDelta) || undefined }}
                      >
                        {fmtVal(tot, metaDef.fmt)}
                      </td>
                    )
                  })()}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-ink-100 font-semibold border-t-2 border-ink-300">
                <td className="px-4 py-3 text-ink-700 sticky left-0 bg-ink-100 z-10">TOTAL</td>
                {colVals.map((cv) => (
                  <td key={cv} className="text-right px-4 py-3 text-ink-900">
                    {fmtVal(colTotals[cv] ?? 0, metaDef.fmt)}
                  </td>
                ))}
                {hasCol && (
                  <td className="text-right px-4 py-3 text-primary-700 bg-primary-100">
                    {fmtVal(grand, metaDef.fmt)}
                  </td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="px-4 py-2 bg-ink-50 border-t text-xs text-ink-400">
          {metaDef.label} · {branches.length} filiais · {AVG_METRICS.includes(metric) ? 'Métrica: média' : 'Métrica: soma'}
        </div>
      </div>
    </div>
  )
}
