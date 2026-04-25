import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { GitCompare } from 'lucide-react'
import { companies, SECTORS } from '../data/mockData'
import { SERVICE_SECTORS } from '../constants'
import { fmtM } from '../utils/formatters'
import { RangeSlider } from '../components/RangeSlider'
import { ChartTooltip } from '../components/ChartTooltip'
import { useTableFilter } from '../hooks/useTableFilter'
import { SkeletonScenarioPage } from '../components/Skeleton'
import { usePageReady } from '../hooks/usePageReady'

function simTax(
  c: { irpj: number; csll: number; revenue: number; sector: string },
  cbs: number, ibsBens: number, ibsSvc: number,
) {
  const isSvc = SERVICE_SECTORS.includes(c.sector)
  return c.irpj + c.csll
    + c.revenue * (cbs / 100)
    + c.revenue * ((isSvc ? ibsSvc : ibsBens) / 100)
}

function SlidersPanel({
  label, color,
  cbs, ibs, ibsSvc,
  onCbs, onIbs, onIbsSvc,
}: {
  label: string; color: string
  cbs: number; ibs: number; ibsSvc: number
  onCbs: (v: number) => void
  onIbs: (v: number) => void
  onIbsSvc: (v: number) => void
}) {
  return (
    <div className="card p-4 space-y-4">
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
      <RangeSlider label="CBS (substitui PIS + COFINS)" value={cbs}    min={0} max={15} step={0.1} onChange={onCbs}    color={color} />
      <RangeSlider label="IBS — Bens (substitui ICMS)"  value={ibs}    min={0} max={30} step={0.5} onChange={onIbs}    color={color} />
      <RangeSlider label="IBS — Serviços (subst. ISS)"  value={ibsSvc} min={0} max={20} step={0.1} onChange={onIbsSvc} color={color} />
    </div>
  )
}

