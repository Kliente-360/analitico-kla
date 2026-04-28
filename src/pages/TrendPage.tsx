import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine, LineChart, Line,
} from 'recharts'
import { getYearlyData, BUSINESS_LINES } from '../data/mockData'
import { BUSINESS_LINE_COLORS } from '../constants'
import { fmtM } from '../utils/formatters'

const PHASES = [
  { year: 2026, label: 'Início',          desc: 'CBS vigente · IBS em teste (0,1%)',      borderColor: 'border-primary-700', textColor: 'text-primary-700' },
  { year: 2027, label: 'CBS plena',        desc: 'Extinção de PIS/COFINS · IBS a 20%',    borderColor: 'border-accent-warn',  textColor: 'text-accent-warn'  },
  { year: 2029, label: 'IBS 50%',          desc: 'ICMS/ISS reduzidos à metade',           borderColor: 'border-accent-warn',  textColor: 'text-accent-warn'  },
  { year: 2033, label: 'Reforma completa', desc: 'Extinção total de ICMS/ISS',            borderColor: 'border-accent-down',  textColor: 'text-accent-down'  },
]

type TooltipEntry = { value: number; name: string; color: string }

function TrendTooltip({ active, payload, label }: {
  active?: boolean; payload?: TooltipEntry[]; label?: string | number
}) {
  if (!active || !payload?.length) return null
  const phase = PHASES.find((p) => p.year === Number(label))
  return (
    <div className="bg-paper border border-ink-200 rounded-lg shadow-md p-3 text-xs max-w-xs">
      <p className="font-semibold text-ink-700 mb-1">Ano {label}</p>
      {phase && (
        <p className="text-primary-700 font-medium mb-2 bg-primary-100 px-2 py-1 rounded text-[11px]">
          {phase.label}: {phase.desc}
        </p>
      )}
      {payload.map((p, i) => (
        <p key={i} className="mt-0.5" style={{ color: p.color }}>{p.name}: {fmtM(p.value)}</p>
      ))}
    </div>
  )
}

