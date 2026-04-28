import { useRef, useState, useCallback, useEffect } from 'react'
import { DataStore } from './DataStore'
import type {
  DataItem,
  DataStoreConfig,
  SortRule,
  SortConfig,
  FilterRule,
  FilterConfig,
  FilterRuleConfig,
} from './types'
import { DataEvents } from './types'

export interface UseDataStoreOptions<T extends DataItem> {
  /** Initial data to parse into the store */
  data?: T[]
  /** DataStore configuration */
  config?: DataStoreConfig
}

export interface UseDataStoreReturn<T extends DataItem> {
  /** Current display order (reactive — updates on change) */
  items: T[]
  /** The underlying DataStore instance for direct access */
  store: DataStore<T>
  /** Add one or more items */
  add: (item: T | T[], index?: number) => string | string[] | undefined
  /** Remove one or more items by id */
  remove: (id: string | string[]) => void
  /** Update an item with partial changes */
  update: (id: string, changes: Partial<T>, silent?: boolean) => void
  /** Get item by id */
  getItem: (id: string) => T
  /** Get item index */
  getIndex: (id: string) => number
  /** Get total length */
  getLength: () => number
  /** Check existence */
  exists: (id: string) => boolean
  /** Sort */
  sort: (rule: SortRule | null, config?: SortConfig) => void
  /** Filter */
  filter: (rule: FilterRule | null, config?: FilterConfig) => string | undefined
  /** Reset filter */
  resetFilter: (config?: { id?: string; permanent?: boolean }) => boolean
  /** Find first matching item */
  find: (conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig) => T | null
  /** Find all matching items */
  findAll: (conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig) => T[]
  /** Serialize to plain objects */
  serialize: () => T[]
  /** Parse new data (replaces existing) */
  parse: (data: T[]) => void
  /** Remove all items */
  removeAll: () => void
}

/**
 * React hook that creates and manages a DataStore instance.
 * Triggers re-renders on data changes via the DataStore's event system.
 */
export function useDataStore<T extends DataItem>(
  options: UseDataStoreOptions<T> = {},
): UseDataStoreReturn<T> {
  const { data, config } = options

  const storeRef = useRef<DataStore<T>>(null!)
  if (storeRef.current === null) {
    storeRef.current = new DataStore<T>(config)
    if (data?.length) {
      storeRef.current.parse(data)
    }
  }
  const store = storeRef.current

  // Reactive state — a snapshot of _order that triggers re-renders
  const [items, setItems] = useState<T[]>(() => [...store._order])

  useEffect(() => {
    const syncItems = () => {
      setItems([...store._order])
    }

    store.events.on(DataEvents.change, syncItems)
    store.events.on(DataEvents.load, syncItems)
    store.events.on(DataEvents.removeAll, syncItems)
    store.events.on(DataEvents.filter, syncItems)

    return () => {
      store.events.clear()
    }
  }, [store])

  const add = useCallback(
    (item: T | T[], index?: number) => store.add(item, index),
    [store],
  )
  const remove = useCallback(
    (id: string | string[]) => store.remove(id),
    [store],
  )
  const update = useCallback(
    (id: string, changes: Partial<T>, silent?: boolean) =>
      store.update(id, changes, silent),
    [store],
  )
  const sort = useCallback(
    (rule: SortRule | null, cfg?: SortConfig) => {
      store.sort(rule, cfg)
      setItems([...store._order])
    },
    [store],
  )
  const filter = useCallback(
    (rule: FilterRule | null, cfg?: FilterConfig) => {
      const id = store.filter(rule, cfg)
      setItems([...store._order])
      return id
    },
    [store],
  )
  const resetFilter = useCallback(
    (cfg?: { id?: string; permanent?: boolean }) => {
      const result = store.resetFilter(cfg)
      setItems([...store._order])
      return result
    },
    [store],
  )
  const parse = useCallback(
    (newData: T[]) => store.parse(newData),
    [store],
  )
  const removeAll = useCallback(() => store.removeAll(), [store])

  return {
    items,
    store,
    add,
    remove,
    update,
    getItem: useCallback((id: string) => store.getItem(id), [store]),
    getIndex: useCallback((id: string) => store.getIndex(id), [store]),
    getLength: useCallback(() => store.getLength(), [store]),
    exists: useCallback((id: string) => store.exists(id), [store]),
    sort,
    filter,
    resetFilter,
    find: useCallback(
      (conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig) =>
        store.find(conf),
      [store],
    ),
    findAll: useCallback(
      (conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig) =>
        store.findAll(conf),
      [store],
    ),
    serialize: useCallback(() => store.serialize(), [store]),
    parse,
    removeAll,
  }
}
