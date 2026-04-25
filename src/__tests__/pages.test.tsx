import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('../hooks/usePageReady', () => ({ usePageReady: () => true }))

// Stub heavy vendor libs that don't work in jsdom
vi.mock('recharts', () => {
  const Fake = ({ children }: { children?: React.ReactNode }) => <>{children}</>
  return {
    ResponsiveContainer: Fake, BarChart: Fake, LineChart: Fake, AreaChart: Fake,
    PieChart: Fake, ScatterChart: Fake, Bar: Fake, Line: Fake, Area: Fake,
    Scatter: Fake, XAxis: Fake, YAxis: Fake, ZAxis: Fake,
    CartesianGrid: Fake, Tooltip: Fake, Legend: Fake, Cell: Fake, Pie: Fake,
    ReferenceLine: Fake, LabelList: Fake, Treemap: Fake,
  }
})

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  closestCenter: vi.fn(),
  PointerSensor: class {},
  useSensor: vi.fn(() => ({})),
  useSensors: vi.fn(() => []),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSortable: () => ({
    attributes: {}, listeners: {}, setNodeRef: vi.fn(),
    transform: null, transition: undefined, isDragging: false,
  }),
  rectSortingStrategy: vi.fn(),
  arrayMove: (arr: unknown[]) => arr,
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}))

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [],
    getTotalSize: () => 0,
  }),
}))

import DashboardPage  from '../pages/DashboardPage'
import PivotTablePage from '../pages/PivotTablePage'
import ScenarioPage   from '../pages/ScenarioPage'
import SectorPage     from '../pages/SectorPage'
import RegionalPage   from '../pages/RegionalPage'
import TrendPage      from '../pages/TrendPage'
import RawDataPage    from '../pages/RawDataPage'

describe('DashboardPage', () => {
  it('renders KPI cards', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Total de Empresas')).toBeInTheDocument()
  })

  it('renders restore button', () => {
    render(<DashboardPage />)
    expect(screen.getByTitle('Restaurar ordem padrão')).toBeInTheDocument()
  })

  it('renders sector revenue widget heading', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Receita Total por Setor (R$ M)')).toBeInTheDocument()
  })
})

describe('PivotTablePage', () => {
  it('renders dimension selector', () => {
    render(<PivotTablePage />)
    expect(screen.getByText('Linhas')).toBeInTheDocument()
  })

  it('renders metric selector', () => {
    render(<PivotTablePage />)
    expect(screen.getByText('Métrica')).toBeInTheDocument()
  })

  it('renders sort button', () => {
    render(<PivotTablePage />)
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
  })
})

describe('ScenarioPage', () => {
  it('renders CBS slider', () => {
    render(<ScenarioPage />)
    expect(screen.getByText(/CBS/)).toBeInTheDocument()
  })

  it('renders compare mode toggle', () => {
    render(<ScenarioPage />)
    expect(screen.getByText(/Comparar/)).toBeInTheDocument()
  })
})

describe('SectorPage', () => {
  it('renders sector filter', () => {
    render(<SectorPage />)
    expect(screen.getAllByText(/Setor/).length).toBeGreaterThan(0)
  })

  it('renders Peer Benchmark section', () => {
    render(<SectorPage />)
    expect(screen.getByText(/Benchmark/)).toBeInTheDocument()
  })
})

describe('RegionalPage', () => {
  it('renders region heading', () => {
    render(<RegionalPage />)
    expect(screen.getByText(/Regional/i)).toBeInTheDocument()
  })

  it('renders filter controls', () => {
    render(<RegionalPage />)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0)
  })
})

describe('TrendPage', () => {
  it('renders timeline heading', () => {
    render(<TrendPage />)
    expect(screen.getByText(/Tendências|Trajetória/i)).toBeInTheDocument()
  })

  it('renders phase milestone years', () => {
    render(<TrendPage />)
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })
})

describe('RawDataPage', () => {
  it('renders search input', () => {
    render(<RawDataPage />)
    expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument()
  })

  it('renders export CSV button', () => {
    render(<RawDataPage />)
    expect(screen.getAllByText(/CSV/).length).toBeGreaterThan(0)
  })

  it('renders column headers', () => {
    render(<RawDataPage />)
    expect(screen.getByText('Empresa')).toBeInTheDocument()
    expect(screen.getAllByText('Setor').length).toBeGreaterThan(0)
  })
})
