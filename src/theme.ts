export interface BrandTheme {
  name: string
  primaryColor: string
  primaryDark: string
  primaryLight: string
  logoText: string
  brandName: string
  brandSubtitle: string
}

export const PRESET_THEMES: Record<string, BrandTheme> = {
  'kliente360': {
    name: 'Kliente 360 (padrão)',
    primaryColor: '#009900',
    primaryDark:  '#007700',
    primaryLight: '#f0fff0',
    logoText:     'K',
    brandName:    'Analitico KLA',
    brandSubtitle: 'Analytics & Reforma Tributária',
  },
  'azul': {
    name: 'Corporativo Azul',
    primaryColor: '#0066cc',
    primaryDark:  '#0044aa',
    primaryLight: '#f0f8ff',
    logoText:     'A',
    brandName:    'Tax Analytics',
    brandSubtitle: 'Análise Tributária Avançada',
  },
  'roxo': {
    name: 'Premium Roxo',
    primaryColor: '#7c3aed',
    primaryDark:  '#6d28d9',
    primaryLight: '#f5f3ff',
    logoText:     'T',
    brandName:    'TaxPro Analytics',
    brandSubtitle: 'Inteligência Fiscal',
  },
  'laranja': {
    name: 'Energia Laranja',
    primaryColor: '#ea580c',
    primaryDark:  '#c2410c',
    primaryLight: '#fff7ed',
    logoText:     'F',
    brandName:    'Fiscal Pro',
    brandSubtitle: 'Gestão Tributária',
  },
}

export const DEFAULT_THEME_KEY = 'kliente360'
