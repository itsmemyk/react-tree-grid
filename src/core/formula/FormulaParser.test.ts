import { describe, it, expect } from 'vitest'
import { parseFormula } from './FormulaParser'

describe('parseFormula', () => {
  it('parses a number literal', () => {
    const ast = parseFormula('=42')
    expect(ast).toEqual({ type: 'number', value: 42 })
  })

  it('parses a string literal', () => {
    const ast = parseFormula('="hello"')
    expect(ast).toEqual({ type: 'string', value: 'hello' })
  })

  it('parses a cell reference', () => {
    const ast = parseFormula('=A1')
    expect(ast).toEqual({ type: 'cellRef', col: 0, row: 1 })
  })

  it('parses B3 (col=1, row=3)', () => {
    const ast = parseFormula('=B3')
    expect(ast).toEqual({ type: 'cellRef', col: 1, row: 3 })
  })

  it('parses a cell range', () => {
    const ast = parseFormula('=A1:A5')
    expect(ast).toEqual({ type: 'range', from: { col: 0, row: 1 }, to: { col: 0, row: 5 } })
  })

  it('parses SUM(A1:A3)', () => {
    const ast = parseFormula('=SUM(A1:A3)')
    expect(ast).toEqual({
      type: 'call',
      name: 'SUM',
      args: [{ type: 'range', from: { col: 0, row: 1 }, to: { col: 0, row: 3 } }],
    })
  })

  it('parses IF(A1>10,"high","low")', () => {
    const ast = parseFormula('=IF(A1>10,"high","low")')
    expect(ast.type).toBe('call')
    expect((ast as { name: string }).name).toBe('IF')
  })

  it('parses arithmetic A1+B1*2', () => {
    const ast = parseFormula('=A1+B1*2')
    expect(ast.type).toBe('binary')
    expect((ast as { op: string }).op).toBe('+')
  })

  it('parses string concat with &', () => {
    const ast = parseFormula('="prefix"&A1')
    expect(ast.type).toBe('binary')
    expect((ast as { op: string }).op).toBe('&')
  })

  it('throws ParseError for malformed input', () => {
    expect(() => parseFormula('=SUM(')).toThrow()
  })
})
