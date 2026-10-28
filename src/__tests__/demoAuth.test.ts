import { describe, it, expect, beforeEach } from 'vitest'
import {
  DEMO_USERS,
  matchDemoUser,
  saveDemoSession,
  loadDemoSession,
  clearDemoSession,
} from '../lib/demoAuth'

// jsdom nesta configuração não expõe localStorage — stub em memória
const store = new Map<string, string>()
beforeEach(() => {
  store.clear()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => { store.set(k, v) },
      removeItem: (k: string) => { store.delete(k) },
      clear: () => { store.clear() },
      key: (i: number) => [...store.keys()][i] ?? null,
      get length() { return store.size },
    },
  })
})

describe('demoAuth — matchDemoUser', () => {
  it('aceita as credenciais de demonstração', () => {
    for (const user of DEMO_USERS) {
      expect(matchDemoUser(user.email, user.password)).toEqual({
        email: user.email,
        name: user.name,
      })
    }
  })

  it('ignora espaços e maiúsculas no e-mail', () => {
    expect(matchDemoUser('  ADMIN@Kliente360.com ', 'admin123')).toEqual({
      email: 'admin@kliente360.com',
      name: 'Administrador',
    })
  })

  it('rejeita senha errada', () => {
    expect(matchDemoUser('admin@kliente360.com', 'errada')).toBeNull()
  })

  it('rejeita e-mail desconhecido', () => {
    expect(matchDemoUser('alguem@example.com', 'admin123')).toBeNull()
  })

  it('rejeita credenciais vazias', () => {
    expect(matchDemoUser('', '')).toBeNull()
  })
})

describe('demoAuth — sessão persistida', () => {
  it('salva e recupera a sessão', () => {
    saveDemoSession({ email: 'demo@kliente360.com', name: 'Usuário Demo' })
    expect(loadDemoSession()).toEqual({ email: 'demo@kliente360.com', name: 'Usuário Demo' })
  })

  it('retorna null quando não há sessão', () => {
    expect(loadDemoSession()).toBeNull()
  })

  it('retorna null quando o conteúdo armazenado é inválido', () => {
    localStorage.setItem('kla.demo-session', 'não é json')
    expect(loadDemoSession()).toBeNull()
  })

  it('clearDemoSession remove a sessão', () => {
    saveDemoSession({ email: 'admin@kliente360.com', name: 'Administrador' })
    clearDemoSession()
    expect(loadDemoSession()).toBeNull()
  })
})
