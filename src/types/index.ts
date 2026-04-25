// Represents a physical branch (filial) of the tenant company
export interface Branch {
  id: string
  name: string
  sector: string      // linha de negócio (Varejo, Tecnologia, Logística, Atacado, Serviços)
  city?: string       // cidade da filial
  state: string       // UF
  region: string      // macro-região
  size: 'Pequena' | 'Média' | 'Grande'
  revenue: number     // R$ mil
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

// Backwards-compat alias — will be removed after Sprint 2–3 page rewrites
export type Company = Branch

// The single tenant (empresa logada)
export interface Tenant {
  id: string
  name: string
  cnpj: string
  fiscalYear: string
  initials: string
}

export type TabId =
  | 'dashboard'
  | 'pivot'
  | 'scenario'
  | 'sector'
  | 'regional'
  | 'trends'
  | 'rawdata'

export type DimensionKey = 'sector' | 'state' | 'region' | 'size' | 'decade' | 'city'

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
