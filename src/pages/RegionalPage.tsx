import { useMemo } from 'react'
import { useUrlState } from '../hooks/useUrlState'
import { Treemap, Cell, ResponsiveContainer } from 'recharts'
import { branches, BUSINESS_LINES, SIZES, STATE_REGION } from '../data/mockData'
import { REGION_COLORS } from '../constants'
import { fmtM } from '../utils/formatters'

function TreemapTile(props: {
  x?: number; y?: number; width?: number; height?: number
  name?: string; size?: number; delta?: number; filiais?: number; color?: string
}) {
  const { x = 0, y = 0, width = 0, height = 0, name = '', size = 0, delta = 0, filiais = 0, color = '#5a6779' } = props
  if (width < 32 || height < 24) return null
  const small = width < 70 || height < 50
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.82} stroke="#fff" strokeWidth={2} rx={6} />
      {!small && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 14} textAnchor="middle" fill="white" fontSize={20} fontWeight="700" fontFamily="Fraunces, Georgia, serif">
            {name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={10} fontFamily="JetBrains Mono, monospace">
            {size}M · {filiais} filial{filiais > 1 ? 'is' : ''}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 18} textAnchor="middle" fill={delta < 0 ? '#7ee3bd' : '#fca5a5'} fontSize={11} fontWeight="600" fontFamily="JetBrains Mono, monospace">
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
          </text>
        </>
      )}
      {small && width > 32 && height > 24 && (
        <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="white" fontSize={10} fontWeight="600">
          {name}
        </text>
      )}
    </g>
  )
}

