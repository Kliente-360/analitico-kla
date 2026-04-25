import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ScatterChart, Scatter, ZAxis, Cell,
} from 'recharts'
import { companies, SECTORS, REGIONS, SIZES } from '../data/mockData'
import { CHART_COLORS } from '../constants'
import { fmtM } from '../utils/formatters'
import { ChartTooltip } from '../components/ChartTooltip'
import { useTableFilter } from '../hooks/useTableFilter'

interface SectorStat {
  name: string; full: string; color: string
  receita: number; atual: number; reforma: number
  irpj: number; csll: number; pis: number; cofins: number; iss: number; icms: number
  delta: number; empresas: number; efetiva: number
}

export default function SectorPage() {
  const [regionFilter, setRegionFilter] = useState('Todos')
  const [sizeFilter,   setSizeFilter]   = useState('Todos')

  const filtered = useTableFilter(companies, { region: regionFilter, size: sizeFilter })

  const sectorStats = useMemo((): SectorStat[] =>
    SECTORS.map((s, i) => {
      const cs = filtered.filter((c) => c.sector === s)
      if (cs.length === 0) return null as unknown as SectorStat
      const rev  = cs.reduce((sum, c) => sum + c.revenue, 0)
      const cur  = cs.reduce((sum, c) => sum + c.totalTaxCurrent, 0)
      const ref  = cs.reduce((sum, c) => sum + c.totalTaxReform, 0)
      return {
        name:    s.length > 14 ? s.slice(0, 13) + '…' : s,
        full:    s,
        color:   CHART_COLORS[i % CHART_COLORS.length],
        receita: Math.round(rev / 1_000),
        atual:   Math.round(cur / 1_000),
        reforma: Math.round(ref / 1_000),
        irpj:    Math.round(cs.reduce((sum, c) => sum + c.irpj,   0) / 1_000),
        csll:    Math.round(cs.reduce((sum, c) => sum + c.csll,   0) / 1_000),
        pis:     Math.round(cs.reduce((sum, c) => sum + c.pis,    0) / 1_000),
        cofins:  Math.round(cs.reduce((sum, c) => sum + c.cofins, 0) / 1_000),
        iss:     Math.round(cs.reduce((sum, c) => sum + c.iss,    0) / 1_000),
        icms:    Math.round(cs.reduce((sum, c) => sum + c.icms,   0) / 1_000),
        delta:   cs.reduce((sum, c) => sum + c.taxDeltaPercent, 0) / cs.length,
        empresas: cs.length,
        efetiva: (cur / rev) * 100,
      }
    }).filter((s): s is SectorStat => s !== null),
    [filtered],
  )

  const scatterData = useMemo(() =>
    filtered.map((c) => ({
      x: Math.round(c.revenue / 1_000),
      y: parseFloat(c.effectiveRateCurrent.toFixed(2)),
      z: c.employees,
      name: c.name, sector: c.sector,
    })),
    [filtered],
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Análise por Setor</h2>
        <p className="text-sm text-gray-500">Compare receita, composição tributária e impacto da reforma por setor.</p>
      </div>

      {/* Filters */}
      <div className="card p-4 print:hidden">
        <div className="flex flex-wrap gap-3 sm:gap-4 items-end">
          <div className="w-48">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Região</label>
            <select className="select-field" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option>Todos</option>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Porte</label>
            <select className="select-field" value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
              <option>Todos</option>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <span className="text-sm text-gray-500">{filtered.length} empresas selecionadas</span>
        </div>
      </div>

      {/* Receita + Atual vs Reforma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Receita por Setor (R$ M)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sectorStats} layout="vertical" margin={{ left: 10, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={(v: number) => [fmtM(v * 1_000), 'Receita']} />
              <Bar dataKey="receita" radius={[0, 4, 4, 0]}>
                {sectorStats.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Atual vs Pós-Reforma por Setor (R$ M)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sectorStats} margin={{ left: 5, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
              <Bar dataKey="atual"   name="Regime Atual" fill="#0066cc" radius={[3, 3, 0, 0]} />
              <Bar dataKey="reforma" name="Pós-Reforma"  fill="#009900" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Composição stacked */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Composição de Impostos por Setor — Regime Atual (R$ M)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sectorStats} margin={{ left: 5, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
            <Bar dataKey="icms"   name="ICMS"   fill="#ef4444" stackId="a" />
            <Bar dataKey="cofins" name="COFINS" fill="#009900" stackId="a" />
            <Bar dataKey="iss"    name="ISS"    fill="#f59e0b" stackId="a" />
            <Bar dataKey="irpj"   name="IRPJ"   fill="#0066cc" stackId="a" />
            <Bar dataKey="csll"   name="CSLL"   fill="#8b5cf6" stackId="a" />
            <Bar dataKey="pis"    name="PIS"    fill="#06b6d4" stackId="a" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter + Stats table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Receita (R$ M) × Alíquota Efetiva (%)</h3>
          <p className="text-xs text-gray-400 mb-4">Tamanho do ponto = número de funcionários</p>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="x" name="Receita" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`}
                label={{ value: 'Receita (R$ M)', position: 'insideBottom', offset: -5, fontSize: 10 }} />
              <YAxis dataKey="y" name="Alíquota" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
              <ZAxis dataKey="z" range={[30, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                if (!payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
                    <p className="font-semibold mb-1">{d.name}</p>
                    <p className="text-gray-500">{d.sector}</p>
                    <p>Receita: {fmtM(d.x * 1_000)}</p>
                    <p>Alíquota: {d.y}%</p>
                    <p>Funcionários: {d.z.toLocaleString('pt-BR')}</p>
                  </div>
                )
              }} />
              <Scatter data={scatterData} fill="#009900" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Resumo por Setor</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left py-2 font-semibold">Setor</th>
                  <th className="text-right py-2 font-semibold">Emp.</th>
                  <th className="text-right py-2 font-semibold">Alíq. Atual</th>
                  <th className="text-right py-2 font-semibold">Impacto</th>
                </tr>
              </thead>
              <tbody>
                {sectorStats.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 pr-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: s.color }} />
                        {s.full}
                      </span>
                    </td>
                    <td className="py-2 text-right text-gray-600">{s.empresas}</td>
                    <td className="py-2 text-right text-gray-600">{s.efetiva.toFixed(1)}%</td>
                    <td className="py-2 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${s.delta < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
    </div>
  )
}
