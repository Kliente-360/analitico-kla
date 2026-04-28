export * from './types'
export * from './dimensions'
export { getFatoSaidas, getFatoEntradas, getFatoTributos, aggregateTributosPorAno } from './mockData'

import { getFatoSaidas, getFatoEntradas, getFatoTributos } from './mockData'
import { DIM_PRODUTO, DIM_MUNICIPIO, ANOS_REFORMA } from './dimensions'
import type { TributoNome } from './types'

// KPI totais
export function getKPIs() {
  const saidas   = getFatoSaidas()
  const entradas = getFatoEntradas()
  const trib     = getFatoTributos()

  const receitas    = saidas.reduce((s, r) => s + r.valor_liquido, 0)
  const aquisicoes  = entradas.reduce((s, r) => s + r.valor_liquido, 0)
  const tribVendas  = trib.filter((t) => t.direcao === 'Saída'   && t.ano === 2024).reduce((s, r) => s + r.valor_tributo, 0)
  const tribCompras = trib.filter((t) => t.direcao === 'Entrada' && t.ano === 2024).reduce((s, r) => s + r.valor_tributo, 0)
  const saldo       = tribVendas - tribCompras

  return { receitas, aquisicoes, tribVendas, tribCompras, saldo }
}

// Monthly aggregation for combo charts
export function getMonthlySeries() {
  const saidas   = getFatoSaidas()
  const entradas = getFatoEntradas()
  const trib     = getFatoTributos().filter((t) => t.ano === 2024)

  const tribByNota = new Map<string, number>()
  for (const t of trib) {
    tribByNota.set(t.id_nota, (tribByNota.get(t.id_nota) ?? 0) + t.valor_tributo)
  }

  const monthMap = new Map<string, { saidas: number; tribVendas: number; entradas: number; tribCompras: number }>()

  for (const s of saidas) {
    const key = s.data_emissao.slice(0, 7)
    const cur = monthMap.get(key) ?? { saidas: 0, tribVendas: 0, entradas: 0, tribCompras: 0 }
    cur.saidas += s.valor_liquido
    cur.tribVendas += tribByNota.get(s.id_nota) ?? 0
    monthMap.set(key, cur)
  }
  for (const e of entradas) {
    const key = e.data_emissao.slice(0, 7)
    const cur = monthMap.get(key) ?? { saidas: 0, tribVendas: 0, entradas: 0, tribCompras: 0 }
    cur.entradas += e.valor_liquido
    cur.tribCompras += tribByNota.get(e.id_nota) ?? 0
    monthMap.set(key, cur)
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, v]) => ({ mes, ...v }))
}

// Bubble map data: municipio → total saídas
export function getMapBubbles() {
  const saidas = getFatoSaidas()
  const byMun = new Map<number, number>()
  for (const s of saidas) {
    byMun.set(s.cod_municipio_ibge, (byMun.get(s.cod_municipio_ibge) ?? 0) + s.valor_liquido)
  }
  return DIM_MUNICIPIO.map((m) => ({
    ...m,
    total_saidas: byMun.get(m.cod_municipio_ibge) ?? 0,
  }))
}

// Stacked bar: saldo por tributo × ano (Page 2)
export function getCargaEfetivaSeries() {
  const trib    = getFatoTributos()
  const saidas  = getFatoSaidas()
  const receitas = saidas.reduce((s, r) => s + r.valor_liquido, 0)

  return ANOS_REFORMA.map((ano) => {
    const debitos  = trib.filter((t) => t.direcao === 'Saída'   && t.ano === ano)
    const creditos = trib.filter((t) => t.direcao === 'Entrada' && t.ano === ano)

    const debitoByTrib: Partial<Record<TributoNome, number>>  = {}
    const creditoByTrib: Partial<Record<TributoNome, number>> = {}

    for (const t of debitos)  debitoByTrib[t.tributo]  = (debitoByTrib[t.tributo]  ?? 0) + t.valor_tributo
    for (const t of creditos) creditoByTrib[t.tributo] = (creditoByTrib[t.tributo] ?? 0) + t.valor_tributo

    const tributos: TributoNome[] = ['ICMS', 'PIS_COFINS', 'ISS', 'IBS', 'CBS']
    const saldos: Partial<Record<TributoNome, number>> = {}
    let totalSaldo = 0
    for (const tr of tributos) {
      const s = (debitoByTrib[tr] ?? 0) - (creditoByTrib[tr] ?? 0)
      saldos[tr] = Math.round(s * 100) / 100
      totalSaldo += s
    }

    return {
      ano,
      ...saldos,
      totalSaldo: Math.round(totalSaldo * 100) / 100,
      cargaEfetiva: receitas > 0 ? Math.round((totalSaldo / receitas) * 10000) / 100 : 0,
    }
  })
}

