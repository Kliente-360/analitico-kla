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

// "Mantendo preço de venda": empresa absorve reforma mantendo preço ao cliente.
// Impacto = novo tributo líquido é maior → reduz margem, não é repassado ao cliente.
// Portanto: receita bruta = constante, tributos = valores do ano, margens diminuem.
interface Linha {
  label: string
  tipo: 'receita' | 'deducao' | 'despesa' | 'subtotal' | 'resultado'
  negate?: boolean
  isPct?: boolean
  getAtual: (r: DRERow) => number
  getReforma: (r: DRERow, baseRow: DRERow) => number
}

function buildLinhas(base: DRERow): Linha[] {
  return [
    {
      label: 'Receita Bruta',
      tipo: 'receita',
      getAtual:   (r) => r.receitaBruta,
      getReforma: ()  => base.receitaBruta,
    },
    {
      label: '(-) ICMS',
      tipo: 'deducao', negate: true,
      getAtual:   (r) => r.icms,
      getReforma: (r) => r.icms,
    },
    {
      label: '(-) PIS/COFINS',
      tipo: 'deducao', negate: true,
      getAtual:   (r) => r.pisCofins,
      getReforma: (r) => r.pisCofins,
    },
    {
      label: '(-) ISS',
      tipo: 'deducao', negate: true,
      getAtual:   (r) => r.iss,
      getReforma: (r) => r.iss,
    },
    {
      label: '(-) IBS',
      tipo: 'deducao', negate: true,
      getAtual:   (r) => r.ibs,
      getReforma: (r) => r.ibs,
    },
    {
      label: '(-) CBS',
      tipo: 'deducao', negate: true,
      getAtual:   (r) => r.cbs,
      getReforma: (r) => r.cbs,
    },
    {
      label: 'Receita Líquida',
      tipo: 'subtotal',
      getAtual:   (r) => r.receitaLiquida,
      getReforma: (r, baseR) => {
        const tributos = r.icms + r.pisCofins + r.iss + r.ibs + r.cbs
        return baseR.receitaBruta - tributos
      },
    },
    {
      label: '(-) Custo de Mercadoria/Serviço',
      tipo: 'despesa', negate: true,
      getAtual:   (r) => r.custoMerc,
      getReforma: (r) => r.custoMerc,
    },
    {
      label: '(-) Despesas Não Recuperáveis',
      tipo: 'despesa', negate: true,
      getAtual:   (r) => r.despNaoRec,
      getReforma: (r) => r.despNaoRec,
    },
    {
      label: 'Lucro Bruto',
      tipo: 'subtotal',
      getAtual:   (r) => r.lucroBruto,
      getReforma: (r, baseR) => {
        const tributos = r.icms + r.pisCofins + r.iss + r.ibs + r.cbs
        const rl = baseR.receitaBruta - tributos
        return rl - r.custoMerc - r.despNaoRec
      },
    },
    {
      label: 'Lucro Operacional',
      tipo: 'resultado',
      getAtual:   (r) => r.lucroOperacional,
      getReforma: (r, baseR) => {
        const tributos = r.icms + r.pisCofins + r.iss + r.ibs + r.cbs
        const rl = baseR.receitaBruta - tributos
        const lb = rl - r.custoMerc - r.despNaoRec
        return lb * 0.85
      },
    },
    {
      label: 'Resultado %',
      tipo: 'resultado', isPct: true,
      getAtual:   (r) => r.resultadoPct,
      getReforma: (r, baseR) => {
        const tributos = r.icms + r.pisCofins + r.iss + r.ibs + r.cbs
        const rl = baseR.receitaBruta - tributos
        const lb = rl - r.custoMerc - r.despNaoRec
        const lo = lb * 0.85
        return baseR.receitaBruta > 0 ? lo / baseR.receitaBruta : 0
      },
    },
  ]
}

