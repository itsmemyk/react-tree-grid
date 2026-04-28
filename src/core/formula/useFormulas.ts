import { useCallback, useEffect, useRef, useState } from 'react'
import type { DataStore } from '../data/DataStore'
import { DataEvents } from '../data/types'
import { parseFormula } from './FormulaParser'
import { evaluateFormula } from './FormulaEvaluator'

type DataItem = { id: string } & Record<string, unknown>

function buildComputed<T extends DataItem>(
  store: DataStore<T>,
  columnIds: string[],
): Map<string, Map<number, unknown>> {
  const result = new Map<string, Map<number, unknown>>()
  const order = store._order

  const getCellValue = (col: number, row: number): unknown => {
    const item = order[row - 1]
    if (!item) return undefined
    return item[columnIds[col] as keyof T]
  }

  for (let rowIdx = 0; rowIdx < order.length; rowIdx++) {
    const item = order[rowIdx]
    const rowId = item.id
    if (!item) continue

    for (let colIdx = 0; colIdx < columnIds.length; colIdx++) {
      const raw = item[columnIds[colIdx] as keyof T]
      if (typeof raw !== 'string' || !raw.startsWith('=')) continue

      let computed: unknown
      try {
        const ast = parseFormula(raw)
        const visiting = new Set<string>([`${colIdx}:${rowIdx + 1}`])
        computed = evaluateFormula(ast, getCellValue, visiting)
      } catch {
        computed = '#ERR'
      }

      if (!result.has(rowId)) result.set(rowId, new Map())
      result.get(rowId)!.set(colIdx, computed)
    }
  }

  return result
}

export function useFormulas<T extends DataItem>(
  store: DataStore<T> | undefined,
  columnIds: string[],
  enabled: boolean,
): { getComputedValue: (rowId: string, colIndex: number) => unknown } {
  const [computed, setComputed] = useState<Map<string, Map<number, unknown>>>(
    () => (store && enabled ? buildComputed(store, columnIds) : new Map()),
  )
  const computedRef = useRef(computed)
  computedRef.current = computed

  useEffect(() => {
    if (!store || !enabled) {
      setComputed(new Map())
      return
    }

    const recompute = () => {
      setComputed(buildComputed(store, columnIds))
    }

    const ctx = {}
    recompute()
    store.events.on(DataEvents.change, recompute, ctx)
    store.events.on(DataEvents.load, recompute, ctx)

    return () => {
      store.events.detach(DataEvents.change, ctx)
      store.events.detach(DataEvents.load, ctx)
    }
  }, [store, enabled, columnIds.join(',')])

  const getComputedValue = useCallback(
    (rowId: string, colIndex: number): unknown => {
      return computedRef.current.get(rowId)?.get(colIndex)
    },
    [],
  )

  return { getComputedValue }
}
