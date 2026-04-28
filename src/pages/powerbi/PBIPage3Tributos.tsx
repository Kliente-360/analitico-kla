import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { getTributosPorAnoQuadrante } from '../../data/powerbi'

const fmtM = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : `R$ ${(v / 1_000).toFixed(0)}k`

const COLORS = {
  ICMS:       '#1e3a8a',
  PIS_COFINS: '#166534',
  ISS:        '#92400e',
  IBS:        '#c2410c',
  CBS:        '#991b1b',
}

const TOOLTIP_STYLE: React.CSSProperties = {
  fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb',
}

type QuadData = ReturnType<typeof getTributosPorAnoQuadrante>[number]

interface QuadChartProps {
  title: string
  data: QuadData[]
  series: { dataKey: keyof QuadData; name: string; color: string }[]
}

function QuadChart({ title, data, series }: QuadChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-ink-100 p-4">
      <p className="text-xs font-semibold text-ink-700 mb-3">{title}</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="ano" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => fmtM(v)} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          {series.map((s) => (
            <Bar
              key={String(s.dataKey)}
              dataKey={String(s.dataKey)}
              name={s.name}
              fill={s.color}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function PBIPage3Tributos(): React.ReactElement {
  const data = useMemo(() => getTributosPorAnoQuadrante(), [])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ink-400">
        Quatro quadrantes — mesma escala de cores por tributo. Eixo X = ano de apuração (2024 + transição 2027–2033).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Superior esquerdo: Créditos regime atual */}
        <QuadChart
          title="Créditos — Regime Atual (ICMS · PIS/COFINS)"
          data={data}
          series={[
            { dataKey: 'creditoICMS',       name: 'ICMS',       color: COLORS.ICMS },
            { dataKey: 'creditoPIS_COFINS', name: 'PIS/COFINS', color: COLORS.PIS_COFINS },
          ]}
        />

        {/* Superior direito: Débitos regime atual */}
        <QuadChart
          title="Débitos — Regime Atual (ICMS · PIS/COFINS · ISS)"
          data={data}
          series={[
            { dataKey: 'debitoICMS',       name: 'ICMS',       color: COLORS.ICMS },
            { dataKey: 'debitoPIS_COFINS', name: 'PIS/COFINS', color: COLORS.PIS_COFINS },
            { dataKey: 'debitoISS',        name: 'ISS',        color: COLORS.ISS },
          ]}
        />

        {/* Inferior esquerdo: Créditos novo regime */}
        <QuadChart
          title="Créditos — Novo Regime (IBS · CBS)"
          data={data}
          series={[
            { dataKey: 'creditoIBS', name: 'IBS', color: COLORS.IBS },
            { dataKey: 'creditoCBS', name: 'CBS', color: COLORS.CBS },
          ]}
        />

        {/* Inferior direito: Débitos novo regime */}
        <QuadChart
          title="Débitos — Novo Regime (IBS · CBS)"
          data={data}
          series={[
            { dataKey: 'debitoIBS', name: 'IBS', color: COLORS.IBS },
            { dataKey: 'debitoCBS', name: 'CBS', color: COLORS.CBS },
          ]}
        />
      </div>

      {/* Summary grid */}
      <div className="bg-white rounded-xl shadow-sm border border-ink-100 overflow-x-auto">
        <table className="w-full text-xs min-w-[700px]">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-100 text-ink-600">
              <th className="px-3 py-2 text-left">Ano</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.ICMS }}>Déb. ICMS</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.PIS_COFINS }}>Déb. PIS/COF</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.ISS }}>Déb. ISS</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.ICMS }}>Cré. ICMS</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.PIS_COFINS }}>Cré. PIS/COF</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.IBS }}>Déb. IBS</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.CBS }}>Déb. CBS</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.IBS }}>Cré. IBS</th>
              <th className="px-3 py-2 text-right" style={{ color: COLORS.CBS }}>Cré. CBS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.ano} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/40'}>
                <td className="px-3 py-1.5 font-semibold text-ink-800">{row.ano}</td>
                <td className="px-3 py-1.5 text-right text-ink-600">{fmtM(row.debitoICMS)}</td>
                <td className="px-3 py-1.5 text-right text-ink-600">{fmtM(row.debitoPIS_COFINS)}</td>
                <td className="px-3 py-1.5 text-right text-ink-600">{fmtM(row.debitoISS)}</td>
                <td className="px-3 py-1.5 text-right text-ink-600">{fmtM(row.creditoICMS)}</td>
                <td className="px-3 py-1.5 text-right text-ink-600">{fmtM(row.creditoPIS_COFINS)}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: COLORS.IBS }}>{fmtM(row.debitoIBS)}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: COLORS.CBS }}>{fmtM(row.debitoCBS)}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: COLORS.IBS }}>{fmtM(row.creditoIBS)}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: COLORS.CBS }}>{fmtM(row.creditoCBS)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
