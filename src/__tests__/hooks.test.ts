import { renderHook, act } from '@testing-library/react'
import { usePageReady } from '../hooks/usePageReady'
import { useNotificationPermission } from '../hooks/useNotificationPermission'
import { useUrlState } from '../hooks/useUrlState'

// Clean URL between tests
afterEach(() => {
  window.history.replaceState(null, '', window.location.pathname)
})

describe('usePageReady', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => usePageReady())
    expect(result.current).toBe(false)
  })

  it('returns true after requestAnimationFrame fires', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePageReady())
    expect(result.current).toBe(false)
    await act(async () => { vi.runAllTimers() })
    expect(result.current).toBe(true)
    vi.useRealTimers()
  })
})

describe('useUrlState', () => {
  it('returns fallback when URL has no param', () => {
    const { result } = renderHook(() => useUrlState('test', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('reads initial value from URL', () => {
    window.history.replaceState(null, '', '?test=hello')
    const { result } = renderHook(() => useUrlState('test', 'default'))
    expect(result.current[0]).toBe('hello')
  })

  it('updates state and URL when setValue is called', () => {
    const { result } = renderHook(() => useUrlState('test', 'default'))
    act(() => { result.current[1]('changed') })
    expect(result.current[0]).toBe('changed')
    expect(new URLSearchParams(window.location.search).get('test')).toBe('changed')
  })

  it('removes param from URL when value equals fallback', () => {
    window.history.replaceState(null, '', '?test=something')
    const { result } = renderHook(() => useUrlState('test', 'default'))
    act(() => { result.current[1]('default') })
    expect(new URLSearchParams(window.location.search).has('test')).toBe(false)
  })
})

describe('useNotificationPermission', () => {
  const originalNotification = global.Notification

  afterEach(() => {
    Object.defineProperty(global, 'Notification', { value: originalNotification, writable: true })
  })

  it('returns default permission state when Notification is defined', () => {
    const MockNotif = class {} as unknown as typeof Notification
    Object.defineProperty(MockNotif, 'permission', { get: () => 'default' })
    Object.defineProperty(global, 'Notification', { value: MockNotif, writable: true })
    const { result } = renderHook(() => useNotificationPermission())
    expect(result.current.permission).toBe('default')
  })

  it('returns default when Notification is undefined', () => {
    Object.defineProperty(global, 'Notification', { value: undefined, writable: true })
    const { result } = renderHook(() => useNotificationPermission())
    expect(result.current.permission).toBe('default')
  })

  it('does not send notification when permission is not granted', () => {
    Object.defineProperty(global, 'Notification', { value: undefined, writable: true })
    const { result } = renderHook(() => useNotificationPermission())
    expect(() => result.current.send('Title', 'Body')).not.toThrow()
  })

  it('request does nothing when Notification is undefined', async () => {
    Object.defineProperty(global, 'Notification', { value: undefined, writable: true })
    const { result } = renderHook(() => useNotificationPermission())
    await act(async () => { await result.current.request() })
    expect(result.current.permission).toBe('default')
  })

  it('request calls Notification.requestPermission when available', async () => {
    const requestPermission = vi.fn(async () => 'granted' as NotificationPermission)
    const MockNotif = class {} as unknown as typeof Notification
    Object.defineProperty(MockNotif, 'permission', { get: () => 'default' })
    Object.assign(MockNotif, { requestPermission })
    Object.defineProperty(global, 'Notification', { value: MockNotif, writable: true })
    const { result } = renderHook(() => useNotificationPermission())
    await act(async () => { await result.current.request() })
    expect(requestPermission).toHaveBeenCalled()
    expect(result.current.permission).toBe('granted')
  })
})
