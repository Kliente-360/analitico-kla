import { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import {
  BarChart3, Table2, FlaskConical, PieChart, MapPin, TrendingUp, Database,
  Loader2, LogOut, ChevronLeft, ChevronRight, Download, Moon, Sun, Bell, Menu, X, Languages,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useNotificationStore } from '../store/notificationStore'
import { TENANT } from '../data/mockData'
import { ErrorBoundary } from './ErrorBoundary'
import type { TabId } from '../types'

const ExportPdfButton = lazy(() => import('./ExportPdfButton').then((m) => ({ default: m.ExportPdfButton })))

const DashboardPage  = lazy(() => import('../pages/DashboardPage'))
const PivotTablePage = lazy(() => import('../pages/PivotTablePage'))
const ScenarioPage   = lazy(() => import('../pages/ScenarioPage'))
const SectorPage     = lazy(() => import('../pages/SectorPage'))
const RegionalPage   = lazy(() => import('../pages/RegionalPage'))
const TrendPage      = lazy(() => import('../pages/TrendPage'))
const RawDataPage    = lazy(() => import('../pages/RawDataPage'))

const PAGES: Record<TabId, React.LazyExoticComponent<() => React.ReactElement>> = {
  dashboard: DashboardPage,
  pivot:     PivotTablePage,
  scenario:  ScenarioPage,
  sector:    SectorPage,
  regional:  RegionalPage,
  trends:    TrendPage,
  rawdata:   RawDataPage,
}

const NAV_IDS: { id: TabId; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', icon: <BarChart3    size={16} strokeWidth={1.5} /> },
  { id: 'pivot',     icon: <Table2       size={16} strokeWidth={1.5} /> },
  { id: 'scenario',  icon: <FlaskConical size={16} strokeWidth={1.5} />, badge: 'novo' },
  { id: 'sector',    icon: <PieChart     size={16} strokeWidth={1.5} /> },
  { id: 'regional',  icon: <MapPin       size={16} strokeWidth={1.5} /> },
  { id: 'trends',    icon: <TrendingUp   size={16} strokeWidth={1.5} /> },
  { id: 'rawdata',   icon: <Database     size={16} strokeWidth={1.5} /> },
]

// 4 items shown in the mobile bottom tab bar
const BOTTOM_TAB_IDS: TabId[] = ['dashboard', 'scenario', 'sector', 'rawdata']

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px] text-primary-700">
      <Loader2 size={32} className="animate-spin" />
    </div>
  )
}

function NotificationDot() {
  const notifications = useNotificationStore((s) => s.notifications)
  const unread        = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (notifications.length === 0) {
      useNotificationStore.getState().addNotification({
        type:  'warning',
        title: 'Atenção · Filial DF',
        body:  'ISS representa 50% da carga tributária. Verifique oportunidades de crédito.',
      })
    }
  }, [notifications.length])

  return (
    <button aria-label="Notificações" className="btn-ghost p-2 relative">
      <Bell size={16} />
      {unread > 0 && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-accent-up rounded-full" />
      )}
    </button>
  )
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLElement>(null)
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!active || e.key !== 'Tab') return
    const el = ref.current
    if (!el) return
    const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (nodes.length === 0) return
    const first = nodes[0], last = nodes[nodes.length - 1]
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus() } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus() } }
  }, [active])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return ref
}

function LangToggle() {
  const { t } = useTranslation()
  const [, forceUpdate] = useState(0)
  function toggle() {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
    forceUpdate((n) => n + 1)
  }
  return (
    <button onClick={toggle} aria-label="Switch language" title={t('lang_switch')} className="btn-ghost p-2 hidden sm:flex items-center gap-1">
      <Languages size={15} />
      <span className="text-xs hidden lg:inline">{t('lang_switch')}</span>
    </button>
  )
}

