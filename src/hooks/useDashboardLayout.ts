import { useState, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

export type WidgetId =
  | 'kpi-summary'
  | 'sector-revenue'
  | 'tax-composition'
  | 'reform-impact'
  | 'delta-pct'
  | 'size-dist'

const DEFAULT_ORDER: WidgetId[] = [
  'kpi-summary',
  'sector-revenue',
  'tax-composition',
  'reform-impact',
  'delta-pct',
  'size-dist',
]

const STORAGE_KEY = 'analitico-dashboard-layout'

function loadOrder(): WidgetId[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_ORDER
    const parsed = JSON.parse(saved) as WidgetId[]
    // Validate — ensure all default widgets are present
    const valid = DEFAULT_ORDER.every((id) => parsed.includes(id))
    return valid ? parsed : DEFAULT_ORDER
  } catch {
    return DEFAULT_ORDER
  }
}

export function useDashboardLayout() {
  const [order, setOrder] = useState<WidgetId[]>(loadOrder)

  const handleDragEnd = useCallback((activeId: WidgetId, overId: WidgetId) => {
    if (activeId === overId) return
    setOrder((prev) => {
      const oldIndex = prev.indexOf(activeId)
      const newIndex = prev.indexOf(overId)
      const next = arrayMove(prev, oldIndex, newIndex)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const resetOrder = useCallback(() => {
    setOrder(DEFAULT_ORDER)
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { order, handleDragEnd, resetOrder }
}
