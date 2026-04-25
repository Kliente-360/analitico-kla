import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Treemap, Cell,
} from 'recharts'
import { companies, SECTORS, SIZES, STATE_REGION } from '../data/mockData'
import { REGION_COLORS } from '../constants'
import { fmtM } from '../utils/formatters'
import { ChartTooltip } from '../components/ChartTooltip'
import { useTableFilter } from '../hooks/useTableFilter'

function CustomTreemapContent(props: {
  x?: number; y?: number; width?: number; height?: number
  name?: string; size?: number; color?: string
}) {
  const { x = 0, y = 0, width = 0, height = 0, name = '', size = 0, color = '#009900' } = props
  if (width < 30 || height < 20) return null
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.85} stroke="#fff" strokeWidth={2} rx={4} />
      {width > 60 && height > 30 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="white" fontSize={12} fontWeight="bold">{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="white" fontSize={10}>{size}M</text>
        </>
      )}
    </g>
  )
}

export default function RegionalPage() {
  const [sectorFilter, setSectorFilter] = useState('Todos')
  const [sizeFilter,   setSizeFilter]   = useState('Todos')

  const filtered = useTableFilter(companies, { sector: sectorFilter, size: sizeFilter })

  const stateData = useMemo(() => {
    const states = [...new Set(filtered.map((c) => c.state))].sort()
    return states.map((st) => {
      const cs     = filtered.filter((c) => c.state === st)
      const rev    = cs.reduce((s, c) => s + c.revenue, 0)
      const cur    = cs.reduce((s, c) => s + c.totalTaxCurrent, 0)
      const ref    = cs.reduce((s, c) => s + c.totalTaxReform, 0)
      const delta  = cs.reduce((s, c) => s + c.taxDeltaPercent, 0) / cs.length
      const region = STATE_REGION[st] || 'Outros'
      return {
        state: st, region,
        receita:  Math.round(rev / 1_000),
        atual:    Math.round(cur / 1_000),
        reforma:  Math.round(ref / 1_000),
        delta,
        empresas: cs.length,
        color: REGION_COLORS[region] || '#009900',
      }
    }).sort((a, b) => b.atual - a.atual)
  }, [filtered])

  const regionData = useMemo(() => {
    const regs = [...new Set(filtered.map((c) => c.region))]
    return regs.map((r) => {
      const cs = filtered.filter((c) => c.region === r)
      return {
        name:    r,
        atual:   Math.round(cs.reduce((s, c) => s + c.totalTaxCurrent, 0) / 1_000),
        reforma: Math.round(cs.reduce((s, c) => s + c.totalTaxReform, 0)  / 1_000),
        receita: Math.round(cs.reduce((s, c) => s + c.revenue, 0)         / 1_000),
        empresas: cs.length,
        color: REGION_COLORS[r] || '#009900',
      }
    }).sort((a, b) => b.atual - a.atual)
  }, [filtered])

  const treemapData = useMemo(() =>
    stateData.map((s) => ({ name: s.state, size: s.receita, color: s.color })),
    [stateData],
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Análise Regional</h2>
        <p className="text-sm text-gray-500">Distribuição geográfica de receita, impostos e impacto da reforma.</p>
      </div>

      {/* Filters */}
      <div className="card p-4 print:hidden">
        <div className="flex flex-wrap gap-4">
          <div className="w-48">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Setor</label>
            <select className="select-field" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option>Todos</option>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Porte</label>
            <select className="select-field" value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
              <option>Todos</option>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <span className="text-sm text-gray-500">{filtered.length} empresas · {stateData.length} estados</span>
          </div>
        </div>
      </div>

      {/* Treemap + Region bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Receita por Estado (R$ M)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <Treemap data={treemapData} dataKey="size" nameKey="name" content={<CustomTreemapContent />}>
              {treemapData.map((_, i) => <Cell key={i} />)}
            </Treemap>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(REGION_COLORS).map(([r, c]) => (
              <span key={r} className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c }} />{r}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Impostos por Região — Atual vs Reforma (R$ M)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionData} margin={{ left: 5, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
              <Bar dataKey="atual"   name="Regime Atual" radius={[3, 3, 0, 0]}>
                {regionData.map((r, i) => <Cell key={i} fill={r.color} fillOpacity={0.6} />)}
              </Bar>
              <Bar dataKey="reforma" name="Pós-Reforma"  radius={[3, 3, 0, 0]}>
                {regionData.map((r, i) => <Cell key={i} fill={r.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* State-level bar chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Carga Tributária por Estado (R$ M) — Regime Atual</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stateData} margin={{ left: 5, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="state" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
            <Bar dataKey="atual"   name="Regime Atual" radius={[3, 3, 0, 0]}>
              {stateData.map((s, i) => <Cell key={i} fill={s.color} />)}
            </Bar>
            <Bar dataKey="reforma" name="Pós-Reforma"  fill="#00cc00" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* State table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Detalhamento por Estado</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold">Estado</th>
                <th className="text-left py-2 px-3 font-semibold">Região</th>
                <th className="text-right py-2 px-3 font-semibold">Empresas</th>
                <th className="text-right py-2 px-3 font-semibold">Receita</th>
                <th className="text-right py-2 px-3 font-semibold">Impostos Atuais</th>
                <th className="text-right py-2 px-3 font-semibold">Pós-Reforma</th>
                <th className="text-right py-2 px-3 font-semibold">Impacto Médio</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((s, i) => (
                <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2.5 px-3 font-semibold text-gray-800">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ background: s.color }} />
                      {s.state}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs">{s.region}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600">{s.empresas}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{fmtM(s.receita * 1_000)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{fmtM(s.atual * 1_000)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{fmtM(s.reforma * 1_000)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${s.delta < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
