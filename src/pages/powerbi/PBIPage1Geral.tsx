import { useMemo } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { getKPIs, getMonthlySeries, getMapBubbles } from '../../data/powerbi'

const fmtM = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : `R$ ${(v / 1_000).toFixed(0)}k`

const fmtMes = (s: string) => {
  const [y, m] = s.split('-')
  const names = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${names[parseInt(m) - 1]}/${y.slice(2)}`
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-ink-100 px-4 py-3 flex flex-col gap-0.5">
      <span className="text-[11px] font-medium text-ink-400 uppercase tracking-wide">{label}</span>
      <span className="text-lg font-bold text-ink-900">{value}</span>
      {sub && <span className="text-[11px] text-ink-400">{sub}</span>}
    </div>
  )
}

// Simple Brazil bubble "map" using normalized lat/long coordinates
const LAT_MIN = -33.8, LAT_MAX = 5.3
const LNG_MIN = -73.9, LNG_MAX = -34.8

function normLng(lng: number) {
  return ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100
}
function normLat(lat: number) {
  return (1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * 100
}

function MapBubbles() {
  const data = useMemo(() => getMapBubbles(), [])
  const max  = Math.max(...data.map((d) => d.total_saidas))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-ink-100 p-4">
      <p className="text-xs font-semibold text-ink-700 mb-3">Distribuição Geográfica de Vendas</p>
      <div className="relative bg-slate-50 rounded-lg border border-ink-100" style={{ height: 220 }}>
        <div className="absolute inset-2 rounded-lg bg-sky-50/40 border border-sky-100" />
        {data.map((city) => {
          const x = normLng(city.longitude)
          const y = normLat(city.latitude)
          const r = max > 0 ? 6 + (city.total_saidas / max) * 28 : 8
          return (
            <div
              key={city.cod_municipio_ibge}
              title={`${city.nome_municipio} · ${fmtM(city.total_saidas)}`}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: r * 2,
                height: r * 2,
                transform: 'translate(-50%, -50%)',
              }}
              className="rounded-full bg-primary-600/70 border border-primary-700 cursor-pointer hover:bg-primary-500 transition-colors flex items-center justify-center"
            >
              {r > 14 && (
                <span className="text-[8px] text-white font-bold leading-none text-center px-0.5">
                  {city.uf}
                </span>
              )}
            </div>
          )
        })}
        <div className="absolute bottom-2 left-2 flex flex-col gap-0.5">
          {data
            .slice()
            .sort((a, b) => b.total_saidas - a.total_saidas)
            .slice(0, 3)
            .map((c) => (
              <span key={c.cod_municipio_ibge} className="text-[9px] text-ink-500 leading-tight">
                {c.nome_municipio}: {fmtM(c.total_saidas)}
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}

const TOOLTIP_STYLE: React.CSSProperties = {
  fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb',
}

export default function PBIPage1Geral(): React.ReactElement {
  const kpis    = useMemo(() => getKPIs(), [])
  const monthly = useMemo(() => getMonthlySeries(), [])

  return (
    <div className="flex flex-col gap-5">

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard label="Receitas"          value={fmtM(kpis.receitas)}    sub="valor líquido saídas" />
        <KpiCard label="Aquisições"        value={fmtM(kpis.aquisicoes)}  sub="valor líquido entradas" />
        <KpiCard label="Tributação Vendas" value={fmtM(kpis.tribVendas)}  sub="2024" />
        <KpiCard label="Tributação Compras" value={fmtM(kpis.tribCompras)} sub="2024" />
        <KpiCard
          label="Saldo Tributos"
          value={fmtM(kpis.saldo)}
          sub={`${kpis.receitas > 0 ? ((kpis.saldo / kpis.receitas) * 100).toFixed(1) : '0'}% da receita`}
        />
      </div>

      {/* Bubble map */}
      <MapBubbles />

      {/* Combo charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-ink-100 p-4">
          <p className="text-xs font-semibold text-ink-700 mb-3">Vendas × Tributação Mensal</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={monthly} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tickFormatter={fmtMes} tick={{ fontSize: 9 }} interval={2} />
              <YAxis yAxisId="left"  tick={{ fontSize: 9 }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => fmtM(v)} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar  yAxisId="left"  dataKey="saidas"     name="Saídas"        fill="#1e40af" radius={[2,2,0,0]} />
              <Line yAxisId="right" dataKey="tribVendas" name="Trib. Vendas"  stroke="#f59e0b" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-ink-100 p-4">
          <p className="text-xs font-semibold text-ink-700 mb-3">Compras × Tributação Mensal</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={monthly} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tickFormatter={fmtMes} tick={{ fontSize: 9 }} interval={2} />
              <YAxis yAxisId="left"  tick={{ fontSize: 9 }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => fmtM(v)} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar  yAxisId="left"  dataKey="entradas"   name="Entradas"       fill="#0f766e" radius={[2,2,0,0]} />
              <Line yAxisId="right" dataKey="tribCompras" name="Trib. Compras" stroke="#dc2626" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
