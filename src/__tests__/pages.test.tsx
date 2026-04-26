import { render, screen, fireEvent } from '@testing-library/react'
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
import LoginPage      from '../pages/LoginPage'

describe('DashboardPage', () => {
  it('renders hero impact heading', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/vai pagar/)).toBeInTheDocument()
  })

  it('renders KPI cards', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Receita total')).toBeInTheDocument()
  })

  it('renders insight cards', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Maior contribuinte')).toBeInTheDocument()
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

  it('toggles sort direction on button click', () => {
    render(<PivotTablePage />)
    fireEvent.click(screen.getByText(/Maior → Menor/))
    expect(screen.getByText(/Menor → Maior/)).toBeInTheDocument()
  })

  it('switches to a delta metric', () => {
    render(<PivotTablePage />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[2], { target: { value: 'taxDeltaPercent' } })
    expect(screen.getAllByText(/Variação/).length).toBeGreaterThan(0)
  })

  it('renders insight strip with grand total label', () => {
    render(<PivotTablePage />)
    expect(screen.getByText('Grand total')).toBeInTheDocument()
  })
})

describe('ScenarioPage', () => {
  it('renders CBS slider', () => {
    render(<ScenarioPage />)
    expect(screen.getAllByText(/CBS/).length).toBeGreaterThan(0)
  })

  it('shows Cenário A and B panels', () => {
    render(<ScenarioPage />)
    expect(screen.getAllByText(/Cenário A/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Cenário B/).length).toBeGreaterThan(0)
  })

  it('shows simulation results summary cards', () => {
    render(<ScenarioPage />)
    expect(screen.getAllByText('Regime atual').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Reforma oficial').length).toBeGreaterThan(0)
  })

  it('filters branches by sector', () => {
    render(<ScenarioPage />)
    const sectorSelect = screen.getByRole('combobox')
    fireEvent.change(sectorSelect, { target: { value: 'Varejo' } })
    expect(screen.getAllByText(/Varejo/).length).toBeGreaterThan(0)
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

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('renders login button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    render(<LoginPage />)
    const toggle = screen.getByLabelText(/mostrar senha/i)
    fireEvent.click(toggle)
    expect(screen.getByLabelText(/ocultar senha/i)).toBeInTheDocument()
  })

  it('fills credentials on demo row click', () => {
    render(<LoginPage />)
    fireEvent.click(screen.getAllByText(/admin@kliente360.com/)[0])
    expect((screen.getByLabelText('E-mail') as HTMLInputElement).value).toBe('admin@kliente360.com')
  })
})
