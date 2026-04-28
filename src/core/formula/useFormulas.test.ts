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
    const store = makeStore([{ id: 'r1', A: '10', B: '5' }])
    const { result } = renderHook(() => useFormulas(store, ['A', 'B'], true))
    expect(result.current.getComputedValue('r1', 0)).toBeUndefined()
  })

  it('evaluates =SUM(A1:A1) on a formula cell', () => {
    const store = makeStore([
      { id: 'r1', A: 10, B: 5 },
      { id: 'r2', A: '=SUM(A1:A1)', B: 0 },
    ])
    const { result } = renderHook(() => useFormulas(store, ['A', 'B'], true))
    expect(result.current.getComputedValue('r2', 0)).toBe(10)
  })

  it('re-evaluates when store fires change', async () => {
    const store = makeStore([
      { id: 'r1', A: 10, B: 0 },
      { id: 'r2', A: '=A1', B: 0 },
    ])
    const { result } = renderHook(() => useFormulas(store, ['A', 'B'], true))
    expect(result.current.getComputedValue('r2', 0)).toBe(10)

    act(() => { store.update('r1', { A: 99 }) })
    expect(result.current.getComputedValue('r2', 0)).toBe(99)
  })

  it('returns #ERR for unparseable formula', () => {
    const store = makeStore([{ id: 'r1', A: '=NOPE(', B: 0 }])
    const { result } = renderHook(() => useFormulas(store, ['A', 'B'], true))
    expect(result.current.getComputedValue('r1', 0)).toBe('#ERR')
  })

  it('returns undefined for all cells when enabled=false', () => {
    const store = makeStore([{ id: 'r1', A: '=A1', B: 0 }])
    const { result } = renderHook(() => useFormulas(store, ['A', 'B'], false))
    expect(result.current.getComputedValue('r1', 0)).toBeUndefined()
  })
})
