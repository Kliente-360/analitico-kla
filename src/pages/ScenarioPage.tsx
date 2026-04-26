import { useState, useMemo } from 'react'
import { FlaskConical } from 'lucide-react'
import { branches, BUSINESS_LINES } from '../data/mockData'
import { SERVICE_SECTORS } from '../constants'
import { fmtM, fmtPct } from '../utils/formatters'
import { RangeSlider } from '../components/RangeSlider'
import { EmptyState } from '../components/EmptyState'

const COLOR_A = '#1f7a5a'
const COLOR_B = '#d04a3b'

const DEFAULTS_A = { cbs: 7.5,  ibsBens: 14.0, ibsSvc: 12.0 }
const DEFAULTS_B = { cbs: 9.0,  ibsBens: 16.0, ibsSvc: 14.0 }

function simTax(
  b: { irpj: number; csll: number; revenue: number; sector: string },
  cbs: number, ibsBens: number, ibsSvc: number,
) {
  const isSvc = SERVICE_SECTORS.includes(b.sector)
  return b.irpj + b.csll
    + b.revenue * (cbs / 100)
    + b.revenue * ((isSvc ? ibsSvc : ibsBens) / 100)
}

interface ScenarioPanelProps {
  label: string; color: string
  cbs: number; ibsBens: number; ibsSvc: number
  total: number; deltaPct: number
  onCbs: (v: number) => void
  onIbsBens: (v: number) => void
  onIbsSvc: (v: number) => void
}

