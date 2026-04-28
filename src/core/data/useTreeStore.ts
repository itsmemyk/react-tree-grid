import { useRef, useState, useCallback, useEffect } from 'react'
import { TreeStore } from './TreeStore'
import type {
  TreeDataItem,
  DataStoreConfig,
  SortRule,
  SortConfig,
  FilterRule,
  FilterConfig,
  FilterRuleConfig,
} from './types'
import { DataEvents } from './types'

export interface UseTreeStoreOptions<T extends TreeDataItem> {
  data?: T[]
  config?: DataStoreConfig & { rootId?: string }
}

export interface UseTreeStoreReturn<T extends TreeDataItem> {
  /** Current flat display order (reactive) */
  items: T[]
  /** The underlying TreeStore instance */
  store: TreeStore<T>
  /** Add item(s) under a parent */
  add: (item: T | T[], index?: number, parent?: string) => string | string[] | undefined
  /** Remove item(s) by id */
  remove: (id: string | string[]) => void
  /** Update an item */
  update: (id: string, changes: Partial<T>, silent?: boolean) => void
  /** Get item by id */
  getItem: (id: string) => T
  /** Get root id */
  getRoot: () => string
  /** Get parent id or item */
  getParent: (id: string) => string | null
  /** Get direct children */
  getItems: (id: string) => T[]
  /** Check if node has children */
  haveItems: (id: string) => boolean
  /** Check existence */
  exists: (id: string) => boolean
  /** Sort */
  sort: (rule: SortRule | null, config?: SortConfig) => void
  /** Filter */
  filter: (rule: FilterRule | null, config?: FilterConfig) => string | undefined
  /** Traverse each child */
  eachChild: (id: string, callback: (item: T, index: number) => void, direct?: boolean) => void
  /** Traverse each parent */
  eachParent: (id: string, callback: (item: T) => void, self?: boolean) => void
  /** Serialize to nested tree structure */
  serialize: () => T[]
  /** Parse new data */
  parse: (data: T[]) => void
  /** Remove all */
  removeAll: (id?: string) => void
  /** Flatten tree for display (respects $opened) */
  flatten: (input: T[]) => T[]
  /** Find first matching */
  find: (conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig) => T | null
}

export function useTreeStore<T extends TreeDataItem>(
  options: UseTreeStoreOptions<T> = {},
): UseTreeStoreReturn<T> {
  const { data, config } = options

  const storeRef = useRef<TreeStore<T>>(null!)
  if (storeRef.current === null) {
    storeRef.current = new TreeStore<T>(config)
    if (data?.length) {
      storeRef.current.parse(data)
    }
  }
  const store = storeRef.current

  const [items, setItems] = useState<T[]>(() => [...store._order])

  useEffect(() => {
    const syncItems = () => setItems([...store._order])
    store.events.on(DataEvents.change, syncItems)
    store.events.on(DataEvents.load, syncItems)
    store.events.on(DataEvents.removeAll, syncItems)
    store.events.on(DataEvents.filter, syncItems)
    return () => { store.events.clear() }
  }, [store])

  return {
    items,
    store,
    add: useCallback(
      (item: T | T[], index?: number, parent?: string) => store.add(item, index, parent),
      [store],
    ),
    remove: useCallback((id: string | string[]) => store.remove(id), [store]),
    update: useCallback(
      (id: string, changes: Partial<T>, silent?: boolean) => store.update(id, changes, silent),
      [store],
    ),
    getItem: useCallback((id: string) => store.getItem(id), [store]),
    getRoot: useCallback(() => store.getRoot(), [store]),
    getParent: useCallback((id: string) => store.getParent(id), [store]),
    getItems: useCallback((id: string) => store.getItems(id), [store]),
    haveItems: useCallback((id: string) => store.haveItems(id), [store]),
    exists: useCallback((id: string) => store.exists(id), [store]),
    sort: useCallback(
      (rule: SortRule | null, cfg?: SortConfig) => {
        store.sort(rule, cfg)
        setItems([...store._order])
      },
      [store],
    ),
    filter: useCallback(
      (rule: FilterRule | null, cfg?: FilterConfig) => {
        const id = store.filter(rule, cfg)
        setItems([...store._order])
        return id
      },
      [store],
    ),
    eachChild: useCallback(
      (id: string, cb: (item: T, index: number) => void, direct?: boolean) =>
        store.eachChild(id, cb, direct),
      [store],
    ),
    eachParent: useCallback(
      (id: string, cb: (item: T) => void, self?: boolean) =>
        store.eachParent(id, cb, self),
      [store],
    ),
    serialize: useCallback(() => store.serialize() as T[], [store]),
    parse: useCallback((newData: T[]) => store.parse(newData), [store]),
    removeAll: useCallback((id?: string) => store.removeAll(id), [store]),
    flatten: useCallback((input: T[]) => store.flatten(input), [store]),
    find: useCallback(
      (conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig) =>
        store.find(conf),
      [store],
    ),
  }
}
