import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../store/authStore'

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}))

import { supabase } from '../lib/supabase'

beforeEach(() => {
  useAuthStore.setState({ isAuthenticated: false, user: null, loading: true })
  vi.clearAllMocks()
  vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null })
  vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  } as unknown as never)
})

describe('authStore — init', () => {
  it('sets loading to false and stays unauthenticated when no session', async () => {
    const { init } = useAuthStore.getState()
    await init()
    const { isAuthenticated, loading } = useAuthStore.getState()
    expect(isAuthenticated).toBe(false)
    expect(loading).toBe(false)
  })

  it('sets isAuthenticated and user when session exists', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: {
            email: 'admin@kliente360.com',
            user_metadata: { name: 'Administrador' },
          },
        } as unknown as never,
      },
      error: null,
    })
    const { init } = useAuthStore.getState()
    await init()
    const { isAuthenticated, user, loading } = useAuthStore.getState()
    expect(isAuthenticated).toBe(true)
    expect(user?.email).toBe('admin@kliente360.com')
    expect(user?.name).toBe('Administrador')
    expect(loading).toBe(false)
  })

  it('falls back to email as name when user_metadata has no name', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { email: 'demo@kliente360.com', user_metadata: {} },
        } as unknown as never,
      },
      error: null,
    })
    await useAuthStore.getState().init()
    expect(useAuthStore.getState().user?.name).toBe('demo@kliente360.com')
  })
})

describe('authStore — login', () => {
  it('returns null and sets user on valid credentials', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: {
          email: 'admin@kliente360.com',
          user_metadata: { name: 'Administrador' },
        } as unknown as never,
        session: {} as unknown as never,
      },
      error: null,
    })
    const result = await useAuthStore.getState().login('admin@kliente360.com', 'admin123')
    expect(result).toBeNull()
    const { isAuthenticated, user } = useAuthStore.getState()
    expect(isAuthenticated).toBe(true)
    expect(user?.email).toBe('admin@kliente360.com')
    expect(user?.name).toBe('Administrador')
  })

  it('returns error message on invalid credentials', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' } as unknown as never,
    })
    const result = await useAuthStore.getState().login('wrong@example.com', 'badpassword')
    expect(result).toBe('Invalid login credentials')
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('returns error message on empty credentials', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' } as unknown as never,
    })
    const result = await useAuthStore.getState().login('', '')
    expect(result).not.toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})

describe('authStore — logout', () => {
  it('resets isAuthenticated and user', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { email: 'admin@kliente360.com', name: 'Administrador' },
      loading: false,
    })
    await useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('logout is idempotent when already logged out', async () => {
    await useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })
})
