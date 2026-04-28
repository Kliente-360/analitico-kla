import { DIM_PRODUTO, DIM_UNIDADE, DIM_MUNICIPIO, DIM_ALIQUOTAS, ANOS_REFORMA } from './dimensions'
import type { FatoSaida, FatoEntrada, FatoTributo, TributoNome } from './types'

// Seeded LCG pseudo-random — deterministic, consistent across renders
function makePrng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(s, 1664525) + 1013904223
    return (s >>> 0) / 0xffffffff
  }
}

function pad(n: number, digits: number) {
  return String(n).padStart(digits, '0')
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${pad(month, 2)}-${pad(day, 2)}`
}

function randomDate(rng: () => number, year: number, month: number) {
  const days = new Date(year, month, 0).getDate()
  return isoDate(year, month, Math.max(1, Math.round(rng() * days)))
}

// Months: Jan 2024 – Dec 2025 = 24 periods
const PERIODS: { year: number; month: number }[] = []
for (let y = 2024; y <= 2025; y++) {
  for (let m = 1; m <= 12; m++) {
    PERIODS.push({ year: y, month: m })
  }
}

const PRODUTOS_BY_TIPO = {
  tributado:  DIM_PRODUTO.filter((p) => p.tipo_tributacao === 'tributado'),
  servico:    DIM_PRODUTO.filter((p) => p.tipo_tributacao === 'servico'),
  monofasico: DIM_PRODUTO.filter((p) => p.tipo_tributacao === 'monofasico'),
  isento:     DIM_PRODUTO.filter((p) => p.tipo_tributacao === 'isento'),
}

const ALL_PROD = DIM_PRODUTO

// UN → municipio mapping (primary city of each unit)
const UN_MUNICIPIO: Record<string, number> = {
  'UN-SP': 3550308,
  'UN-RJ': 3304557,
  'UN-MG': 3106200,
  'UN-PR': 4106902,
}

const MUN_IBGE = DIM_MUNICIPIO.map((m) => m.cod_municipio_ibge)

function pickUnit(rng: () => number, empresa: string) {
  const units = DIM_UNIDADE.filter((u) => u.cod_empresa === empresa)
  return units[Math.floor(rng() * units.length)]
}

function pickMunicipio(rng: () => number, unidade: string): number {
  if (rng() < 0.7) return UN_MUNICIPIO[unidade] ?? MUN_IBGE[0]
  return MUN_IBGE[Math.floor(rng() * MUN_IBGE.length)]
}

// ---------------------------------------------------------------------------
// fato_saidas — 500 rows
// ---------------------------------------------------------------------------
export function gerarFatoSaidas(): FatoSaida[] {
  const rng = makePrng(42)
  const result: FatoSaida[] = []
  let counter = 1

  for (let i = 0; i < 500; i++) {
    const period = PERIODS[Math.floor(rng() * PERIODS.length)]
    const empresa = rng() < 0.6 ? 'EMP01' : 'EMP02'
    const unit = pickUnit(rng, empresa)
    const prod = ALL_PROD[Math.floor(rng() * ALL_PROD.length)]

    let qty: number
    if (prod.tipo_tributacao === 'servico') {
      qty = 1
    } else if (prod.categoria === 'Alimentos') {
      qty = Math.max(10, Math.round(rng() * 300))
    } else if (prod.categoria === 'Mat. Escritório') {
      qty = Math.max(1, Math.round(rng() * 50))
    } else {
      qty = Math.max(1, Math.round(rng() * 15))
    }

    const precoVar = prod.preco_unitario * (0.85 + rng() * 0.30)
    const valorBruto = Math.round(precoVar * qty * 100) / 100
    const descPct = prod.tipo_tributacao === 'servico' ? 0 : rng() * 0.07
    const valorDesconto = Math.round(valorBruto * descPct * 100) / 100
    const valorLiquido = Math.round((valorBruto - valorDesconto) * 100) / 100

    result.push({
      id_nota: `NFS-${pad(counter++, 5)}`,
      data_emissao: randomDate(rng, period.year, period.month),
      cod_empresa: empresa,
      cod_un: unit.cod_un,
      cod_item: prod.cod_item,
      cod_municipio_ibge: pickMunicipio(rng, unit.cod_un),
      tipo_nf: prod.tipo_tributacao === 'servico' ? 'Serviço' : 'Saída',
      quantidade: qty,
      valor_bruto: valorBruto,
      valor_liquido: valorLiquido,
      valor_desconto: valorDesconto,
    })
  }
  return result
}

// ---------------------------------------------------------------------------
// fato_entradas — 1000 rows
// ---------------------------------------------------------------------------
export function gerarFatoEntradas(): FatoEntrada[] {
  const rng = makePrng(137)
  const result: FatoEntrada[] = []
  let counter = 1

  // Weights: more tributado (goods) than services for purchases
  const COMPRA_PRODS = [
    ...PRODUTOS_BY_TIPO.tributado,
    ...PRODUTOS_BY_TIPO.monofasico,
    ...PRODUTOS_BY_TIPO.isento,
    ...PRODUTOS_BY_TIPO.servico.slice(0, 4),
  ]

  for (let i = 0; i < 1000; i++) {
    const period = PERIODS[Math.floor(rng() * PERIODS.length)]
    const empresa = rng() < 0.6 ? 'EMP01' : 'EMP02'
    const unit = pickUnit(rng, empresa)
    const prod = COMPRA_PRODS[Math.floor(rng() * COMPRA_PRODS.length)]
    const regime: 'Não Cumulativo' | 'Cumulativo' = rng() < 0.7 ? 'Não Cumulativo' : 'Cumulativo'

    let qty: number
    if (prod.tipo_tributacao === 'servico') {
      qty = 1
    } else if (prod.categoria === 'Alimentos') {
      qty = Math.max(20, Math.round(rng() * 500))
    } else if (prod.categoria === 'Mat. Escritório') {
      qty = Math.max(5, Math.round(rng() * 100))
    } else {
      qty = Math.max(1, Math.round(rng() * 20))
    }

    const precoCompra = prod.preco_unitario * (0.70 + rng() * 0.20)
    const valorBruto = Math.round(precoCompra * qty * 100) / 100
    const descPct = rng() * 0.05
    const valorLiquido = Math.round(valorBruto * (1 - descPct) * 100) / 100

    const creditaICMS = (prod.tipo_tributacao === 'tributado' || prod.tipo_tributacao === 'monofasico') && rng() < 0.85
    const creditaPIS = prod.tipo_tributacao === 'tributado' && regime === 'Não Cumulativo' && rng() < 0.80

    const classBucket = rng()
    const classificacao: 'Custo' | 'Despesa' | 'Ativo' =
      classBucket < 0.55 ? 'Custo' : classBucket < 0.85 ? 'Despesa' : 'Ativo'

    result.push({
      id_nota: `NFE-${pad(counter++, 5)}`,
      data_emissao: randomDate(rng, period.year, period.month),
      cod_empresa: empresa,
      cod_un: unit.cod_un,
      cod_item: prod.cod_item,
      cod_municipio_ibge: pickMunicipio(rng, unit.cod_un),
      tipo_nf: prod.tipo_tributacao === 'servico' ? 'Serviço' : 'Entrada',
      quantidade: qty,
      valor_bruto: valorBruto,
      valor_liquido: valorLiquido,
      regime,
      credito_de_icms: creditaICMS ? 'Sim' : 'Não',
      credito_pis_cofins: creditaPIS ? 'Sim' : 'Não',
      classificacao,
    })
  }
  return result
}

// ---------------------------------------------------------------------------
// fato_tributos — derived from saídas + entradas × anos × tributos
// ---------------------------------------------------------------------------
const ALIQ_MAP = new Map(DIM_ALIQUOTAS.map((a) => [a.ano, a]))

const ALIQ_ICMS = 0.18
const ALIQ_PIS_COFINS_NC = 0.0925
const ALIQ_PIS_COFINS_C  = 0.0365
const ALIQ_ISS = 0.05

function tributosSaida(nota: FatoSaida): FatoTributo[] {
  const rows: FatoTributo[] = []
  const prod = DIM_PRODUTO.find((p) => p.cod_item === nota.cod_item)!
  const base = nota.valor_liquido

  for (const ano of ANOS_REFORMA) {
    const dim = ALIQ_MAP.get(ano)!

    if (prod.tipo_tributacao === 'tributado') {
      const icmsAliq = ALIQ_ICMS * dim.reducao_ibs
      if (icmsAliq > 0) {
        rows.push({ id_nota: nota.id_nota, direcao: 'Saída', ano, tributo: 'ICMS', aliquota: icmsAliq, base_calculo: base, valor_tributo: Math.round(base * icmsAliq * 100) / 100, tipo_movimento: 'Débito', escriturado: true })
      }
      const pisAliq = ALIQ_PIS_COFINS_NC * dim.reducao_ibs
      if (pisAliq > 0) {
        rows.push({ id_nota: nota.id_nota, direcao: 'Saída', ano, tributo: 'PIS_COFINS', aliquota: pisAliq, base_calculo: base, valor_tributo: Math.round(base * pisAliq * 100) / 100, tipo_movimento: 'Débito', escriturado: true })
      }
    }

    if (prod.tipo_tributacao === 'monofasico') {
      const icmsAliq = ALIQ_ICMS * dim.reducao_ibs
      if (icmsAliq > 0) {
        rows.push({ id_nota: nota.id_nota, direcao: 'Saída', ano, tributo: 'ICMS', aliquota: icmsAliq, base_calculo: base, valor_tributo: Math.round(base * icmsAliq * 100) / 100, tipo_movimento: 'Débito', escriturado: true })
      }
    }

    if (prod.tipo_tributacao === 'servico') {
      const issAliq = ALIQ_ISS * (1 - dim.reducao_iss)
      if (issAliq > 0) {
        rows.push({ id_nota: nota.id_nota, direcao: 'Saída', ano, tributo: 'ISS', aliquota: issAliq, base_calculo: base, valor_tributo: Math.round(base * issAliq * 100) / 100, tipo_movimento: 'Débito', escriturado: true })
      }
    }

    if (dim.aliquota_ibs > 0) {
      rows.push({ id_nota: nota.id_nota, direcao: 'Saída', ano, tributo: 'IBS', aliquota: dim.aliquota_ibs, base_calculo: base, valor_tributo: Math.round(base * dim.aliquota_ibs * 100) / 100, tipo_movimento: 'Débito', escriturado: true })
    }
    if (dim.aliquota_cbs > 0) {
      rows.push({ id_nota: nota.id_nota, direcao: 'Saída', ano, tributo: 'CBS', aliquota: dim.aliquota_cbs, base_calculo: base, valor_tributo: Math.round(base * dim.aliquota_cbs * 100) / 100, tipo_movimento: 'Débito', escriturado: true })
    }
  }
  return rows
}

function tributosEntrada(nota: FatoEntrada): FatoTributo[] {
  const rows: FatoTributo[] = []
  const prod = DIM_PRODUTO.find((p) => p.cod_item === nota.cod_item)!
  const base = nota.valor_liquido

  for (const ano of ANOS_REFORMA) {
    const dim = ALIQ_MAP.get(ano)!

    if (nota.credito_de_icms === 'Sim' && prod.tipo_tributacao !== 'servico') {
      const icmsAliq = ALIQ_ICMS * dim.reducao_ibs
      if (icmsAliq > 0) {
        rows.push({ id_nota: nota.id_nota, direcao: 'Entrada', ano, tributo: 'ICMS', aliquota: icmsAliq, base_calculo: base, valor_tributo: Math.round(base * icmsAliq * 100) / 100, tipo_movimento: 'Crédito', escriturado: true })
      }
    }

    if (nota.credito_pis_cofins === 'Sim') {
      const pisAliq = (nota.regime === 'Não Cumulativo' ? ALIQ_PIS_COFINS_NC : ALIQ_PIS_COFINS_C) * dim.reducao_ibs
      if (pisAliq > 0) {
        rows.push({ id_nota: nota.id_nota, direcao: 'Entrada', ano, tributo: 'PIS_COFINS', aliquota: pisAliq, base_calculo: base, valor_tributo: Math.round(base * pisAliq * 100) / 100, tipo_movimento: 'Crédito', escriturado: true })
      }
    }

    if (dim.aliquota_ibs > 0) {
      rows.push({ id_nota: nota.id_nota, direcao: 'Entrada', ano, tributo: 'IBS', aliquota: dim.aliquota_ibs, base_calculo: base, valor_tributo: Math.round(base * dim.aliquota_ibs * 100) / 100, tipo_movimento: 'Crédito', escriturado: true })
    }
    if (dim.aliquota_cbs > 0) {
      rows.push({ id_nota: nota.id_nota, direcao: 'Entrada', ano, tributo: 'CBS', aliquota: dim.aliquota_cbs, base_calculo: base, valor_tributo: Math.round(base * dim.aliquota_cbs * 100) / 100, tipo_movimento: 'Crédito', escriturado: true })
    }
  }
  return rows
}

// Lazy-generated singletons
let _saidas: FatoSaida[] | null = null
let _entradas: FatoEntrada[] | null = null
let _tributos: FatoTributo[] | null = null

export function getFatoSaidas(): FatoSaida[] {
  if (!_saidas) _saidas = gerarFatoSaidas()
  return _saidas
}

export function getFatoEntradas(): FatoEntrada[] {
  if (!_entradas) _entradas = gerarFatoEntradas()
  return _entradas
}

export function getFatoTributos(): FatoTributo[] {
  if (!_tributos) {
    const saidas = getFatoSaidas()
    const entradas = getFatoEntradas()
    _tributos = [
      ...saidas.flatMap(tributosSaida),
      ...entradas.flatMap(tributosEntrada),
    ]
  }
  return _tributos
}

// Helper: aggregate tributos by ano × tributo for saídas or entradas
export function aggregateTributosPorAno(
  direcao: 'Saída' | 'Entrada',
  anoFilter?: number,
): Record<number, Partial<Record<TributoNome, number>>> {
  const trib = getFatoTributos().filter((t) => t.direcao === direcao)
  const result: Record<number, Partial<Record<TributoNome, number>>> = {}
  for (const ano of ANOS_REFORMA) {
    if (anoFilter !== undefined && ano !== anoFilter) continue
    result[ano] = {}
  }
  for (const t of trib) {
    if (!(t.ano in result)) continue
    result[t.ano][t.tributo] = (result[t.ano][t.tributo] ?? 0) + t.valor_tributo
  }
  return result
}
