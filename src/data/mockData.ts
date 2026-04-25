import type { Company, YearlyPoint } from '../types'
import { SIZE_THRESHOLDS, GROWTH_RATE } from '../constants'

export const STATE_REGION: Record<string, string> = {
  SP: 'Sudeste', RJ: 'Sudeste', MG: 'Sudeste', ES: 'Sudeste',
  RS: 'Sul',     PR: 'Sul',     SC: 'Sul',
  BA: 'Nordeste', CE: 'Nordeste', PE: 'Nordeste', MA: 'Nordeste',
  GO: 'Centro-Oeste', DF: 'Centro-Oeste', MT: 'Centro-Oeste', MS: 'Centro-Oeste',
  AM: 'Norte',   PA: 'Norte',   RO: 'Norte',
}

interface Rates {
  irpj: number; csll: number; pis: number; cofins: number
  iss:  number; icms: number
  cbs:  number; ibs:  number; is_rate: number
}

// Alíquotas efetivas médias por setor — regime atual e pós-reforma
const SECTOR_RATES: Record<string, Rates> = {
  'Tecnologia':       { irpj:.025, csll:.010, pis:.0165, cofins:.0760, iss:.030, icms:.000, cbs:.088, ibs:.035, is_rate:0 },
  'Varejo':           { irpj:.020, csll:.009, pis:.0165, cofins:.0760, iss:.000, icms:.150, cbs:.088, ibs:.130, is_rate:0 },
  'Indústria':        { irpj:.020, csll:.009, pis:.0165, cofins:.0760, iss:.000, icms:.110, cbs:.088, ibs:.095, is_rate:0 },
  'Agronegócio':      { irpj:.015, csll:.007, pis:.0065, cofins:.0300, iss:.000, icms:.070, cbs:.020, ibs:.030, is_rate:0 },
  'Saúde':            { irpj:.020, csll:.009, pis:.0065, cofins:.0300, iss:.035, icms:.000, cbs:.044, ibs:.040, is_rate:0 },
  'Construção Civil': { irpj:.020, csll:.009, pis:.0165, cofins:.0760, iss:.040, icms:.000, cbs:.088, ibs:.048, is_rate:0 },
  'Financeiro':       { irpj:.030, csll:.015, pis:.0065, cofins:.0400, iss:.020, icms:.000, cbs:.050, ibs:.022, is_rate:0 },
  'Telecomunicações': { irpj:.020, csll:.009, pis:.0165, cofins:.0760, iss:.000, icms:.250, cbs:.088, ibs:.200, is_rate:0 },
  'Energia':          { irpj:.020, csll:.009, pis:.0165, cofins:.0760, iss:.000, icms:.200, cbs:.088, ibs:.170, is_rate:0 },
  'Serviços':         { irpj:.025, csll:.010, pis:.0165, cofins:.0760, iss:.050, icms:.000, cbs:.088, ibs:.058, is_rate:0 },
}

function mk(
  id: string, name: string, sector: string, state: string,
  revenue: number, employees: number, founded: number,
): Company {
  const r      = SECTOR_RATES[sector]
  const region = STATE_REGION[state]
  const size: Company['size'] =
    revenue < SIZE_THRESHOLDS.SMALL  ? 'Pequena' :
    revenue < SIZE_THRESHOLDS.MEDIUM ? 'Média'   : 'Grande'

  const irpj   = Math.round(revenue * r.irpj)
  const csll   = Math.round(revenue * r.csll)
  const pis    = Math.round(revenue * r.pis)
  const cofins = Math.round(revenue * r.cofins)
  const iss    = Math.round(revenue * r.iss)
  const icms   = Math.round(revenue * r.icms)
  const totalTaxCurrent    = irpj + csll + pis + cofins + iss + icms
  const effectiveRateCurrent = (totalTaxCurrent / revenue) * 100

  const cbs    = Math.round(revenue * r.cbs)
  const ibs    = Math.round(revenue * r.ibs)
  const isTax  = Math.round(revenue * r.is_rate)
  const totalTaxReform     = irpj + csll + cbs + ibs + isTax
  const effectiveRateReform = (totalTaxReform / revenue) * 100
  const taxDelta        = totalTaxReform - totalTaxCurrent
  const taxDeltaPercent = (taxDelta / totalTaxCurrent) * 100

  return {
    id, name, sector, state, region, size,
    revenue, employees, founded,
    irpj, csll, pis, cofins, iss, icms, totalTaxCurrent, effectiveRateCurrent,
    cbs, ibs, isTax, totalTaxReform, effectiveRateReform, taxDelta, taxDeltaPercent,
  }
}

