import { lazy, Suspense, useState } from 'react'
import { LogOut, BarChart3, Table2, FlaskConical, PieChart, MapPin, TrendingUp, Database, Loader2, Printer } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { ErrorBoundary } from './ErrorBoundary'
import type { TabId } from '../types'

// Code-split: cada aba é carregada sob demanda
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

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard',       icon: <BarChart3 size={15} /> },
  { id: 'pivot',     label: 'Tabela Dinâmica', icon: <Table2 size={15} /> },
  { id: 'scenario',  label: 'Simulação',       icon: <FlaskConical size={15} /> },
  { id: 'sector',    label: 'Por Setor',       icon: <PieChart size={15} /> },
  { id: 'regional',  label: 'Regional',        icon: <MapPin size={15} /> },
  { id: 'trends',    label: 'Tendências',      icon: <TrendingUp size={15} /> },
  { id: 'rawdata',   label: 'Dados Brutos',    icon: <Database size={15} /> },
]

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px] text-primary-700">
      <Loader2 size={32} className="animate-spin" />
    </div>
  )
}

export default function Layout() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const { user, logout } = useAuthStore()
  const Page = PAGES[activeTab]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base leading-none">K</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-gray-900 text-base">Analitico KLA</span>
                <span className="text-gray-400 text-xs">by Kliente 360 · Analytics &amp; Reforma Tributária</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={() => window.print()}
                title="Exportar / Imprimir"
                className="print:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              >
                <Printer size={15} />
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button
                onClick={logout}
                className="print:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="flex gap-0 -mb-px overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Page />
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100 bg-white">
        © 2025 Kliente 360 · Analitico KLA · Dados simulados para fins de demonstração
      </footer>
    </div>
  )
}
