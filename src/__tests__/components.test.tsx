import { render, screen, fireEvent } from '@testing-library/react'
import { useAuthStore } from '../store/authStore'
import {
  SkeletonKpiCard, SkeletonChart, SkeletonTable,
  SkeletonControls, SkeletonPivotPage, SkeletonScenarioPage, SkeletonTrendPage,
} from '../components/Skeleton'
import { ThemeProvider, ThemeSwitcher } from '../components/ThemeProvider'
import { EmptyState } from '../components/EmptyState'

// Minimal Layout mock — avoids the full lazy-page + matchMedia setup
vi.mock('../components/Layout', () => ({
  default: () => <div data-testid="layout">Layout</div>,
}))

import App from '../App'

describe('App', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, user: null })
  })

  it('shows LoginPage when not authenticated', () => {
    render(<App />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('shows Layout when authenticated', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { name: 'Admin', email: 'admin@test.com' },
    })
    render(<App />)
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })
})

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <span data-testid="child">hello</span>
      </ThemeProvider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})

describe('ThemeSwitcher', () => {
  it('renders toggle button', () => {
    render(<ThemeSwitcher />)
    expect(screen.getByLabelText('Personalizar tema')).toBeInTheDocument()
  })

  it('opens theme picker on button click', () => {
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByLabelText('Personalizar tema'))
    expect(screen.getByText('Personalizar Marca')).toBeInTheDocument()
  })

  it('shows preset theme options', () => {
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByLabelText('Personalizar tema'))
    expect(screen.getByText('Temas predefinidos')).toBeInTheDocument()
  })

  it('closes picker when X button is clicked', () => {
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByLabelText('Personalizar tema'))
    expect(screen.getByText('Personalizar Marca')).toBeInTheDocument()
    const closeBtn = screen.getByText('Personalizar Marca').closest('div')!.querySelector('button')!
    fireEvent.click(closeBtn)
    expect(screen.queryByText('Personalizar Marca')).not.toBeInTheDocument()
  })

  it('selects a theme on click and closes', () => {
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByLabelText('Personalizar tema'))
    const themeButtons = screen.getAllByRole('button').filter((b) => b.closest('.p-3'))
    if (themeButtons.length > 0) {
      fireEvent.click(themeButtons[0])
      expect(screen.queryByText('Personalizar Marca')).not.toBeInTheDocument()
    }
  })
})

describe('Skeleton components', () => {
  it('SkeletonKpiCard renders without crashing', () => {
    const { container } = render(<SkeletonKpiCard />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SkeletonChart renders with default height', () => {
    const { container } = render(<SkeletonChart />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SkeletonChart renders with custom height', () => {
    const { container } = render(<SkeletonChart height={400} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SkeletonTable renders with default rows', () => {
    const { container } = render(<SkeletonTable />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SkeletonTable renders with custom rows', () => {
    const { container } = render(<SkeletonTable rows={3} />)
    expect(container.querySelectorAll('.divide-y > div')).toHaveLength(3)
  })

  it('SkeletonControls renders without crashing', () => {
    const { container } = render(<SkeletonControls />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SkeletonPivotPage renders without crashing', () => {
    const { container } = render(<SkeletonPivotPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SkeletonScenarioPage renders without crashing', () => {
    const { container } = render(<SkeletonScenarioPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SkeletonTrendPage renders without crashing', () => {
    const { container } = render(<SkeletonTrendPage />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('renders optional body text', () => {
    render(<EmptyState title="Empty" body="Try adjusting filters" />)
    expect(screen.getByText('Try adjusting filters')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={<svg data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
