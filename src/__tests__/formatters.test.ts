import { describe, it, expect } from 'vitest'
import { fmtM, fmtPct, fmtNum, fmtVal } from '../utils/formatters'

describe('fmtM', () => {
  it('formats billions correctly', () => {
    expect(fmtM(1_500_000)).toBe('R$ 1.5B')
    expect(fmtM(2_000_000)).toBe('R$ 2.0B')
  })

  it('formats millions correctly', () => {
    expect(fmtM(1_000)).toBe('R$ 1M')
    expect(fmtM(45_000)).toBe('R$ 45M')
    expect(fmtM(999_999)).toBe('R$ 1000M')
  })

  it('formats thousands (K) correctly', () => {
    expect(fmtM(500)).toBe('R$ 500K')
    expect(fmtM(0)).toBe('R$ 0K')
  })

  it('handles negative values', () => {
    expect(fmtM(-1_500_000)).toBe('R$ -1.5B')
    expect(fmtM(-50_000)).toBe('R$ -50M')
  })
})

describe('fmtPct', () => {
  it('shows + sign for positive values', () => {
    expect(fmtPct(5.5)).toBe('+5.5%')
    expect(fmtPct(0)).toBe('+0.0%')
  })

  it('shows - sign for negative values', () => {
    expect(fmtPct(-3.2)).toBe('-3.2%')
  })

  it('rounds to one decimal', () => {
    expect(fmtPct(1.234)).toBe('+1.2%')
  })
})

describe('fmtNum', () => {
  it('formats integers with pt-BR locale', () => {
    expect(fmtNum(1000)).toMatch(/1\.000|1,000/)
    expect(fmtNum(0)).toBe('0')
  })
})

describe('fmtVal', () => {
  it('formats money (divides by 1000 for M display)', () => {
    const result = fmtVal(1_000_000, 'money')
    expect(result).toContain('1')
    expect(result).toContain('B')
  })

  it('formats percentage with one decimal', () => {
    expect(fmtVal(12.5, 'pct')).toBe('12.5%')
  })

  it('formats float with two decimals', () => {
    expect(fmtVal(8.333, 'float')).toBe('8.33%')
  })

  it('formats integers', () => {
    expect(fmtVal(1234, 'int')).toMatch(/1\.234|1,234/)
  })
})
