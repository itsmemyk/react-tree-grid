import { EventSystem } from '../events/EventSystem'
import { uid, extend, copy, isDefined, isId, isEmptyObj } from '../utils/common'
import { Sort } from './Sort'
import type {
  DataItem,
  SortRule,
  SortConfig,
  FilterRule,
  FilterRuleConfig,
  FilterConfig,
  StoredFilter,
  ChangeEntry,
  DataStoreConfig,
} from './types'
import { DataEvents } from './types'

/**
 * DataStore — faithful conversion of DHTMLX DataCollection (suite.js lines 8258-9040).
 *
 * Core data management class with:
 * - O(1) id lookup via _pull
 * - Ordered display via _order
 * - Stackable, permanent filters with restore
 * - Multi-column sorting with smart cycling
 * - Change tracking (max 10 per item)
 * - Per-item metadata via WeakMap
 * - Before/after events with veto pattern
 */
export class DataStore<T extends DataItem = DataItem> {
  // Core data structures
  _pull: Record<string, T> = {}
  _order: T[] = []
  _initFilterOrder: T[] | null = null
  _initSortOrder: T[] | null = null
  _filters: Record<string, StoredFilter> = {}
  _sortingStates: SortRule[] = []
  _changes: { order: ChangeEntry[] } = { order: [] }
  _meta: WeakMap<T, Record<string, unknown>> = new WeakMap()
  _range: [number, number] | null = null
  _loaded = false

  config: DataStoreConfig
  events: EventSystem

  private _sort: Sort
  private _sorter: SortRule | null = null

  constructor(config?: DataStoreConfig, events?: EventSystem) {
    this.config = config || {}
    this._sort = new Sort()
    this.events = events || new EventSystem(this)
    this._reset()
  }

  // --- Reset ---

  _reset(): void {
    this._order = []
    this._pull = {}
    this._changes = { order: [] }
    this._initFilterOrder = this._initSortOrder = null
    this._meta = new WeakMap()
    this._loaded = false
  }

  // --- CRUD ---

  /** Add one or more items. Fires beforeAdd/afterAdd events. Returns id(s). */
  add(newItem: T | T[], index?: number): string | string[] | undefined {
    if (!this.events.fire(DataEvents.beforeAdd, [newItem])) {
      return undefined
    }
    let out: string | string[]
    if (Array.isArray(newItem)) {
      let idx = index
      out = newItem.map((element, key) => {
        if (key !== 0 && idx !== undefined && idx >= 0) {
          idx = idx + 1
        }
        return this._add(copy(element) as T, idx)
      })
    } else {
      out = this._add(copy(newItem) as T, index)
    }
    this._reapplyFilters()
    return out
  }

  /** Remove one or more items by id */
  remove(id: string | string[]): void {
    if (Array.isArray(id)) {
      ;[...id].forEach((elementId) => this._remove(elementId))
    } else if (isId(id)) {
      this._remove(id as string)
    }
  }

  /** Remove all items and reset state */
  removeAll(): void {
    this._reset()
    this.events.fire(DataEvents.removeAll)
    this.events.fire(DataEvents.change)
  }

  /** Check if an item with the given id exists */
  exists(id: string): boolean {
    return !!this._pull[id]
  }

  /** Get item by id */
  getItem(id: string): T {
    return this._pull[id]
  }

  /** Update an item with partial changes */
  update(id: string, newItem: Partial<T>, silent = false): void {
    const item = this.getItem(id)
    if (item) {
      if (isId((newItem as DataItem).id) && id !== (newItem as DataItem).id) {
        console.warn("DataStore: update doesn't allow changing the id")
        return
      }
      extend(this._pull[id] as unknown as Record<string, unknown>, newItem as Record<string, unknown>, false)
      if (this.config.update) {
        this.config.update(this._pull[id])
      }
      if (!silent) {
        this._onChange('update', id, this._pull[id])
      }
      this._reapplyFilters()
    }
  }

