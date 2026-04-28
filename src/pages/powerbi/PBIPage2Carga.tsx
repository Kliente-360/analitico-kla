import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LabelList,
} from 'recharts'
import { getCargaEfetivaSeries, getKPIs } from '../../data/powerbi'

const fmtM = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : `R$ ${(v / 1_000).toFixed(0)}k`

const TRIB_COLORS: Record<string, string> = {
  ICMS:      '#1e3a8a',
  PIS_COFINS:'#166534',
  ISS:       '#92400e',
  IBS:       '#c2410c',
  CBS:       '#991b1b',
}

const TRIB_LABELS: Record<string, string> = {
  ICMS: 'ICMS', PIS_COFINS: 'PIS/COFINS', ISS: 'ISS', IBS: 'IBS', CBS: 'CBS',
}

type CargaRow = ReturnType<typeof getCargaEfetivaSeries>[number]

function CustomLabel({ x, y, width, height, value }: {
  x?: number; y?: number; width?: number; height?: number; value?: number
}) {
  if (!value || (x === undefined) || (y === undefined) || (width === undefined) || (height === undefined)) return null
  if (height < 12) return null
  return (
    <text x={(x + width / 2)} y={y + height / 2 + 4} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="bold">
      {fmtM(value)}
    </text>
  )
}

function TopLabel({ x, y, width, value }: {
  x?: number; y?: number; width?: number; value?: number
}) {
  if (value === undefined || x === undefined || y === undefined || width === undefined) return null
  return (
    <text x={x + width / 2} y={(y ?? 0) - 4} textAnchor="middle" fill="#64748b" fontSize={9}>
      ({value.toFixed(1)}%)
    </text>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CargaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const data: CargaRow = payload[0]?.payload
  return (
    <div className="bg-white border border-ink-200 rounded-lg shadow-md p-3 text-xs min-w-[180px]">
      <p className="font-bold text-ink-800 mb-2">Ano {label}</p>
      {payload.map((p: { name: string; value: number; fill: string }) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: p.fill }} />
            {TRIB_LABELS[p.name] ?? p.name}
          </span>
          <span className="font-medium">{fmtM(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-ink-100 mt-2 pt-2 flex justify-between">
        <span className="font-semibold text-ink-700">Saldo total</span>
        <span className="font-bold">{fmtM(data?.totalSaldo ?? 0)}</span>
      </div>
      <div className="flex justify-between text-ink-500">
        <span>Carga efetiva</span>
        <span className="font-semibold">{data?.cargaEfetiva?.toFixed(1)}%</span>
      </div>
    </div>
  )
}

export default function PBIPage2Carga(): React.ReactElement {
  const series = useMemo(() => getCargaEfetivaSeries(), [])
  const kpis   = useMemo(() => getKPIs(), [])

  const TRIBUTOS: Array<keyof CargaRow> = ['ICMS', 'PIS_COFINS', 'ISS', 'IBS', 'CBS']

  return (
    <div className="flex flex-col gap-5">
      {/* KPI */}
      <div className="bg-white rounded-xl shadow-sm border border-ink-100 px-4 py-3 flex items-center gap-6">
        <div>
          <p className="text-[11px] text-ink-400 uppercase tracking-wide">Receitas (base 2024–2025)</p>
          <p className="text-xl font-bold text-ink-900">
            R$ {(kpis.receitas / 1_000_000).toFixed(2)}M
          </p>
        </div>
        <div className="h-10 w-px bg-ink-100" />
        <p className="text-xs text-ink-400 max-w-sm">
          Colunas empilhadas = saldo de cada tributo (débito − crédito) por ano de apuração.
          A carga efetiva (%) é calculada sobre a receita líquida total do período.
        </p>
      </div>

      {/* Stacked bar chart */}
      <div className="bg-white rounded-xl shadow-sm border border-ink-100 p-4">
        <p className="text-xs font-semibold text-ink-700 mb-4">
          Carga Tributária Efetiva — Comparativo 2024 vs. Transição (2027–2033)
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={series} margin={{ top: 24, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="ano" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CargaTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(v) => TRIB_LABELS[v] ?? v}
            />
            {TRIBUTOS.map((t) => (
              <Bar key={String(t)} dataKey={String(t)} stackId="a" fill={TRIB_COLORS[String(t)]} name={String(t)}>
                <LabelList content={<CustomLabel />} />
              </Bar>
            ))}
            {/* Invisible bar just to render cargaEfetiva label at top */}
            <Bar dataKey="cargaEfetiva" stackId="b" fill="transparent" name="cargaEfetiva">
              <LabelList dataKey="cargaEfetiva" content={<TopLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-xl shadow-sm border border-ink-100 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-100">
              <th className="px-3 py-2 text-left font-semibold text-ink-600">Ano</th>
              {TRIBUTOS.map((t) => (
                <th key={String(t)} className="px-3 py-2 text-right font-semibold" style={{ color: TRIB_COLORS[String(t)] }}>
                  {TRIB_LABELS[String(t)]}
                </th>
              ))}
              <th className="px-3 py-2 text-right font-semibold text-ink-700">Total Saldo</th>
              <th className="px-3 py-2 text-right font-semibold text-ink-700">Carga %</th>
            </tr>
          </thead>
          <tbody>
            {series.map((row, i) => (
              <tr key={row.ano} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/40'}>
                <td className="px-3 py-1.5 font-semibold text-ink-800">{row.ano}</td>
                {TRIBUTOS.map((t) => (
                  <td key={String(t)} className="px-3 py-1.5 text-right text-ink-600">
                    {fmtM((row[t] as number) ?? 0)}
                  </td>
                ))}
                <td className="px-3 py-1.5 text-right font-bold text-ink-800">
                  {fmtM(row.totalSaldo)}
                </td>
                <td className="px-3 py-1.5 text-right font-bold text-primary-700">
                  {row.cargaEfetiva.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
