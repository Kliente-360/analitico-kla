import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'

type Accent = 'primary' | 'down' | 'up' | 'warn' | 'neutral'
// Backwards-compat aliases
type AccentLegacy = 'green' | 'blue' | 'red' | 'amber'

const ACCENT_ICON: Record<Accent, string> = {
  primary: 'bg-primary-100 text-primary-700',
  down:    'bg-green-50 text-accent-down',
  up:      'bg-red-50 text-accent-up',
  warn:    'bg-amber-50 text-accent-warn',
  neutral: 'bg-ink-100 text-ink-500',
}

const LEGACY_MAP: Record<AccentLegacy, Accent> = {
  green: 'primary',
  blue:  'primary',
  red:   'up',
  amber: 'warn',
}

interface KpiCardProps {
  label:   string
  value:   string
  sub?:    string
  icon:    ReactNode
  accent?: Accent | AccentLegacy
  delta?:  number   // % change — rendered as ±badge when provided
}

export function KpiCard({ label, value, sub, icon, accent = 'primary', delta }: KpiCardProps) {
  const resolved: Accent = accent in LEGACY_MAP
    ? LEGACY_MAP[accent as AccentLegacy]
    : accent as Accent

  return (
    <div className="card p-4 flex items-start gap-3">
      <div className={`p-2.5 rounded-lg flex-shrink-0 ${ACCENT_ICON[resolved]}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-ink-500 uppercase tracking-wide truncate">{label}</p>
        <p className="font-display text-xl font-semibold text-ink-900 mt-0.5 tabular-nums">{value}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {sub && <p className="text-xs text-ink-400 truncate">{sub}</p>}
          {delta !== undefined && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              delta < 0 ? 'text-accent-down' : delta > 0 ? 'text-accent-up' : 'text-ink-400'
            }`}>
              {delta < 0 ? <TrendingDown size={11} /> : delta > 0 ? <TrendingUp size={11} /> : null}
              {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