  /** Get the index of an item in the current order */
  getIndex(id: string): number {
    if (!isId(id) || !isDefined(this._pull[id])) return -1
    return this._order.findIndex((i) => i?.id == id)
  }

  /** Get the id of the item at a given index */
  getId(index: number): string | undefined {
    if (!this._order[index]) return undefined
    return this._order[index].id
  }

  /** Get the number of items in the current display order */
  getLength(): number {
    return this._order.length
  }

  /** Get nearest valid id (first item if given id doesn't exist) */
  getNearId(id: string): string {
    const item = this._pull[id]
    if (!item) {
      return this._order[0]?.id || ''
    }
    return id
  }

  // --- Iteration ---

  forEach(callback: (item: T, index: number, array: T[]) => void): void {
    for (let i = 0; i < this._order.length; i++) {
      callback.call(this, this._order[i], i, this._order)
    }
  }

  map<R>(callback: (item: T, index: number, array: T[]) => R): R[] {
    const result: R[] = []
    for (let i = 0; i < this._order.length; i++) {
      result.push(callback.call(this, this._order[i], i, this._order))
    }
    return result
  }

  mapRange<R>(
    from: number,
    to: number,
    callback: (item: T, index: number, array: T[]) => R,
  ): R[] {
    if (from < 0) from = 0
    if (to > this._order.length - 1) to = this._order.length - 1
    const arr = this._order.slice(from, to + 1)
    const result: R[] = []
    for (let i = from; i <= to; i++) {
      result.push(callback.call(this, this._order[i], i, arr))
    }
    return result
  }

  reduce<R>(callback: (acc: R, item: T, index: number) => R, acc: R): R {
    for (let i = 0; i < this._order.length; i++) {
      acc = callback.call(this, acc, this._order[i], i)
    }
    return acc
  }

  /** Find first matching item (searches unfiltered data) */
  find(conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig): T | null {
    const data = this._initFilterOrder || this._order
    for (let i = 0; i < data.length; i++) {
      const res = this._findByConf(data[i], conf, i, data)
      if (res) return res
    }
    return null
  }

  /** Find all matching items (searches unfiltered data) */
  findAll(conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig): T[] {
    const data = this._initFilterOrder || this._order
    const result: T[] = []
    for (let i = 0; i < data.length; i++) {
      const item = this._findByConf(data[i], conf, i, data)
      if (item) result.push(item)
    }
    return result
  }

  // --- Filtering ---

  /**
   * Apply a filter. Supports stacking, permanent filters, and config-based or function rules.
   * Returns the filter ID.
   */
  filter(rule: FilterRule | null, config?: FilterConfig, silent = false): string | undefined {
    if (config?.$restore) {
      rule = this._normalizeFilters(rule || this._filters)
    }

    if (!config?.add) {
      this._order = this._initFilterOrder || this._order
      this._initFilterOrder = null
      if (!config?.$restore) {
        for (const key in this._filters) {
          const filter = this._filters[key]
          if (filter.config?.permanent) {
            this._applyFilters(filter.rule)
          } else {
            delete this._filters[key]
          }
        }
      }
    }

    let id: string | undefined
    if (rule && !config?.$restore) {
      id = config?.id || uid()
      this._filters[id] = { rule, config: config || {} }
    }

    if (rule && typeof rule !== 'function') {
      if (isDefined((rule as FilterRuleConfig).by)) {
        this._applyFilters(rule)
      } else {
        for (const key in rule as Record<string, FilterRuleConfig>) {
          this._applyFilters((rule as Record<string, FilterRuleConfig>)[key])
        }
      }
    } else {
      this._applyFilters(rule)
    }

    if (!silent) {
      const filters = this._getPureFilters(this._filters)
      this.events.fire(
        DataEvents.filter,
        [isEmptyObj(filters) ? null : filters],
      )
    }
    return id
  }

