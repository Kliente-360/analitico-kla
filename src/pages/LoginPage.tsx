import { useState } from 'react'
import { Eye, EyeOff, BarChart2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const login = useAuthStore((s) => s.login)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const ok = login(email, password)
      if (!ok) setError('E-mail ou senha inválidos. Verifique as credenciais.')
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex flex-col items-center justify-center p-4">
      {/* Brand header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-700 rounded-2xl shadow-lg mb-4">
          <BarChart2 size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analitico KLA</h1>
        <p className="text-gray-500 mt-1 text-sm">Analytics &amp; Simulação da Reforma Tributária</p>
        <span className="inline-block mt-2 text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
          by Kliente 360
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Bem-vindo de volta</h2>
        <p className="text-sm text-gray-400 mb-6">Faça login para acessar o portal</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="seu@email.com"
              required
              autoComplete="email"
              aria-label="E-mail"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                aria-label="Senha"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? 'Entrando...' : 'Entrar no Portal'}
          </button>
        </form>

        {/* Credentials hint */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-2 font-medium">CREDENCIAIS DE DEMONSTRAÇÃO</p>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <div
              className="flex items-center justify-between text-xs text-gray-600 cursor-pointer hover:text-primary-700 transition-colors"
              onClick={() => { setEmail('admin@kliente360.com'); setPassword('admin123') }}
            >
              <span>admin@kliente360.com</span>
              <span className="font-mono text-gray-400">admin123</span>
            </div>
            <div
              className="flex items-center justify-between text-xs text-gray-600 cursor-pointer hover:text-primary-700 transition-colors"
              onClick={() => { setEmail('demo@kliente360.com'); setPassword('demo@2025') }}
            >
              <span>demo@kliente360.com</span>
              <span className="font-mono text-gray-400">demo@2025</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">Clique para preencher automaticamente</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        © 2025 Kliente 360 · Todos os direitos reservados
      </p>
    </div>
  )
}