// 4-quadrant tributos (Page 3): debitos e creditos por regime e ano
export function getTributosPorAnoQuadrante() {
  const trib = getFatoTributos()

  return ANOS_REFORMA.map((ano) => {
    const sai = trib.filter((t) => t.direcao === 'Saída'   && t.ano === ano)
    const ent = trib.filter((t) => t.direcao === 'Entrada' && t.ano === ano)

    const sum = (arr: typeof trib, tributo: TributoNome) =>
      Math.round(arr.filter((t) => t.tributo === tributo).reduce((s, t) => s + t.valor_tributo, 0) * 100) / 100

    return {
      ano,
      // debitos regime atual
      debitoICMS:       sum(sai, 'ICMS'),
      debitoPIS_COFINS: sum(sai, 'PIS_COFINS'),
      debitoISS:        sum(sai, 'ISS'),
      // creditos regime atual
      creditoICMS:       sum(ent, 'ICMS'),
      creditoPIS_COFINS: sum(ent, 'PIS_COFINS'),
      // debitos novo regime
      debitoIBS: sum(sai, 'IBS'),
      debitoCBS: sum(sai, 'CBS'),
      // creditos novo regime
      creditoIBS: sum(ent, 'IBS'),
      creditoCBS: sum(ent, 'CBS'),
    }
  })
}

// Pivot por produto (Pages 4 & 5)
export function getPivotPorProduto(direcao: 'Saída' | 'Entrada') {
  const notas = direcao === 'Saída' ? getFatoSaidas() : getFatoEntradas()
  const trib  = getFatoTributos().filter((t) => t.direcao === direcao)

  type ProdRow = {
    cod_item: string
    descricao_item: string
    categoria: string
    anos: Record<number, {
      valor_bruto: number
      valor_liquido: number
      ICMS: number
      PIS_COFINS: number
      ISS: number
      IBS: number
      CBS: number
    }>
  }

  const map = new Map<string, ProdRow>()

  for (const nota of notas) {
    const prod = DIM_PRODUTO.find((p) => p.cod_item === nota.cod_item)!
    if (!map.has(nota.cod_item)) {
      map.set(nota.cod_item, {
        cod_item: nota.cod_item,
        descricao_item: prod.descricao_item,
        categoria: prod.categoria,
        anos: Object.fromEntries(ANOS_REFORMA.map((a) => [a, { valor_bruto: 0, valor_liquido: 0, ICMS: 0, PIS_COFINS: 0, ISS: 0, IBS: 0, CBS: 0 }])),
      })
    }
    const row = map.get(nota.cod_item)!
    for (const ano of ANOS_REFORMA) {
      row.anos[ano].valor_bruto   += nota.valor_bruto
      row.anos[ano].valor_liquido += nota.valor_liquido
    }
  }

  for (const t of trib) {
    const row = map.get(t.id_nota.replace('NFS-', 'NFS-').replace('NFE-', 'NFE-'))
    if (!row) continue
    // find which nota belongs to which product
  }

  // Rebuild using nota → item mapping
  const notaItem = new Map<string, string>()
  for (const n of notas) notaItem.set(n.id_nota, n.cod_item)

  for (const t of trib) {
    const item = notaItem.get(t.id_nota)
    if (!item) continue
    const row = map.get(item)
    if (!row || !(t.ano in row.anos)) continue
    const tr = t.tributo as 'ICMS' | 'PIS_COFINS' | 'ISS' | 'IBS' | 'CBS'
    row.anos[t.ano][tr] = (row.anos[t.ano][tr] ?? 0) + t.valor_tributo
  }

  return Array.from(map.values()).sort((a, b) => a.descricao_item.localeCompare(b.descricao_item))
}

// DRE por ano (Pages 6 & 7)
export function getDREPorAno() {
  const trib     = getFatoTributos()
  const saidas   = getFatoSaidas()
  const entradas = getFatoEntradas()

  const receitaBruta = saidas.reduce((s, r) => s + r.valor_bruto, 0)
  const custoMerc    = entradas.reduce((s, r) => s + r.valor_liquido, 0) * 0.55
  const despNaoRec   = receitaBruta * 0.04

  return ANOS_REFORMA.map((ano) => {
    const sai = trib.filter((t) => t.direcao === 'Saída' && t.ano === ano)
    const sum = (tr: TributoNome) => sai.filter((t) => t.tributo === tr).reduce((s, t) => s + t.valor_tributo, 0)

    const icms      = sum('ICMS')
    const pisCofins = sum('PIS_COFINS')
    const iss       = sum('ISS')
    const ibs       = sum('IBS')
    const cbs       = sum('CBS')

    const receitaLiquida  = receitaBruta - icms - pisCofins - iss - ibs - cbs
    const lucroBruto      = receitaLiquida - custoMerc - despNaoRec
    const lucroOperacional = lucroBruto * 0.85

    return {
      ano,
      receitaBruta,
      icms, pisCofins, iss, ibs, cbs,
      receitaLiquida,
      custoMerc,
      despNaoRec,
      lucroBruto,
      lucroOperacional,
      resultadoPct: receitaBruta > 0 ? lucroOperacional / receitaBruta : 0,
    }
  })
}