  /** Reset filters. Returns true if all non-permanent filters were removed. */
  resetFilter(
    config?: { id?: string; permanent?: boolean },
    silent = false,
  ): boolean {
    const { id, permanent } = config || {}
    if (!config || isEmptyObj(config as Record<string, unknown>)) {
      for (const key in this._filters) {
        if (!this._filters[key].config?.permanent) {
          delete this._filters[key]
        }
      }
    } else if (permanent) {
      this._filters = {}
    } else if (id) {
      delete this._filters[id]
    }
    this.filter(null, { $restore: true }, silent)
    return isEmptyObj(this._getPureFilters(this._filters))
  }

  /** Get active (non-local) filters */
  getFilters(config?: { permanent?: boolean }): Record<string, StoredFilter> | null {
    const filters = this.getRawFilters(config)
    const pureFilters = filters ? this._getPureFilters(filters) : {}
    return isEmptyObj(pureFilters) ? null : pureFilters
  }

  /** Get raw filters (optionally only permanent) */
  getRawFilters(config?: { permanent?: boolean }): Record<string, StoredFilter> | null {
    let filters = this._filters
    if (config?.permanent) {
      filters = Object.keys(filters).reduce(
        (obj: Record<string, StoredFilter>, key) => {
          if (filters[key].config?.permanent) {
            obj[key] = filters[key]
          }
          return obj
        },
        {},
      )
    }
    return isEmptyObj(filters) ? null : filters
  }

  /** Get the unfiltered data order */
  getInitialData(): T[] | null {
    return this._initFilterOrder
  }

  // --- Sorting ---

  /**
   * Sort by a rule. Supports multi-column and smart sorting (click cycling).
   */
  sort(rule: SortRule | null, config?: SortConfig, ignore = false): void {
    if (config?.smartSorting) {
      this._sorter = rule
    }

    if (
      !ignore &&
      rule &&
      (!this._sortingStates.length ||
        config?.smartSorting ||
        (!this._sortingStates[0]?.smartSorting && !config?.smartSorting))
    ) {
      this._sortingStates = [{ ...rule, ...config }]
    }

    if (rule) {
      if (!ignore) {
        this._initSortOrder =
          this._initSortOrder || [...(this._initFilterOrder || this._order)]

        if (
          !config?.smartSorting &&
          this._sortingStates[0]?.smartSorting
        ) {
          const sortIndex = this._sortingStates.findIndex(
            (i) => i.by === rule.by,
          )
          if (sortIndex !== -1) {
            this._sortingStates[sortIndex].dir = rule.dir
          } else {
            this._sortingStates.push(rule)
          }
        }
      }
      this._applySorters()
    } else if (this._initSortOrder) {
      this._sortingStates = []
      this._order = this._initSortOrder
      this._sorter = null
      this._initSortOrder = null
      if (this._initFilterOrder) {
        this._initFilterOrder = null
        this.filter(null, { $restore: true }, true)
      }
    }

    if (!ignore) {
      this.events.fire(DataEvents.change, [undefined, 'sort', rule])
    }
  }

  /** Get current sorting states */
  getSortingStates(): SortRule[] {
    return this._sortingStates
  }

  // --- Data Loading / Parsing ---

  /** Parse data array into the store */
  parse(data: T[]): void {
    this._reset()
    this._parseData(data)
    this._reapplyFilters()
    this.events.fire(DataEvents.change, [undefined, 'load'])
    this.events.fire(DataEvents.load)
  }

  /** Serialize current order to plain objects (strips $ prefixed keys) */
  serialize(): T[] {
    const data: T[] = []
    for (let i = 0; i < this._order.length; i++) {
      const item = { ...this._order[i] }
      Object.keys(item).forEach((key) => {
        if (key.startsWith('$')) {
          delete (item as Record<string, unknown>)[key]
        }
      })
      if (!isDefined((item as Record<string, unknown>).parent)) {
        delete (item as Record<string, unknown>).parent
      }
      data.push(item as T)
    }
    return data
  }

