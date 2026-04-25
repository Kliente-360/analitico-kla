import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine, LineChart, Line,
} from 'recharts'
import { getYearlyData, SECTORS } from '../data/mockData'
import { SECTOR_COLORS } from '../constants'
import { fmtM } from '../utils/formatters'

const PHASES = [
  { year: 2026, label: 'Início Transição', desc: 'CBS vigente; IBS em teste (0.1%)' },
  { year: 2027, label: 'CBS Plena',        desc: 'Extinção de PIS/COFINS. IBS 20%' },
  { year: 2029, label: 'IBS 50%',          desc: 'ICMS/ISS reduzidos à metade' },
  { year: 2033, label: 'Reforma Completa', desc: 'Extinção total de ICMS/ISS' },
]

type TooltipEntry = { value: number; name: string; color: string; dataKey: string }

function TrendTooltip({ active, payload, label }: {
  active?: boolean; payload?: TooltipEntry[]; label?: string | number
}) {
  if (!active || !payload?.length) return null
  const phase = PHASES.find((p) => p.year === Number(label))
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-xs">
      <p className="font-semibold text-gray-700 mb-1">Ano {label}</p>
      {phase && (
        <p className="text-primary-700 font-medium mb-2 bg-primary-50 px-2 py-1 rounded">
          {phase.label}: {phase.desc}
        </p>
      )}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {fmtM(p.value)}</p>
      ))}
    </div>
  )
}

export default function TrendPage() {
  const [sectorFilter, setSectorFilter] = useState('Todos')
  const [view, setView] = useState<'area' | 'line'>('area')

  const yearlyData = useMemo(() => getYearlyData(sectorFilter), [sectorFilter])

  const sectorComparison = useMemo(() =>
    SECTORS.map((s) => {
      const data  = getYearlyData(s)
      const y2025 = data.find((d) => d.year === 2025)!
      const y2033 = data.find((d) => d.year === 2033)!
      const change = ((y2033.regimeReforma - y2025.regimeAtual) / y2025.regimeAtual) * 100
      return {
        sector:     s,
        atual2025:  y2025.regimeAtual,
        reforma2033: y2033.regimeReforma,
        change,
      }
    }),
    [SECTORS],
  )

  const ChartComp = view === 'area' ? AreaChart : LineChart

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Tendências e Projeções</h2>
        <p className="text-sm text-gray-500">Evolução da carga tributária durante a transição para o novo regime (2021–2033).</p>
      </div>

      {/* Controls */}
      <div className="card p-4 print:hidden">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-52">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Setor</label>
            <select className="select-field" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option>Todos</option>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('area')}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${view === 'area' ? 'bg-primary-700 text-white' : 'bg-white border border-gray-300 text-gray-600'}`}
            >
              Área
            </button>
            <button
              onClick={() => setView('line')}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${view === 'line' ? 'bg-primary-700 text-white' : 'bg-white border border-gray-300 text-gray-600'}`}
            >
              Linha
            </button>
          </div>
        </div>
      </div>

      {/* Reforma phases */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PHASES.map((p) => (
          <div key={p.year} className="card p-4 border-l-4 border-primary-700">
            <p className="text-lg font-bold text-primary-700">{p.year}</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{p.label}</p>
            <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Main evolution chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Evolução da Carga Tributária — {sectorFilter} (R$ M)
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Regime Atual (projeção linear) · Caminho real da transição · Meta do Regime Reforma
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComp data={yearlyData} margin={{ left: 10, right: 20 }}>
            <defs>
              <linearGradient id="gradAtual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6b7280" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradReforma" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#009900" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#009900" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradTransicao" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0066cc" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0066cc" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000).toFixed(0)}M`} />
            <Tooltip content={<TrendTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
            <ReferenceLine x={2026} stroke="#009900" strokeDasharray="4 4" label={{ value: '▶ Início', position: 'top', fontSize: 9, fill: '#009900' }} />
            <ReferenceLine x={2033} stroke="#009900" strokeDasharray="4 4" label={{ value: '✓ Plena', position: 'top', fontSize: 9, fill: '#009900' }} />
            {view === 'area' ? (
              <>
                <Area type="monotone" dataKey="regimeAtual"   name="Regime Atual (projeção)"  stroke="#6b7280" fill="url(#gradAtual)"     strokeWidth={1.5} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="regimeReforma" name="Regime Reforma (projeção)" stroke="#009900" fill="url(#gradReforma)"   strokeWidth={1.5} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="transicao"     name="Projeção Real (transição)" stroke="#0066cc" fill="url(#gradTransicao)" strokeWidth={2.5} />
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="regimeAtual"   name="Regime Atual (projeção)"  stroke="#6b7280" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="regimeReforma" name="Regime Reforma (projeção)" stroke="#009900" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="transicao"     name="Projeção Real (transição)" stroke="#0066cc" strokeWidth={2.5} dot={{ r: 3, fill: '#0066cc' }} />
              </>
            )}
          </ChartComp>
        </ResponsiveContainer>
      </div>

      {/* Sector comparison 2025 vs 2033 */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Impacto por Setor: 2025 → 2033 (Impostos Totais)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold">Setor</th>
                <th className="text-right py-2 px-3 font-semibold">2025 (Atual)</th>
                <th className="text-right py-2 px-3 font-semibold">2033 (Reforma)</th>
                <th className="text-right py-2 px-3 font-semibold">Variação</th>
                <th className="py-2 px-3 font-semibold">Tendência</th>
              </tr>
            </thead>
            <tbody>
              {sectorComparison.map((s, i) => (
                <tr key={s.sector} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ background: SECTOR_COLORS[s.sector] || '#009900' }} />
                      {s.sector}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{fmtM(s.atual2025)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{fmtM(s.reforma2033)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${s.change < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="w-full bg-gray-100 rounded-full h-2 max-w-[120px]">
                      <div
                        className={`h-2 rounded-full ${s.change < 0 ? 'bg-green-500' : 'bg-red-400'}`}
                        style={{ width: `${Math.min(100, Math.abs(s.change) * 2)}%` }}
                      />
                    </div>
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
