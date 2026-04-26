import { renderHook, act } from '@testing-library/react'
import { vi, beforeEach, describe, it, expect } from 'vitest'
import { useDashboardLayout } from '../hooks/useDashboardLayout'

vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: (arr: unknown[], from: number, to: number) => {
    const result = [...arr]
    const [item] = result.splice(from, 1)
    result.splice(to, 0, item)
    return result
  },
}))

beforeEach(() => {
  localStorage.clear()
})

describe('useDashboardLayout', () => {
  it('returns DEFAULT_ORDER when localStorage is empty', () => {
    const { result } = renderHook(() => useDashboardLayout())
    expect(result.current.order).toHaveLength(6)
    expect(result.current.order[0]).toBe('kpi-summary')
  })

  it('returns saved order from localStorage when valid', () => {
    const saved = ['size-dist', 'kpi-summary', 'sector-revenue', 'tax-composition', 'reform-impact', 'delta-pct']
    localStorage.setItem('analitico-dashboard-layout', JSON.stringify(saved))
    const { result } = renderHook(() => useDashboardLayout())
    expect(result.current.order[0]).toBe('size-dist')
  })

  it('falls back to default when localStorage has invalid JSON', () => {
    localStorage.setItem('analitico-dashboard-layout', 'not-json')
    const { result } = renderHook(() => useDashboardLayout())
    expect(result.current.order[0]).toBe('kpi-summary')
  })

  it('falls back to default when saved order is missing widgets', () => {
    const incomplete = ['kpi-summary', 'sector-revenue']
    localStorage.setItem('analitico-dashboard-layout', JSON.stringify(incomplete))
    const { result } = renderHook(() => useDashboardLayout())
    expect(result.current.order).toHaveLength(6)
  })

  it('handleDragEnd does nothing when active === over', () => {
    const { result } = renderHook(() => useDashboardLayout())
    const before = [...result.current.order]
    act(() => { result.current.handleDragEnd('kpi-summary', 'kpi-summary') })
    expect(result.current.order).toEqual(before)
  })

  it('handleDragEnd reorders and persists to localStorage', () => {
    const { result } = renderHook(() => useDashboardLayout())
    act(() => { result.current.handleDragEnd('sector-revenue', 'kpi-summary') })
    expect(result.current.order[0]).toBe('sector-revenue')
    expect(localStorage.getItem('analitico-dashboard-layout')).not.toBeNull()
  })

  it('resetOrder restores default and clears localStorage', () => {
    const { result } = renderHook(() => useDashboardLayout())
    act(() => { result.current.handleDragEnd('sector-revenue', 'kpi-summary') })
    act(() => { result.current.resetOrder() })
    expect(result.current.order[0]).toBe('kpi-summary')
    expect(localStorage.getItem('analitico-dashboard-layout')).toBeNull()
  })
})
