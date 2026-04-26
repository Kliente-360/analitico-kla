import { useState, useMemo, useCallback, useRef } from 'react'
import { useUrlState } from '../hooks/useUrlState'
import { Download, Search, X, ArrowUpDown, ArrowUp, ArrowDown, Database } from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'
import Papa from 'papaparse'
import { branches, BUSINESS_LINES, STATES, SIZES } from '../data/mockData'
import { fmtM, fmtPct } from '../utils/formatters'
import { useTableFilter } from '../hooks/useTableFilter'
import { EmptyState } from '../components/EmptyState'
import { SkeletonTable } from '../components/Skeleton'
import { usePageReady } from '../hooks/usePageReady'
import type { Branch } from '../types'

interface ColDef {
  key: keyof Branch
  label: string
  fmt?: (v: number | string) => string
  align?: 'left' | 'right'
}

const COLUMNS: ColDef[] = [
  { key: 'name',                 label: 'Empresa',        align: 'left'  },
  { key: 'sector',               label: 'Setor',          align: 'left'  },
  { key: 'state',                label: 'UF',             align: 'left'  },
  { key: 'region',               label: 'Região',         align: 'left'  },
  { key: 'size',                 label: 'Porte',          align: 'left'  },
  { key: 'founded',              label: 'Fundação',       align: 'right', fmt: (v) => String(v) },
  { key: 'employees',            label: 'Funcionários',   align: 'right', fmt: (v) => Number(v).toLocaleString('pt-BR') },
  { key: 'revenue',              label: 'Receita',        align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'irpj',                 label: 'IRPJ',           align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'csll',                 label: 'CSLL',           align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'pis',                  label: 'PIS',            align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'cofins',               label: 'COFINS',         align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'iss',                  label: 'ISS',            align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'icms',                 label: 'ICMS',           align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'totalTaxCurrent',      label: 'Total Atual',    align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'effectiveRateCurrent', label: 'Alíq. Atual',   align: 'right', fmt: (v) => `${Number(v).toFixed(1)}%` },
  { key: 'cbs',                  label: 'CBS',            align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'ibs',                  label: 'IBS',            align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'totalTaxReform',       label: 'Total Reforma',  align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'effectiveRateReform',  label: 'Alíq. Reforma', align: 'right', fmt: (v) => `${Number(v).toFixed(1)}%` },
  { key: 'taxDelta',             label: 'Δ R$',           align: 'right', fmt: (v) => fmtM(Number(v)) },
  { key: 'taxDeltaPercent',      label: 'Δ %',            align: 'right', fmt: (v) => fmtPct(Number(v)) },
]

type SortKey = keyof Branch

const ROW_HEIGHT = 36

