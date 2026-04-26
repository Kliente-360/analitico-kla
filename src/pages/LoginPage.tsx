import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
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
    <div className="min-h-screen flex">

      {/* ── Brand panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-shrink-0 flex-col justify-between
                      bg-primary-700 text-white p-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">K</span>
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">Analítico KLA</p>
            <p className="text-white/60 text-xs leading-tight">by Kliente 360</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="space-y-6">
          <h1 className="font-display text-4xl xl:text-5xl font-semibold leading-tight tracking-tight">
            Inteligência fiscal<br />para a reforma<br />tributária.
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xs">
            Simule cenários de CBS e IBS, compare regimes e visualize o
            impacto real sobre cada filial da sua empresa.
          </p>
          <div className="flex flex-wrap gap-3">
            {['CBS / IBS', 'Regime atual vs reforma', 'Filiais & UFs', 'Cenários A/B'].map((tag) => (
              <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 text-white/80">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs">
          © 2025 Kliente 360 · Dados simulados para demonstração
        </p>
      </div>

      {/* ── Form panel ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-ink-50 p-6 sm:p-10">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-primary-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-base">K</span>
          </div>
          <span className="font-bold text-ink-900 text-lg">Analítico KLA</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Bem-vindo de volta</h2>
            <p className="text-ink-500 mt-1 text-sm">Faça login para acessar o portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5">
                E-mail
              </label>
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
              <label htmlFor="login-password" className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5">
                Senha
              </label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="bg-red-50 text-accent-up text-sm px-4 py-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm justify-center mt-2"
            >
              {loading ? 'Entrando…' : 'Entrar no Portal'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-7 pt-6 border-t border-ink-200">
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest text-center mb-3">
              Credenciais de demonstração
            </p>
            <div className="space-y-1.5">
              {[
                { email: 'admin@kliente360.com', pwd: 'admin123' },
                { email: 'demo@kliente360.com',  pwd: 'demo@2025' },
              ].map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => { setEmail(cred.email); setPassword(cred.pwd) }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-paper
                             border border-ink-200 text-xs text-ink-600 hover:border-primary-700
                             hover:text-primary-700 transition-colors"
                >
                  <span>{cred.email}</span>
                  <span className="font-mono text-ink-400">{cred.pwd}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-400 text-center mt-2">Clique para preencher automaticamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
