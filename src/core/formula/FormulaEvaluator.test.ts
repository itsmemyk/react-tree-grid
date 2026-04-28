import { describe, it, expect } from 'vitest'
import { evaluateFormula } from './FormulaEvaluator'
import { parseFormula } from './FormulaParser'

const data = [
  { id: 'r1', A: 10, B: 5 },
  { id: 'r2', A: 20, B: 3 },
  { id: 'r3', A: 30, B: 7 },
]
const columns = ['A', 'B']

function getCellValue(col: number, row: number): unknown {
  const item = data[row - 1]
  if (!item) return undefined
  return item[columns[col] as keyof typeof item]
}

describe('evaluateFormula', () => {
  it('evaluates a number literal', () => {
    expect(evaluateFormula(parseFormula('=42'), getCellValue, new Set())).toBe(42)
  })

  it('evaluates a string literal', () => {
    expect(evaluateFormula(parseFormula('="hello"'), getCellValue, new Set())).toBe('hello')
  })

  it('evaluates a cell reference A1 → 10', () => {
    expect(evaluateFormula(parseFormula('=A1'), getCellValue, new Set())).toBe(10)
  })

  it('evaluates B2 → 3', () => {
    expect(evaluateFormula(parseFormula('=B2'), getCellValue, new Set())).toBe(3)
  })

  it('evaluates arithmetic A1+B1 → 15', () => {
    expect(evaluateFormula(parseFormula('=A1+B1'), getCellValue, new Set())).toBe(15)
  })

  it('evaluates SUM(A1:A3) → 60', () => {
    expect(evaluateFormula(parseFormula('=SUM(A1:A3)'), getCellValue, new Set())).toBe(60)
  })

  it('evaluates AVG(A1:A3) → 20', () => {
    expect(evaluateFormula(parseFormula('=AVG(A1:A3)'), getCellValue, new Set())).toBe(20)
  })

  it('evaluates COUNT(A1:A3) → 3', () => {
    expect(evaluateFormula(parseFormula('=COUNT(A1:A3)'), getCellValue, new Set())).toBe(3)
  })

  it('evaluates MIN(B1:B3) → 3', () => {
    expect(evaluateFormula(parseFormula('=MIN(B1:B3)'), getCellValue, new Set())).toBe(3)
  })

  it('evaluates MAX(B1:B3) → 7', () => {
    expect(evaluateFormula(parseFormula('=MAX(B1:B3)'), getCellValue, new Set())).toBe(7)
  })

  it('evaluates IF(A1>5,"high","low") → "high"', () => {
    expect(evaluateFormula(parseFormula('=IF(A1>5,"high","low")'), getCellValue, new Set())).toBe('high')
  })

  it('evaluates IF(B1>5,"high","low") → "low"', () => {
    expect(evaluateFormula(parseFormula('=IF(B1>5,"high","low")'), getCellValue, new Set())).toBe('low')
  })

  it('returns #REF for out-of-range cell', () => {
    expect(evaluateFormula(parseFormula('=A99'), getCellValue, new Set())).toBe('#REF')
  })

  it('returns #DIV/0 on division by zero', () => {
    expect(evaluateFormula(parseFormula('=A1/0'), getCellValue, new Set())).toBe('#DIV/0')
  })

  it('evaluates string concat "prefix"&A1 → "prefix10"', () => {
    expect(evaluateFormula(parseFormula('="prefix"&A1'), getCellValue, new Set())).toBe('prefix10')
  })

  it('returns #CIRC when cell key is in visiting set', () => {
    const visiting = new Set(['0:1'])
    expect(evaluateFormula(parseFormula('=A1'), getCellValue, visiting)).toBe('#CIRC')
  })
})
