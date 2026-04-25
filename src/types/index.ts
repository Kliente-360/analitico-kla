export interface Company {
  id: string
  name: string
  sector: string
  state: string
  region: string
  size: 'Pequena' | 'Média' | 'Grande'
  revenue: number       // R$ mil
  employees: number
  founded: number

  // Regime atual
  irpj: number
  csll: number
  pis: number
  cofins: number
  iss: number
  icms: number
  totalTaxCurrent: number
  effectiveRateCurrent: number  // %

  // Reforma tributária
  cbs: number           // substitui PIS + COFINS
  ibs: number           // substitui ICMS + ISS
  isTax: number         // Imposto Seletivo
  totalTaxReform: number
  effectiveRateReform: number   // %
  taxDelta: number              // diferença absoluta
  taxDeltaPercent: number       // variação %
}

export type TabId =
  | 'dashboard'
  | 'pivot'
  | 'scenario'
  | 'sector'
  | 'regional'
  | 'trends'
  | 'rawdata'

export type DimensionKey = 'sector' | 'state' | 'region' | 'size' | 'decade'

export type MetricKey =
  | 'revenue'
  | 'employees'
  | 'totalTaxCurrent'
  | 'totalTaxReform'
  | 'taxDelta'
  | 'taxDeltaPercent'
  | 'effectiveRateCurrent'
  | 'effectiveRateReform'
  | 'irpj'
  | 'csll'
  | 'pis'
  | 'cofins'
  | 'iss'
  | 'icms'
  | 'cbs'
  | 'ibs'

export interface YearlyPoint {
  year: number
  regimeAtual: number
  regimeReforma: number
  transicao: number
}
