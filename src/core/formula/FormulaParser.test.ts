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

describe('parseFormula precedence and literals', () => {
  it('gives comparison lower precedence than multiplication (2*3>5)', () => {
    const ast = parseFormula('=2*3>5') as { type: string; op: string; left: { op: string } }
    expect(ast.type).toBe('binary')
    expect(ast.op).toBe('>')
    expect(ast.left.op).toBe('*')
  })

  it('gives comparison lower precedence than addition (A1+1=B1)', () => {
    const ast = parseFormula('=A1+1=B1') as { op: string }
    expect(ast.op).toBe('=')
  })

  it('parses <> as a single operator', () => {
    const ast = parseFormula('=A1<>B1') as { op: string }
    expect(ast.op).toBe('<>')
  })

  it('parses numbers with a leading decimal point', () => {
    expect(parseFormula('=.5')).toEqual({ type: 'number', value: 0.5 })
  })

  it('rejects malformed numbers', () => {
    expect(() => parseFormula('=1.2.3')).toThrow()
    expect(() => parseFormula('=.')).toThrow()
  })

  it('parses ^ with higher precedence than *', () => {
    const ast = parseFormula('=2*3^2') as { op: string; right: { op: string } }
    expect(ast.op).toBe('*')
    expect(ast.right.op).toBe('^')
  })

  it('parses ^ as right-associative', () => {
    const ast = parseFormula('=2^3^2') as { op: string; left: { type: string }; right: { op: string } }
    expect(ast.op).toBe('^')
    expect(ast.left.type).toBe('number')
    expect(ast.right.op).toBe('^')
  })
})
