/**
 * Autenticação local de demonstração.
 *
 * Permite acessar o portal sem depender do Supabase (demos, ambientes sem
 * `.env`, projeto Supabase indisponível). As credenciais abaixo são as mesmas
 * publicadas no README e nos atalhos da tela de login — dados simulados, sem
 * acesso a qualquer informação real.
 */

export interface DemoUser {
  email: string
  password: string
  name: string
}

export const DEMO_USERS: DemoUser[] = [
  { email: 'admin@kliente360.com', password: 'admin123', name: 'Administrador' },
  { email: 'demo@kliente360.com',  password: 'demo@2025', name: 'Usuário Demo' },
]

const STORAGE_KEY = 'kla.demo-session'

export interface DemoSession {
  email: string
  name: string
}

/** Retorna a sessão demo se e-mail/senha baterem com um usuário de demonstração. */
export function matchDemoUser(email: string, password: string): DemoSession | null {
  const normalized = email.trim().toLowerCase()
  const found = DEMO_USERS.find(
    (u) => u.email === normalized && u.password === password,
  )
  return found ? { email: found.email, name: found.name } : null
}

export function saveDemoSession(session: DemoSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // storage indisponível — sessão vive apenas em memória
  }
}

export function loadDemoSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<DemoSession>
    if (typeof parsed?.email === 'string' && typeof parsed?.name === 'string') {
      return { email: parsed.email, name: parsed.name }
    }
    return null
  } catch {
    return null
  }
}

export function clearDemoSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nada a limpar
  }
}
