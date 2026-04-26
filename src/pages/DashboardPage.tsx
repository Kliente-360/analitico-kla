import { TrendingDown, Building2, DollarSign, Users, AlertTriangle } from 'lucide-react'
import { branches, BUSINESS_LINES, TENANT } from '../data/mockData'
import { fmtM, fmtPct, fmtNum } from '../utils/formatters'
import { KpiCard } from '../components/KpiCard'
import { BUSINESS_LINE_COLORS } from '../constants'

// ─── Totais agregados ──────────────────────────────────────────────────────────

const totalRevenue   = branches.reduce((s, b) => s + b.revenue, 0)
const totalCurrent   = branches.reduce((s, b) => s + b.totalTaxCurrent, 0)
const totalReform    = branches.reduce((s, b) => s + b.totalTaxReform, 0)
const totalSavings   = totalCurrent - totalReform
const savingsPct     = (totalSavings / totalCurrent) * 100
const avgRateCurrent = (totalCurrent / totalRevenue) * 100
const avgRateReform  = (totalReform  / totalRevenue) * 100
const totalEmployees = branches.reduce((s, b) => s + b.employees, 0)

// Tributo com maior participação atual
const TAX_FIELDS: { key: keyof typeof branches[0]; label: string }[] = [
  { key: 'icms',   label: 'ICMS'   },
  { key: 'cofins', label: 'COFINS' },
  { key: 'irpj',   label: 'IRPJ'   },
  { key: 'iss',    label: 'ISS'    },
  { key: 'csll',   label: 'CSLL'   },
  { key: 'pis',    label: 'PIS'    },
]

const taxBreakdown = TAX_FIELDS.map(({ key, label }) => ({
  label,
  value: branches.reduce((s, b) => s + (b[key] as number), 0),
})).sort((a, b) => b.value - a.value)

const topTax    = taxBreakdown[0]
const topTaxPct = (topTax.value / totalCurrent) * 100

// Filial com maior carga absoluta
const topBranch = [...branches].sort((a, b) => b.totalTaxCurrent - a.totalTaxCurrent)[0]

// Filial com anomalia (ISS > 50% da carga)
const anomaly = branches.find((b) => b.iss > 0 && (b.iss / b.totalTaxCurrent) > 0.45)

// ─── Componentes ──────────────────────────────────────────────────────────────

