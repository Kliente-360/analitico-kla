import { fmtM } from '../utils/formatters'

interface TooltipEntry {
  value: number
  name: string
  color: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  /** Converte o valor antes de formatar. Padrão: v * 1000 (chart em M → fmtM em R$ mil) */
  valueMapper?: (v: number) => number
  /** Conteúdo extra renderizado entre o label e os itens */
  extra?: React.ReactNode
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueMapper = (v) => v * 1000,
  extra,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-xs">
      {label !== undefined && (
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
      )}
      {extra}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {fmtM(valueMapper(p.value))}
        </p>
      ))}
    </div>
  )
}