export default function RawDataPage() {
  const pageReady = usePageReady()
  const [sectorFilter, setSector]   = useUrlState('raw_sector', 'Todos')
  const [stateFilter,  setStateFlt] = useUrlState('raw_state', 'Todos')
  const [sizeFilter,   setSizeFlt]  = useUrlState('raw_size', 'Todos')
  const [search,       setSearch]   = useUrlState('raw_q', '')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [visibleCols, setVisibleCols] = useState<Set<keyof Branch>>(new Set(COLUMNS.map((c) => c.key)))
  const [showColPicker, setShowColPicker] = useState(false)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const filtered = useTableFilter(branches, {
    sector: sectorFilter,
    state:  stateFilter,
    size:   sizeFilter,
    search,
  })

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      const av  = a[sortKey]
      const bv  = b[sortKey]
      const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    }),
    [filtered, sortKey, sortDir],
  )

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }, [sortKey])

  const exportCsv = useCallback(() => {
    const rows = sorted.map((c) => {
      const obj: Record<string, string | number> = {}
      COLUMNS.forEach((col) => { obj[col.label] = c[col.key] as string | number })
      return obj
    })
    const csv  = Papa.unparse(rows)
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href     = url
    link.download = `analitico-kla-dados-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [sorted])

  const toggleCol = useCallback((key: keyof Branch) => {
    setVisibleCols((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const visibleColDefs = COLUMNS.filter((c) => visibleCols.has(c.key))

  const rowVirtualizer = useVirtualizer({
    count:           sorted.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize:    () => ROW_HEIGHT,
    overscan:        15,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="opacity-30" />
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  const activeFilterCount = [
    sectorFilter !== 'Todos',
    stateFilter  !== 'Todos',
    sizeFilter   !== 'Todos',
    search       !== '',
  ].filter(Boolean).length

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-ink-900">Dados Brutos</h2>
        <p className="text-sm text-ink-500">Explore todas as filiais e exporte para CSV.</p>
      </div>

      {/* Controls */}
      <div className="card p-4 print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar filial, setor, estado..."
              className="input-field pl-9 pr-8"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="w-44">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Setor</label>
            <select className="select-field" value={sectorFilter} onChange={(e) => setSector(e.target.value)}>
              <option>Todos</option>
              {BUSINESS_LINES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Estado</label>
            <select className="select-field" value={stateFilter} onChange={(e) => setStateFlt(e.target.value)}>
              <option>Todos</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Porte</label>
            <select className="select-field" value={sizeFilter} onChange={(e) => setSizeFlt(e.target.value)}>
              <option>Todos</option>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="relative">
            <button onClick={() => setShowColPicker((v) => !v)} className="btn-secondary text-sm">
              Colunas
              {visibleColDefs.length < COLUMNS.length && (
                <span className="ml-1 text-[11px] text-primary-700 font-semibold">
                  {visibleColDefs.length}/{COLUMNS.length}
                </span>
              )}
            </button>
            {showColPicker && (
              <div className="absolute right-0 top-full mt-1 bg-paper border border-ink-200 rounded-xl shadow-xl p-4 z-20 w-64">
                <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">Colunas visíveis</p>
                <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
                  {COLUMNS.map((col) => (
                    <label key={String(col.key)} className="flex items-center gap-2 text-xs text-ink-700 cursor-pointer py-1">
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

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-400">
          <span>{sorted.length} de {branches.length} filiais</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium text-[11px]">
              {activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''} ativo{activeFilterCount > 1 ? 's' : ''}
            </span>
          )}
          <span className="text-ink-300">·</span>
          <span>{visibleColDefs.length} colunas visíveis</span>
        </div>
      </div>

      {sorted.length === 0 && (
        <div className="card">
          <EmptyState
            icon={<Database size={28} />}
            title="Nenhuma filial encontrada"
            body="Tente outro termo de busca ou remova filtros ativos."
          />
        </div>
      )}

      {/* Virtualized Table — deferred until after first paint */}
      {sorted.length > 0 && !pageReady && <SkeletonTable rows={8} />}
      {sorted.length > 0 && pageReady && <div className="card overflow-hidden">
        <div ref={tableContainerRef} className="overflow-auto" style={{ maxHeight: '520px' }}>
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-10">
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
            <tbody style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {virtualItems.map((virtualRow) => {
                  const c  = sorted[virtualRow.index]
                  const ri = virtualRow.index
                  return (
                    <tr
                      key={c.id}
                      style={{
                        position:  'absolute',
                        top:       0,
                        left:      0,
                        width:     '100%',
                        height:    `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className={`${ri % 2 === 0 ? 'bg-paper' : 'bg-ink-50'} hover:bg-primary-100 transition-colors`}
                    >
                      {visibleColDefs.map((col) => {
                        const raw      = c[col.key]
                        const val      = col.fmt ? col.fmt(raw as number | string) : String(raw)
                        const isDelta  = col.key === 'taxDelta' || col.key === 'taxDeltaPercent'
                        const numRaw   = typeof raw === 'number' ? raw : 0
                        const deltaClass = isDelta
                          ? (numRaw < 0 ? 'text-accent-down font-medium' : numRaw > 0 ? 'text-accent-up font-medium' : '')
                          : ''
                        return (
                          <td key={String(col.key)} className={`px-3 py-2 ${col.align === 'right' ? 'text-right' : ''} ${deltaClass || 'text-ink-700'}`}>
                            {val}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <div className="bg-ink-50 border-t border-ink-200 px-4 py-3 flex flex-wrap gap-6 text-xs text-ink-500">
          <span>Receita total: <strong className="text-ink-900">{fmtM(sorted.reduce((s, c) => s + c.revenue, 0))}</strong></span>
          <span>Impostos atuais: <strong className="text-ink-900">{fmtM(sorted.reduce((s, c) => s + c.totalTaxCurrent, 0))}</strong></span>
          <span>Impostos reforma: <strong className="text-ink-900">{fmtM(sorted.reduce((s, c) => s + c.totalTaxReform, 0))}</strong></span>
          <span>Colaboradores: <strong className="text-ink-900">{sorted.reduce((s, c) => s + c.employees, 0).toLocaleString('pt-BR')}</strong></span>
        </div>
      </div>}
    </div>
  )
}