function HeroImpact() {
  const barMax = Math.max(totalCurrent, totalReform)
  return (
    <div className="rounded-xl bg-ink-900 text-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
        Impacto da Reforma Tributária · {TENANT.fiscalYear}
      </p>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-tight mb-6">
        O <span className="text-white">{TENANT.name}</span> vai pagar{' '}
        <span className="underline decoration-white/40 decoration-2 underline-offset-4">
          {fmtM(totalSavings)} a menos
        </span>{' '}
        com a reforma.
      </h1>

      {/* Comparison bars */}
      <div className="space-y-3 mb-6">
        {[
          { label: 'Regime atual',       value: totalCurrent, color: 'bg-white/30' },
          { label: 'Pós-reforma (2033)', value: totalReform,  color: 'bg-white'    },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-white/70">{label}</span>
              <span className="font-mono text-sm font-semibold text-white">{fmtM(value)}</span>
            </div>
            <div className="h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${color} transition-all`}
                style={{ width: `${(value / barMax) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <TrendingDown size={16} className="text-white/80" />
        <span className="text-sm font-semibold text-white">
          {fmtPct(savingsPct)} de redução na carga tributária total
        </span>
      </div>
    </div>
  )
}

function KpiStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard
        label="Receita total"
        value={fmtM(totalRevenue)}
        sub={`${fmtNum(totalEmployees)} colaboradores`}
        icon={<DollarSign size={18} />}
        accent="neutral"
      />
      <KpiCard
        label="Carga atual"
        value={fmtM(totalCurrent)}
        sub={`${avgRateCurrent.toFixed(1)}% da receita`}
        icon={<DollarSign size={18} />}
        accent="neutral"
      />
      <KpiCard
        label="Carga pós-reforma"
        value={fmtM(totalReform)}
        sub={`${avgRateReform.toFixed(1)}% da receita`}
        icon={<DollarSign size={18} />}
        accent="down"
        delta={-savingsPct}
      />
      <KpiCard
        label="Filiais ativas"
        value={String(branches.length)}
        sub={`${[...new Set(branches.map((b) => b.state))].length} estados`}
        icon={<Building2 size={18} />}
        accent="neutral"
      />
      <KpiCard
        label="Período pleno"
        value="2033"
        sub="Plena implementação"
        icon={<Users size={18} />}
        accent="primary"
      />
    </div>
  )
}

function CompositionBars() {
  const max = taxBreakdown[0].value
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-ink-900 mb-1">Composição da carga atual</h3>
      <p className="text-xs text-ink-400 mb-4">Tributos por valor total (R$ M)</p>
      <div className="space-y-2.5">
        {taxBreakdown.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-14 text-xs font-mono text-ink-500 text-right flex-shrink-0">{label}</span>
            <div className="flex-1 h-5 bg-ink-100 rounded overflow-hidden">
              <div
                className="h-full bg-primary-700 rounded transition-all"
                style={{ width: `${(value / max) * 100}%`, opacity: 0.7 + (value / max) * 0.3 }}
              />
            </div>
            <span className="w-16 text-xs font-mono text-ink-700 text-right flex-shrink-0">{fmtM(value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilialBars() {
  const sorted = [...branches].sort((a, b) => b.totalTaxCurrent - a.totalTaxCurrent)
  const max    = sorted[0].totalTaxCurrent

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink-900">Impacto por filial</h3>
          <p className="text-xs text-ink-400 mt-0.5">Carga atual vs reforma · R$ M</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-ink-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-ink-300" />Atual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-primary-700" />Reforma
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {sorted.map((b) => {
          const deltaPct = b.taxDeltaPercent
          return (
            <div key={b.id} className="flex items-center gap-3">
              <span className="w-36 text-xs text-ink-600 truncate flex-shrink-0">{b.name}</span>
              <div className="flex-1 space-y-0.5">
                <div className="h-2 bg-ink-100 rounded overflow-hidden">
                  <div className="h-full bg-ink-300 rounded" style={{ width: `${(b.totalTaxCurrent / max) * 100}%` }} />
                </div>
                <div className="h-2 bg-ink-100 rounded overflow-hidden">
                  <div className="h-full bg-primary-700 rounded" style={{ width: `${(b.totalTaxReform / max) * 100}%` }} />
                </div>
              </div>
              <span className={`w-14 text-right text-[11px] font-semibold font-mono flex-shrink-0 ${
                deltaPct < 0 ? 'text-accent-down' : 'text-accent-up'
              }`}>
                {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const bestReduction = [...branches].sort((a, b) => a.taxDeltaPercent - b.taxDeltaPercent)[0]

function InsightCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Top branch */}
      <div className="card p-4">
        <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Maior contribuinte</p>
        <p className="text-sm font-semibold text-ink-900">{topBranch.name}</p>
        <p className="text-xs text-ink-400 mt-1">
          {fmtM(topBranch.totalTaxCurrent)} · {((topBranch.totalTaxCurrent / totalCurrent) * 100).toFixed(0)}% do total
        </p>
      </div>

      {/* Dominant tax */}
      <div className="card p-4">
        <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Tributo dominante</p>
        <p className="text-sm font-semibold text-ink-900">{topTax.label}</p>
        <p className="text-xs text-ink-400 mt-1">
          {fmtM(topTax.value)} · {topTaxPct.toFixed(0)}% da carga total
        </p>
      </div>

      {/* Anomaly or best reduction */}
      {anomaly ? (
        <div className="card p-4 border-accent-warn bg-amber-50/50">
          <p className="text-[11px] font-semibold text-accent-warn uppercase tracking-widest mb-2 flex items-center gap-1">
            <AlertTriangle size={11} /> Atenção
          </p>
          <p className="text-sm font-semibold text-ink-900">{anomaly.name}</p>
          <p className="text-xs text-ink-500 mt-1">
            ISS representa {((anomaly.iss / anomaly.totalTaxCurrent) * 100).toFixed(0)}% da carga
          </p>
        </div>
      ) : (
        <div className="card p-4">
          <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Maior redução</p>
          <p className="text-sm font-semibold text-ink-900">{bestReduction.name}</p>
          <p className="text-xs text-accent-down mt-1 font-semibold">{bestReduction.taxDeltaPercent.toFixed(1)}%</p>
        </div>
      )}
    </div>
  )
}

function BusinessLineChart() {
  const data = BUSINESS_LINES.map((line) => {
    const bs  = branches.filter((b) => b.sector === line)
    return {
      label:   line,
      current: bs.reduce((s, b) => s + b.totalTaxCurrent, 0),
      reform:  bs.reduce((s, b) => s + b.totalTaxReform,  0),
      color:   (BUSINESS_LINE_COLORS as Record<string, string>)[line] ?? '#5a6779',
    }
  }).sort((a, b) => b.current - a.current)

  const max = data[0].current

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-ink-900 mb-1">Por linha de negócio</h3>
      <p className="text-xs text-ink-400 mb-4">Carga atual vs reforma por segmento</p>
      <div className="space-y-4">
        {data.map(({ label, current, reform, color }) => {
          const delta = ((reform - current) / current) * 100
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-ink-700 flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                  {label}
                </span>
                <span className={`text-[11px] font-semibold font-mono ${delta < 0 ? 'text-accent-down' : 'text-accent-up'}`}>
                  {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="h-2 bg-ink-100 rounded overflow-hidden">
                  <div className="h-full rounded opacity-40" style={{ width: `${(current / max) * 100}%`, background: color }} />
                </div>
                <div className="h-2 bg-ink-100 rounded overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${(reform / max) * 100}%`, background: color }} />
                </div>
              </div>
              <div className="flex justify-between mt-1 text-[10px] font-mono text-ink-400">
                <span>atual {fmtM(current)}</span>
                <span>reforma {fmtM(reform)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <HeroImpact />
      <KpiStrip />
      <InsightCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CompositionBars />
        <BusinessLineChart />
      </div>
      <FilialBars />
    </div>
  )
}
