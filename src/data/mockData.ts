import type { Branch, Tenant, YearlyPoint } from '../types'
import { SIZE_THRESHOLDS, GROWTH_RATE } from '../constants'

// ─── Tenant (empresa logada) ────────────────────────────────────────────────

export const TENANT: Tenant = {
  id:          'grupo-meridional',
  name:        'Grupo Meridional S.A.',
  cnpj:        '12.345.678/0001-90',
  fiscalYear:  'Jan–Dez 2025',
  initials:    'GM',
}

// ─── Mapeamento UF → Região ──────────────────────────────────────────────────

export const STATE_REGION: Record<string, string> = {
  SP: 'Sudeste', RJ: 'Sudeste', MG: 'Sudeste', ES: 'Sudeste',
  RS: 'Sul',     PR: 'Sul',     SC: 'Sul',
  BA: 'Nordeste', CE: 'Nordeste', PE: 'Nordeste', MA: 'Nordeste',
  GO: 'Centro-Oeste', DF: 'Centro-Oeste', MT: 'Centro-Oeste', MS: 'Centro-Oeste',
  AM: 'Norte',   PA: 'Norte',   RO: 'Norte',
}

// ─── Alíquotas efetivas por linha de negócio ─────────────────────────────────
// Regime atual: IRPJ + CSLL + PIS + COFINS + ISS ou ICMS
// Regime reforma: IRPJ + CSLL + CBS + IBS

interface Rates {
  irpj: number; csll: number; pis: number; cofins: number
  iss:  number; icms: number
  cbs:  number; ibs:  number; is_rate: number
}

const BUSINESS_LINE_RATES: Record<string, Rates> = {
  // Varejo — ICMS sobre mercadorias; CBS+IBS bens (redução moderada)
  'Varejo':     { irpj:.020, csll:.009, pis:.0065, cofins:.0300, iss:.000, icms:.055, cbs:.040, ibs:.045, is_rate:0 },
  // Tecnologia — ISS sobre serviços; CBS+IBS serviços (redução expressiva)
  'Tecnologia': { irpj:.025, csll:.010, pis:.0165, cofins:.0760, iss:.030, icms:.000, cbs:.088, ibs:.015, is_rate:0 },
  // Logística — ICMS; CBS+IBS bens com créditos amplos (redução)
  'Logística':  { irpj:.020, csll:.009, pis:.0165, cofins:.0760, iss:.000, icms:.040, cbs:.065, ibs:.055, is_rate:0 },
  // Atacado — menor carga atual; CBS+IBS bens (redução)
  'Atacado':    { irpj:.015, csll:.007, pis:.0065, cofins:.0300, iss:.000, icms:.035, cbs:.030, ibs:.022, is_rate:0 },
  // Serviços — ISS alto; CBS+IBS serviços (maior redução proporcional)
  'Serviços':   { irpj:.025, csll:.010, pis:.0165, cofins:.0760, iss:.035, icms:.000, cbs:.060, ibs:.030, is_rate:0 },
}

// ─── Builder de filial ───────────────────────────────────────────────────────

function mkBranch(
  id: string, name: string, sector: string, city: string, state: string,
  revenue: number, employees: number, founded: number,
): Branch {
  const r      = BUSINESS_LINE_RATES[sector] ?? BUSINESS_LINE_RATES['Serviços']
  const region = STATE_REGION[state]
  const size: Branch['size'] =
    revenue < SIZE_THRESHOLDS.SMALL  ? 'Pequena' :
    revenue < SIZE_THRESHOLDS.MEDIUM ? 'Média'   : 'Grande'

  const irpj   = Math.round(revenue * r.irpj)
  const csll   = Math.round(revenue * r.csll)
  const pis    = Math.round(revenue * r.pis)
  const cofins = Math.round(revenue * r.cofins)
  const iss    = Math.round(revenue * r.iss)
  const icms   = Math.round(revenue * r.icms)
  const totalTaxCurrent      = irpj + csll + pis + cofins + iss + icms
  const effectiveRateCurrent = (totalTaxCurrent / revenue) * 100

  const cbs    = Math.round(revenue * r.cbs)
  const ibs    = Math.round(revenue * r.ibs)
  const isTax  = Math.round(revenue * r.is_rate)
  const totalTaxReform      = irpj + csll + cbs + ibs + isTax
  const effectiveRateReform = (totalTaxReform / revenue) * 100
  const taxDelta        = totalTaxReform - totalTaxCurrent
  const taxDeltaPercent = (taxDelta / totalTaxCurrent) * 100

  return {
    id, name, sector, city, state, region, size,
    revenue, employees, founded,
    irpj, csll, pis, cofins, iss, icms, totalTaxCurrent, effectiveRateCurrent,
    cbs, ibs, isTax, totalTaxReform, effectiveRateReform, taxDelta, taxDeltaPercent,
  }
}

