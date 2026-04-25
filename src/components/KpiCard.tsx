import type { ReactNode } from 'react'

type Accent = 'green' | 'blue' | 'red' | 'amber'

const ACCENT: Record<Accent, string> = {
  green: 'bg-primary-50 text-primary-700',
  blue:  'bg-blue-50 text-blue-600',
  red:   'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
}

interface KpiCardProps {
  label:   string
  value:   string
  sub?:    string
  icon:    ReactNode
  accent?: Accent
}

export function KpiCard({ label, value, sub, icon, accent = 'green' }: KpiCardProps) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`p-3 rounded-xl flex-shrink-0 ${ACCENT[accent]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
