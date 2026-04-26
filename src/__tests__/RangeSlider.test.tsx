import { render, screen, fireEvent } from '@testing-library/react'
import { RangeSlider } from '../components/RangeSlider'

describe('RangeSlider', () => {
  it('renders the label', () => {
    render(<RangeSlider label="CBS" value={8.8} min={0} max={15} step={0.1} onChange={() => {}} />)
    expect(screen.getByText('CBS')).toBeInTheDocument()
  })

  it('renders formatted value with %', () => {
    render(<RangeSlider label="CBS" value={8.8} min={0} max={15} step={0.1} onChange={() => {}} />)
    expect(screen.getByText('8.8%')).toBeInTheDocument()
  })

  it('renders min and max labels', () => {
    render(<RangeSlider label="X" value={5} min={0} max={30} step={0.5} onChange={() => {}} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('calls onChange with parsed float after debounce', () => {
    vi.useFakeTimers()
    const onChange = vi.fn()
    render(<RangeSlider label="CBS" value={8.8} min={0} max={15} step={0.1} onChange={onChange} />)
    const input = screen.getByRole('slider')
    fireEvent.change(input, { target: { value: '10.5' } })
    vi.advanceTimersByTime(200)
    expect(onChange).toHaveBeenCalledWith(10.5)
    vi.useRealTimers()
  })

  it('respects the step attribute', () => {
    render(<RangeSlider label="X" value={5} min={0} max={30} step={0.5} onChange={() => {}} />)
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('step', '0.5')
  })
})