  // --- Metadata ---

  setMeta(obj: T, key: string, value: unknown): void {
    if (!obj) return
    let map = this._meta.get(obj)
    if (!map) {
      map = {}
      this._meta.set(obj, map)
    }
    map[key] = value
  }

  getMeta(obj: T, key: string): unknown {
    const map = this._meta.get(obj)
    return map ? map[key] : null
  }

  getMetaMap(obj: T): Record<string, unknown> | undefined {
    return this._meta.get(obj)
  }

  // --- Change tracking ---

  isSaved(): boolean {
    return !this._changes.order.length
  }

  /** Change the id of an existing item */
  changeId(id: string, newId: string = uid(), silent = false): void {
    if (id === newId) return
    if (this.exists(newId)) {
      console.warn(`DataStore: item with ID ${newId} already exists`)
      return
    }
    const item = this.getItem(id)
    if (!item) {
      console.warn('DataStore: item not found')
    } else {
      item.id = newId
      extend(this._pull[id] as unknown as Record<string, unknown>, item as unknown as Record<string, unknown>)
      this._pull[newId] = this._pull[id]
      if (!silent) {
        this._onChange('update', newId, this._pull[newId])
      }
      delete this._pull[id]
    }
  }

  // --- Raw data access (for virtual scroll) ---

  setRange(from: number, to: number): void {
    this._range = !to ? null : [from, to]
  }

  getRawData(from: number, to: number, order?: T[], mode?: number): T[] {
    order = order || this._order
    if (mode === 1) return order

    if (this._range) {
      from = this._range[0] + from
      if (to === -1) {
        to = this._range[1]
      } else {
        const diff = Math.abs(to - from)
        to = from + diff > this._range[1] ? this._range[1] : from + diff
      }
    }

    if (!to || (from === 0 && (to === -1 || to === order.length))) {
      return order
    }
    if (from >= order.length) return []
    if (to === -1 || to > order.length) to = order.length

    const slice = order.slice(from, to)
    if (slice.some((item) => (item as Record<string, unknown>).$empty)) {
      this.events.fire(DataEvents.dataRequest, [from, to])
    }
    return slice
  }

  /** Copy item(s) — optionally to another DataStore */
  copy(
    id: string | string[],
    index: number,
    target?: DataStore<T>,
    targetId?: string,
  ): string | string[] | null {
    if (Array.isArray(id)) {
      return id.map((elementId, key) =>
        this._copy(elementId, index, target, targetId, key),
      ).filter((x): x is string => x !== null)
    }
    return this._copy(id, index, target, targetId)
  }

  /** Move item(s) — optionally to another DataStore */
  move(
    id: string | string[],
    index: number,
    target?: DataStore<T>,
    targetId?: string,
    newId?: string,
  ): string | string[] | null {
    if (Array.isArray(id)) {
      const movedIds: string[] = []
      id.forEach((elementId, key) => {
        const result = this._move(elementId, index, target, targetId, key)
        if (isId(result)) {
          movedIds.push(result as string)
        }
      })
      return movedIds
    }
    return this._move(id, index, target, targetId, 0, newId) ?? null
  }

  isDataLoaded(from?: number, to?: number): boolean {
    if (from !== undefined && to !== undefined) {
      return this._order
        .slice(from, to)
        .filter((item) => (item as Record<string, unknown>).$empty)
        .length === 0
    }
    if (!this._loaded) {
      this._loaded = !this.find((item) => !!(item as Record<string, unknown>).$empty)
    }
    return this._loaded
  }

  // --- Private methods ---

  private _add(newItem: T, index?: number): string {
    const id = this._addCore(newItem, index)
    this._onChange('add', newItem.id, newItem)
    this.events.fire(DataEvents.afterAdd, [newItem])
    return id
  }

