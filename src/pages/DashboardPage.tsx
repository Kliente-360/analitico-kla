import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList,
} from 'recharts'
import { Building2, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { companies, SECTORS } from '../data/mockData'

const sum = (arr: typeof companies, fn: (c: (typeof companies)[0]) => number) =>
  arr.reduce((s, x) => s + fn(x), 0)

const fmtM = (v: number) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}B`
  if (v >= 1_000)     return `R$ ${(v / 1_000).toFixed(0)}M`
  return `R$ ${v}K`
}
const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
const fmtNum = (v: number) => v.toLocaleString('pt-BR')

// ─── Agregações ───────────────────────────────────────────────────────────────
const totalReceita    = sum(companies, (c) => c.revenue)
const totalAtual      = sum(companies, (c) => c.totalTaxCurrent)
const totalReforma    = sum(companies, (c) => c.totalTaxReform)
const totalFuncionarios = sum(companies, (c) => c.employees)
const mediaImpacto    = sum(companies, (c) => c.taxDeltaPercent) / companies.length

const sectorData = SECTORS.map((s) => {
  const cs = companies.filter((c) => c.sector === s)
  return {
    name: s.length > 14 ? s.slice(0, 13) + '…' : s,
    full: s,
    receita:   Math.round(sum(cs, (c) => c.revenue) / 1000),
    atual:     Math.round(sum(cs, (c) => c.totalTaxCurrent) / 1000),
    reforma:   Math.round(sum(cs, (c) => c.totalTaxReform) / 1000),
    delta:     sum(cs, (c) => c.taxDeltaPercent) / cs.length,
  }
}).sort((a, b) => b.receita - a.receita)

const taxComposition = [
  { name: 'ICMS',   value: Math.round(sum(companies, (c) => c.icms) / 1000),   color: '#ef4444' },
  { name: 'COFINS', value: Math.round(sum(companies, (c) => c.cofins) / 1000), color: '#009900' },
  { name: 'IRPJ',   value: Math.round(sum(companies, (c) => c.irpj) / 1000),   color: '#0066cc' },
  { name: 'ISS',    value: Math.round(sum(companies, (c) => c.iss) / 1000),    color: '#f59e0b' },
  { name: 'CSLL',   value: Math.round(sum(companies, (c) => c.csll) / 1000),   color: '#8b5cf6' },
  { name: 'PIS',    value: Math.round(sum(companies, (c) => c.pis) / 1000),    color: '#06b6d4' },
]

const sizeData = [
  { name: 'Grande', value: companies.filter((c) => c.size === 'Grande').length,  color: '#009900' },
  { name: 'Média',  value: companies.filter((c) => c.size === 'Média').length,   color: '#0066cc' },
  { name: 'Pequena',value: companies.filter((c) => c.size === 'Pequena').length, color: '#f59e0b' },
]

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent?: 'green' | 'blue' | 'red' | 'amber'
}

function KpiCard({ label, value, sub, icon, accent = 'green' }: KpiCardProps) {
  const bg: Record<string, string> = {
    green: 'bg-primary-50 text-primary-700',
    blue:  'bg-blue-50 text-blue-600',
    red:   'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${bg[accent]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

const CustomTooltipBar = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Total de Empresas"
          value={String(companies.length)}
          sub={`${SECTORS.length} setores`}
          icon={<Building2 size={20} />}
          accent="green"
        />
        <KpiCard
          label="Receita Total (portfólio)"
          value={fmtM(totalReceita * 1000)}
          sub="Base: R$ mil"
          icon={<DollarSign size={20} />}
          accent="blue"
        />
        <KpiCard
          label="Impostos — Regime Atual"
          value={fmtM(totalAtual * 1000)}
          sub={`${((totalAtual / totalReceita) * 100).toFixed(1)}% da receita`}
          icon={<DollarSign size={20} />}
          accent="amber"
        />
        <KpiCard
          label="Impostos — Pós-Reforma"
          value={fmtM(totalReforma * 1000)}
          sub={`${((totalReforma / totalReceita) * 100).toFixed(1)}% da receita`}
          icon={<DollarSign size={20} />}
          accent={totalReforma < totalAtual ? 'green' : 'red'}
        />
        <KpiCard
          label="Impacto Médio da Reforma"
          value={fmtPct(mediaImpacto)}
          sub={`${fmtNum(totalFuncionarios)} funcionários`}
          icon={mediaImpacto < 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
          accent={mediaImpacto < 0 ? 'green' : 'red'}
        />
      </div>

      {/* Receita por Setor + Composição de Impostos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Receita Total por Setor (R$ M)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sectorData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
              <Tooltip content={<CustomTooltipBar />} />
              <Bar dataKey="receita" name="Receita" fill="#009900" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="receita" position="right" formatter={(v: number) => `${v}M`} style={{ fontSize: 10 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Composição de Impostos Atuais</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={taxComposition} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                {taxComposition.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmtM(v * 1000)} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impacto da Reforma por Setor */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Impacto da Reforma Tributária por Setor</h3>
        <p className="text-xs text-gray-400 mb-4">Comparativo entre carga tributária atual e pós-reforma (R$ M)</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={sectorData} margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
            <Tooltip content={<CustomTooltipBar />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
            <Bar dataKey="atual"   name="Regime Atual"  fill="#0066cc" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reforma" name="Pós-Reforma"   fill="#009900" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Impacto % + Porte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Variação % por Setor (Regime Atual → Reforma)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={sectorData.map((d) => ({ ...d, color: d.delta < 0 ? '#009900' : '#ef4444' }))}
              layout="vertical"
              margin={{ left: 10, right: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, 'Variação']} />
              {sectorData.map((entry, i) => (
                <Bar key={i} dataKey="delta" data={[entry]} name="Variação %" fill={entry.delta < 0 ? '#009900' : '#ef4444'} radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="delta" position="right" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 10 }} />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribuição por Porte</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sizeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {sizeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {sizeData.map((s) => {
              const cs = companies.filter((c) => c.size === s.name as 'Grande' | 'Média' | 'Pequena')
              return (
                <div key={s.name} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">{s.name}</p>
                  <p className="font-bold text-gray-900" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-gray-400">{fmtM(sum(cs, (c) => c.revenue) * 1000)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
