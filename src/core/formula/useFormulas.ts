import { useCallback, useEffect, useRef, useState } from 'react'
import type { DataStore } from '../data/DataStore'
import { DataEvents } from '../data/types'
import { parseFormula } from './FormulaParser'
import { evaluateFormula } from './FormulaEvaluator'

type DataItem = { id: string } & Record<string, unknown>

function buildComputed<T extends DataItem>(
  rows: T[],
  columnIds: string[],
): Map<string, Map<number, unknown>> {
  const result = new Map<string, Map<number, unknown>>()

  // Evaluated formula values keyed by "col:row" (row is 1-based).
  const memo = new Map<string, unknown>()
  // Formula cells currently being evaluated. Reaching one of them again means
  // the reference chain loops back, so every cell on that chain is circular.
  const inProgress = new Set<string>()

  const isFormula = (v: unknown): v is string => typeof v === 'string' && v.startsWith('=')

  const getCellValue = (col: number, row: number): unknown => {
    const item = rows[row - 1]
    if (!item) return undefined
    const raw = item[columnIds[col] as keyof T]
    if (!isFormula(raw)) return raw

    const key = `${col}:${row}`
    if (memo.has(key)) return memo.get(key)
    if (inProgress.has(key)) return '#CIRC'

    inProgress.add(key)
    let value: unknown
    try {
      value = evaluateFormula(parseFormula(raw), getCellValue, inProgress)
    } catch {
      value = '#ERR'
    } finally {
      inProgress.delete(key)
    }
    memo.set(key, value)
    return value
  }

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const item = rows[rowIdx]
    if (!item) continue
    const rowId = item.id

    for (let colIdx = 0; colIdx < columnIds.length; colIdx++) {
      const raw = item[columnIds[colIdx] as keyof T]
      if (!isFormula(raw)) continue

      const computed = getCellValue(colIdx, rowIdx + 1)

      if (!result.has(rowId)) result.set(rowId, new Map())
      result.get(rowId)!.set(colIdx, computed)
    }
  }

  return result
}

export function useFormulas<T extends DataItem>(
  store: DataStore<T> | undefined,
  rows: T[],
  columnIds: string[],
  enabled: boolean,
): { getComputedValue: (rowId: string, colIndex: number) => unknown } {
  const [computed, setComputed] = useState<Map<string, Map<number, unknown>>>(
    () => enabled ? buildComputed(rows, columnIds) : new Map(),
  )
  const computedRef = useRef(computed)
  computedRef.current = computed

  useEffect(() => {
    if (!enabled) {
      setComputed(new Map())
      return
    }

    const recompute = () => {
      const currentRows = store ? (store._order as T[]) : rows
      setComputed(buildComputed(currentRows, columnIds))
    }

    recompute()

    if (!store) return

    const ctx = {}
    store.events.on(DataEvents.change, recompute, ctx)
    store.events.on(DataEvents.load, recompute, ctx)

    return () => {
      store.events.detach(DataEvents.change, ctx)
      store.events.detach(DataEvents.load, ctx)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, enabled, columnIds.join(','), rows])

  const getComputedValue = useCallback(
    (rowId: string, colIndex: number): unknown => {
      return computedRef.current.get(rowId)?.get(colIndex)
    },
    [],
  )

  return { getComputedValue }
}