  private _remove(id: string): void {
    const removedItem = this._pull[id]
    if (removedItem) {
      if (!this.events.fire(DataEvents.beforeRemove, [removedItem])) {
        return
      }
      this._removeCore(removedItem.id)
      this._onChange('remove', id, removedItem)
    }
    this.events.fire(DataEvents.afterRemove, [removedItem])
  }

  _addCore(obj: T, index?: number): string {
    if (this.config.init) {
      obj = this.config.init(obj) as T
    }
    obj.id = obj.id ?? uid()
    if (this._pull[obj.id]) {
      throw new Error(`DataStore: Item ${obj.id} already exists`)
    }
    if (this._initFilterOrder) {
      this._addToOrder(this._initFilterOrder, obj, index)
    }
    if (this._initSortOrder) {
      this._addToOrder(this._initSortOrder, obj, index)
    }
    this._addToOrder(this._order, obj, index)
    return obj.id
  }

  private _removeCore(id: string): void {
    if (this._pull[id]) {
      this._order = this._order.filter((el) => el.id !== id)
      if (this._initFilterOrder?.length) {
        this._initFilterOrder = this._initFilterOrder.filter(
          (el) => el.id !== id,
        )
      }
      if (this._initSortOrder?.length) {
        this._initSortOrder = this._initSortOrder.filter(
          (el) => el.id !== id,
        )
      }
      delete this._pull[id]
    }
  }

  private _parseData(data: T[]): void {
    let index = this._order.length
    for (const obj of data) {
      this._addCore(obj, index++)
    }
  }

  private _onChange(status: 'add' | 'update' | 'remove', id: string, obj: T): void {
    const maxStack = 10
    let itemCount = 0

    for (const item of this._changes.order) {
      const idx = this._changes.order.indexOf(item)
      if (item.id === id && !item.saving) {
        itemCount += 1
        if (
          idx === this._changes.order.length - 1 ||
          this._changes.order[idx + 1].id !== id
        ) {
          const updated = {
            ...item,
            obj: { ...obj } as DataItem,
            status,
          }
          itemCount += 1
          if (itemCount > maxStack) {
            this._changes.order.splice(idx, itemCount - maxStack, updated)
          } else {
            this._changes.order.splice(idx + 1, 0, updated)
          }
          this.events.fire(DataEvents.change, [id, status, obj])
          return
        }
      }
    }

    this._changes.order.push({
      id,
      status,
      obj: { ...obj } as DataItem,
      saving: false,
    })
    this.events.fire(DataEvents.change, [id, status, obj])
  }

  private _addToOrder(array: T[], obj: T, index?: number): void {
    if (index !== undefined && index >= 0 && array[index]) {
      this._pull[obj.id] = obj
      array.splice(index, 0, obj)
    } else {
      this._pull[obj.id] = obj
      array.push(obj)
    }
  }

  _applySorters(): void {
    if (this._sortingStates.length > 0) {
      this._order = this._sort.sort(this._order, this._sortingStates)
      if (this._initFilterOrder?.length) {
        this._sort.sort(this._initFilterOrder, this._sortingStates)
      }
    }
  }

  private _applyFilters(rule: FilterRule | null): void {
    if (!rule) return
    const filter =
      typeof rule !== 'function' ? this._getRuleCallback(rule as FilterRuleConfig) : rule
    if (!filter) return
    const fOrder = this._order.filter((item) => (filter as (item: T) => boolean)(item))
    if (!this._initFilterOrder) {
      this._initFilterOrder = this._order
    }
    this._order = fOrder
  }

  _reapplyFilters(): void {
    const permFilters = this.getFilters({ permanent: true })
    if (permFilters) {
      this.filter(permFilters as unknown as FilterRule, { $restore: true, add: true }, true)
    }
    if (this._sorter) {
      this._applySorters()
    }
  }

  private _getRuleCallback(
    rule: FilterRuleConfig,
  ): ((item: T) => boolean) | undefined {
    if (!isDefined(rule.by) || !isDefined(rule.match)) return undefined
    return rule.compare
      ? (obj: T) => rule.compare!(obj[rule.by], rule.match, obj, rule.multi)
      : (obj: T) => obj[rule.by] == rule.match
  }