function ScenarioPanel({
  label, color, cbs, ibsBens, ibsSvc, total, deltaPct,
  onCbs, onIbsBens, onIbsSvc,
}: ScenarioPanelProps) {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color }}>{label}</p>
        <div className="text-right">
          <p className="text-base font-bold text-ink-900">{fmtM(total)}</p>
          <p className={`text-xs font-semibold ${deltaPct < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
            {fmtPct(deltaPct)} vs atual
          </p>
        </div>
      </div>
      <div className="space-y-4 print:hidden">
        <RangeSlider label="CBS (substitui PIS + COFINS)" value={cbs}     min={0} max={15} step={0.1} onChange={onCbs}     color={color} />
        <RangeSlider label="IBS — Bens (substitui ICMS)"  value={ibsBens} min={0} max={30} step={0.5} onChange={onIbsBens} color={color} />
        <RangeSlider label="IBS — Serviços (subst. ISS)"  value={ibsSvc}  min={0} max={20} step={0.1} onChange={onIbsSvc}  color={color} />
      </div>
    </div>
  )
}

function ComparisonBars({
  current, reform, totalA, totalB,
}: { current: number; reform: number; totalA: number; totalB: number }) {
  const max  = Math.max(current, reform, totalA, totalB)
  const bars = [
    { label: 'Regime atual',    value: current, color: '#8390a3' },
    { label: 'Reforma oficial', value: reform,  color: '#b87514' },
    { label: 'Cenário A',       value: totalA,  color: COLOR_A   },
    { label: 'Cenário B',       value: totalB,  color: COLOR_B   },
  ]
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-ink-900 mb-1">Comparativo de cenários</h3>
      <p className="text-xs text-ink-400 mb-4">Carga tributária total simulada (R$ M)</p>
      <div className="space-y-3">
        {bars.map(({ label, value, color }) => {
          const pct   = max > 0 ? (value / max) * 100 : 0
          const delta = current > 0 ? ((value - current) / current) * 100 : 0
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-ink-700">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ink-500">{fmtM(value)}</span>
                  {label !== 'Regime atual' && (
                    <span className={`text-[11px] font-semibold font-mono ${delta < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
                      {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-3 bg-ink-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ScenarioPage() {
  const [sectorFilter, setSectorFilter] = useState('Todos')

  const [cbsA,     setCbsA]     = useState(DEFAULTS_A.cbs)
  const [ibsBensA, setIbsBensA] = useState(DEFAULTS_A.ibsBens)
  const [ibsSvcA,  setIbsSvcA]  = useState(DEFAULTS_A.ibsSvc)

  const [cbsB,     setCbsB]     = useState(DEFAULTS_B.cbs)
  const [ibsBensB, setIbsBensB] = useState(DEFAULTS_B.ibsBens)
  const [ibsSvcB,  setIbsSvcB]  = useState(DEFAULTS_B.ibsSvc)

  const baseBranches = useMemo(
    () => sectorFilter === 'Todos' ? branches : branches.filter((b) => b.sector === sectorFilter),
    [sectorFilter],
  )

  const currentTotal = useMemo(() => baseBranches.reduce((s, b) => s + b.totalTaxCurrent, 0), [baseBranches])
  const reformTotal  = useMemo(() => baseBranches.reduce((s, b) => s + b.totalTaxReform,  0), [baseBranches])
  const totalA = useMemo(
    () => baseBranches.reduce((s, b) => s + simTax(b, cbsA, ibsBensA, ibsSvcA), 0),
    [baseBranches, cbsA, ibsBensA, ibsSvcA],
  )
  const totalB = useMemo(
    () => baseBranches.reduce((s, b) => s + simTax(b, cbsB, ibsBensB, ibsSvcB), 0),
    [baseBranches, cbsB, ibsBensB, ibsSvcB],
  )

  const deltaPctA = currentTotal ? ((totalA - currentTotal) / currentTotal) * 100 : 0
  const deltaPctB = currentTotal ? ((totalB - currentTotal) / currentTotal) * 100 : 0

  const branchTable = useMemo(() =>
    baseBranches.map((b) => {
      const sA    = simTax(b, cbsA, ibsBensA, ibsSvcA)
      const sB    = simTax(b, cbsB, ibsBensB, ibsSvcB)
      const dPctA = b.totalTaxCurrent ? ((sA - b.totalTaxCurrent) / b.totalTaxCurrent) * 100 : 0
      const dPctB = b.totalTaxCurrent ? ((sB - b.totalTaxCurrent) / b.totalTaxCurrent) * 100 : 0
      return { ...b, sA, sB, dPctA, dPctB }
    }).sort((a, b) => a.dPctA - b.dPctA),
    [baseBranches, cbsA, ibsBensA, ibsSvcA, cbsB, ibsBensB, ibsSvcB],
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-ink-900">Simulação de Cenários</h2>
        <p className="text-sm text-ink-500">Ajuste as alíquotas e compare dois cenários em tempo real.</p>
      </div>

      {/* Filter */}
      <div className="card p-3 sm:p-4 print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-52">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1">Filtrar segmento</label>
            <select className="select-field" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option>Todos</option>
              {BUSINESS_LINES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="text-xs text-ink-400 pb-1">IRPJ e CSLL mantidos sem alteração · Serviços usam alíquota IBS-Serviços</p>
        </div>
      </div>

      {/* Scenario panels — A/B always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
        <ScenarioPanel
          label="Cenário A" color={COLOR_A}
          cbs={cbsA} ibsBens={ibsBensA} ibsSvc={ibsSvcA}
          total={totalA} deltaPct={deltaPctA}
          onCbs={setCbsA} onIbsBens={setIbsBensA} onIbsSvc={setIbsSvcA}
        />
        <ScenarioPanel
          label="Cenário B" color={COLOR_B}
          cbs={cbsB} ibsBens={ibsBensB} ibsSvc={ibsSvcB}
          total={totalB} deltaPct={deltaPctB}
          onCbs={setCbsB} onIbsBens={setIbsBensB} onIbsSvc={setIbsSvcB}
        />
      </div>

      {/* Comparison bars */}
      <ComparisonBars current={currentTotal} reform={reformTotal} totalA={totalA} totalB={totalB} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Regime atual',    value: currentTotal, delta: null as number | null },
          { label: 'Reforma oficial', value: reformTotal,  delta: currentTotal ? ((reformTotal - currentTotal) / currentTotal) * 100 : 0 },
          { label: 'Cenário A',       value: totalA,       delta: deltaPctA },
          { label: 'Cenário B',       value: totalB,       delta: deltaPctB },
        ].map(({ label, value, delta }) => (
          <div key={label} className="card p-4">
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest">{label}</p>
            <p className="text-lg font-bold text-ink-900 mt-1">{fmtM(value)}</p>
            {delta !== null && (
              <p className={`text-xs font-semibold mt-0.5 ${delta < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
                {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs atual
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Branch table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-1">Impacto simulado por filial</h3>
        <p className="text-xs text-ink-400 mb-4">Verde = redução · Vermelho = aumento · ordenado por Δ A</p>
        {branchTable.length === 0 ? (
          <EmptyState
            icon={<FlaskConical size={28} />}
            title="Nenhuma filial neste segmento"
            body="Selecione outro segmento ou escolha 'Todos' para ver a simulação."
          />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-ink-500 border-b border-ink-200">
                <th className="text-left py-2 px-3 font-semibold">Filial</th>
                <th className="text-left py-2 px-3 font-semibold">Segmento</th>
                <th className="text-right py-2 px-3 font-semibold">Atual</th>
                <th className="text-right py-2 px-3 font-semibold">Cenário A</th>
                <th className="text-right py-2 px-3 font-semibold">Δ A</th>
                <th className="text-right py-2 px-3 font-semibold">Cenário B</th>
                <th className="text-right py-2 px-3 font-semibold">Δ B</th>
              </tr>
            </thead>
            <tbody>
              {branchTable.map((b, i) => (
                <tr key={b.id} className={i % 2 === 0 ? 'bg-paper' : 'bg-ink-50'}>
                  <td className="py-2 px-3 font-medium text-ink-800">{b.name}</td>
                  <td className="py-2 px-3 text-ink-500">{b.sector}</td>
                  <td className="py-2 px-3 text-right text-ink-700">{fmtM(b.totalTaxCurrent)}</td>
                  <td className="py-2 px-3 text-right text-ink-700">{fmtM(b.sA)}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${b.dPctA < 0 ? 'bg-green-100 text-accent-down' : 'bg-red-100 text-accent-up'}`}>
                      {b.dPctA >= 0 ? '+' : ''}{b.dPctA.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-ink-700">{fmtM(b.sB)}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${b.dPctB < 0 ? 'bg-green-100 text-accent-down' : 'bg-red-100 text-accent-up'}`}>
                      {b.dPctB >= 0 ? '+' : ''}{b.dPctB.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  )
}
