import { lazy, Suspense, useState, useEffect } from 'react'
import {
  BarChart3, Table2, FlaskConical, PieChart, MapPin, TrendingUp, Database,
  Loader2, LogOut, ChevronLeft, ChevronRight, Download, Moon, Sun, Bell,
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

const NAV_ITEMS: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', label: 'Visão Executiva',          icon: <BarChart3    size={16} strokeWidth={1.5} /> },
  { id: 'pivot',     label: 'Análise Multidimensional', icon: <Table2       size={16} strokeWidth={1.5} /> },
  { id: 'scenario',  label: 'Simulação de Cenários',    icon: <FlaskConical size={16} strokeWidth={1.5} />, badge: 'novo' },
  { id: 'sector',    label: 'Linha de Negócio',         icon: <PieChart     size={16} strokeWidth={1.5} /> },
  { id: 'regional',  label: 'Por Filial / UF',          icon: <MapPin       size={16} strokeWidth={1.5} /> },
  { id: 'trends',    label: 'Tendência 2026–2033',      icon: <TrendingUp   size={16} strokeWidth={1.5} /> },
  { id: 'rawdata',   label: 'Dados Brutos',             icon: <Database     size={16} strokeWidth={1.5} /> },
]

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

export default function Layout() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout }             = useAuthStore()
  const { darkMode, toggleDarkMode } = useThemeStore()
  const Page = PAGES[activeTab]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-screen bg-ink-50 flex">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`
        flex-shrink-0 h-screen sticky top-0 flex flex-col
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
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
              Análise
            </p>
          )}
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
            <p className="text-[11px] text-primary-600 leading-snug">
              Fale com um consultor Kliente 360.
            </p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="flex items-center justify-center h-9 border-t border-ink-100 text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-14 flex items-center gap-3 px-4 bg-paper border-b border-ink-200 sticky top-0 z-30 print:hidden">
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

          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
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

        {/* Page */}
        <main className="flex-1 px-4 sm:px-6 py-5 sm:py-6 min-w-0">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Page />
            </Suspense>
          </ErrorBoundary>
        </main>

        <footer className="text-center text-[11px] text-ink-300 py-3 border-t border-ink-100 bg-paper print:hidden">
          © 2025 Kliente 360 · Analítico KLA · Dados simulados para fins de demonstração
        </footer>
      </div>
    </div>
  )
}
