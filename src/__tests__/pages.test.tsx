import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('../hooks/usePageReady', () => ({ usePageReady: () => true }))

// Reset URL query params between tests so useUrlState doesn't leak across tests
afterEach(() => {
  window.history.replaceState(null, '', window.location.pathname)
})

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
  it('renders line-of-business heading', () => {
    render(<SectorPage />)
    expect(screen.getByText('Por Linha de Negócio')).toBeInTheDocument()
  })

  it('renders micro-bars section', () => {
    render(<SectorPage />)
    expect(screen.getByText('Carga por linha de negócio')).toBeInTheDocument()
  })

  it('renders summary table', () => {
    render(<SectorPage />)
    expect(screen.getByText('Resumo por linha de negócio')).toBeInTheDocument()
  })

  it('filters by region', () => {
    render(<SectorPage />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'Sul' } })
    expect(screen.getByText(/filiais selecionadas/)).toBeInTheDocument()
  })
})

describe('RegionalPage', () => {
  it('renders filial/UF heading', () => {
    render(<RegionalPage />)
    expect(screen.getByText('Por Filial / UF')).toBeInTheDocument()
  })

  it('renders filter controls', () => {
    render(<RegionalPage />)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0)
  })

  it('renders state detail table', () => {
    render(<RegionalPage />)
    expect(screen.getByText('Detalhamento por estado')).toBeInTheDocument()
  })
})

