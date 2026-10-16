import { useCallback, useEffect, useState } from 'react'
import type { DataStore } from '../core/data'
import type { DataItem, SortRule } from '../core/data/types'
import { DataEvents } from '../core/data/types'
import type { GridColumn, GridRow, SortOrder, SortState } from './types'

interface GridSortEvents {
  onBeforeSort?: (states: SortState[]) => boolean | void
  onAfterSort?: (states: SortState[]) => void
  /** Receives every sort rule, primary first */
  onRemoteSort?: (states: SortState[]) => void
}

function toSortStates(rules: SortRule[]): SortState[] {
  return rules
    .filter((rule) => typeof rule.by === 'string')
    .map((rule) => ({ columnId: rule.by as string, order: (rule.dir ?? 'asc') as SortOrder }))
}

/**
 * Manages sort state and header click-to-sort for the Grid.
 *
 * Behavior:
 * - Click header → cycle: asc → desc → asc
 * - Ctrl+click → add/modify secondary sort column (multi-sort)
 * - Fires events, then calls store.sort() with sort rules
 */
export function useGridSort<T extends GridRow>(
  store: DataStore<T & DataItem> | undefined,
  columns: GridColumn<T>[],
  events: GridSortEvents,
  defaultSortStates?: SortState[],
) {
  const [sortingStates, setSortingStates] = useState<SortState[]>(() => {
    const fromStore = store ? toSortStates(store.getSortingStates()) : []
    return fromStore.length ? fromStore : defaultSortStates ?? []
  })

  // Sorts applied straight to the store (e.g. store.sort() in app code) show in the headers
  useEffect(() => {
    if (!store) return
    const context = {}
    store.events.on(DataEvents.change, (_id: unknown, status: unknown) => {
      if (status === 'sort') setSortingStates(toSortStates(store.getSortingStates()))
    }, context)
    return () => store.events.detach(DataEvents.change, context)
  }, [store])

  const cycleOrder = (current: SortOrder | undefined): SortOrder => {
    if (!current) return 'asc'
    return current === 'asc' ? 'desc' : 'asc'
  }

  const handleHeaderClick = useCallback(
    (colId: string, ctrlKey: boolean) => {
      const col = columns.find((c) => c.id === colId)
      if (!col || col.sortable === false) return

      let next: SortState[]

      if (ctrlKey) {
        // Multi-sort: add/modify this column in the sort chain
        const existing = sortingStates.find((s) => s.columnId === colId)
        const newOrder = cycleOrder(existing?.order)

        if (existing) {
          next = sortingStates.map((s) => (s.columnId === colId ? { ...s, order: newOrder } : s))
        } else {
          next = [...sortingStates, { columnId: colId, order: newOrder }]
        }
      } else {
        // Single sort: replace all with this column
        const existing = sortingStates.length === 1
          ? sortingStates.find((s) => s.columnId === colId)
          : undefined
        const newOrder = cycleOrder(existing?.order)
        next = [{ columnId: colId, order: newOrder }]
      }

      // Fire before event
      if (events.onBeforeSort) {
        const result = events.onBeforeSort(next)
        if (result === false) return
      }

      // Apply sort — remote or local
      if (events.onRemoteSort) {
        events.onRemoteSort(next)
      } else if (store) {
        if (next.length === 0) {
          store.sort(null)
        } else {
          store.sort(next.map((rule) => ({ by: rule.columnId, dir: rule.order })))
        }
      }

      events.onAfterSort?.(next)
      setSortingStates(next)
    },
    [columns, store, events, sortingStates],
  )

  const getSortOrder = useCallback(
    (colId: string): SortOrder | undefined => {
      return sortingStates.find((s) => s.columnId === colId)?.order
    },
    [sortingStates],
  )

  const getSortIndex = useCallback(
    (colId: string): number => {
      if (sortingStates.length <= 1) return -1
      const idx = sortingStates.findIndex((s) => s.columnId === colId)
      return idx >= 0 ? idx + 1 : -1
    },
    [sortingStates],
  )

  return {
    sortingStates,
    handleHeaderClick,
    getSortOrder,
    getSortIndex,
  }
}