export default function Layout() {
  const [activeTab,    setActiveTab]    = useState<TabId>('dashboard')
  const [collapsed,    setCollapsed]    = useState(false)
  const [mobileMenuOpen, setMobileMenu] = useState(false)
  const { user, logout }               = useAuthStore()
  const { darkMode, toggleDarkMode }   = useThemeStore()
  const { t } = useTranslation()
  const Page = PAGES[activeTab]
  const mobileNavRef = useFocusTrap(mobileMenuOpen) as React.RefObject<HTMLElement>

  const NAV_ITEMS = NAV_IDS.map((n) => ({
    ...n,
    label:      t(`nav.${n.id}`),
    shortLabel: t(`nav_short.${n.id}`),
  }))
  const BOTTOM_TAB_ITEMS = NAV_ITEMS.filter((n) => BOTTOM_TAB_IDS.includes(n.id))

  // Auto-collapse sidebar on tablet (640–1024px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px) and (max-width: 1023px)')
    const apply = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setCollapsed(true)
    }
    apply(mq)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Focus first item when mobile menu opens; restore on close
  const lastFocusRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (mobileMenuOpen) {
      lastFocusRef.current = document.activeElement as HTMLElement
      const first = mobileNavRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      first?.focus()
    } else {
      lastFocusRef.current?.focus()
    }
  }, [mobileMenuOpen, mobileNavRef])

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && mobileMenuOpen) setMobileMenu(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  // Close mobile menu on tab change
  function navigate(id: TabId) {
    setActiveTab(id)
    setMobileMenu(false)
  }

  return (
    <div className="min-h-screen bg-ink-50 flex">

      {/* ── Skip-to-content ──────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-700 focus:text-white focus:rounded focus:text-sm focus:font-medium"
      >
        {t('skip_link')}
      </a>

      {/* ── Mobile overlay menu ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/50 sm:hidden fade-in"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <aside
        ref={mobileNavRef as React.RefObject<HTMLElement>}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-paper border-r border-ink-200
          flex flex-col transition-transform duration-200
          sm:hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-ink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">Analítico KLA</p>
              <p className="text-[10px] text-ink-400">by Kliente 360</p>
            </div>
          </div>
          <button onClick={() => setMobileMenu(false)} aria-label="Fechar menu" className="btn-ghost p-1">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">Análise</p>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors
                  ${isActive
                    ? 'bg-primary-100 text-primary-700 font-semibold border-l-[3px] border-primary-700 pl-[9px]'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] font-semibold bg-amber-50 text-accent-warn px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
        <div className="mx-2 mb-3 p-3 rounded-lg bg-primary-100 border border-primary-200">
          <p className="text-xs font-semibold text-primary-700 mb-1">Dúvidas tributárias?</p>
          <p className="text-[11px] text-primary-600 leading-snug">Fale com um consultor Kliente 360.</p>
        </div>
      </aside>

      {/* ── Desktop/Tablet Sidebar ────────────────────────────────────────── */}
      <aside className={`
        hidden sm:flex flex-shrink-0 h-screen sticky top-0 flex-col
        bg-paper border-r border-ink-200 transition-all duration-200 print:hidden
        ${collapsed ? 'w-14' : 'w-56'}
      `}>
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-3 py-4 border-b border-ink-100 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm leading-none">K</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900 leading-tight">Analítico KLA</p>
              <p className="text-[10px] text-ink-400 leading-tight">by Kliente 360</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">Análise</p>
          )}
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-primary-100 text-primary-700 font-semibold border-l-[3px] border-primary-700 pl-[9px]'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-[10px] font-semibold bg-amber-50 text-accent-warn px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom CTA */}
        {!collapsed && (
          <div className="mx-2 mb-3 p-3 rounded-lg bg-primary-100 border border-primary-200">
            <p className="text-xs font-semibold text-primary-700 mb-1">Dúvidas tributárias?</p>
            <p className="text-[11px] text-primary-600 leading-snug">Fale com um consultor Kliente 360.</p>
          </div>
        )}

        {/* Collapse toggle — hidden on tablet (auto-collapsed, no toggle) */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="hidden lg:flex items-center justify-center h-9 border-t border-ink-100 text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-14 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 bg-paper border-b border-ink-200 sticky top-0 z-30 print:hidden">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileMenu(true)}
            aria-label="Abrir menu"
            className="sm:hidden btn-ghost p-2 -ml-1"
          >
            <Menu size={18} />
          </button>

          {/* Tenant identity */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">{TENANT.initials}</span>
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-semibold text-ink-900 leading-tight truncate">{TENANT.name}</p>
              <p className="text-[10px] text-ink-400 leading-tight font-mono">
                {TENANT.cnpj} · {TENANT.fiscalYear}
              </p>
            </div>
          </div>

          {/* Period pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-ink-200 bg-ink-50 text-xs">
            <span className="text-ink-400">Período:</span>
            <span className="font-semibold text-ink-700">{TENANT.fiscalYear}</span>
          </div>

          <div className="flex-1" />

          <NotificationDot />

          <LangToggle />

          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? t('topbar.light_mode') : t('topbar.dark_mode')}
            className="btn-ghost p-2"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Suspense fallback={null}>
            <ExportPdfButton />
          </Suspense>

          <button
            onClick={() => window.print()}
            title="Exportar / Imprimir"
            className="btn-ghost hidden sm:flex items-center gap-1.5"
          >
            <Download size={15} />
            <span className="text-xs hidden md:inline">Exportar</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-ink-100">
            <div className="w-7 h-7 rounded-full bg-ink-200 flex items-center justify-center">
              <span className="text-xs font-semibold text-ink-600">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <button onClick={logout} aria-label="Sair" title="Sair" className="btn-ghost p-1.5">
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Page — key forces remount + page-enter animation on tab change */}
        <main id="main-content" className="flex-1 px-3 sm:px-6 py-4 sm:py-6 min-w-0 pb-20 sm:pb-6">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <div key={activeTab} className="page-enter">
                <Page />
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>

        <footer className="hidden sm:block text-center text-[11px] text-ink-300 py-3 border-t border-ink-100 bg-paper print:hidden">
          © 2025 Kliente 360 · Analítico KLA · Dados simulados para fins de demonstração
        </footer>
      </div>

      {/* ── Mobile bottom tab bar ─────────────────────────────────────────── */}
      <nav
        aria-label="Navegação mobile"
        className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-paper border-t border-ink-200 flex print:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {BOTTOM_TAB_ITEMS.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium
                transition-colors
                ${isActive ? 'text-primary-700' : 'text-ink-400'}
              `}
            >
              <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span>{item.shortLabel}</span>
              {item.badge && isActive && (
                <span className="absolute top-1.5 right-1/4 w-1.5 h-1.5 bg-accent-warn rounded-full" />
              )}
            </button>
          )
        })}
        {/* "Mais" button opens the mobile overlay menu */}
        <button
          onClick={() => setMobileMenu(true)}
          aria-label="Mais páginas"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium text-ink-400"
        >
          <Menu size={16} strokeWidth={1.5} />
          <span>Mais</span>
        </button>
      </nav>
    </div>
  )
}
