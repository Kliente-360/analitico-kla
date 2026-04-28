import { useMemo, useState } from 'react'
import { getPivotPorProduto } from '../../data/powerbi'
import { ANOS_REFORMA } from '../../data/powerbi/dimensions'

const fmtM = (v: number) => {
  if (v === 0) return '—'
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(1)}k`
  return `R$ ${v.toFixed(0)}`
}

const COLUNAS = ['valor_bruto', 'valor_liquido', 'ICMS', 'PIS_COFINS', 'ISS', 'IBS', 'CBS'] as const
type Col = typeof COLUNAS[number]

const COL_LABEL: Record<Col, string> = {
  valor_bruto:   'Val. Bruto',
  valor_liquido: 'Val. Líquido',
  ICMS:          'ICMS',
  PIS_COFINS:    'PIS/COFINS',
  ISS:           'ISS',
  IBS:           'IBS',
  CBS:           'CBS',
}

const COL_COLOR: Record<Col, string> = {
  valor_bruto:   'text-ink-600',
  valor_liquido: 'text-ink-700',
  ICMS:          'text-blue-800',
  PIS_COFINS:    'text-green-800',
  ISS:           'text-amber-800',
  IBS:           'text-orange-700',
  CBS:           'text-red-800',
}

export default function PBIPage5ProdSai(): React.ReactElement {
  const rows   = useMemo(() => getPivotPorProduto('Saída'), [])
  const [filter, setFilter] = useState('')

  const visible = filter
    ? rows.filter((r) =>
        r.descricao_item.toLowerCase().includes(filter.toLowerCase()) ||
        r.categoria.toLowerCase().includes(filter.toLowerCase())
      )
    : rows

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <p className="text-xs text-ink-400 flex-1">
          Tabela dinâmica: linhas = produto, colunas = Débito por ano × métrica (espelho de entradas para saídas).
        </p>
        <input
          type="text"
          placeholder="Filtrar produto..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs border border-ink-200 rounded px-2 py-1 w-44 focus:outline-none focus:ring-1 focus:ring-primary-400"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink-200 shadow-sm">
        <table className="text-[10px] w-full min-w-[1600px]">
          <thead>
            <tr className="bg-primary-800 text-white">
              <th className="px-3 py-2 text-left w-48 sticky left-0 bg-primary-800 z-10">Produto</th>
              <th className="px-2 py-2 text-left w-28">Categoria</th>
              {ANOS_REFORMA.map((ano) => (
                <th key={ano} colSpan={COLUNAS.length} className="px-2 py-2 text-center border-l border-primary-600">
                  Débito {ano}
                </th>
              ))}
            </tr>
            <tr className="bg-primary-50 border-b border-ink-200">
              <th className="sticky left-0 bg-primary-50 z-10" />
              <th />
              {ANOS_REFORMA.map((ano) =>
                COLUNAS.map((col) => (
                  <th
                    key={`${ano}-${col}`}
                    className={`px-2 py-1.5 text-right font-medium border-l border-ink-200 whitespace-nowrap ${COL_COLOR[col]}`}
                  >
                    {COL_LABEL[col]}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr
                key={row.cod_item}
                className={`border-b border-ink-100 hover:bg-primary-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-ink-50/30'}`}
              >
                <td className="px-3 py-1.5 font-medium text-ink-800 sticky left-0 bg-inherit z-10 whitespace-nowrap">
                  {row.descricao_item}
                </td>
                <td className="px-2 py-1.5 text-ink-500 whitespace-nowrap">{row.categoria}</td>
                {ANOS_REFORMA.map((ano) =>
                  COLUNAS.map((col) => {
                    const anoData = row.anos[ano]
                    const val =
                      col === 'valor_bruto' || col === 'valor_liquido'
                        ? anoData[col]
                        : (anoData[col as 'ICMS' | 'PIS_COFINS' | 'ISS' | 'IBS' | 'CBS'] ?? 0)
                    return (
                      <td
                        key={`${ano}-${col}`}
                        className={`px-2 py-1.5 text-right border-l border-ink-100 tabular-nums ${COL_COLOR[col]}`}
                      >
                        {fmtM(val)}
                      </td>
                    )
                  })
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-primary-50 border-t-2 border-primary-300 font-bold">
              <td className="px-3 py-2 text-ink-800 sticky left-0 bg-primary-50 z-10">TOTAL</td>
              <td />
              {ANOS_REFORMA.map((ano) =>
                COLUNAS.map((col) => {
                  const total = visible.reduce((s, r) => {
                    const d = r.anos[ano]
                    const v =
                      col === 'valor_bruto' || col === 'valor_liquido'
                        ? d[col]
                        : (d[col as 'ICMS' | 'PIS_COFINS' | 'ISS' | 'IBS' | 'CBS'] ?? 0)
                    return s + v
                  }, 0)
                  return (
                    <td
                      key={`tot-${ano}-${col}`}
                      className={`px-2 py-2 text-right border-l border-ink-200 tabular-nums ${COL_COLOR[col]}`}
                    >
                      {fmtM(total)}
                    </td>
                  )
                })
              )}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