export default function TrendPage() {
  const [sectorFilter, setSectorFilter] = useState('Todos')
  const [view, setView] = useState<'area' | 'line'>('area')

  const yearlyData = useMemo(() => getYearlyData(sectorFilter), [sectorFilter])

  const sectorComparison = useMemo(() =>
    BUSINESS_LINES.map((s) => {
      const data   = getYearlyData(s)
      const y2025  = data.find((d) => d.year === 2025)!
      const y2033  = data.find((d) => d.year === 2033)!
      const change = ((y2033.regimeReforma - y2025.regimeAtual) / y2025.regimeAtual) * 100
      return { sector: s, atual2025: y2025.regimeAtual, reforma2033: y2033.regimeReforma, change }
    }),
    [],
  )

  // Callout metrics
  const allData    = useMemo(() => getYearlyData('Todos'), [])
  const y2025      = allData.find((d) => d.year === 2025)!
  const y2033      = allData.find((d) => d.year === 2033)!
  const economiaAcum = allData
    .filter((d) => d.year >= 2026)
    .reduce((s, d) => s + Math.max(0, d.regimeAtual - d.transicao), 0)
  const carga2033vs2025 = y2025 && y2033
    ? ((y2033.regimeReforma - y2025.regimeAtual) / y2025.regimeAtual) * 100
    : 0

  const ChartComp = view === 'area' ? AreaChart : LineChart

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-ink-900">Tendências 2026–2033</h2>
        <p className="text-sm text-ink-500">Evolução da carga tributária durante a transição para o novo regime.</p>
      </div>

      {/* Controls */}
      <div className="card p-3 sm:p-4 print:hidden">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-52">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Segmento</label>
            <select className="select-field" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option>Todos</option>
              {BUSINESS_LINES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            {(['area', 'line'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  view === v
                    ? 'bg-primary-700 text-white'
                    : 'bg-paper border border-ink-200 text-ink-600 hover:border-primary-700 hover:text-primary-700'
                }`}
              >
                {v === 'area' ? 'Área' : 'Linha'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase milestone strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PHASES.map((p) => (
          <div key={p.year} className={`card p-4 border-l-4 ${p.borderColor}`}>
            <p className={`font-mono text-lg font-bold leading-none ${p.textColor}`}>{p.year}</p>
            <p className="text-sm font-semibold text-ink-800 mt-1">{p.label}</p>
            <p className="text-xs text-ink-400 mt-1 leading-snug">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="card p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-ink-900">
              Evolução da carga tributária — {sectorFilter === 'Todos' ? 'Grupo Kliente 360' : sectorFilter}
            </h3>
            <p className="text-xs text-ink-400 mt-0.5">
              Regime atual (projeção linear) · transição real · meta pós-reforma · R$ M
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComp data={yearlyData} margin={{ left: 10, right: 20 }}>
            <defs>
              <linearGradient id="gradAtual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8390a3" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8390a3" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradReforma" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1f7a5a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1f7a5a" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradTransicao" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#e30613" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#e30613" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceff5" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000).toFixed(0)}M`} />
            <Tooltip content={<TrendTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
            <ReferenceLine x={2027} stroke="#b87514" strokeDasharray="4 4" label={{ value: '2027', position: 'top', fontSize: 9, fill: '#b87514' }} />
            <ReferenceLine x={2033} stroke="#1f7a5a" strokeDasharray="4 4" label={{ value: '2033', position: 'top', fontSize: 9, fill: '#1f7a5a' }} />
            {view === 'area' ? (
              <>
                <Area type="monotone" dataKey="regimeAtual"   name="Sem reforma (projeção)"  stroke="#8390a3" fill="url(#gradAtual)"     strokeWidth={1.5} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="regimeReforma" name="Reforma completa (meta)"  stroke="#1f7a5a" fill="url(#gradReforma)"   strokeWidth={1.5} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="transicao"     name="Trajetória real"          stroke="#e30613" fill="url(#gradTransicao)" strokeWidth={2.5} />
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="regimeAtual"   name="Sem reforma (projeção)"  stroke="#8390a3" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="regimeReforma" name="Reforma completa (meta)"  stroke="#1f7a5a" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="transicao"     name="Trajetória real"          stroke="#e30613" strokeWidth={2.5} dot={{ r: 3, fill: '#e30613' }} />
              </>
            )}
          </ChartComp>
        </ResponsiveContainer>
      </div>

      {/* Callout card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card p-5 bg-green-50/60 border-accent-down">
          <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Economia acumulada 2026–2033</p>
          <p className="font-display text-3xl font-semibold text-accent-down leading-none">{fmtM(economiaAcum)}</p>
          <p className="text-xs text-ink-500 mt-1.5">vs projeção sem reforma</p>
        </div>
        <div className="card p-5">
          <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Carga 2033 vs 2025</p>
          <p className={`font-display text-3xl font-semibold leading-none ${carga2033vs2025 < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
            {carga2033vs2025 >= 0 ? '+' : ''}{carga2033vs2025.toFixed(1)}%
          </p>
          <p className="text-xs text-ink-500 mt-1.5">alíquota efetiva pós-reforma plena</p>
        </div>
        <div className="card p-5">
          <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Fase-chave</p>
          <p className="font-display text-3xl font-semibold text-accent-warn leading-none">2027</p>
          <p className="text-xs text-ink-500 mt-1.5">CBS plena · extinção de PIS/COFINS</p>
        </div>
      </div>

      {/* Sector comparison table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-4">Impacto por segmento: 2025 → 2033</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-ink-500 border-b border-ink-200">
                <th className="text-left py-2 px-3 font-semibold">Segmento</th>
                <th className="text-right py-2 px-3 font-semibold">2025 (atual)</th>
                <th className="text-right py-2 px-3 font-semibold">2033 (reforma)</th>
                <th className="text-right py-2 px-3 font-semibold">Variação</th>
                <th className="py-2 px-3 font-semibold">Tendência</th>
              </tr>
            </thead>
            <tbody>
              {sectorComparison.map((s, i) => (
                <tr key={s.sector} className={i % 2 === 0 ? 'bg-paper' : 'bg-ink-50'}>
                  <td className="py-2.5 px-3 font-medium text-ink-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                        style={{ background: (BUSINESS_LINE_COLORS as Record<string, string>)[s.sector] ?? '#5a6779' }} />
                      {s.sector}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-ink-700 font-mono">{fmtM(s.atual2025)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-700 font-mono">{fmtM(s.reforma2033)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      s.change < 0 ? 'bg-green-50 text-accent-down' : 'bg-red-50 text-accent-up'
                    }`}>
                      {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="h-2 bg-ink-100 rounded-full max-w-[120px] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.change < 0 ? 'bg-accent-down' : 'bg-accent-up'}`}
                        style={{ width: `${Math.min(100, Math.abs(s.change) * 4)}%` }}
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
