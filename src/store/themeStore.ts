import { create } from 'zustand'
import { PRESET_THEMES, DEFAULT_THEME_KEY, type BrandTheme } from '../theme'

interface ThemeState {
  themeKey:    string
  theme:       BrandTheme
  customTheme: BrandTheme | null
  darkMode:    boolean
  setTheme:       (key: string)           => void
  setCustomTheme: (t: Partial<BrandTheme>) => void
  toggleDarkMode: ()                       => void
}

function loadSaved(): string {
  try { return localStorage.getItem('analitico-theme') ?? DEFAULT_THEME_KEY } catch (_e) { return DEFAULT_THEME_KEY }
}

function loadDark(): boolean {
  try { return localStorage.getItem('analitico-dark') === 'true' } catch (_e) { return false }
}

function applyDark(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

const savedKey = loadSaved()

export const useThemeStore = create<ThemeState>((set) => ({
  themeKey:    savedKey,
  theme:       PRESET_THEMES[savedKey] ?? PRESET_THEMES[DEFAULT_THEME_KEY],
  customTheme: null,
  darkMode:    loadDark(),

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

  toggleDarkMode: () => set((s) => {
    const next = !s.darkMode
    try { localStorage.setItem('analitico-dark', String(next)) } catch (_e) { /* storage unavailable */ }
    applyDark(next)
    return { darkMode: next }
  }),
}))
