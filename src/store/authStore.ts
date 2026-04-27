import { create } from 'zustand'
import { supabase, supabaseConfigured } from '../lib/supabase'

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
    if (!supabaseConfigured) { set({ loading: false }); return }

    try {
      const { data: { session } } = await supabase.auth.getSession()
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
        } else {
          set({ isAuthenticated: false, user: null })
        }
      })
    } catch {
      // Supabase unreachable — show login page
    } finally {
      set({ loading: false })
    }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
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
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ isAuthenticated: false, user: null })
  },
}))
