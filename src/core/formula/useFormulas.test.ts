import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { DataStore } from '../data/DataStore'
import { useFormulas } from './useFormulas'

type Row = { id: string; A: string | number; B: string | number }

function makeStore(rows: Row[]) {
  const s = new DataStore<Row>()
  s.parse(rows)
  return s
}

describe('useFormulas', () => {
  it('returns undefined for non-formula cells', () => {
    const rows = [{ id: 'r1', A: '10', B: '5' }]
    const store = makeStore(rows)
    const { result } = renderHook(() => useFormulas(store, rows, ['A', 'B'], true))
    expect(result.current.getComputedValue('r1', 0)).toBeUndefined()
  })

  it('evaluates =SUM(A1:A1) on a formula cell', () => {
    const rows = [
      { id: 'r1', A: 10, B: 5 },
      { id: 'r2', A: '=SUM(A1:A1)', B: 0 },
    ]
    const store = makeStore(rows)
    const { result } = renderHook(() => useFormulas(store, rows, ['A', 'B'], true))
    expect(result.current.getComputedValue('r2', 0)).toBe(10)
  })

  it('re-evaluates when store fires change', async () => {
    const rows = [
      { id: 'r1', A: 10, B: 0 },
      { id: 'r2', A: '=A1', B: 0 },
    ]
    const store = makeStore(rows)
    const { result } = renderHook(() => useFormulas(store, rows, ['A', 'B'], true))
    expect(result.current.getComputedValue('r2', 0)).toBe(10)

    act(() => { store.update('r1', { A: 99 }) })
    expect(result.current.getComputedValue('r2', 0)).toBe(99)
  })

  it('returns #ERR for unparseable formula', () => {
    const rows = [{ id: 'r1', A: '=NOPE(', B: 0 }]
    const store = makeStore(rows)
    const { result } = renderHook(() => useFormulas(store, rows, ['A', 'B'], true))
    expect(result.current.getComputedValue('r1', 0)).toBe('#ERR')
  })

  it('returns undefined for all cells when enabled=false', () => {
    const rows = [{ id: 'r1', A: '=A1', B: 0 }]
    const store = makeStore(rows)
    const { result } = renderHook(() => useFormulas(store, rows, ['A', 'B'], false))
    expect(result.current.getComputedValue('r1', 0)).toBeUndefined()
  })

  it('evaluates formulas without a store (data-only mode)', () => {
    const rows = [
      { id: 'r1', A: 10, B: '=A1*2' },
      { id: 'r2', A: 20, B: '=A2*2' },
    ]
    const { result } = renderHook(() => useFormulas(undefined, rows, ['A', 'B'], true))
    expect(result.current.getComputedValue('r1', 1)).toBe(20)
    expect(result.current.getComputedValue('r2', 1)).toBe(40)
  })
})

describe('useFormulas cross-formula references', () => {
  type R = { id: string; A: unknown; B: unknown; C: unknown; D: unknown }
  const cols = ['A', 'B', 'C', 'D']

  it('evaluates a formula that references another formula cell', () => {
    const rows: R[] = [{ id: 'r1', A: 0, B: 10, C: '=B1*2', D: '=C1+1' }]
    const { result } = renderHook(() => useFormulas(undefined, rows, cols, true))
    expect(result.current.getComputedValue('r1', 2)).toBe(20)
    expect(result.current.getComputedValue('r1', 3)).toBe(21)
  })

  it('resolves forward references regardless of evaluation order', () => {
    const rows: R[] = [{ id: 'r1', A: '=B1+1', B: '=C1*2', C: 5, D: 0 }]
    const { result } = renderHook(() => useFormulas(undefined, rows, cols, true))
    expect(result.current.getComputedValue('r1', 0)).toBe(11)
    expect(result.current.getComputedValue('r1', 1)).toBe(10)
  })

  it('sums a range of formula cells', () => {
    const rows: R[] = [
      { id: 'r1', A: 0, B: 10, C: '=B1*2', D: '=SUM(C1:C2)' },
      { id: 'r2', A: 0, B: 3, C: '=B2*2', D: 0 },
    ]
    const { result } = renderHook(() => useFormulas(undefined, rows, cols, true))
    expect(result.current.getComputedValue('r1', 3)).toBe(26)
  })

  it('marks every cell of a mutual reference cycle as #CIRC', () => {
    const rows: R[] = [{ id: 'r1', A: 0, B: 0, C: '=D1+1', D: '=C1+1' }]
    const { result } = renderHook(() => useFormulas(undefined, rows, cols, true))
    expect(result.current.getComputedValue('r1', 2)).toBe('#CIRC')
    expect(result.current.getComputedValue('r1', 3)).toBe('#CIRC')
  })

  it('marks every cell of a longer cycle as #CIRC', () => {
    const rows: R[] = [{ id: 'r1', A: '=B1', B: '=C1', C: '=A1', D: '=A1+1' }]
    const { result } = renderHook(() => useFormulas(undefined, rows, cols, true))
    expect(result.current.getComputedValue('r1', 0)).toBe('#CIRC')
    expect(result.current.getComputedValue('r1', 1)).toBe('#CIRC')
    expect(result.current.getComputedValue('r1', 2)).toBe('#CIRC')
    // D depends on the cycle, so it inherits the error
    expect(result.current.getComputedValue('r1', 3)).toBe('#CIRC')
  })

  it('detects a cycle through a range', () => {
    const rows: R[] = [{ id: 'r1', A: 1, B: '=SUM(A1:C1)', C: '=B1', D: 0 }]
    const { result } = renderHook(() => useFormulas(undefined, rows, cols, true))
    expect(result.current.getComputedValue('r1', 1)).toBe('#CIRC')
    expect(result.current.getComputedValue('r1', 2)).toBe('#CIRC')
  })

  it('still detects self reference', () => {
    const rows: R[] = [{ id: 'r1', A: '=A1+1', B: 0, C: 0, D: 0 }]
    const { result } = renderHook(() => useFormulas(undefined, rows, cols, true))
    expect(result.current.getComputedValue('r1', 0)).toBe('#CIRC')
  })

  it('propagates parse errors of referenced formula cells', () => {
    const rows: R[] = [{ id: 'r1', A: '=NOPE(', B: '=A1+1', C: 0, D: 0 }]
    const { result } = renderHook(() => useFormulas(undefined, rows, cols, true))
    expect(result.current.getComputedValue('r1', 1)).toBe('#ERR')
  })
})
