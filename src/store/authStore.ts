import { create } from 'zustand'

interface User {
  email: string
  name: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const CREDENTIALS = [
  { email: 'admin@kliente360.com', password: 'admin123', name: 'Administrador' },
  { email: 'demo@kliente360.com',  password: 'demo@2025', name: 'Demo Kliente 360' },
]

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (email, password) => {
    const found = CREDENTIALS.find((c) => c.email === email && c.password === password)
    if (found) {
      set({ isAuthenticated: true, user: { email: found.email, name: found.name } })
      return true
    }
    return false
  },

  logout: () => set({ isAuthenticated: false, user: null }),
}))
