import { useCallback, useState } from 'react'
import type { DataStore } from '../core/data'
import type { DataItem } from '../core/data/types'
import type { GridColumn, GridRow, SortOrder, SortState } from './types'

interface GridSortEvents {
  onBeforeSort?: (states: SortState[]) => boolean | void
  onAfterSort?: (states: SortState[]) => void
  onRemoteSort?: (sortBy: string | null, sortDir: string | null) => void
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
  const [sortingStates, setSortingStates] = useState<SortState[]>(defaultSortStates ?? [])

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
        events.onRemoteSort(
          next.length > 0 ? next[0].columnId : null,
          next.length > 0 ? next[0].order : null,
        )
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
