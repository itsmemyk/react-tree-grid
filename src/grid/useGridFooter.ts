import { useCallback, useSyncExternalStore } from 'react'
import type { DataStore } from '../core/data'
import { computeAggregate } from '../core/data/aggregate'
import type { GridColumn, GridRow } from './types'

export type FooterValues = Record<string, Record<number, string | number>>

/**
 * useGridFooter — computes footer aggregate values from DataStore.
 *
 * For each column with a `footer[].content` aggregate type, computes the
 * value from the current (filtered) DataStore order.
 *
 * Returns a map of `columnId → { rowIndex → computed value }`.
 */
export function useGridFooter<T extends GridRow>(
  store: DataStore<T> | undefined,
  columns: GridColumn<T>[],
  data: T[],
): FooterValues {
  // Subscribe to store changes so we recompute when data changes
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!store) return () => {}
      const handler = () => onStoreChange()
      store.events.on('change', handler)
      store.events.on('filter', handler)
      store.events.on('sort', handler)
      return () => {
        store.events.detach('change', handler)
        store.events.detach('filter', handler)
        store.events.detach('sort', handler)
      }
    },
    [store],
  )

  const getSnapshot = useCallback(() => {
    return store ? store._order.length : data.length
  }, [store, data.length])

  useSyncExternalStore(subscribe, getSnapshot)

  const source = store ? store._order : data
  const result: FooterValues = {}

  for (const column of columns) {
    if (!column.footer) continue

    for (let rowIdx = 0; rowIdx < column.footer.length; rowIdx++) {
      const cell = column.footer[rowIdx]
      if (!cell.content) continue

      const computed = computeAggregate(
        source as Record<string, unknown>[],
        column.id,
        cell.content as import('../core/data/aggregate').AggregateType,
      )

      if (computed !== undefined) {
        if (!result[column.id]) result[column.id] = {}

        if (cell.template) {
          result[column.id][rowIdx] = cell.template(computed, column)
        } else {
          result[column.id][rowIdx] = computed
        }
      }
    }
  }

  return result
}
