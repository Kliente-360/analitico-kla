import { render, screen } from '@testing-library/react'
import { KpiCard } from '../components/KpiCard'

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Receita Total" value="R$ 45M" icon={<span>icon</span>} />)
    expect(screen.getByText('Receita Total')).toBeInTheDocument()
    expect(screen.getByText('R$ 45M')).toBeInTheDocument()
  })

  it('renders sub text when provided', () => {
    render(<KpiCard label="X" value="Y" sub="subtítulo aqui" icon={<span />} />)
    expect(screen.getByText('subtítulo aqui')).toBeInTheDocument()
  })

  it('does not render sub when omitted', () => {
    render(<KpiCard label="X" value="Y" icon={<span />} />)
    expect(screen.queryByText('subtítulo aqui')).not.toBeInTheDocument()
  })

  it('renders icon node', () => {
    render(<KpiCard label="X" value="Y" icon={<span data-testid="my-icon" />} />)
    expect(screen.getByTestId('my-icon')).toBeInTheDocument()
  })

  it.each([
    ['green', 'bg-primary-100'],
    ['blue',  'bg-primary-100'],
    ['red',   'bg-red-50'],
    ['amber', 'bg-amber-50'],
  ] as const)('applies %s accent class', (accent, expectedClass) => {
    const { container } = render(
      <KpiCard label="X" value="Y" icon={<span />} accent={accent} />,
    )
    expect(container.querySelector(`.${expectedClass}`)).toBeTruthy()
  })

  it('defaults to primary accent', () => {
    const { container } = render(<KpiCard label="X" value="Y" icon={<span />} />)
    expect(container.querySelector('.bg-primary-100')).toBeTruthy()
  })
})
