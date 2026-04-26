// Limites de porte por receita (R$ mil) — calibrado para filiais de um grupo
export const SIZE_THRESHOLDS = {
  SMALL:  20_000,   // < R$ 20M → Pequena
  MEDIUM: 50_000,   // < R$ 50M → Média; ≥ R$ 50M → Grande
} as const

// Crescimento anual estimado para projeções
export const GROWTH_RATE = 0.05

// Linhas de negócio que operam em regime de serviços (ISS → IBS-Serviços)
export const SERVICE_BUSINESS_LINES = [
  'Tecnologia',
  'Serviços',
  'Saúde',
  'Financeiro',
  'Construção Civil',
]
// Backwards-compat alias
export const SERVICE_SECTORS = SERVICE_BUSINESS_LINES

// Paleta geral de gráficos — alinhada ao novo brand azul Kliente 360
export const CHART_COLORS = [
  '#0b3d8c', '#1f7a5a', '#b87514', '#d04a3b',
  '#6e9bdb', '#0f4cab', '#5a6779', '#0a3275',
  '#2c3848', '#8390a3',
]

// Cor por linha de negócio (consistente em todas as páginas)
export const BUSINESS_LINE_COLORS: Record<string, string> = {
  'Varejo':           '#0b3d8c',
  'Tecnologia':       '#1f7a5a',
  'Logística':        '#b87514',
  'Atacado':          '#0f4cab',
  'Serviços':         '#d04a3b',
  // legado — mantido para compatibilidade com páginas ainda não reescritas
  'Indústria':        '#6e9bdb',
  'Agronegócio':      '#5a6779',
  'Saúde':            '#2c3848',
  'Construção Civil': '#8390a3',
  'Financeiro':       '#0a3275',
  'Telecomunicações': '#b3bccb',
  'Energia':          '#3a4a66',
}
// Backwards-compat alias
export const SECTOR_COLORS = BUSINESS_LINE_COLORS

// Cor por região
export const REGION_COLORS: Record<string, string> = {
  'Sudeste':      '#0b3d8c',
  'Sul':          '#1f7a5a',
  'Nordeste':     '#b87514',
  'Centro-Oeste': '#d04a3b',
  'Norte':        '#6e9bdb',
}
