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

// Paleta geral de gráficos — vermelho institucional + neutros quentes
export const CHART_COLORS = [
  '#e30613', '#1f7a5a', '#b87514', '#5a6779',
  '#c0392b', '#2c3848', '#6e7e98', '#8390a3',
  '#4a7c8e', '#d04a3b',
]

// Cor por linha de negócio — vermelho como segmento principal, neutros e acentos para os demais
export const BUSINESS_LINE_COLORS: Record<string, string> = {
  'Varejo':           '#e30613',  // brand red — segmento de bens (principal)
  'Tecnologia':       '#1f7a5a',  // verde (accent-down)
  'Logística':        '#b87514',  // âmbar (accent-warn)
  'Atacado':          '#5a6779',  // neutro ink-500
  'Serviços':         '#c0392b',  // terracota
  'Indústria':        '#2c3848',  // neutro escuro
  'Agronegócio':      '#6e7e98',  // neutro médio
  'Saúde':            '#4a7c8e',  // azul-petróleo
  'Construção Civil': '#8390a3',  // neutro claro
  'Financeiro':       '#d04a3b',  // terroso (accent-up)
  'Telecomunicações': '#3a4a5e',  // neutro azulado
  'Energia':          '#2c3848',  // neutro escuro
}
// Backwards-compat alias
export const SECTOR_COLORS = BUSINESS_LINE_COLORS

// Cor por região — vermelho para maior região (Sudeste), acentos para demais
export const REGION_COLORS: Record<string, string> = {
  'Sudeste':      '#e30613',  // brand red — maior região
  'Sul':          '#1f7a5a',
  'Nordeste':     '#b87514',
  'Centro-Oeste': '#c0392b',
  'Norte':        '#5a6779',
}
