import { create } from 'zustand'
import { supabase, supabaseConfigured } from '../lib/supabase'
import {
  matchDemoUser,
  loadDemoSession,
  saveDemoSession,
  clearDemoSession,
} from '../lib/demoAuth'

/** Tempo máximo de espera pela sessão remota antes de mostrar o login. */
const SESSION_TIMEOUT_MS = 3000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms),
    ),
  ])
}

interface User {
  email: string
  name: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  init: () => Promise<void>
  login: (email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  init: async () => {
    // Sessão local de demonstração tem precedência: funciona sem Supabase.
    const demoSession = loadDemoSession()
    if (demoSession) {
      set({ isAuthenticated: true, user: demoSession, loading: false })
      return
    }

    if (!supabaseConfigured) { set({ loading: false }); return }

    try {
      // Supabase fora do ar trava o getSession por dezenas de segundos e deixa
      // a tela no spinner — limitamos a espera e caímos na tela de login.
      const { data: { session } } = await withTimeout(
        supabase.auth.getSession(),
        SESSION_TIMEOUT_MS,
      )
      if (session?.user) {
        set({
          isAuthenticated: true,
          user: {
            email: session.user.email ?? '',
            name: session.user.user_metadata?.name ?? session.user.email ?? '',
          },
        })
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          set({
            isAuthenticated: true,
            user: {
              email: session.user.email ?? '',
              name: session.user.user_metadata?.name ?? session.user.email ?? '',
            },
          })
        } else if (!loadDemoSession()) {
          set({ isAuthenticated: false, user: null })
        }
      })
    } catch {
      // Supabase inacessível — segue com login local de demonstração
    } finally {
      set({ loading: false })
    }
  },

  login: async (email, password) => {
    // 1) Credenciais de demonstração — sempre disponíveis, sem rede.
    const demoSession = matchDemoUser(email, password)
    if (demoSession) {
      saveDemoSession(demoSession)
      set({ isAuthenticated: true, user: demoSession })
      return null
    }

    // 2) Supabase, quando configurado.
    if (!supabaseConfigured) {
      return 'Invalid login credentials'
    }

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        SESSION_TIMEOUT_MS,
      )
      if (error) return error.message
      if (data.user) {
        set({
          isAuthenticated: true,
          user: {
            email: data.user.email ?? '',
            name: data.user.user_metadata?.name ?? data.user.email ?? '',
          },
        })
      }
      return null
    } catch {
      return 'Invalid login credentials'
    }
  },

  logout: async () => {
    clearDemoSession()
    set({ isAuthenticated: false, user: null })
    if (!supabaseConfigured) return
    try {
      await withTimeout(supabase.auth.signOut(), SESSION_TIMEOUT_MS)
    } catch {
      // sem sessão remota para encerrar
    }
  },
}))
