import { beforeEach, describe, it, expect } from 'vitest'
import { useThemeStore } from '../store/themeStore'
import { PRESET_THEMES, DEFAULT_THEME_KEY } from '../theme'

beforeEach(() => {
  useThemeStore.setState({
    themeKey: DEFAULT_THEME_KEY,
    theme: PRESET_THEMES[DEFAULT_THEME_KEY],
    customTheme: null,
  })
  localStorage.clear()
})

describe('themeStore', () => {
  it('initialises with default theme', () => {
    const { themeKey, theme } = useThemeStore.getState()
    expect(themeKey).toBe(DEFAULT_THEME_KEY)
    expect(theme.primaryColor).toBe(PRESET_THEMES[DEFAULT_THEME_KEY].primaryColor)
  })

  it('setTheme switches to a valid preset', () => {
    const newKey = 'azul'
    useThemeStore.getState().setTheme(newKey)
    const { themeKey, theme, customTheme } = useThemeStore.getState()
    expect(themeKey).toBe(newKey)
    expect(theme.primaryColor).toBe(PRESET_THEMES.azul.primaryColor)
    expect(customTheme).toBeNull()
  })

  it('setTheme persists key to localStorage', () => {
    useThemeStore.getState().setTheme('roxo')
    expect(localStorage.getItem('analitico-theme')).toBe('roxo')
  })

  it('setTheme ignores unknown key and leaves state unchanged', () => {
    useThemeStore.getState().setTheme('nonexistent')
    expect(useThemeStore.getState().themeKey).toBe(DEFAULT_THEME_KEY)
  })

  it('setCustomTheme merges partial override and marks customTheme', () => {
    useThemeStore.getState().setCustomTheme({ primaryColor: '#ff0000' })
    const { theme, customTheme } = useThemeStore.getState()
    expect(theme.primaryColor).toBe('#ff0000')
    expect(customTheme).not.toBeNull()
    expect(customTheme?.primaryColor).toBe('#ff0000')
  })

  it('setCustomTheme preserves other fields from current theme', () => {
    useThemeStore.getState().setCustomTheme({ primaryColor: '#abc123' })
    const { theme } = useThemeStore.getState()
    expect(theme.brandName).toBe(PRESET_THEMES[DEFAULT_THEME_KEY].brandName)
  })

  it('toggleDarkMode switches darkMode from false to true', () => {
    useThemeStore.setState({ darkMode: false })
    useThemeStore.getState().toggleDarkMode()
    expect(useThemeStore.getState().darkMode).toBe(true)
    expect(localStorage.getItem('analitico-dark')).toBe('true')
  })

  it('toggleDarkMode switches darkMode from true to false', () => {
    useThemeStore.setState({ darkMode: true })
    useThemeStore.getState().toggleDarkMode()
    expect(useThemeStore.getState().darkMode).toBe(false)
    expect(localStorage.getItem('analitico-dark')).toBe('false')
  })

  it('toggleDarkMode sets data-theme attribute on documentElement', () => {
    useThemeStore.setState({ darkMode: false })
    useThemeStore.getState().toggleDarkMode()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    useThemeStore.getState().toggleDarkMode()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
