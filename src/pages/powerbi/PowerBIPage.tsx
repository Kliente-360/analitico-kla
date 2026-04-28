import { useState } from 'react'
import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

const PBIPage1Geral    = lazy(() => import('./PBIPage1Geral'))
const PBIPage2Carga    = lazy(() => import('./PBIPage2Carga'))
const PBIPage3Tributos = lazy(() => import('./PBIPage3Tributos'))
const PBIPage4ProdEnt  = lazy(() => import('./PBIPage4ProdEnt'))
const PBIPage5ProdSai  = lazy(() => import('./PBIPage5ProdSai'))
const PBIPage6DRE      = lazy(() => import('./PBIPage6DRE'))
const PBIPage7Preco    = lazy(() => import('./PBIPage7Preco'))
const PBIPage8Sim      = lazy(() => import('./PBIPage8Sim'))

type PBITabId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const SUB_TABS: { id: PBITabId; label: string }[] = [
  { id: 1, label: 'Geral' },
  { id: 2, label: 'Carga Efetiva' },
  { id: 3, label: 'Tributos' },
  { id: 4, label: 'Produto (Entradas)' },
  { id: 5, label: 'Produtos Saídas' },
  { id: 6, label: 'Resultado do Exercício' },
  { id: 7, label: 'Mantendo Preço de Venda' },
  { id: 8, label: 'Simulador' },
]

const PAGE_MAP: Record<PBITabId, React.LazyExoticComponent<() => React.ReactElement>> = {
  1: PBIPage1Geral,
  2: PBIPage2Carga,
  3: PBIPage3Tributos,
  4: PBIPage4ProdEnt,
  5: PBIPage5ProdSai,
  6: PBIPage6DRE,
  7: PBIPage7Preco,
  8: PBIPage8Sim,
}

function SubPageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px] text-primary-700">
      <Loader2 size={28} className="animate-spin" />
    </div>
  )
}

export default function PowerBIPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<PBITabId>(1)
  const Page = PAGE_MAP[activeTab]

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-0 sm:px-6">
        <h1 className="text-base font-bold text-ink-900 mb-1">
          Reforma Tributária — Análise Comparativa
        </h1>
        <p className="text-xs text-ink-400 mb-3">
          Comparativo regime atual (2024) vs. reforma (2027–2033) · ICMS / PIS·COFINS / ISS → IBS / CBS
        </p>

        {/* Sub-tab navigation */}
        <div className="flex gap-0.5 overflow-x-auto pb-px border-b border-ink-200 scrollbar-none">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-shrink-0 px-3 py-2 text-xs font-medium rounded-t transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-primary-700 text-white'
                  : 'text-ink-500 hover:text-ink-800 hover:bg-ink-100'}
              `}
            >
              <span className="opacity-50 mr-1">{tab.id}.</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 p-4 sm:p-6">
        <Suspense fallback={<SubPageLoader />}>
          <Page />
        </Suspense>
      </div>
    </div>
  )
}
