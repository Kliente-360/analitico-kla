import { useMemo } from 'react'
import { getDREPorAno } from '../../data/powerbi'
import { ANOS_REFORMA } from '../../data/powerbi/dimensions'

const fmtM = (v: number) => {
  const abs = Math.abs(v)
  const s = v < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${s}R$ ${(abs / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `${s}R$ ${(abs / 1_000).toFixed(1)}k`
  return `${s}R$ ${abs.toFixed(0)}`
}

const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`

type DRERow = ReturnType<typeof getDREPorAno>[number]

interface IndicadorConfig {
  label: string
  key: keyof DRERow | null
  tipo: 'receita' | 'deducao' | 'despesa' | 'subtotal' | 'resultado'
  negate?: boolean
  isPct?: boolean
}

const INDICADORES: IndicadorConfig[] = [
  { label: 'Receita Bruta',                       key: 'receitaBruta',   tipo: 'receita'   },
  { label: '(-) ICMS',                             key: 'icms',           tipo: 'deducao',   negate: true },
  { label: '(-) PIS/COFINS',                       key: 'pisCofins',      tipo: 'deducao',   negate: true },
  { label: '(-) ISS',                              key: 'iss',            tipo: 'deducao',   negate: true },
  { label: '(-) IBS',                              key: 'ibs',            tipo: 'deducao',   negate: true },
  { label: '(-) CBS',                              key: 'cbs',            tipo: 'deducao',   negate: true },
  { label: 'Receita Líquida',                      key: 'receitaLiquida', tipo: 'subtotal'  },
  { label: '(-) Custo de Mercadoria/Serviço',      key: 'custoMerc',      tipo: 'despesa',   negate: true },
  { label: '(-) Despesas Não Recuperáveis',        key: 'despNaoRec',     tipo: 'despesa',   negate: true },
  { label: 'Lucro Bruto',                          key: 'lucroBruto',     tipo: 'subtotal'  },
  { label: 'Lucro Operacional',                    key: 'lucroOperacional', tipo: 'resultado' },
  { label: 'Resultado %',                          key: 'resultadoPct',   tipo: 'resultado', isPct: true  },
]

const TIPO_STYLE: Record<string, string> = {
  receita:   'font-semibold text-ink-800',
  deducao:   'text-ink-500 pl-5',
  despesa:   'text-ink-500 pl-5',
  subtotal:  'font-bold text-ink-900 bg-ink-50',
  resultado: 'font-bold text-primary-800 bg-primary-50',
}

export default function PBIPage6DRE(): React.ReactElement {
  const data = useMemo(() => getDREPorAno(), [])

  // Index by ano for quick lookup
  const byAno = useMemo(() => {
    const m = new Map<number, DRERow>()
    for (const d of data) m.set(d.ano, d)
    return m
  }, [data])

  function cellValue(ano: number, ind: IndicadorConfig): string {
    const row = byAno.get(ano)
    if (!row || ind.key === null) return '—'
    const raw = row[ind.key] as number
    if (ind.isPct) return fmtPct(raw)
    const val = ind.negate ? -raw : raw
    return fmtM(val)
  }

  function cellClass(ano: number, ind: IndicadorConfig): string {
    const row = byAno.get(ano)
    if (!row || ind.key === null) return ''
    const raw = row[ind.key] as number
    const val = ind.negate ? -raw : raw
    if (val < 0) return 'text-red-600'
    return ''
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ink-400">
        Demonstração do Resultado do Exercício — subtotais em negrito, valores negativos em vermelho.
        Colunas = cada ano de apuração da reforma.
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-ink-200 overflow-x-auto">
        <table className="w-full text-xs min-w-[640px]">
          <thead>
            <tr className="bg-ink-800 text-white">
              <th className="px-4 py-2 text-left w-56 sticky left-0 bg-ink-800 z-10">Indicador</th>
              {ANOS_REFORMA.map((ano) => (
                <th key={ano} className="px-3 py-2 text-right">{ano}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INDICADORES.map((ind, idx) => {
              const isSection = ind.tipo === 'subtotal' || ind.tipo === 'resultado'
              return (
                <tr
                  key={idx}
                  className={`border-b border-ink-100 ${isSection ? '' : 'hover:bg-ink-50/30'}`}
                >
                  <td
                    className={`px-4 py-2 sticky left-0 bg-inherit z-10 ${TIPO_STYLE[ind.tipo] ?? ''}`}
                    style={isSection ? { background: ind.tipo === 'resultado' ? '#eff6ff' : '#f8fafc' } : undefined}
                  >
                    {ind.label}
                  </td>
                  {ANOS_REFORMA.map((ano) => (
                    <td
                      key={ano}
                      className={`px-3 py-2 text-right tabular-nums ${TIPO_STYLE[ind.tipo] ?? ''} ${cellClass(ano, ind)}`}
                      style={isSection ? { background: ind.tipo === 'resultado' ? '#eff6ff' : '#f8fafc' } : undefined}
                    >
                      {cellValue(ano, ind)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mini chart: Receita Líquida vs Lucro Operacional */}
      <div className="bg-white rounded-xl shadow-sm border border-ink-100 p-4">
        <p className="text-xs font-semibold text-ink-700 mb-3">Evolução Receita Líquida × Lucro Operacional</p>
        <div className="flex gap-2 items-end h-28 px-2">
          {ANOS_REFORMA.map((ano) => {
            const row = byAno.get(ano)
            if (!row) return null
            const maxRL = Math.max(...data.map((d) => d.receitaLiquida))
            const rlH = maxRL > 0 ? (row.receitaLiquida / maxRL) * 100 : 0
            const loH = maxRL > 0 ? (row.lucroOperacional / maxRL) * 100 : 0
            return (
              <div key={ano} className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[8px] text-ink-400">{row.lucroOperacional >= 0 ? '+' : ''}{fmtPct(row.resultadoPct)}</span>
                <div className="w-full flex gap-0.5 items-end" style={{ height: 80 }}>
                  <div
                    className="flex-1 bg-primary-200 rounded-sm"
                    style={{ height: `${rlH}%` }}
                    title={`RL ${fmtM(row.receitaLiquida)}`}
                  />
                  <div
                    className={`flex-1 rounded-sm ${row.lucroOperacional >= 0 ? 'bg-green-500' : 'bg-red-400'}`}
                    style={{ height: `${Math.abs(loH)}%` }}
                    title={`LO ${fmtM(row.lucroOperacional)}`}
                  />
                </div>
                <span className="text-[8px] text-ink-500">{ano}</span>
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 mt-1 text-[10px] text-ink-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary-200 inline-block" /> Rec. Líquida</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block" /> Lucro Operacional</span>
        </div>
      </div>
    </div>
  )
}
