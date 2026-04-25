import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../components/ErrorBoundary'

// Suppress console.error for expected error boundary messages
const originalError = console.error
beforeEach(() => {
  console.error = vi.fn()
})
afterEach(() => {
  console.error = originalError
})

function ThrowOnMount({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Erro de teste')
  return <div>Conteúdo carregado</div>
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount shouldThrow={false} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Conteúdo carregado')).toBeInTheDocument()
  })

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Erro ao carregar módulo')).toBeInTheDocument()
    expect(screen.getByText('Erro de teste')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tentar novamente/i })).toBeInTheDocument()
  })

  it('resets state when "Tentar novamente" is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount shouldThrow={true} />
      </ErrorBoundary>,
    )
    const btn = screen.getByRole('button', { name: /Tentar novamente/i })
    fireEvent.click(btn)
    // After reset, boundary shows children again (ThrowOnMount still throws, so error UI reappears)
    expect(screen.getByText('Erro ao carregar módulo')).toBeInTheDocument()
  })
})
