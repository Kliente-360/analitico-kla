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
  label, value, min, max, step, onChange, color = '#009900',
}: RangeSliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  )
}
