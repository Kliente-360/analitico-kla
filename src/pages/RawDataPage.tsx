import { useState, useMemo } from 'react'
import { Download, Search, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import Papa from 'papaparse'
import { companies, SECTORS, STATES, SIZES } from '../data/mockData'
import { fmtM, fmtPct } from '../utils/formatters'
import { useTableFilter } from '../hooks/useTableFilter'
import type { Company } from '../types'

interface ColDef {
  key: keyof Company
  label: string
  fmt?: (v: number | string) => string
  align?: 'left' | 'right'
}

const COLUMNS: ColDef[] = [
  { key: 'name',                 label: 'Empresa',           align: 'left'  },
  { key: 'sector',               label: 'Setor',             align: 'left'  },
  { key: 'state',                label: 'UF',                align: 'left'  },
  { key: 'region',               label: 'Região',            align: 'left'  },
  { key: 'size',                 label: 'Porte',             align: 'left'  },
  { key: 'founded',              label: 'Fundação',          align: 'right', fmt: (v) => String(v) },
  { key: 'employees',            label: 'Funcionários',      align: 'right', fmt: (v) => Number(v).toLocaleString('pt-BR') },
  { key: 'revenue',              label: 'Receita',           align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'irpj',                 label: 'IRPJ',              align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'csll',                 label: 'CSLL',              align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'pis',                  label: 'PIS',               align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'cofins',               label: 'COFINS',            align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'iss',                  label: 'ISS',               align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'icms',                 label: 'ICMS',              align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'totalTaxCurrent',      label: 'Total Atual',       align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'effectiveRateCurrent', label: 'Alíq. Atual',      align: 'right', fmt: (v) => `${Number(v).toFixed(1)}%` },
  { key: 'cbs',                  label: 'CBS',               align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'ibs',                  label: 'IBS',               align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'totalTaxReform',       label: 'Total Reforma',     align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'effectiveRateReform',  label: 'Alíq. Reforma',    align: 'right', fmt: (v) => `${Number(v).toFixed(1)}%` },
  { key: 'taxDelta',             label: 'Δ R$',              align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'taxDeltaPercent',      label: 'Δ %',               align: 'right', fmt: (v) => fmtPct(Number(v)) },
]

type SortKey = keyof Company

interface Filters { sector: string; state: string; size: string; search: string }

export default function RawDataPage() {
  const [filters, setFilters] = useState<Filters>({ sector: 'Todos', state: 'Todos', size: 'Todos', search: '' })
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [visibleCols, setVisibleCols] = useState<Set<keyof Company>>(new Set(COLUMNS.map((c) => c.key)))
  const [showColPicker, setShowColPicker] = useState(false)

  const setFilter = (k: keyof Filters) => (v: string) => setFilters((prev) => ({ ...prev, [k]: v }))

  const filtered = useTableFilter(companies, {
    sector: filters.sector,
    state:  filters.state,
    size:   filters.size,
    search: filters.search,
  })

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    }),
    [filtered, sortKey, sortDir],
  )

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const exportCsv = () => {
    const rows = sorted.map((c) => {
      const obj: Record<string, string | number> = {}
      COLUMNS.forEach((col) => { obj[col.label] = c[col.key] as string | number })
      return obj
    })
    const csv  = Papa.unparse(rows)
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analitico-kla-dados-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleCol = (key: keyof Company) => {
    setVisibleCols((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const visibleColDefs = COLUMNS.filter((c) => visibleCols.has(c.key))

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="opacity-30" />
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Dados Brutos</h2>
        <p className="text-sm text-gray-500">Explore todos os dados e exporte para CSV.</p>
      </div>

      {/* Controls */}
      <div className="card p-4 print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search')(e.target.value)}
              placeholder="Buscar empresa, setor, estado..."
              className="input-field pl-9 pr-8"
            />
            {filters.search && (
              <button onClick={() => setFilter('search')('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="w-44">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Setor</label>
            <select className="select-field" value={filters.sector} onChange={(e) => setFilter('sector')(e.target.value)}>
              <option>Todos</option>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Estado</label>
            <select className="select-field" value={filters.state} onChange={(e) => setFilter('state')(e.target.value)}>
              <option>Todos</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Porte</label>
            <select className="select-field" value={filters.size} onChange={(e) => setFilter('size')(e.target.value)}>
              <option>Todos</option>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="relative">
            <button onClick={() => setShowColPicker((v) => !v)} className="btn-secondary text-sm">
              Colunas
            </button>
            {showColPicker && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-20 w-64">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Colunas visíveis</p>
                <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
                  {COLUMNS.map((col) => (
                    <label key={String(col.key)} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer py-1">
                      <input type="checkbox" checked={visibleCols.has(col.key)} onChange={() => toggleCol(col.key)} className="accent-primary-700" />
                      {col.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={exportCsv} className="btn-primary flex items-center gap-2 text-sm">
            <Download size={14} />
            Exportar CSV
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          {sorted.length} de {companies.length} empresas · {visibleColDefs.length} colunas visíveis
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-primary-700 text-white text-xs">
                {visibleColDefs.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={() => handleSort(col.key as SortKey)}
                    className={`px-3 py-3 font-semibold cursor-pointer hover:bg-primary-800 select-none ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key as SortKey} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, ri) => (
                <tr key={c.id} className={`${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary-50 transition-colors`}>
                  {visibleColDefs.map((col) => {
                    const raw     = c[col.key]
                    const val     = col.fmt ? col.fmt(raw as number | string) : String(raw)
                    const isDelta = col.key === 'taxDelta' || col.key === 'taxDeltaPercent'
                    const numRaw  = typeof raw === 'number' ? raw : 0
                    const deltaClass = isDelta ? (numRaw < 0 ? 'text-green-700 font-medium' : numRaw > 0 ? 'text-red-700 font-medium' : '') : ''
                    return (
                      <td key={String(col.key)} className={`px-3 py-2 ${col.align === 'right' ? 'text-right' : ''} ${deltaClass || 'text-gray-700'}`}>
                        {val}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={visibleColDefs.length} className="text-center py-12 text-gray-400">
                    Nenhuma empresa encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex flex-wrap gap-6 text-xs text-gray-500">
          <span>Receita total: <strong className="text-gray-700">{fmtM(sorted.reduce((s, c) => s + c.revenue, 0))}</strong></span>
          <span>Impostos atuais: <strong className="text-gray-700">{fmtM(sorted.reduce((s, c) => s + c.totalTaxCurrent, 0))}</strong></span>
          <span>Impostos reforma: <strong className="text-gray-700">{fmtM(sorted.reduce((s, c) => s + c.totalTaxReform, 0))}</strong></span>
          <span>Funcionários: <strong className="text-gray-700">{sorted.reduce((s, c) => s + c.employees, 0).toLocaleString('pt-BR')}</strong></span>
        </div>
      </div>
    </div>
  )
}