  private _getPureFilters(
    filters: Record<string, StoredFilter>,
  ): Record<string, StoredFilter> {
    return Object.keys(filters).reduce(
      (obj: Record<string, StoredFilter>, key) => {
        if (!filters[key].config?.$local) {
          obj[key] = filters[key]
        }
        return obj
      },
      {},
    )
  }

  private _normalizeFilters(
    filters: FilterRule | Record<string, StoredFilter>,
  ): FilterRule {
    const rules: ((item: DataItem) => boolean)[] = []
    for (const key in filters as Record<string, StoredFilter>) {
      const entry = (filters as Record<string, StoredFilter>)[key]
      const rule = entry.rule
      if (typeof rule !== 'function') {
        if (isDefined((rule as FilterRuleConfig).by)) {
          const cb = this._getRuleCallback(rule as FilterRuleConfig)
          if (cb) rules.push(cb as (item: DataItem) => boolean)
        } else {
          for (const rKey in rule as Record<string, FilterRuleConfig>) {
            const cb = this._getRuleCallback(
              (rule as Record<string, FilterRuleConfig>)[rKey],
            )
            if (cb) rules.push(cb as (item: DataItem) => boolean)
          }
        }
      } else {
        rules.push(rule as (item: DataItem) => boolean)
      }
    }
    return { ...rules } as unknown as FilterRule
  }

  private _findByConf(
    item: T,
    conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig,
    index: number,
    array: T[],
  ): T | null {
    if (typeof conf === 'function') {
      return conf.call(this, item, index, array) ? item : null
    }
    if (isDefined(conf.by) && isDefined(conf.match)) {
      if (conf.compare) {
        return conf.compare(item[conf.by], conf.match, item, conf.multi) ? item : null
      }
      return item[conf.by] == conf.match ? item : null
    }
    return null
  }

  private _copy(
    id: string,
    index: number,
    target?: DataStore<T>,
    _targetId?: string,
    key?: number,
  ): string | null {
    if (!this.exists(id)) return null
    const newId = uid()
    if (key) {
      index = index === -1 ? -1 : index + key
    }
    if (target) {
      if (target.exists(id)) {
        target.add({ ...this._copyWithoutInternal(this.getItem(id)), id: newId } as T, index)
        return newId
      }
      target.add(this._copyWithoutInternal(this.getItem(id)) as T, index)
      return id
    }
    this.add({ ...this._copyWithoutInternal(this.getItem(id)), id: newId } as T, index)
    return newId
  }

  private _move(
    id: string,
    index: number,
    target?: DataStore<T>,
    targetId?: string,
    key?: number,
    newId?: string,
  ): string | null {
    if (!this.exists(id)) return null
    if (key && index < this.getIndex(id)) {
      index = index === -1 ? -1 : index + key
    }
    if (target && target !== this && this.exists(id)) {
      const item = copy(this.getItem(id), true) as T
      if (newId) item.id = newId
      if ((!newId && target.exists(id)) || (newId && target.exists(newId))) {
        item.id = uid()
      }
      if (targetId) {
        ;(item as Record<string, unknown>).parent = targetId
      }
      target.add(item, index)
      this.remove(id)
      return item.id
    }
    if (this.getIndex(id) === index) return null
    const spliced = this._order.splice(this.getIndex(id), 1)[0]
    if (index === -1) {
      index = this._order.length
    }
    this._order.splice(index, 0, spliced)
    this.events.fire(DataEvents.change, [id, 'update', this.getItem(id)])
    return id
  }

  private _copyWithoutInternal(item: T): Partial<T> {
    const result: Record<string, unknown> = {}
    for (const key in item) {
      if (!key.startsWith('$')) {
        result[key] = item[key]
      }
    }
    return result as Partial<T>
  }
}
