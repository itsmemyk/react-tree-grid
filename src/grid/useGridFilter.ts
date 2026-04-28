import { useCallback, useRef, useSyncExternalStore } from 'react'
import type { DataStore } from '../core/data'
import type { DataItem } from '../core/data/types'
import type { GridColumn, GridRow } from './types'

export interface GridFilterState {
  /** Current filter values keyed by column id */
  values: Record<string, unknown>
  /** Set a filter value for a column (null/empty clears) */
  setFilterValue: (columnId: string, value: unknown) => void
  /** Clear all header filters */
  clearFilters: () => void
}

/**
 * useGridFilter — manages header filter state and syncs with DataStore.
 *
 * Each column filter is stored as a $local, permanent, stacked filter on the
 * DataStore with id = `__hf_${columnId}` so it doesn't collide with
 * user-defined filters.
 */
export function useGridFilter<T extends GridRow>(
  store: DataStore<T> | undefined,
  columns: GridColumn<T>[],
  onRemoteFilter?: (filters: Record<string, unknown>) => void,
): GridFilterState {
  const filterValues = useRef<Record<string, unknown>>({})
  const version = useRef(0)

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!store) return () => {}
      const handler = () => onStoreChange()
      store.events.on('filter', handler)
      return () => store.events.detach('filter', handler)
    },
    [store],
  )

  const getSnapshot = useCallback(() => version.current, [])

  useSyncExternalStore(subscribe, getSnapshot)

  const setFilterValue = useCallback(
    (columnId: string, value: unknown) => {
      const filterId = `__hf_${columnId}`
      const isEmpty = value === null || value === undefined || value === ''

      if (isEmpty) {
        delete filterValues.current[columnId]
      } else {
        filterValues.current[columnId] = value
      }

      if (onRemoteFilter) {
        onRemoteFilter({ ...filterValues.current })
        version.current++
        return
      }

      if (!store) return

      if (isEmpty) {
        store.resetFilter({ id: filterId })
      } else {
        const column = columns.find((c) => c.id === columnId)
        const headerCell = column?.header?.find((h) => h.content)
        const content = headerCell?.content

        let compare:
          | ((
              cellValue: unknown,
              match: unknown,
              item: DataItem,
            ) => boolean)
          | undefined

        if (content === 'inputFilter') {
          compare = (cellValue, match) =>
            String(cellValue ?? '')
              .toLowerCase()
              .includes(String(match).toLowerCase())
        }

        store.filter(
          {
            by: columnId,
            match: value,
            ...(compare ? { compare } : {}),
          },
          { id: filterId, add: true, permanent: true, $local: true },
        )
      }

      version.current++
    },
    [store, columns, onRemoteFilter],
  )

  const clearFilters = useCallback(() => {
    if (!store) return
    for (const columnId of Object.keys(filterValues.current)) {
      store.resetFilter({ id: `__hf_${columnId}` })
    }
    filterValues.current = {}
    version.current++
  }, [store])

  return {
    values: filterValues.current,
    setFilterValue,
    clearFilters,
  }
}
