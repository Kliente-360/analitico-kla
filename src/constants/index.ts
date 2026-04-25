// Limites de porte por receita (R$ mil)
export const SIZE_THRESHOLDS = {
  SMALL:  30_000,
  MEDIUM: 300_000,
} as const

// Crescimento anual estimado para projeções
export const GROWTH_RATE = 0.05

// Setores que pagam ISS (regime de serviços) em vez de ICMS
export const SERVICE_SECTORS = [
  'Tecnologia',
  'Serviços',
  'Saúde',
  'Financeiro',
  'Construção Civil',
]

// Paleta geral de gráficos
export const CHART_COLORS = [
  '#009900', '#0066cc', '#ff6b35', '#8b5cf6',
  '#ef4444', '#f59e0b', '#06b6d4', '#ec4899',
  '#10b981', '#6366f1',
]

// Cor por setor (consistente em todas as páginas)
export const SECTOR_COLORS: Record<string, string> = {
  'Tecnologia':       '#009900',
  'Varejo':           '#0066cc',
  'Indústria':        '#ff6b35',
  'Agronegócio':      '#8b5cf6',
  'Saúde':            '#ef4444',
  'Construção Civil': '#f59e0b',
  'Financeiro':       '#06b6d4',
  'Telecomunicações': '#ec4899',
  'Energia':          '#10b981',
  'Serviços':         '#6366f1',
}

// Cor por região
export const REGION_COLORS: Record<string, string> = {
  'Sudeste':      '#009900',
  'Sul':          '#0066cc',
  'Nordeste':     '#f59e0b',
  'Centro-Oeste': '#8b5cf6',
  'Norte':        '#06b6d4',
}
