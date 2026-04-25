import { create } from 'zustand'
import { PRESET_THEMES, DEFAULT_THEME_KEY, type BrandTheme } from '../theme'

interface ThemeState {
  themeKey: string
  theme: BrandTheme
  setTheme: (key: string) => void
  customTheme: BrandTheme | null
  setCustomTheme: (t: Partial<BrandTheme>) => void
}

function loadSaved(): string {
  try { return localStorage.getItem('analitico-theme') ?? DEFAULT_THEME_KEY } catch { return DEFAULT_THEME_KEY }
}

const savedKey = loadSaved()

export const useThemeStore = create<ThemeState>((set) => ({
  themeKey: savedKey,
  theme: PRESET_THEMES[savedKey] ?? PRESET_THEMES[DEFAULT_THEME_KEY],
  customTheme: null,

  setTheme: (key) => {
    const theme = PRESET_THEMES[key]
    if (!theme) return
    try { localStorage.setItem('analitico-theme', key) } catch (_e) { /* storage unavailable */ }
    set({ themeKey: key, theme, customTheme: null })
  },

  setCustomTheme: (partial) => set((s) => {
    const custom = { ...s.theme, ...partial, name: 'Personalizado' }
    return { customTheme: custom, theme: custom }
  }),
}))
