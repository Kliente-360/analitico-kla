import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../store/authStore'

beforeEach(() => {
  useAuthStore.setState({ isAuthenticated: false, user: null })
})

describe('authStore — login', () => {
  it('initial state: not authenticated, no user', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })

  it('returns true and sets user for valid admin credentials', () => {
    const { login } = useAuthStore.getState()
    const result = login('admin@kliente360.com', 'admin123')
    expect(result).toBe(true)
    const { isAuthenticated, user } = useAuthStore.getState()
    expect(isAuthenticated).toBe(true)
    expect(user?.email).toBe('admin@kliente360.com')
    expect(user?.name).toBe('Administrador')
  })

  it('returns true and sets user for valid demo credentials', () => {
    const { login } = useAuthStore.getState()
    const result = login('demo@kliente360.com', 'demo@2025')
    expect(result).toBe(true)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user?.name).toBe('Demo Kliente 360')
  })

  it('returns false for wrong password', () => {
    const { login } = useAuthStore.getState()
    const result = login('admin@kliente360.com', 'wrongpassword')
    expect(result).toBe(false)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('returns false for unknown email', () => {
    const { login } = useAuthStore.getState()
    const result = login('unknown@example.com', 'admin123')
    expect(result).toBe(false)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('returns false for empty credentials', () => {
    const { login } = useAuthStore.getState()
    expect(login('', '')).toBe(false)
  })
})

describe('authStore — logout', () => {
  it('resets isAuthenticated and user to initial state', () => {
    const { login, logout } = useAuthStore.getState()
    login('admin@kliente360.com', 'admin123')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('logout is idempotent when already logged out', () => {
    const { logout } = useAuthStore.getState()
    logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })
})