// ─── 13 filiais do Grupo Meridional S.A. · 6 UFs ─────────────────────────────
// Receita total: R$ 312 M · Filiais ativas: 13 · UFs: SP, RJ, MG, PR, RS, DF

export const branches: Branch[] = [
  // SP — 4 filiais — R$ 141 M
  mkBranch('1',  'Matriz São Paulo',       'Varejo',     'São Paulo',       'SP', 60_000, 900, 1998),
  mkBranch('2',  'Filial Campinas',        'Tecnologia', 'Campinas',        'SP', 33_000, 330, 2008),
  mkBranch('3',  'Filial Santo André',     'Logística',  'Santo André',     'SP', 21_000, 420, 2003),
  mkBranch('4',  'Filial Ribeirão Preto',  'Atacado',    'Ribeirão Preto',  'SP', 27_000, 216, 2005),
  // RJ — 2 filiais — R$ 53 M
  mkBranch('5',  'Filial Rio de Janeiro',  'Varejo',     'Rio de Janeiro',  'RJ', 36_000, 540, 2001),
  mkBranch('6',  'Filial Niterói',         'Serviços',   'Niterói',         'RJ', 17_000, 204, 2006),
  // MG — 2 filiais — R$ 43 M
  mkBranch('7',  'Filial Belo Horizonte',  'Varejo',     'Belo Horizonte',  'MG', 29_000, 435, 2004),
  mkBranch('8',  'Filial Uberlândia',      'Logística',  'Uberlândia',      'MG', 14_000, 280, 2007),
  // PR — 2 filiais — R$ 27 M
  mkBranch('9',  'Filial Curitiba',        'Tecnologia', 'Curitiba',        'PR', 18_000, 180, 2010),
  mkBranch('10', 'Filial Londrina',        'Serviços',   'Londrina',        'PR',  9_000, 108, 2012),
  // RS — 2 filiais — R$ 35 M
  mkBranch('11', 'Filial Porto Alegre',    'Atacado',    'Porto Alegre',    'RS', 23_000, 184, 2002),
  mkBranch('12', 'Filial Caxias do Sul',   'Logística',  'Caxias do Sul',   'RS', 12_000, 240, 2009),
  // DF — 1 filial — R$ 13 M
  mkBranch('13', 'Filial Brasília',        'Serviços',   'Brasília',        'DF', 13_000, 156, 2011),
]

// Backwards-compat alias — pages still referencing `companies` keep working
export const companies = branches

// ─── Listas de valores únicos ────────────────────────────────────────────────

export const BUSINESS_LINES = [...new Set(branches.map((b) => b.sector))].sort()
export const SECTORS        = BUSINESS_LINES  // backwards-compat alias

export const STATES  = [...new Set(branches.map((b) => b.state))].sort()
export const REGIONS = [...new Set(branches.map((b) => b.region))].sort()
export const CITIES  = [...new Set(branches.map((b) => b.city))].sort()
export const SIZES: Branch['size'][] = ['Pequena', 'Média', 'Grande']

// ─── Projeção temporal da reforma ────────────────────────────────────────────

const TRANSITION: Record<number, number> = {
  2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0,
  2026: 0.10, 2027: 0.20, 2028: 0.35, 2029: 0.50,
  2030: 0.65, 2031: 0.80, 2032: 0.90, 2033: 1.00,
}

export function getYearlyData(sectorFilter?: string): YearlyPoint[] {
  const filtered =
    sectorFilter && sectorFilter !== 'Todos'
      ? branches.filter((b) => b.sector === sectorFilter)
      : branches

  return Object.entries(TRANSITION).map(([yrStr, t]) => {
    const year = parseInt(yrStr)
    const g    = Math.pow(1 + GROWTH_RATE, year - 2025)

    const old_ = filtered.reduce((s, b) => s + b.totalTaxCurrent * g, 0)
    const new_ = filtered.reduce((s, b) => s + b.totalTaxReform  * g, 0)

    return {
      year,
      regimeAtual:   Math.round(old_),
      regimeReforma: Math.round(new_),
      transicao:     Math.round(old_ * (1 - t) + new_ * t),
    }
  })
}
