import { useMemo } from 'react'
import { useUrlState } from '../hooks/useUrlState'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { branches, BUSINESS_LINES, REGIONS, SIZES } from '../data/mockData'
import { BUSINESS_LINE_COLORS } from '../constants'
import { fmtM } from '../utils/formatters'

interface LineStats {
  name: string; color: string
  filiais: number; receita: number
  atual: number; reforma: number; delta: number
  efetiva: number; efeivaReform: number
}

export default function SectorPage() {
  const [regionFilter, setRegionFilter] = useUrlState('sec_region', 'Todos')
  const [sizeFilter,   setSizeFilter]   = useUrlState('sec_size', 'Todos')

  const filtered = useMemo(() =>
    branches.filter((b) =>
      (regionFilter === 'Todos' || b.region === regionFilter) &&
      (sizeFilter   === 'Todos' || b.size   === sizeFilter)
    ),
    [regionFilter, sizeFilter],
  )

  const lineStats = useMemo((): LineStats[] =>
    BUSINESS_LINES.map((line) => {
      const bs = filtered.filter((b) => b.sector === line)
      if (bs.length === 0) return null as unknown as LineStats
      const rev = bs.reduce((s, b) => s + b.revenue, 0)
      const cur = bs.reduce((s, b) => s + b.totalTaxCurrent, 0)
      const ref = bs.reduce((s, b) => s + b.totalTaxReform, 0)
      return {
        name:          line,
        color:         (BUSINESS_LINE_COLORS as Record<string, string>)[line] ?? '#5a6779',
        filiais:       bs.length,
        receita:       rev,
        atual:         cur,
        reforma:       ref,
        delta:         cur > 0 ? ((ref - cur) / cur) * 100 : 0,
        efetiva:       rev > 0 ? (cur / rev) * 100 : 0,
        efeivaReform:  rev > 0 ? (ref / rev) * 100 : 0,
      }
    }).filter((s): s is LineStats => s !== null)
      .sort((a, b) => b.atual - a.atual),
    [filtered],
  )

  const scatterData = useMemo(() =>
    filtered.map((b) => ({
      x:      Math.round(b.revenue / 1_000),
      y:      parseFloat(b.effectiveRateCurrent.toFixed(2)),
      z:      b.employees,
      name:   b.name,
      sector: b.sector,
    })),
    [filtered],
  )

  const maxAtual = lineStats[0]?.atual ?? 1

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-ink-900">Por Linha de Negócio</h2>
        <p className="text-sm text-ink-500">Receita, carga tributária e impacto da reforma por segmento.</p>
      </div>

      {/* Filters */}
      <div className="card p-3 sm:p-4 print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-48">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Região</label>
            <select className="select-field" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option>Todos</option>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Porte</label>
            <select className="select-field" value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
              <option>Todos</option>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <span className="text-xs text-ink-500 pb-1">{filtered.length} filiais selecionadas</span>
        </div>
      </div>

      {/* Main: micro-bars + scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

        {/* Micro-bars por linha */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-1">Carga por linha de negócio</h3>
          <p className="text-xs text-ink-400 mb-4">Atual (opaco) vs reforma · R$ · ordenado por carga atual</p>
          <div className="space-y-5">
            {lineStats.map(({ name, color, atual, reforma, delta, filiais, receita }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-ink-700 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
                    {name}
                    <span className="text-[11px] text-ink-400 font-normal">
                      · {filiais} filial{filiais > 1 ? 'is' : ''} · {fmtM(receita)}
                    </span>
                  </span>
                  <span className={`text-[11px] font-semibold font-mono ${delta < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
                    {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="h-2.5 bg-ink-100 rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all"
                      style={{ width: `${(atual / maxAtual) * 100}%`, background: color, opacity: 0.4 }}
                    />
                  </div>
                  <div className="h-2.5 bg-ink-100 rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all"
                      style={{ width: `${(reforma / maxAtual) * 100}%`, background: color }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-mono text-ink-400">
                  <span>atual {fmtM(atual)}</span>
                  <span>reforma {fmtM(reforma)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scatter receita × alíquota */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-1">Receita × Alíquota efetiva</h3>
          <p className="text-xs text-ink-400 mb-4">Tamanho = nº de colaboradores · cor = segmento</p>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ left: -10, right: 16, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceff5" />
              <XAxis
                dataKey="x" name="Receita" type="number" tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${v}M`}
                label={{ value: 'Receita (R$ M)', position: 'insideBottom', offset: -12, fontSize: 10, fill: '#8390a3' }}
              />
              <YAxis
                dataKey="y" name="Alíquota" type="number" tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${v}%`}
              />
              <ZAxis dataKey="z" range={[28, 360]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  const color = (BUSINESS_LINE_COLORS as Record<string, string>)[d.sector] ?? '#5a6779'
                  return (
                    <div className="bg-paper border border-ink-200 rounded-lg shadow-md p-3 text-xs">
                      <p className="font-semibold text-ink-900 mb-1">{d.name}</p>
                      <p className="text-xs font-medium mb-1.5" style={{ color }}>{d.sector}</p>
                      <p className="text-ink-600">Receita: {fmtM(d.x * 1_000)}</p>
                      <p className="text-ink-600">Alíquota: {d.y}%</p>
                      <p className="text-ink-600">Colaboradores: {d.z.toLocaleString('pt-BR')}</p>
                    </div>
                  )
                }}
              />
              {BUSINESS_LINES.map((line) => {
                const pts   = scatterData.filter((d) => d.sector === line)
                const color = (BUSINESS_LINE_COLORS as Record<string, string>)[line] ?? '#5a6779'
                return pts.length > 0 ? (
                  <Scatter key={line} name={line} data={pts} fill={color} fillOpacity={0.75} />
                ) : null
              })}
            </ScatterChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {BUSINESS_LINES.filter((l) => scatterData.some((d) => d.sector === l)).map((line) => (
              <span key={line} className="flex items-center gap-1 text-[11px] text-ink-500">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: (BUSINESS_LINE_COLORS as Record<string, string>)[line] }} />
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-4">Resumo por linha de negócio</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-ink-500 border-b border-ink-200">
                <th className="text-left py-2 px-3 font-semibold">Linha</th>
                <th className="text-right py-2 px-3 font-semibold">Filiais</th>
                <th className="text-right py-2 px-3 font-semibold">Receita</th>
                <th className="text-right py-2 px-3 font-semibold">Alíq. atual</th>
                <th className="text-right py-2 px-3 font-semibold">Alíq. reforma</th>
                <th className="text-right py-2 px-3 font-semibold">Impacto</th>
              </tr>
            </thead>
            <tbody>
              {lineStats.map((s, i) => (
                <tr key={s.name} className={i % 2 === 0 ? 'bg-paper' : 'bg-ink-50'}>
                  <td className="py-2.5 px-3 font-medium text-ink-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0" style={{ background: s.color }} />
                      {s.name}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-ink-600">{s.filiais}</td>
                  <td className="py-2.5 px-3 text-right text-ink-700 font-mono">{fmtM(s.receita)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-700 font-mono">{s.efetiva.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right text-ink-700 font-mono">{s.efeivaReform.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      s.delta < 0 ? 'bg-green-50 text-accent-down' : 'bg-red-50 text-accent-up'
                    }`}>
                      {s.delta >= 0 ? '+' : ''}{s.delta.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
