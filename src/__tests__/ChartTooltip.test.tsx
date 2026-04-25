import { render, screen } from '@testing-library/react'
import { ChartTooltip } from '../components/ChartTooltip'

const payload = [
  { value: 1000, name: 'Receita', color: '#009900' },
  { value: 500, name: 'Impostos', color: '#0066cc' },
]

describe('ChartTooltip', () => {
  it('returns null when inactive', () => {
    const { container } = render(
      <ChartTooltip active={false} payload={payload} label="Setor" />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when payload is empty', () => {
    const { container } = render(<ChartTooltip active={true} payload={[]} label="Setor" />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when payload is undefined', () => {
    const { container } = render(<ChartTooltip active={true} label="Setor" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders label when active', () => {
    render(<ChartTooltip active={true} payload={payload} label="Tecnologia" />)
    expect(screen.getByText('Tecnologia')).toBeInTheDocument()
  })

  it('does not render label element when label is undefined', () => {
    render(<ChartTooltip active={true} payload={payload} />)
    expect(screen.queryByText('Tecnologia')).not.toBeInTheDocument()
  })

  it('renders each payload entry name', () => {
    render(<ChartTooltip active={true} payload={payload} label="X" />)
    expect(screen.getByText(/Receita/)).toBeInTheDocument()
    expect(screen.getByText(/Impostos/)).toBeInTheDocument()
  })

  it('uses default valueMapper (v * 1000) to format values', () => {
    render(<ChartTooltip active={true} payload={[{ value: 1000, name: 'Receita', color: '#009900' }]} />)
    // 1000 * 1000 = 1_000_000 → fmtM(1_000_000) = 'R$ 1B'
    expect(screen.getByText(/R\$/)).toBeInTheDocument()
  })

  it('uses custom valueMapper when provided', () => {
    render(
      <ChartTooltip
        active={true}
        payload={[{ value: 500, name: 'X', color: '#000' }]}
        valueMapper={(v) => v}
      />,
    )
    // valueMapper returns 500 as-is → fmtM(500) = 'R$ 500K'
    expect(screen.getByText(/500K/)).toBeInTheDocument()
  })

  it('renders extra content when provided', () => {
    render(
      <ChartTooltip
        active={true}
        payload={payload}
        extra={<span data-testid="extra">Extra Info</span>}
      />,
    )
    expect(screen.getByTestId('extra')).toBeInTheDocument()
  })
})
