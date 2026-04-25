/**
 * Formata valores monetários em R$ mil (unidade base do mockData).
 * >= 1 000 000 → bilhões (B) | >= 1 000 → milhões (M) | < 1 000 → mil (K)
 */
export function fmtM(v: number): string {
  const a = Math.abs(v)
  if (a >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}B`
  if (a >= 1_000)     return `R$ ${(v / 1_000).toFixed(0)}M`
  return `R$ ${v.toFixed(0)}K`
}

/** Percentual com sinal (ex: +3.2% / -1.5%) */
export function fmtPct(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
}

/** Número inteiro formatado em pt-BR */
export function fmtNum(v: number): string {
  return v.toLocaleString('pt-BR')
}

/**
 * Formata um valor conforme o tipo da métrica.
 * Input em R$ mil para 'money'.
 */
export function fmtVal(v: number, fmt: 'money' | 'pct' | 'int' | 'float'): string {
  switch (fmt) {
    case 'money': {
      const mv = v / 1_000
      if (Math.abs(mv) >= 1_000) return `${(mv / 1_000).toFixed(1)}B`
      if (Math.abs(mv) >= 1)     return `${mv.toFixed(0)}M`
      return `${v.toFixed(0)}K`
    }
    case 'pct':   return `${v.toFixed(1)}%`
    case 'float': return `${v.toFixed(2)}%`
    case 'int':   return v.toLocaleString('pt-BR')
  }
}
