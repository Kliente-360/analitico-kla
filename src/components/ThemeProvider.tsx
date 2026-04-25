import { useEffect, useState } from 'react'
import { Settings, Palette, X } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { PRESET_THEMES } from '../theme'

function applyTheme(theme: { primaryColor: string; primaryDark: string; primaryLight: string; logoText: string; brandName: string; brandSubtitle: string }) {
  const root = document.documentElement
  root.style.setProperty('--brand-primary-700', theme.primaryColor)
  root.style.setProperty('--brand-primary-800', theme.primaryDark)
  root.style.setProperty('--brand-primary-50',  theme.primaryLight)
  root.style.setProperty('--brand-logo-text',   `'${theme.logoText}'`)
  root.style.setProperty('--brand-name',         `'${theme.brandName}'`)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return <>{children}</>
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const { themeKey, setTheme, theme } = useThemeStore()

  return (
    <div className="relative print:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Personalizar tema"
        title="Personalizar tema"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
      >
        <Palette size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Settings size={13} />
              Personalizar Marca
            </span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
          <div className="p-3 space-y-1">
            <p className="text-xs text-gray-500 px-1 mb-2 font-semibold uppercase tracking-wide">Temas predefinidos</p>
            {Object.entries(PRESET_THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => { setTheme(key); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  themeKey === key ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-offset-1"
                  style={{ background: t.primaryColor }}
                />
                <span>
                  <p className="text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.brandName}</p>
                </span>
                {themeKey === key && (
                  <span className="ml-auto text-xs font-bold" style={{ color: theme.primaryColor }}>✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400 text-center">
              Tema aplicado em tempo real · Salvo automaticamente
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