describe('TrendPage', () => {
  it('renders timeline heading', () => {
    render(<TrendPage />)
    expect(screen.getByText(/Tendências/i)).toBeInTheDocument()
  })

  it('renders phase milestone years', () => {
    render(<TrendPage />)
    expect(screen.getAllByText(/2026/).length).toBeGreaterThan(0)
  })

  it('renders callout economia card', () => {
    render(<TrendPage />)
    expect(screen.getByText(/Economia acumulada/i)).toBeInTheDocument()
  })

  it('switches to line view', () => {
    render(<TrendPage />)
    fireEvent.click(screen.getByText('Linha'))
    expect(screen.getByText('Área')).toBeInTheDocument()
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
    expect(screen.getAllByText(/Setor|setor/i).length).toBeGreaterThan(0)
  })

  it('filters by search term and shows count', () => {
    render(<RawDataPage />)
    const input = screen.getByPlaceholderText(/Buscar/i)
    fireEvent.change(input, { target: { value: 'xyznotexist' } })
    expect(screen.getByText(/0 de/)).toBeInTheDocument()
  })

  it('shows clear button when searching and clears on click', () => {
    render(<RawDataPage />)
    const input = screen.getByPlaceholderText(/Buscar/i)
    fireEvent.change(input, { target: { value: 'abc' } })
    const clearBtn = document.querySelector('button svg.lucide-x')?.closest('button')
    expect(clearBtn).toBeTruthy()
    if (clearBtn) fireEvent.click(clearBtn)
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('filters by sector', () => {
    render(<RawDataPage />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'Varejo' } })
    expect(screen.getByText(/1 filtro ativo/)).toBeInTheDocument()
  })

  it('filters by state', () => {
    render(<RawDataPage />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[1], { target: { value: 'SP' } })
    expect(screen.getByText(/1 filtro ativo/)).toBeInTheDocument()
  })

  it('filters by size', () => {
    render(<RawDataPage />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[2], { target: { value: 'Pequena' } })
    expect(screen.getByText(/filtro/)).toBeInTheDocument()
  })

  it('shows empty state when no results', () => {
    render(<RawDataPage />)
    const input = screen.getByPlaceholderText(/Buscar/i)
    fireEvent.change(input, { target: { value: 'ZZZ_NOTEXIST_XYZABC' } })
    expect(screen.getByText('Nenhuma filial encontrada')).toBeInTheDocument()
  })

  it('shows active filter count with multiple filters', () => {
    render(<RawDataPage />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'Varejo' } })
    fireEvent.change(selects[1], { target: { value: 'SP' } })
    expect(screen.getByText(/2 filtros ativos/)).toBeInTheDocument()
  })

  it('toggles column picker open/close', () => {
    render(<RawDataPage />)
    const colBtn = screen.getByText('Colunas')
    fireEvent.click(colBtn)
    expect(screen.getByText('Colunas visíveis')).toBeInTheDocument()
    fireEvent.click(colBtn)
    expect(screen.queryByText('Colunas visíveis')).not.toBeInTheDocument()
  })

  it('toggles a column off in column picker', () => {
    render(<RawDataPage />)
    fireEvent.click(screen.getByText('Colunas'))
    const checkboxes = screen.getAllByRole('checkbox')
    const checked = checkboxes.filter((cb) => (cb as HTMLInputElement).checked)
    fireEvent.click(checked[0])
    const picker = screen.getByText('Colunas visíveis').closest('div')
    expect(picker).toBeInTheDocument()
  })

  it('renders summary footer with totals', () => {
    render(<RawDataPage />)
    expect(screen.getByText(/Receita total/)).toBeInTheDocument()
    expect(screen.getByText(/Impostos atuais/)).toBeInTheDocument()
  })

  it('sorts by column on header click', () => {
    render(<RawDataPage />)
    const empresaHeader = screen.getByText('Empresa').closest('th')!
    fireEvent.click(empresaHeader)
    expect(empresaHeader).toBeInTheDocument()
  })

  it('toggles sort direction on second column click', () => {
    render(<RawDataPage />)
    const empresaHeader = screen.getByText('Empresa').closest('th')!
    fireEvent.click(empresaHeader)
    fireEvent.click(empresaHeader)
    expect(empresaHeader).toBeInTheDocument()
  })

  it('shows correct column count label after hiding a column', () => {
    render(<RawDataPage />)
    fireEvent.click(screen.getByText('Colunas'))
    const checkboxes = screen.getAllByRole('checkbox')
    const checked = checkboxes.filter((cb) => (cb as HTMLInputElement).checked)
    fireEvent.click(checked[0])
    expect(screen.getByText(/\//)).toBeInTheDocument()
  })

  it('exports CSV when button clicked', () => {
    const createObjectURL = vi.fn(() => 'blob:test')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(window, 'URL', {
      value: { createObjectURL, revokeObjectURL },
      writable: true,
    })
    const clickFn = vi.fn()
    const origCreate = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreate(tag)
      if (tag === 'a') { vi.spyOn(el as HTMLAnchorElement, 'click').mockImplementation(clickFn) }
      return el
    })
    render(<RawDataPage />)
    fireEvent.click(screen.getByText('Exportar CSV'))
    expect(clickFn).toHaveBeenCalled()
    vi.restoreAllMocks()
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

  it('fills second demo credential on click', () => {
    render(<LoginPage />)
    fireEvent.click(screen.getAllByText(/demo@kliente360.com/)[0])
    expect((screen.getByLabelText('E-mail') as HTMLInputElement).value).toBe('demo@kliente360.com')
  })

  it('shows loading state when form is submitted', () => {
    vi.useFakeTimers()
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'admin@kliente360.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'admin123' } })
    act(() => {
      fireEvent.submit(screen.getByRole('button', { name: /entrar/i }).closest('form')!)
    })
    expect(screen.getByText(/Entrando/i)).toBeInTheDocument()
    act(() => { vi.runAllTimers() })
    vi.useRealTimers()
  })

  it('shows error on invalid credentials', () => {
    vi.useFakeTimers()
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'wrong@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'wrongpassword' } })
    act(() => {
      fireEvent.submit(screen.getByRole('button', { name: /entrar/i }).closest('form')!)
    })
    act(() => { vi.runAllTimers() })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/inválidos/i)).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('renders demo credential tags', () => {
    render(<LoginPage />)
    expect(screen.getByText('Credenciais de demonstração')).toBeInTheDocument()
  })
})