const TIPO_STYLE: Record<string, string> = {
  receita:   'font-semibold text-ink-800',
  deducao:   'text-ink-500 pl-5',
  despesa:   'text-ink-500 pl-5',
  subtotal:  'font-bold text-ink-900',
  resultado: 'font-bold text-primary-800',
}

function cellBg(tipo: string) {
  if (tipo === 'subtotal') return '#f8fafc'
  if (tipo === 'resultado') return '#eff6ff'
  return undefined
}

export default function PBIPage7Preco(): React.ReactElement {
  const allData = useMemo(() => getDREPorAno(), [])
  const byAno   = useMemo(() => {
    const m = new Map<number, DRERow>()
    for (const d of allData) m.set(d.ano, d)
    return m
  }, [allData])

  const base = byAno.get(2024)!
  const linhas = useMemo(() => buildLinhas(base), [base])

  const anos = ANOS_REFORMA

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
        <strong>Premissa:</strong> empresa mantém o preço final ao cliente durante toda a transição.
        O impacto tributário da reforma é absorvido integralmente na margem operacional,
        sem repasse ao consumidor.
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-ink-200 overflow-x-auto">
        <table className="w-full text-xs min-w-[960px]">
          <thead>
            <tr className="bg-ink-800 text-white">
              <th className="px-4 py-2 text-left w-56 sticky left-0 bg-ink-800 z-10">Indicador</th>
              {anos.map((ano) => (
                <th key={ano} colSpan={2} className="px-2 py-2 text-center border-l border-ink-600">
                  {ano}
                </th>
              ))}
            </tr>
            <tr className="bg-ink-100 border-b border-ink-200 text-ink-600 font-semibold">
              <th className="px-4 py-1.5 text-left sticky left-0 bg-ink-100 z-10">Cenário</th>
              {anos.map((ano) => (
                <React.Fragment key={ano}>
                  <th className="px-2 py-1.5 text-right border-l border-ink-200">Atual</th>
                  <th className="px-2 py-1.5 text-right border-l border-amber-200 bg-amber-50">Preço Mant.</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha, idx) => (
              <tr
                key={idx}
                className="border-b border-ink-100"
                style={{ background: cellBg(linha.tipo) }}
              >
                <td
                  className={`px-4 py-2 sticky left-0 z-10 ${TIPO_STYLE[linha.tipo]}`}
                  style={{ background: cellBg(linha.tipo) ?? 'white' }}
                >
                  {linha.label}
                </td>
                {anos.map((ano) => {
                  const row = byAno.get(ano)
                  if (!row) return <React.Fragment key={ano}><td /><td /></React.Fragment>
                  const vAtual   = linha.getAtual(row)
                  const vReforma = linha.getReforma(row, base)
                  const delta    = vReforma - vAtual
                  const fmtV = (v: number) => linha.isPct ? fmtPct(v) : fmtM(linha.negate ? -v : v)
                  const isNeg = (v: number) => (linha.negate ? -v : v) < 0

                  return (
                    <React.Fragment key={ano}>
                      <td className={`px-2 py-2 text-right tabular-nums border-l border-ink-100 ${TIPO_STYLE[linha.tipo]} ${isNeg(vAtual) ? 'text-red-600' : ''}`}>
                        {fmtV(vAtual)}
                      </td>
                      <td className={`px-2 py-2 text-right tabular-nums border-l border-amber-100 bg-amber-50/50 ${TIPO_STYLE[linha.tipo]} ${isNeg(vReforma) ? 'text-red-600' : ''}`}>
                        <div>{fmtV(vReforma)}</div>
                        {!linha.isPct && delta !== 0 && (
                          <div className={`text-[9px] font-normal ${delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {delta > 0 ? '+' : ''}{fmtM(linha.negate ? -delta : delta)}
                          </div>
                        )}
                      </td>
                    </React.Fragment>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Need React in scope for JSX fragments
import React from 'react'
