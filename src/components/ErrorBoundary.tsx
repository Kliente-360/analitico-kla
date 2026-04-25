import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props  { children: ReactNode }
interface State  { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="card p-8 max-w-sm text-center">
            <AlertTriangle size={40} className="text-amber-500 mx-auto mb-4" />
            <p className="font-semibold text-gray-800 text-lg mb-2">Erro ao carregar módulo</p>
            <p className="text-sm text-gray-500 mb-5">{this.state.error.message}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