export const companies: Company[] = [
  mk('1',  'TechBrasil Soluções',    'Tecnologia',       'SP', 45_000,    320,  2008),
  mk('2',  'E-Commerce Nacional',    'Varejo',           'SP', 1_250_000, 6200, 2010),
  mk('3',  'Aço Forte Industrial',   'Indústria',        'MG', 380_000,   2800, 1992),
  mk('4',  'Agro Cerrado S.A.',      'Agronegócio',      'GO', 580_000,   280,  1985),
  mk('5',  'HealthCare Plus',        'Saúde',            'RJ', 95_000,    720,  2002),
  mk('6',  'Construtora Meridional', 'Construção Civil', 'RS', 175_000,   1200, 1998),
  mk('7',  'FinTech Capital',        'Financeiro',       'SP', 820_000,   3200, 2012),
  mk('8',  'Telecom Fiber Sul',      'Telecomunicações', 'PR', 620_000,   2100, 1999),
  mk('9',  'Solar Energia BR',       'Energia',          'BA', 340_000,   680,  2005),
  mk('10', 'Serviços Express',       'Serviços',         'CE', 28_000,    210,  2015),
  mk('11', 'DataSoft Analytics',     'Tecnologia',       'SC', 82_000,    540,  2016),
  mk('12', 'Supermercados Bom Dia',  'Varejo',           'PR', 420_000,   3800, 1978),
  mk('13', 'Celulose Verde',         'Indústria',        'BA', 920_000,   2200, 1975),
  mk('14', 'Soja do Planalto',       'Agronegócio',      'GO', 450_000,   180,  1982),
  mk('15', 'Hospital São Lucas',     'Saúde',            'PE', 42_000,    380,  1989),
  mk('16', 'Mega Obras RJ',          'Construção Civil', 'RJ', 210_000,   1450, 2000),
  mk('17', 'Banco Digital BR',       'Financeiro',       'SP', 2_800_000, 8500, 2018),
  mk('18', 'Via Cable Internet',     'Telecomunicações', 'MG', 380_000,   1800, 2000),
  mk('19', 'Hidrelétrica Nacional',  'Energia',          'MG', 750_000,   920,  1970),
  mk('20', 'RH Especializado',       'Serviços',         'SP', 45_000,    380,  2003),
  mk('21', 'Cloud Solutions BR',     'Tecnologia',       'SP', 155_000,   980,  2014),
  mk('22', 'Farmácias Total',        'Varejo',           'RS', 320_000,   2100, 1990),
  mk('23', 'Papel e Papelão Ind',    'Indústria',        'SP', 240_000,   1100, 1988),
  mk('24', 'Horticultura Orgânica',  'Agronegócio',      'SC', 22_000,    95,   2010),
  mk('25', 'Centro Médico Elite',    'Saúde',            'SP', 180_000,   890,  1995),
  mk('26', 'Smart Building Co',      'Construção Civil', 'SP', 95_000,    620,  2007),
  mk('27', 'Crédito Rápido S.A.',    'Financeiro',       'SP', 520_000,   3200, 2008),
  mk('28', 'Internet Total',         'Telecomunicações', 'SP', 890_000,   4100, 1998),
  mk('29', 'Eólica Nordeste',        'Energia',          'CE', 145_000,   420,  2006),
  mk('30', 'Consultoria Premium',    'Serviços',         'DF', 85_000,    650,  2001),
  mk('31', 'Startup AI Hub',         'Tecnologia',       'SP', 18_000,    120,  2021),
  mk('32', 'Rede Atacado Nacional',  'Varejo',           'SP', 680_000,   3500, 1985),
  mk('33', 'Metalúrgica Sul',        'Indústria',        'RS', 88_000,    560,  1979),
  mk('34', 'Agropecuária Norte',     'Agronegócio',      'AM', 125_000,   85,   2000),
  mk('35', 'Clínica Saúde Família',  'Saúde',            'MG', 15_000,    120,  2005),
]

// Cronograma de transição da reforma (proporção do novo regime, 0 → 1)
const TRANSITION: Record<number, number> = {
  2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0,
  2026: 0.10, 2027: 0.20, 2028: 0.35, 2029: 0.50,
  2030: 0.65, 2031: 0.80, 2032: 0.90, 2033: 1.00,
}

export function getYearlyData(sectorFilter?: string): YearlyPoint[] {
  const filtered =
    sectorFilter && sectorFilter !== 'Todos'
      ? companies.filter((c) => c.sector === sectorFilter)
      : companies

  return Object.entries(TRANSITION).map(([yrStr, t]) => {
    const year = parseInt(yrStr)
    const g    = Math.pow(1 + GROWTH_RATE, year - 2025)

    const old_ = filtered.reduce((s, c) => s + c.totalTaxCurrent * g, 0)
    const new_ = filtered.reduce((s, c) => s + c.totalTaxReform  * g, 0)

    return {
      year,
      regimeAtual:   Math.round(old_),
      regimeReforma: Math.round(new_),
      transicao:     Math.round(old_ * (1 - t) + new_ * t),
    }
  })
}

export const SECTORS = [...new Set(companies.map((c) => c.sector))].sort()
export const STATES  = [...new Set(companies.map((c) => c.state))].sort()
export const REGIONS = [...new Set(companies.map((c) => c.region))].sort()
export const SIZES: Company['size'][] = ['Pequena', 'Média', 'Grande']
