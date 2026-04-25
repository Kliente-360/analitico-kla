import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
}

function Bar({ className }: SkeletonProps) {
  return <div className={clsx('bg-gray-200 rounded animate-pulse', className)} />
}

export function SkeletonKpiCard() {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Bar className="h-3 w-24" />
        <Bar className="h-6 w-32" />
        <Bar className="h-2.5 w-20" />
      </div>
    </div>
  )
}

export function SkeletonChart({ height = 240 }: { height?: number }) {
  return (
    <div className="card p-5">
      <Bar className="h-4 w-40 mb-4" />
      <div className="bg-gray-100 rounded-lg animate-pulse" style={{ height }} />
    </div>
  )
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-gray-200 animate-pulse h-10" />
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
            <Bar className="h-3 w-32" />
            <Bar className="h-3 w-20" />
            <Bar className="h-3 flex-1" />
            <Bar className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonControls() {
  return (
    <div className="card p-4 flex flex-wrap gap-3">
      <Bar className="h-9 w-44" />
      <Bar className="h-9 w-36" />
      <Bar className="h-9 w-36" />
    </div>
  )
}

export function SkeletonPivotPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-1">
        <Bar className="h-6 w-40" />
        <Bar className="h-4 w-64" />
      </div>
      <SkeletonControls />
      <SkeletonTable rows={8} />
    </div>
  )
}

export function SkeletonScenarioPage() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div className="space-y-1">
          <Bar className="h-6 w-52" />
          <Bar className="h-4 w-72" />
        </div>
        <Bar className="h-9 w-40" />
      </div>
      <SkeletonControls />
      <div className="card p-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between"><Bar className="h-3 w-40" /><Bar className="h-3 w-10" /></div>
            <Bar className="h-2 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => <div key={i} className="card p-4 space-y-2"><Bar className="h-3 w-24" /><Bar className="h-8 w-32" /></div>)}
      </div>
      <SkeletonChart height={220} />
    </div>
  )
}

export function SkeletonTrendPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <Bar className="h-6 w-48" />
        <Bar className="h-4 w-80" />
      </div>
      <SkeletonControls />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 border-l-4 border-gray-200 space-y-1.5">
            <Bar className="h-5 w-12" />
            <Bar className="h-4 w-28" />
            <Bar className="h-3 w-36" />
          </div>
        ))}
      </div>
      <SkeletonChart height={300} />
      <SkeletonTable rows={5} />
    </div>
  )
}
