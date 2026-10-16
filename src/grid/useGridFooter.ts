import { useCallback, useRef, useSyncExternalStore } from 'react'
import type { DataStore } from '../core/data'
import { computeAggregate } from '../core/data/aggregate'
import type { GridColumn, GridRow } from './types'

export type FooterValues = Record<string, Record<number, string | number>>

interface TreeLike<T> {
  getRoot(): string
  _childs: Record<string, T[]>
}

/**
 * Rows the footer aggregates over. A tree store filters its child lists and
 * leaves `_order` untouched, so walk the filtered tree instead.
 */
function visibleStoreRows<T extends GridRow>(store: DataStore<T>): T[] {
  const tree = store as unknown as Partial<TreeLike<T>>
  if (typeof tree.getRoot !== 'function' || !tree._childs) return store._order
  const childs = tree._childs
  const rows: T[] = []
  const walk = (id: string) => {
    for (const child of childs[id] ?? []) {
      rows.push(child)
      walk(child.id)
    }
  }
  walk(tree.getRoot())
  return rows
}

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
  // Bumped on every store event, so edits that keep the row count still recompute
  const versionRef = useRef(0)
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!store) return () => {}
      const handler = () => {
        versionRef.current += 1
        onStoreChange()
      }
      // The handler doubles as the context, which is what detach() matches on
      store.events.on('change', handler, handler)
      store.events.on('filter', handler, handler)
      store.events.on('sort', handler, handler)
      return () => {
        store.events.detach('change', handler)
        store.events.detach('filter', handler)
        store.events.detach('sort', handler)
      }
    },
    [store],
  )

  const getSnapshot = useCallback(() => versionRef.current, [])

  useSyncExternalStore(subscribe, getSnapshot)

  const source = store ? visibleStoreRows(store) : data
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
