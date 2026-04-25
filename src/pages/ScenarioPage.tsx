import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { companies, SECTORS } from '../data/mockData'

const fmtM = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}B`
  if (Math.abs(v) >= 1_000)     return `R$ ${(v / 1_000).toFixed(0)}M`
  return `R$ ${v.toFixed(0)}K`
}

function Slider({ label, value, min, max, step, onChange, color = '#009900' }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; color?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold" style={{ color }}>{value.toFixed(1)}%</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{min}%</span><span>{max}%</span>
      </div>
    </div>
  )
}

export default function ScenarioPage() {
  const [sectorFilter, setSectorFilter] = useState('Todos')
  const [cbsRate,  setCbsRate]  = useState(8.8)
  const [ibsRate,  setIbsRate]  = useState(12.0)
  const [ibsRateSvc, setIbsRateSvc] = useState(5.0)

  const SERVICE_SECTORS = ['Tecnologia', 'Serviços', 'Saúde', 'Financeiro', 'Construção Civil']

  const baseCompanies = useMemo(() =>
    sectorFilter === 'Todos' ? companies : companies.filter((c) => c.sector === sectorFilter),
    [sectorFilter],
  )

  const simTotal = useMemo(() =>
    baseCompanies.reduce((s, c) => {
      const isService = SERVICE_SECTORS.includes(c.sector)
      const simCbs = c.revenue * (cbsRate / 100)
      const simIbs = c.revenue * ((isService ? ibsRateSvc : ibsRate) / 100)
      return s + c.irpj + c.csll + simCbs + simIbs
    }, 0),
    [baseCompanies, cbsRate, ibsRate, ibsRateSvc],
  )

  const currentTotal = useMemo(() => baseCompanies.reduce((s, c) => s + c.totalTaxCurrent, 0), [baseCompanies])
  const reformTotal  = useMemo(() => baseCompanies.reduce((s, c) => s + c.totalTaxReform, 0),  [baseCompanies])

  const simDelta    = simTotal - currentTotal
  const simDeltaPct = (simDelta / currentTotal) * 100
  const offDelta    = reformTotal - currentTotal
  const offDeltaPct = (offDelta / currentTotal) * 100

  // Per-sector chart data
  const sectorChartData = useMemo(() => {
    const sectors = sectorFilter === 'Todos' ? SECTORS : [sectorFilter]
    return sectors.map((s) => {
      const cs = companies.filter((c) => c.sector === s)
      const cur = cs.reduce((sum, c) => sum + c.totalTaxCurrent, 0)
      const ref = cs.reduce((sum, c) => sum + c.totalTaxReform,  0)
      const sim = cs.reduce((sum, c) => {
        const isSvc = SERVICE_SECTORS.includes(c.sector)
        return sum + c.irpj + c.csll + c.revenue * (cbsRate / 100) + c.revenue * ((isSvc ? ibsRateSvc : ibsRate) / 100)
      }, 0)
      return {
        name: s.length > 13 ? s.slice(0, 12) + '…' : s,
        atual:    Math.round(cur / 1000),
        reforma:  Math.round(ref / 1000),
        simulado: Math.round(sim / 1000),
      }
    })
  }, [sectorFilter, cbsRate, ibsRate, ibsRateSvc])

  // Company-level impact table
  const companyTable = useMemo(() => {
    return baseCompanies.map((c) => {
      const isSvc = SERVICE_SECTORS.includes(c.sector)
      const simTaxes = c.irpj + c.csll + c.revenue * (cbsRate / 100) + c.revenue * ((isSvc ? ibsRateSvc : ibsRate) / 100)
      const delta = simTaxes - c.totalTaxCurrent
      return { ...c, simTaxes, simDelta: delta, simDeltaPct: (delta / c.totalTaxCurrent) * 100 }
    }).sort((a, b) => b.simDeltaPct - a.simDeltaPct)
  }, [baseCompanies, cbsRate, ibsRate, ibsRateSvc])

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
    if (!active || !payload) return null
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {fmtM(p.value * 1000)}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Simulação de Cenários</h2>
        <p className="text-sm text-gray-500">Ajuste as alíquotas da reforma e veja o impacto em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Controls */}
        <div className="card p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Filtrar Setor</label>
            <select className="select-field" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option>Todos</option>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Alíquotas da Reforma</p>
            <div className="space-y-5">
              <Slider
                label="CBS (substitui PIS + COFINS)"
                value={cbsRate} min={0} max={15} step={0.1}
                onChange={setCbsRate} color="#009900"
              />
              <Slider
                label="IBS — Bens (substitui ICMS)"
                value={ibsRate} min={0} max={30} step={0.5}
                onChange={setIbsRate} color="#0066cc"
              />
              <Slider
                label="IBS — Serviços (substitui ISS)"
                value={ibsRateSvc} min={0} max={20} step={0.1}
                onChange={setIbsRateSvc} color="#8b5cf6"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              IRPJ e CSLL: sem alteração na reforma.<br />
              Setores de serviço usam alíquota IBS-Serviços.
            </p>
          </div>
        </div>

        {/* KPI summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Regime Atual', value: fmtM(currentTotal * 1000), sub: 'Base de referência', color: 'text-gray-700', bg: 'bg-gray-50' },
              { label: 'Reforma Oficial', value: fmtM(reformTotal * 1000), sub: `${offDelta >= 0 ? '+' : ''}${offDeltaPct.toFixed(1)}% vs atual`, color: offDeltaPct < 0 ? 'text-green-700' : 'text-red-700', bg: offDeltaPct < 0 ? 'bg-green-50' : 'bg-red-50' },
              { label: 'Cenário Simulado', value: fmtM(simTotal * 1000), sub: `${simDelta >= 0 ? '+' : ''}${simDeltaPct.toFixed(1)}% vs atual`, color: simDeltaPct < 0 ? 'text-green-700' : 'text-red-700', bg: simDeltaPct < 0 ? 'bg-green-50' : 'bg-red-50' },
            ].map((k) => (
              <div key={k.label} className={`card p-4 ${k.bg}`}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{k.label}</p>
                <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>
                <p className={`text-xs mt-1 ${k.color}`}>{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Comparativo por Setor (R$ M)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sectorChartData} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
                <Bar dataKey="atual"    name="Regime Atual"  fill="#6b7280" radius={[3,3,0,0]} />
                <Bar dataKey="reforma"  name="Reforma Oficial" fill="#0066cc" radius={[3,3,0,0]} />
                <Bar dataKey="simulado" name="Simulação"     fill="#009900" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Delta chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Impacto Simulado por Empresa — Variação % vs Regime Atual</h3>
        <p className="text-xs text-gray-400 mb-4">Verde = redução de carga · Vermelho = aumento de carga</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold">Empresa</th>
                <th className="text-left py-2 px-3 font-semibold">Setor</th>
                <th className="text-right py-2 px-3 font-semibold">Impostos Atuais</th>
                <th className="text-right py-2 px-3 font-semibold">Simulação</th>
                <th className="text-right py-2 px-3 font-semibold">Variação R$</th>
                <th className="text-right py-2 px-3 font-semibold">Variação %</th>
              </tr>
            </thead>
            <tbody>
              {companyTable.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-3 font-medium text-gray-800">{c.name}</td>
                  <td className="py-2 px-3 text-gray-500">{c.sector}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmtM(c.totalTaxCurrent * 1000)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmtM(c.simTaxes * 1000)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${c.simDelta < 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {c.simDelta < 0 ? '' : '+'}{fmtM(c.simDelta * 1000)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${c.simDeltaPct < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.simDeltaPct >= 0 ? '+' : ''}{c.simDeltaPct.toFixed(1)}%
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
