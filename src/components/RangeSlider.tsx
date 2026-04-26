import { useState, useRef } from 'react'

interface RangeSliderProps {
  label:    string
  value:    number
  min:      number
  max:      number
  step:     number
  onChange: (v: number) => void
  color?:   string
}

export function RangeSlider({
  label, value, min, max, step, onChange, color = '#e30613',
}: RangeSliderProps) {
  const [local,     setLocal]     = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  // Sync when parent resets — React-approved during-render update
  if (prevValue !== value) {
    setPrevValue(value)
    setLocal(value)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value)
    setLocal(v)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(v), 150)
  }

  // Bicolor track fill: filled portion = color, unfilled = --ink-200
  const pct = max > min ? ((local - min) / (max - min)) * 100 : 0
  const trackStyle = {
    '--slider-color': color,
    background: `linear-gradient(to right, ${color} ${pct}%, var(--ink-200, #dadde2) ${pct}%)`,
  } as React.CSSProperties

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-ink-700">{label}</label>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {local.toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={local}
        onChange={handleChange}
        className="w-full cursor-pointer"
        style={trackStyle}
      />
      <div className="flex justify-between text-xs text-ink-400 mt-1">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  )
}
