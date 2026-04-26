import { useState, useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import { branches } from '../data/mockData'
import { SERVICE_SECTORS } from '../constants'
import { fmtM } from '../utils/formatters'
import { RangeSlider } from '../components/RangeSlider'
import { SkeletonScenarioPage } from '../components/Skeleton'
import { usePageReady } from '../hooks/usePageReady'

const COLOR_A = '#1f7a5a'   // accent-down — "otimista"
const COLOR_B = '#d04a3b'   // accent-up  — "conservador"
const COLOR_REFORM = '#e30613'
const COLOR_CURRENT = '#8390a3'

function simTax(
  c: { irpj: number; csll: number; revenue: number; sector: string },
  cbs: number, ibsBens: number, ibsSvc: number,
): number {
  const isSvc = SERVICE_SECTORS.includes(c.sector)
  return c.irpj + c.csll
    + c.revenue * (cbs / 100)
    + c.revenue * ((isSvc ? ibsSvc : ibsBens) / 100)
}

interface SliderPanelProps {
  tag:      string
  title:    string
  color:    string
  cbs:      number; ibsBens: number; ibsSvc: number
  onCbs:    (v: number) => void
  onBens:   (v: number) => void
  onSvc:    (v: number) => void
  onReset:  () => void
  total:    number
  delta:    number
  accent?:  boolean
}

function ScenarioPanel({ tag, title, color, cbs, ibsBens, ibsSvc, onCbs, onBens, onSvc, onReset, total, delta, accent }: SliderPanelProps) {
  return (
    <div className={`card p-5 space-y-5 ${accent ? 'border-2 border-primary-700' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="text-[10px] font-bold tracking-widest px-2 py-1 rounded text-white"
            style={{ background: color }}
          >
            {tag}
          </span>
          <span className="text-sm font-semibold text-ink-900">{title}</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] text-ink-400 hover:text-ink-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={11} /> resetar
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <RangeSlider label="CBS (substitui PIS + COFINS)" value={cbs}     min={0} max={15} step={0.1} onChange={onCbs}  color={color} />
        <RangeSlider label="IBS — Bens (substitui ICMS)"  value={ibsBens} min={0} max={30} step={0.5} onChange={onBens} color={color} />
        <RangeSlider label="IBS — Serviços (subst. ISS)"  value={ibsSvc}  min={0} max={20} step={0.1} onChange={onSvc}  color={color} />
      </div>

      <hr className="border-ink-100" />

      {/* Result */}
      <div>
        <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">Carga total simulada</p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-ink-900">{fmtM(total)}</span>
          <span className="text-xs text-ink-400">R$ M</span>
        </div>
        <p className={`text-sm font-semibold mt-1 ${delta < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
          {delta < 0 ? '−' : '+'}{fmtM(Math.abs(delta))}{' '}
          <span className="text-ink-400 font-normal">vs regime atual</span>
        </p>
      </div>
    </div>
  )
}

function ComparisonBars({ current, reform, simA, simB }: { current: number; reform: number; simA: number; simB: number }) {
  const items = [
    { label: 'Atual',          value: current, color: COLOR_CURRENT },
    { label: 'Reforma oficial', value: reform,  color: COLOR_REFORM  },
    { label: 'Cenário A',      value: simA,    color: COLOR_A       },
    { label: 'Cenário B',      value: simB,    color: COLOR_B       },
  ]
  const max = Math.max(...items.map((i) => i.value)) * 1.1

  return (
    <div className="card p-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink-900">Resumo comparativo</h3>
          <p className="text-xs text-ink-400 mt-0.5">Carga total sob 4 regimes</p>
        </div>
        <div className="text-xs text-ink-400 font-mono">
          A: {simA < current ? '−' : '+'}{fmtM(Math.abs(simA - current))} ·
          B: {simB < current ? '−' : '+'}{fmtM(Math.abs(simB - current))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 h-36 pb-6 px-2">
        {items.map(({ label, value, color }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-2 h-full">
            <div className="flex-1 w-full flex items-end">
              <div
                className="w-full rounded-t-sm transition-all relative"
                style={{ height: `${(value / max) * 100}%`, background: color }}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold whitespace-nowrap" style={{ color }}>
                  {fmtM(value)}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-ink-600 font-medium text-center">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DEFAULTS_A = { cbs: 7.5, ibsBens: 14.0, ibsSvc: 12.0 }
const DEFAULTS_B = { cbs: 9.5, ibsBens: 19.0, ibsSvc: 16.0 }

export default function ScenarioPage() {
  const ready = usePageReady()

  const [cbsA,    setCbsA]    = useState(DEFAULTS_A.cbs)
  const [ibsBensA, setIbsBensA] = useState(DEFAULTS_A.ibsBens)
  const [ibsSvcA, setIbsSvcA] = useState(DEFAULTS_A.ibsSvc)

  const [cbsB,    setCbsB]    = useState(DEFAULTS_B.cbs)
  const [ibsBensB, setIbsBensB] = useState(DEFAULTS_B.ibsBens)
  const [ibsSvcB, setIbsSvcB] = useState(DEFAULTS_B.ibsSvc)

  const current = useMemo(() => branches.reduce((s, b) => s + b.totalTaxCurrent, 0), [])
  const reform  = useMemo(() => branches.reduce((s, b) => s + b.totalTaxReform,  0), [])
  const simA    = useMemo(() => branches.reduce((s, b) => s + simTax(b, cbsA, ibsBensA, ibsSvcA), 0), [cbsA, ibsBensA, ibsSvcA])
  const simB    = useMemo(() => branches.reduce((s, b) => s + simTax(b, cbsB, ibsBensB, ibsSvcB), 0), [cbsB, ibsBensB, ibsSvcB])

  const branchTable = useMemo(() => branches.map((b) => {
    const a  = simTax(b, cbsA, ibsBensA, ibsSvcA)
    const bs = simTax(b, cbsB, ibsBensB, ibsSvcB)
    return {
      ...b,
      simA: a, simB: bs,
      dPctA: b.totalTaxCurrent ? ((a  - b.totalTaxCurrent) / b.totalTaxCurrent) * 100 : 0,
      dPctB: b.totalTaxCurrent ? ((bs - b.totalTaxCurrent) / b.totalTaxCurrent) * 100 : 0,
    }
  }).sort((a, b) => a.dPctA - b.dPctA), [cbsA, ibsBensA, ibsSvcA, cbsB, ibsBensB, ibsSvcB])

  if (!ready) return <SkeletonScenarioPage />

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink-900 tracking-tight">E se a alíquota fosse outra?</h2>
          <p className="text-sm text-ink-400 mt-0.5">
            Ajuste CBS e IBS e veja em tempo real o impacto sobre o Grupo Meridional. Compare dois cenários.
          </p>
        </div>
      </div>

      {/* Comparison bars */}
      <ComparisonBars current={current} reform={reform} simA={simA} simB={simB} />

      {/* Two scenario cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScenarioPanel
          tag="CENÁRIO A" title="Otimista · alíquotas reduzidas"
          color={COLOR_A}
          cbs={cbsA} ibsBens={ibsBensA} ibsSvc={ibsSvcA}
          onCbs={setCbsA} onBens={setIbsBensA} onSvc={setIbsSvcA}
          onReset={() => { setCbsA(DEFAULTS_A.cbs); setIbsBensA(DEFAULTS_A.ibsBens); setIbsSvcA(DEFAULTS_A.ibsSvc) }}
          total={simA} delta={simA - current}
        />
        <ScenarioPanel
          tag="CENÁRIO B" title="Conservador · alíquotas elevadas"
          color={COLOR_B}
          cbs={cbsB} ibsBens={ibsBensB} ibsSvc={ibsSvcB}
          onCbs={setCbsB} onBens={setIbsBensB} onSvc={setIbsSvcB}
          onReset={() => { setCbsB(DEFAULTS_B.cbs); setIbsBensB(DEFAULTS_B.ibsBens); setIbsSvcB(DEFAULTS_B.ibsSvc) }}
          total={simB} delta={simB - current}
        />
      </div>

      {/* Per-branch table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-100">
          <h3 className="text-sm font-semibold text-ink-900">Impacto por filial</h3>
          <p className="text-xs text-ink-400 mt-0.5">Verde = redução · Vermelho = aumento · IRPJ e CSLL sem alteração</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ink-50 border-b border-ink-200">
                <th className="text-left px-4 py-2.5 font-semibold text-ink-500 uppercase tracking-wider text-[11px]">Filial</th>
                <th className="text-left px-4 py-2.5 font-semibold text-ink-500 uppercase tracking-wider text-[11px]">Segmento</th>
                <th className="text-right px-4 py-2.5 font-semibold text-ink-500 uppercase tracking-wider text-[11px]">Atual</th>
                <th className="text-right px-4 py-2.5 font-semibold uppercase tracking-wider text-[11px]" style={{ color: COLOR_A }}>Cenário A</th>
                <th className="text-right px-4 py-2.5 font-semibold uppercase tracking-wider text-[11px]" style={{ color: COLOR_A }}>Δ A</th>
                <th className="text-right px-4 py-2.5 font-semibold uppercase tracking-wider text-[11px]" style={{ color: COLOR_B }}>Cenário B</th>
                <th className="text-right px-4 py-2.5 font-semibold uppercase tracking-wider text-[11px]" style={{ color: COLOR_B }}>Δ B</th>
              </tr>
            </thead>
            <tbody>
              {branchTable.map((b, i) => (
                <tr key={b.id} className={`border-b border-ink-100 ${i % 2 === 0 ? '' : 'bg-ink-50'}`}>
                  <td className="px-4 py-2.5 font-medium text-ink-800">{b.name}</td>
                  <td className="px-4 py-2.5 text-ink-500">{b.sector}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink-700">{fmtM(b.totalTaxCurrent)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink-700">{fmtM(b.simA)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-mono font-semibold ${b.dPctA < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
                      {b.dPctA > 0 ? '+' : ''}{b.dPctA.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink-700">{fmtM(b.simB)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-mono font-semibold ${b.dPctB < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
                      {b.dPctB > 0 ? '+' : ''}{b.dPctB.toFixed(1)}%
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