export default function RegionalPage() {
  const [sectorFilter, setSectorFilter] = useUrlState('reg_sector', 'Todos')
  const [sizeFilter,   setSizeFilter]   = useUrlState('reg_size', 'Todos')

  const filtered = useMemo(() =>
    branches.filter((b) =>
      (sectorFilter === 'Todos' || b.sector === sectorFilter) &&
      (sizeFilter   === 'Todos' || b.size   === sizeFilter)
    ),
    [sectorFilter, sizeFilter],
  )

  const stateData = useMemo(() => {
    const states = [...new Set(filtered.map((b) => b.state))].sort()
    return states.map((st) => {
      const bs     = filtered.filter((b) => b.state === st)
      const rev    = bs.reduce((s, b) => s + b.revenue, 0)
      const cur    = bs.reduce((s, b) => s + b.totalTaxCurrent, 0)
      const ref    = bs.reduce((s, b) => s + b.totalTaxReform, 0)
      const delta  = bs.reduce((s, b) => s + b.taxDeltaPercent, 0) / bs.length
      const region = STATE_REGION[st] ?? 'Outros'
      return {
        state:    st,
        region,
        receita:  rev,
        atual:    cur,
        reforma:  ref,
        delta,
        filiais:  bs.length,
        pctTotal: 0,
        color:    (REGION_COLORS as Record<string, string>)[region] ?? '#5a6779',
      }
    }).sort((a, b) => b.atual - a.atual)
  }, [filtered])

  // Add % of total revenue to each state
  const totalRev = stateData.reduce((s, d) => s + d.receita, 0)
  const stateDataWithPct = stateData.map((d) => ({
    ...d,
    pctTotal: totalRev > 0 ? (d.receita / totalRev) * 100 : 0,
  }))

  const treemapData = useMemo(() =>
    stateDataWithPct.map((s) => ({
      name:    s.state,
      size:    Math.round(s.receita / 1_000),
      delta:   s.delta,
      filiais: s.filiais,
      color:   s.color,
    })),
    [stateDataWithPct],
  )

  const maxAtual = stateDataWithPct[0]?.atual ?? 1

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-ink-900">Por Filial / UF</h2>
        <p className="text-sm text-ink-500">Distribuição geográfica das filiais do grupo.</p>
      </div>

      {/* Filters */}
      <div className="card p-3 sm:p-4 print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-48">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Segmento</label>
            <select className="select-field" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option>Todos</option>
              {BUSINESS_LINES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Porte</label>
            <select className="select-field" value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
              <option>Todos</option>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <span className="text-xs text-ink-500 pb-1">
            {filtered.length} filiais · {stateDataWithPct.length} estados
          </span>
        </div>
      </div>

      {/* Treemap + UF bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Treemap */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-1">Receita por estado (R$ M)</h3>
          <p className="text-xs text-ink-400 mb-4">Tamanho proporcional à receita · cor = macrorregião</p>
          <ResponsiveContainer width="100%" height={260}>
            <Treemap
              data={treemapData}
              dataKey="size"
              nameKey="name"
              content={<TreemapTile />}
            >
              {treemapData.map((_, i) => <Cell key={i} />)}
            </Treemap>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(REGION_COLORS).map(([r, c]) => (
              <span key={r} className="flex items-center gap-1 text-[11px] text-ink-500">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />{r}
              </span>
            ))}
          </div>
        </div>

        {/* UF bars */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-1">Carga tributária por UF</h3>
          <p className="text-xs text-ink-400 mb-4">Atual (opaco) vs reforma · ordenado por carga</p>
          <div className="space-y-4">
            {stateDataWithPct.map(({ state, atual, reforma, delta, filiais, color }) => (
              <div key={state} className="flex items-center gap-3">
                <div className="w-10 flex-shrink-0">
                  <p className="font-display text-xl font-semibold text-ink-900 leading-none">{state}</p>
                  <p className="text-[10px] text-ink-400 mt-0.5">{filiais} filial{filiais > 1 ? 'is' : ''}</p>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="h-2.5 bg-ink-100 rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${(atual / maxAtual) * 100}%`, background: color, opacity: 0.4 }} />
                  </div>
                  <div className="h-2.5 bg-ink-100 rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${(reforma / maxAtual) * 100}%`, background: color }} />
                  </div>
                </div>
                <span className={`w-14 text-right text-[11px] font-semibold font-mono flex-shrink-0 ${delta < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
                  {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-ink-100 flex items-center gap-4 text-[11px] text-ink-400">
            <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-2 rounded-sm bg-ink-300 opacity-40" />Atual</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-2 rounded-sm bg-ink-300" />Reforma</span>
          </div>
        </div>
      </div>

      {/* State table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-4">Detalhamento por estado</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-ink-500 border-b border-ink-200">
                <th className="text-left py-2 px-3 font-semibold">UF</th>
                <th className="text-left py-2 px-3 font-semibold">Região</th>
                <th className="text-right py-2 px-3 font-semibold">Filiais</th>
                <th className="text-right py-2 px-3 font-semibold">Receita</th>
                <th className="text-right py-2 px-3 font-semibold">% receita</th>
                <th className="text-right py-2 px-3 font-semibold">Imp. atual</th>
                <th className="text-right py-2 px-3 font-semibold">Imp. reforma</th>
                <th className="text-right py-2 px-3 font-semibold">Δ médio</th>
              </tr>
            </thead>
            <tbody>
              {stateDataWithPct.map((s, i) => (
                <tr key={s.state} className={i % 2 === 0 ? 'bg-paper' : 'bg-ink-50'}>
                  <td className="py-2.5 px-3 font-semibold text-ink-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ background: s.color }} />
                      {s.state}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-ink-500 text-xs">{s.region}</td>
                  <td className="py-2.5 px-3 text-right text-ink-600">{s.filiais}</td>
                  <td className="py-2.5 px-3 text-right text-ink-700 font-mono">{fmtM(s.receita)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-600 font-mono">{s.pctTotal.toFixed(0)}%</td>
                  <td className="py-2.5 px-3 text-right text-ink-700 font-mono">{fmtM(s.atual)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-700 font-mono">{fmtM(s.reforma)}</td>
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
