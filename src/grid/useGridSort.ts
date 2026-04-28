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
 * Faithful conversion of DHTMLX suite.js Grid._initSort and _sortingStates.
 *
 * Behavior:
 * - Click header → cycle: asc → desc → none
 * - Ctrl+click → add/modify secondary sort column (multi-sort)
 * - Fires events, then calls store.sort() with sort rules
 */
export function useGridSort<T extends GridRow>(
  store: DataStore<T & DataItem> | undefined,
  columns: GridColumn<T>[],
  events: GridSortEvents,
) {
  const [sortingStates, setSortingStates] = useState<SortState[]>([])

  const cycleOrder = (current: SortOrder | undefined): SortOrder | null => {
    if (!current) return 'asc'
    if (current === 'asc') return 'desc'
    return null // remove sort
  }

  const handleHeaderClick = useCallback(
    (colId: string, ctrlKey: boolean) => {
      const col = columns.find((c) => c.id === colId)
      if (!col || col.sortable === false) return

      setSortingStates((prev) => {
        let next: SortState[]

        if (ctrlKey) {
          // Multi-sort: add/modify this column in the sort chain
          const existing = prev.find((s) => s.columnId === colId)
          const newOrder = cycleOrder(existing?.order)

          if (newOrder === null) {
            next = prev.filter((s) => s.columnId !== colId)
          } else if (existing) {
            next = prev.map((s) => (s.columnId === colId ? { ...s, order: newOrder } : s))
          } else {
            next = [...prev, { columnId: colId, order: newOrder }]
          }
        } else {
          // Single sort: replace all with this column
          const existing = prev.length === 1 ? prev.find((s) => s.columnId === colId) : undefined
          const newOrder = cycleOrder(existing?.order)

          if (newOrder === null) {
            next = []
          } else {
            next = [{ columnId: colId, order: newOrder }]
          }
        }

        // Fire before event
        if (events.onBeforeSort) {
          const result = events.onBeforeSort(next)
          if (result === false) return prev
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
            for (let i = next.length - 1; i >= 0; i--) {
              const rule = next[i]
              store.sort({ by: rule.columnId, dir: rule.order })
            }
          }
        }

        events.onAfterSort?.(next)
        return next
      })
    },
    [columns, store, events],
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