export default function ScenarioPage() {
  const ready = usePageReady()

  const [sectorFilter, setSectorFilter] = useState('Todos')
  const [compareMode,  setCompareMode]  = useState(false)

  // Cenário A
  const [cbsA,    setCbsA]    = useState(8.8)
  const [ibsA,    setIbsA]    = useState(12.0)
  const [ibsSvcA, setIbsSvcA] = useState(5.0)

  // Cenário B
  const [cbsB,    setCbsB]    = useState(8.8)
  const [ibsB,    setIbsB]    = useState(12.0)
  const [ibsSvcB, setIbsSvcB] = useState(5.0)

  const baseCompanies = useTableFilter(companies, { sector: sectorFilter })

  const currentTotal = useMemo(() => baseCompanies.reduce((s, c) => s + c.totalTaxCurrent, 0), [baseCompanies])
  const reformTotal  = useMemo(() => baseCompanies.reduce((s, c) => s + c.totalTaxReform,  0), [baseCompanies])
  const simTotalA    = useMemo(() => baseCompanies.reduce((s, c) => s + simTax(c, cbsA, ibsA, ibsSvcA), 0), [baseCompanies, cbsA, ibsA, ibsSvcA])
  const simTotalB    = useMemo(() => baseCompanies.reduce((s, c) => s + simTax(c, cbsB, ibsB, ibsSvcB), 0), [baseCompanies, cbsB, ibsB, ibsSvcB])

  const pct = (v: number) => currentTotal ? ((v - currentTotal) / currentTotal) * 100 : 0

  const offDeltaPct = pct(reformTotal)
  const simDeltaPct = pct(simTotalA)
  const simDeltaPctB = pct(simTotalB)

  const sectorChartData = useMemo(() => {
    const sectors = sectorFilter === 'Todos' ? SECTORS : [sectorFilter]
    return sectors.map((s) => {
      const cs  = companies.filter((c) => c.sector === s)
      const cur = cs.reduce((sum, c) => sum + c.totalTaxCurrent, 0)
      const ref = cs.reduce((sum, c) => sum + c.totalTaxReform,  0)
      const sA  = cs.reduce((sum, c) => sum + simTax(c, cbsA, ibsA, ibsSvcA), 0)
      const sB  = cs.reduce((sum, c) => sum + simTax(c, cbsB, ibsB, ibsSvcB), 0)
      return {
        name:     s.length > 13 ? s.slice(0, 12) + '…' : s,
        atual:    Math.round(cur / 1_000),
        reforma:  Math.round(ref / 1_000),
        cenarioA: Math.round(sA  / 1_000),
        cenarioB: Math.round(sB  / 1_000),
      }
    })
  }, [sectorFilter, cbsA, ibsA, ibsSvcA, cbsB, ibsB, ibsSvcB])

  const companyTable = useMemo(() =>
    baseCompanies.map((c) => {
      const sA      = simTax(c, cbsA, ibsA, ibsSvcA)
      const sB      = simTax(c, cbsB, ibsB, ibsSvcB)
      const dA      = sA - c.totalTaxCurrent
      const dB      = sB - c.totalTaxCurrent
      const dPctA   = c.totalTaxCurrent ? (dA / c.totalTaxCurrent) * 100 : 0
      const dPctB   = c.totalTaxCurrent ? (dB / c.totalTaxCurrent) * 100 : 0
      return { ...c, sA, sB, dA, dB, dPctA, dPctB }
    }).sort((a, b) => b.dPctA - a.dPctA),
    [baseCompanies, cbsA, ibsA, ibsSvcA, cbsB, ibsB, ibsSvcB],
  )

  const pctBadge = (v: number) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${v < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {v >= 0 ? '+' : ''}{v.toFixed(1)}%
    </span>
  )

  return ready ? (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Simulação de Cenários</h2>
          <p className="text-sm text-gray-500">Ajuste as alíquotas da reforma e veja o impacto em tempo real.</p>
        </div>
        <button
          onClick={() => setCompareMode((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors print:hidden ${
            compareMode
              ? 'bg-primary-700 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:border-primary-700 hover:text-primary-700'
          }`}
        >
          <GitCompare size={15} />
          {compareMode ? 'Modo Comparação ativado' : 'Comparar dois cenários'}
        </button>
      </div>

      {/* Filter */}
      <div className="card p-3 sm:p-4 print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-52">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Filtrar Setor</label>
            <select className="select-field" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option>Todos</option>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="text-xs text-gray-400 pb-1">IRPJ e CSLL: sem alteração · Serviços usam alíquota IBS-Serviços</p>
        </div>
      </div>

      {/* Slider panels */}
      {compareMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          <SlidersPanel label="Cenário A" color="#009900" cbs={cbsA} ibs={ibsA} ibsSvc={ibsSvcA} onCbs={setCbsA} onIbs={setIbsA} onIbsSvc={setIbsSvcA} />
          <SlidersPanel label="Cenário B" color="#0066cc" cbs={cbsB} ibs={ibsB} ibsSvc={ibsSvcB} onCbs={setCbsB} onIbs={setIbsB} onIbsSvc={setIbsSvcB} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-4 sm:p-5 space-y-5 print:hidden">
            <div className="space-y-5">
              <RangeSlider label="CBS (substitui PIS + COFINS)" value={cbsA}    min={0} max={15} step={0.1} onChange={setCbsA}    color="#009900" />
              <RangeSlider label="IBS — Bens (substitui ICMS)"  value={ibsA}    min={0} max={30} step={0.5} onChange={setIbsA}    color="#0066cc" />
              <RangeSlider label="IBS — Serviços (subst. ISS)"  value={ibsSvcA} min={0} max={20} step={0.1} onChange={setIbsSvcA} color="#8b5cf6" />
            </div>
          </div>
          <div className="lg:col-span-2" />
        </div>
      )}

      {/* Summary cards */}
      <div className={`grid gap-3 sm:gap-4 ${compareMode ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {[
          { label: 'Regime Atual',    value: fmtM(currentTotal), sub: 'Base de referência',                                         cls: 'text-gray-700',                bg: 'bg-gray-50'   },
          { label: 'Reforma Oficial', value: fmtM(reformTotal),  sub: `${offDeltaPct >= 0 ? '+' : ''}${offDeltaPct.toFixed(1)}% vs atual`, cls: offDeltaPct < 0 ? 'text-green-700' : 'text-red-700', bg: offDeltaPct < 0 ? 'bg-green-50' : 'bg-red-50' },
          { label: compareMode ? 'Cenário A' : 'Cenário Simulado', value: fmtM(simTotalA), sub: `${simDeltaPct >= 0 ? '+' : ''}${simDeltaPct.toFixed(1)}% vs atual`, cls: simDeltaPct < 0 ? 'text-green-700' : 'text-red-700', bg: simDeltaPct < 0 ? 'bg-green-50' : 'bg-red-50' },
          ...(compareMode ? [{
            label: 'Cenário B', value: fmtM(simTotalB), sub: `${simDeltaPctB >= 0 ? '+' : ''}${simDeltaPctB.toFixed(1)}% vs atual`,
            cls: simDeltaPctB < 0 ? 'text-green-700' : 'text-red-700', bg: simDeltaPctB < 0 ? 'bg-green-50' : 'bg-red-50',
          }] : []),
        ].map((k) => (
          <div key={k.label} className={`card p-4 ${k.bg}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{k.label}</p>
            <p className={`text-xl font-bold mt-1 ${k.cls}`}>{k.value}</p>
            <p className={`text-xs mt-1 ${k.cls}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Comparativo por Setor (R$ M)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sectorChartData} margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
            <Bar dataKey="atual"    name="Regime Atual"    fill="#6b7280" radius={[3, 3, 0, 0]} />
            <Bar dataKey="reforma"  name="Reforma Oficial" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            <Bar dataKey="cenarioA" name={compareMode ? 'Cenário A' : 'Simulação'} fill="#009900" radius={[3, 3, 0, 0]} />
            {compareMode && <Bar dataKey="cenarioB" name="Cenário B" fill="#0066cc" radius={[3, 3, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Company table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Impacto Simulado por Empresa</h3>
        <p className="text-xs text-gray-400 mb-4">Verde = redução de carga · Vermelho = aumento de carga</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold">Empresa</th>
                <th className="text-left py-2 px-3 font-semibold">Setor</th>
                <th className="text-right py-2 px-3 font-semibold">Atual</th>
                {compareMode ? (
                  <>
                    <th className="text-right py-2 px-3 font-semibold">Cenário A</th>
                    <th className="text-right py-2 px-3 font-semibold">Δ A</th>
                    <th className="text-right py-2 px-3 font-semibold">Cenário B</th>
                    <th className="text-right py-2 px-3 font-semibold">Δ B</th>
                  </>
                ) : (
                  <>
                    <th className="text-right py-2 px-3 font-semibold">Simulação</th>
                    <th className="text-right py-2 px-3 font-semibold">Variação R$</th>
                    <th className="text-right py-2 px-3 font-semibold">Variação %</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {companyTable.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-3 font-medium text-gray-800">{c.name}</td>
                  <td className="py-2 px-3 text-gray-500">{c.sector}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmtM(c.totalTaxCurrent)}</td>
                  {compareMode ? (
                    <>
                      <td className="py-2 px-3 text-right text-gray-700">{fmtM(c.sA)}</td>
                      <td className="py-2 px-3 text-right">{pctBadge(c.dPctA)}</td>
                      <td className="py-2 px-3 text-right text-gray-700">{fmtM(c.sB)}</td>
                      <td className="py-2 px-3 text-right">{pctBadge(c.dPctB)}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-3 text-right text-gray-700">{fmtM(c.sA)}</td>
                      <td className={`py-2 px-3 text-right font-medium ${c.dA < 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {c.dA < 0 ? '' : '+'}{fmtM(c.dA)}
                      </td>
                      <td className="py-2 px-3 text-right">{pctBadge(c.dPctA)}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <SkeletonScenarioPage />
}
