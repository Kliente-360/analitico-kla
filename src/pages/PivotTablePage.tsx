import { useState, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { companies } from '../data/mockData'
import { usePivotTable } from '../hooks/usePivotTable'
import { fmtVal } from '../utils/formatters'
import type { DimensionKey, MetricKey } from '../types'

const DIMENSIONS: { key: DimensionKey; label: string }[] = [
  { key: 'sector', label: 'Setor' },
  { key: 'state',  label: 'Estado' },
  { key: 'region', label: 'Região' },
  { key: 'size',   label: 'Porte' },
  { key: 'decade', label: 'Década de Fundação' },
]

const METRICS: { key: MetricKey; label: string; fmt: 'money' | 'pct' | 'int' | 'float' }[] = [
  { key: 'revenue',              label: 'Receita (R$ M)',          fmt: 'money' },
  { key: 'employees',            label: 'Funcionários',            fmt: 'int'   },
  { key: 'totalTaxCurrent',      label: 'Impostos Atuais (R$ M)',  fmt: 'money' },
  { key: 'totalTaxReform',       label: 'Impostos Reforma (R$ M)', fmt: 'money' },
  { key: 'taxDelta',             label: 'Variação R$ (M)',         fmt: 'money' },
  { key: 'taxDeltaPercent',      label: 'Variação (%)',            fmt: 'float' },
  { key: 'effectiveRateCurrent', label: 'Alíquota Efetiva Atual',  fmt: 'float' },
  { key: 'effectiveRateReform',  label: 'Alíquota Efetiva Reform', fmt: 'float' },
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

function deltaClass(v: number, metric: MetricKey) {
  if (!DELTA_METRICS.includes(metric)) return ''
  return v < 0 ? 'text-green-700 bg-green-50' : v > 0 ? 'text-red-700 bg-red-50' : ''
}

export default function PivotTablePage() {
  const [rowDim,  setRowDim]  = useState<DimensionKey>('sector')
  const [colDim,  setColDim]  = useState<DimensionKey | 'none'>('region')
  const [metric,  setMetric]  = useState<MetricKey>('totalTaxCurrent')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const metaDef = METRICS.find((m) => m.key === metric)!
  const { rowVals, colVals, cells, rowTotals, colTotals, grand, hasCol } =
    usePivotTable(companies, rowDim, colDim, metric)

  const sortedRows = useMemo(
    () => [...rowVals].sort((a, b) =>
      sortDir === 'desc' ? rowTotals[b] - rowTotals[a] : rowTotals[a] - rowTotals[b],
    ),
    [rowVals, rowTotals, sortDir],
  )

  const rowLabel = DIMENSIONS.find((d) => d.key === rowDim)?.label ?? rowDim

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Tabela Dinâmica</h2>
        <p className="text-sm text-gray-500">Combine dimensões e métricas para análises personalizadas.</p>
      </div>

      {/* Controls */}
      <div className="card p-3 sm:p-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Linhas</label>
            <select className="select-field" value={rowDim} onChange={(e) => setRowDim(e.target.value as DimensionKey)}>
              {DIMENSIONS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Colunas <span className="hidden sm:inline text-gray-400 normal-case font-normal">(desktop)</span>
            </label>
            <select className="select-field" value={colDim} onChange={(e) => setColDim(e.target.value as DimensionKey | 'none')}>
              <option value="none">— Sem colunas —</option>
              {DIMENSIONS.filter((d) => d.key !== rowDim).map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Métrica</label>
            <select className="select-field" value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)}>
              {METRICS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ordenar</label>
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

      {/* Mobile card list (hidden on md+) */}
      <div className="md:hidden space-y-2">
        <p className="text-xs text-gray-400 px-1">
          Vista resumida — {metaDef.label} por {rowLabel}
          {hasCol ? '. Gire o dispositivo ou acesse pelo computador para ver a tabela completa.' : ''}
        </p>
        <div className="card overflow-hidden">
          {sortedRows.map((rv, ri) => {
            const v   = rowTotals[rv] ?? 0
            const cls = deltaClass(v, metric)
            return (
              <div key={rv} className={`flex items-center justify-between px-4 py-3 ${ri > 0 ? 'border-t border-gray-100' : ''} ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <span className="text-sm font-medium text-gray-700">{rv}</span>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded ${cls || 'text-gray-800'}`}>
                  {fmtVal(v, metaDef.fmt)}
                </span>
              </div>
            )
          })}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-t-2 border-gray-300 font-semibold">
            <span className="text-sm text-gray-700">TOTAL</span>
            <span className="text-sm text-primary-700">{fmtVal(grand, metaDef.fmt)}</span>
          </div>
        </div>
      </div>

      {/* Full pivot table (hidden on < md) */}
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
                <tr key={rv} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className={`px-4 py-2.5 font-medium text-gray-700 sticky left-0 z-10 ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {rv}
                  </td>
                  {colVals.map((cv) => {
                    const v   = cells[rv]?.[cv] ?? 0
                    const cls = deltaClass(v, metric)
                    return (
                      <td key={cv} className="text-right px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls || 'text-gray-700'}`}>
                          {fmtVal(v, metaDef.fmt)}
                        </span>
                      </td>
                    )
                  })}
                  {hasCol && (
                    <td className="text-right px-4 py-2.5 font-semibold bg-gray-100">
                      {fmtVal(rowTotals[rv] ?? 0, metaDef.fmt)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                <td className="px-4 py-3 text-gray-700 sticky left-0 bg-gray-100 z-10">TOTAL</td>
                {colVals.map((cv) => (
                  <td key={cv} className="text-right px-4 py-3 text-gray-800">
                    {fmtVal(colTotals[cv] ?? 0, metaDef.fmt)}
                  </td>
                ))}
                {hasCol && (
                  <td className="text-right px-4 py-3 text-primary-700 bg-primary-50">
                    {fmtVal(grand, metaDef.fmt)}
                  </td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400">
          {metaDef.label} · {companies.length} empresas · {AVG_METRICS.includes(metric) ? 'Métrica: média' : 'Métrica: soma'}
        </div>
      </div>
    </div>
  )
}
