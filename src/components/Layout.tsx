import { useState } from 'react'
import { LogOut, BarChart3, Table2, FlaskConical, PieChart, MapPin, TrendingUp, Database } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import type { TabId } from '../types'
import DashboardPage    from '../pages/DashboardPage'
import PivotTablePage   from '../pages/PivotTablePage'
import ScenarioPage     from '../pages/ScenarioPage'
import SectorPage       from '../pages/SectorPage'
import RegionalPage     from '../pages/RegionalPage'
import TrendPage        from '../pages/TrendPage'
import RawDataPage      from '../pages/RawDataPage'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard',        icon: <BarChart3 size={15} /> },
  { id: 'pivot',     label: 'Tabela Dinâmica',  icon: <Table2 size={15} /> },
  { id: 'scenario',  label: 'Simulação',        icon: <FlaskConical size={15} /> },
  { id: 'sector',    label: 'Por Setor',        icon: <PieChart size={15} /> },
  { id: 'regional',  label: 'Regional',         icon: <MapPin size={15} /> },
  { id: 'trends',    label: 'Tendências',       icon: <TrendingUp size={15} /> },
  { id: 'rawdata',   label: 'Dados Brutos',     icon: <Database size={15} /> },
]

function renderPage(tab: TabId) {
  switch (tab) {
    case 'dashboard': return <DashboardPage />
    case 'pivot':     return <PivotTablePage />
    case 'scenario':  return <ScenarioPage />
    case 'sector':    return <SectorPage />
    case 'regional':  return <RegionalPage />
    case 'trends':    return <TrendPage />
    case 'rawdata':   return <RawDataPage />
  }
}

export default function Layout() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const { user, logout } = useAuthStore()

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

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              >
                <LogOut size={15} />
                <span>Sair</span>
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
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-6 py-6">
        {renderPage(activeTab)}
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100 bg-white">
        © 2025 Kliente 360 · Analitico KLA · Dados simulados para fins de demonstração
      </footer>
    </div>
  )
}
