import { EventSystem } from '../events/EventSystem'
import { uid, isDefined, isId, isEmptyObj } from '../utils/common'
import { DataStore } from './DataStore'
import type {
  DataItem,
  TreeDataItem,
  SortRule,
  SortConfig,
  FilterRule,
  FilterRuleConfig,
  FilterConfig,
  TreeFilterConfig,
  DataStoreConfig,
} from './types'
import { DataEvents, TreeFilterType } from './types'

function addToOrder<T extends TreeDataItem>(
  childs: Record<string, T[]>,
  obj: T,
  parent: string,
  index?: number,
): void {
  if (!childs[parent]) {
    childs[parent] = []
  }
  if (index !== undefined && index >= 0 && childs[parent][index]) {
    childs[parent].splice(index, 0, obj)
  } else if (index === -1) {
    childs[parent].push(obj)
  } else {
    childs[parent].push(obj)
  }
}

/**
 * TreeStore — faithful conversion of DHTMLX TreeCollection (suite.js lines 9328-10052).
 *
 * Extends DataStore with hierarchical data:
 * - Parent/child relationships via _childs map
 * - Recursive add/remove/traversal
 * - Tree-aware filtering (preserves parent chain)
 * - Tree-aware sorting (sorts within each parent)
 */
export class TreeStore<T extends TreeDataItem = TreeDataItem> extends DataStore<T> {
  _root: string
  _childs: Record<string, T[]> = {}
  _initChilds: Record<string, T[]> | null = null

  constructor(config?: DataStoreConfig & { rootId?: string }, events?: EventSystem) {
    super(config, events)
    this._root = config?.rootId || '_ROOT_' + uid()
    this._childs = { [this._root]: [] }
    this._initChilds = null
  }

  // --- CRUD overrides ---

  override add(newItem: T | T[], index = -1, parent: string = this._root): string | string[] | undefined {
    if (!this.events.fire(DataEvents.beforeAdd, [newItem])) {
      return undefined
    }
    if (typeof newItem !== 'object') {
      newItem = { value: newItem } as unknown as T
    }
    let out: string | string[]
    if (Array.isArray(newItem)) {
      out = newItem.map((element, key) => this._addTree(element, index, parent, key))
    } else {
      out = this._addTree(newItem, index, parent)
    }
    this._reapplyFilters()
    return out
  }

  override removeAll(id?: string): void {
    if (!isId(id)) {
      super.removeAll()
      this._initChilds = null
      this._childs = { [this._root]: [] }
    } else if (id && this._childs[id]) {
      const childs = [...this._childs[id]]
      for (const child of childs) {
        this.remove(child.id)
      }
    }
  }

  override update(id: string, newItem: Partial<T>, silent = false): void {
    const parent = (newItem as TreeDataItem).parent
    if (isDefined(parent) && !this.exists(parent as string) && parent !== this._root) {
      console.warn("TreeStore: item parent doesn't exist")
      return
    }
    super.update(id, newItem, silent)
  }

  getRoot(): string {
    return this._root
  }

  getParent(id: string, asObj?: false): string | null
  getParent(id: string, asObj: true): T | null
  getParent(id: string, asObj = false): string | T | null {
    if (!this._pull[id]) return null
    const parent = this._pull[id].parent!
    return asObj ? this._pull[parent] : parent
  }

  getItems(id: string): T[] {
    if (this._childs && this._childs[id]) {
      return this._childs[id]
    }
    return []
  }

  override getLength(): number
  getLength(id?: string): number | null
  getLength(id: string = this._root): number | null {
    if (!this._childs[id]) return null
    return this._childs[id].length
  }

  override getIndex(id: string): number {
    const parent = this.getParent(id)
    if (!parent || !this._childs[parent]) return -1
    return this._childs[parent].findIndex((i) => i?.id == id)
  }

  override getId(index: number, parent: string = this._root): string | undefined {
    if (!this._childs[parent] || !this._childs[parent][index]) return undefined
    return this._childs[parent][index].id
  }

  override getNearId(id: string): string {
    return id
  }

  haveItems(id: string): boolean {
    return id in this._childs
  }

  canCopy(id: string, target: string): boolean {
    if (id === target) return false
    let canCopyResult = true
    this.eachParent(target, (item) => {
      if (item.id === id) canCopyResult = false
    })
    return canCopyResult
  }

  // --- Traversal ---

  override forEach(callback: (item: T, index: number, array: T[]) => void, parent: string = this._root, level: number = Infinity): void {
    if (!this.haveItems(parent) || level < 1) return
    const array = this._childs[parent]
    for (let i = 0; i < array.length; i++) {
      callback.call(this, array[i], i, array)
      if (this.haveItems(array[i].id)) {
        this.forEach(callback, array[i].id, level - 1)
      }
    }
  }

  eachChild(id: string, callback: (item: T, index: number) => void, direct = true, checkItem: (item: T) => boolean = () => true): void {
    if (!this.haveItems(id)) return
    for (let i = 0; i < this._childs[id].length; i++) {
      callback.call(this, this._childs[id][i], i)
      if (direct && checkItem(this._childs[id][i])) {
        this.eachChild(this._childs[id][i].id, callback, direct, checkItem)
      }
    }
  }

  eachParent(id: string, callback: (item: T) => void, self = false): void {
    const item = this.getItem(id)
    if (!item) return
    if (self) callback.call(this, item)
    if (item.parent === this._root) return
    const parent = this.getItem(item.parent!)
    if (parent) {
      callback.call(this, parent)
      this.eachParent(item.parent!, callback)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override map<R>(callback: (item: T, index: number, array: any) => R, parent: string = this._root, direct = true): R[] {
    let result: R[] = []
    if (!this.haveItems(parent)) return result
    for (let i = 0; i < this._childs[parent].length; i++) {
      result.push(callback.call(this, this._childs[parent][i], i, this._childs))
      if (direct) {
        const childResult = this.map(callback, this._childs[parent][i].id, direct)
        result = result.concat(childResult)
      }
    }
    return result
  }

  /** Flatten tree into array (only includes children of $opened nodes) */
  flatten(input: T[]): T[] {
    const out: T[] = []
    input.forEach((a) => {
      out.push(a)
      const kids = this._childs[a.id]
      if (kids && a.$opened) {
        out.push(...this.flatten(kids))
      }
    })
    return out
  }

  override getRawData(from: number, to: number, _order?: T[], mode?: number, parent?: string): T[] {
    parent = parent ?? this._root
    let out: T[]
    if (!this._childs[parent]) return []
    if (parent === this._root) {
      out = super.getRawData(from, to, this._childs[parent])
    } else {
      out = this._childs[parent]
    }
    if (mode === 2) {
      return this.flatten(out)
    }
    return out
  }

  // --- Sorting override ---

  override sort(rule: SortRule | null, config?: SortConfig, ignore = false): void {
    if (config?.smartSorting) {
      (this as unknown as Record<string, unknown>)._sorter = rule
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
          const sortIndex = this._sortingStates.findIndex((i) => i.by === rule.by)
          if (sortIndex !== -1) {
            this._sortingStates[sortIndex].dir = rule.dir
          } else {
            this._sortingStates.push(rule)
          }
        }
      }
      this._applySorters()
    } else if (this._initSortOrder) {
      this._childs = {}
      this._order = []
      this._sortingStates = []
      this._initSortOrder.forEach((item) => this._parseItem(item))
      ;(this as unknown as Record<string, unknown>)._sorter = null
      this._initSortOrder = null
      this._initChilds = null
      if (this._initFilterOrder) {
        this._initFilterOrder = null
        this.filter(null, { $restore: true } as TreeFilterConfig, true)
      }
    }

    if (!ignore) {
      this._reapplyFilters()
      this.events.fire(DataEvents.change, [undefined, 'sort', rule])
    }
  }

  // --- Filtering override ---

  override filter(rule: FilterRule | null, config?: FilterConfig, silent = false): string | undefined {
    const treeConfig = (config || {}) as TreeFilterConfig

    if (treeConfig.$restore) {
      rule = this._normalizeTreeFilters(rule || this._filters)
    }

    if (!rule || !treeConfig.add) {
      if (this._initChilds) {
        this._childs = this._initChilds
        this._initChilds = null
      }
      if (!treeConfig.$restore) {
        for (const key in this._filters) {
          const { rule: fRule, config: fConf } = this._filters[key]
          if ((fConf as TreeFilterConfig)?.permanent) {
            this._applyTreeFilter(fRule, fConf as TreeFilterConfig)
          } else {
            delete this._filters[key]
          }
        }
      }
    }

    let id: string | undefined
    if (rule && !treeConfig.$restore) {
      id = treeConfig.id || uid()
      treeConfig.type = treeConfig.type || TreeFilterType.all
      this._filters[id] = { rule, config: treeConfig }
      this._applyTreeFilter(rule, treeConfig)
    } else {
      for (const key in rule as Record<string, FilterRule>) {
        this._applyTreeFilter(
          (rule as Record<string, FilterRule>)[key],
          this._filters[key]?.config as TreeFilterConfig,
        )
      }
    }

    if (!silent) {
      const filters = this._getPureFiltersInternal(this._filters)
      this.events.fire(DataEvents.filter, [isEmptyObj(filters) ? null : filters])
    }
    return id
  }

  restoreOrder(): void {
    this.resetFilter({ permanent: true }, true)
    this.sort(null)
  }

  // --- Copy/Move overrides ---

  override copy(
    id: string | string[],
    index: number,
    target: DataStore<T> = this as unknown as DataStore<T>,
    targetId: string = this._root,
  ): string | string[] | null {
    if (Array.isArray(id)) {
      return id.map((elementId, key) =>
        this._copyTree(elementId, index, target as unknown as TreeStore<T>, targetId, key),
      ).filter((x): x is string => x !== null)
    }
    return this._copyTree(id, index, target as unknown as TreeStore<T>, targetId)
  }

  override move(
    id: string | string[],
    index: number,
    target?: DataStore<T>,
    targetId: string = this._root,
  ): string | string[] | null {
    target = target || (this as unknown as DataStore<T>)
    if (Array.isArray(id)) {
      const movedIds: string[] = []
      id.forEach((elementId, key) => {
        const result = this._moveTree(elementId, index, target as unknown as TreeStore<T>, targetId, key)
        if (isId(result)) movedIds.push(result as string)
      })
      return movedIds
    }
    return this._moveTree(id, index, target as unknown as TreeStore<T>, targetId) ?? null
  }

  // --- Serialization ---

  override serialize(checkItem?: (item: Partial<T>) => Partial<T>): T[] {
    return this._serializeTree(this._root, checkItem) as T[]
  }

  // --- Internal overrides ---

  override _reset(): void {
    super._reset()
    if (this._root) {
      this._initChilds = null
      this._childs = { [this._root]: [] }
    }
  }

  protected _removeTreeCore(id: string): void {
    if (this._pull[id]) {
      const parent = this.getParent(id) as string
      this._childs[parent] = this._childs[parent].filter((item) => item.id !== id)
      if (parent !== this._root && !this._childs[parent].length) {
        delete this._childs[parent]
      }
      if (this._initChilds && this._initChilds[parent]) {
        this._initChilds[parent] = this._initChilds[parent].filter((item) => item.id !== id)
        if (parent !== this._root && !this._initChilds[parent].length) {
          delete this._initChilds[parent]
        }
      }
      this._fastDeleteChilds(this._childs, id)
      if (this._initChilds) {
        this._fastDeleteChilds(this._initChilds, id)
      }
    }
  }

  protected _addToTreeOrder(_order: T[], obj: T, index?: number): void {
    const parent = obj.parent!
    this._pull[obj.id] = obj

    if (
      obj.parent &&
      this._pull[obj.parent] &&
      (this._pull[obj.parent] as TreeDataItem).items &&
      !(this._pull[obj.parent] as TreeDataItem).items!.find((item: DataItem) => item.id === obj.id)
    ) {
      ;(this._pull[obj.parent] as TreeDataItem).items!.push(obj)
    }

    // Call the grandparent _addToOrder (DataStore's version for _order array)
    if (index !== undefined && index >= 0 && _order[index]) {
      this._pull[obj.id] = obj
      _order.splice(index, 0, obj)
    } else {
      this._pull[obj.id] = obj
      _order.push(obj)
    }

    addToOrder(this._childs, obj, parent, index)
    if (this._initChilds) {
      addToOrder(this._initChilds, obj, parent, index)
    }
  }

  // Override _addCore to use tree-aware ordering
  override _addCore(obj: T, index?: number): string {
    if (this.config.init) {
      obj = this.config.init(obj) as T
    }
    obj.id = obj.id ?? uid()
    if (this._pull[obj.id]) {
      throw new Error(`TreeStore: Item ${obj.id} already exists`)
    }

    this._addToTreeOrder(this._order, obj, index)
    if (this._initFilterOrder) {
      addToOrder(this._childs, obj, obj.parent!, index)
    }
    if (this._initSortOrder) {
      // already handled in _addToTreeOrder
    }

    return obj.id
  }

  _parseTreeData(data: T[], parent: string = this._root): void {
    for (let obj of data) {
      if (this.config.init) {
        obj = this.config.init(obj) as T
      }
      if (obj && typeof obj !== 'object') {
        obj = { value: obj } as unknown as T
      }
      obj.id = obj.id ?? uid()
      obj.parent = obj.parent && !String(obj.parent).includes('_ROOT_')
        ? obj.parent
        : parent
      if (this._pull[obj.id]) {
        throw new Error(`TreeStore: Item ${obj.id} already exists`)
      }
      this._parseItem(obj)
      if (obj.items && obj.items instanceof Object) {
        this._parseTreeData(obj.items as T[], obj.id)
      }
    }
  }

  _parseItem(item: T): void {
    this._pull[item.id] = item
    this._order[this._order.length] = item
    if (!this._childs[item.parent!]) {
      this._childs[item.parent!] = []
    }
    this._childs[item.parent!].push(item)
  }

  override parse(data: T[]): void {
    this._reset()
    this._parseTreeData(data)
    this._reapplyFilters()
    this.events.fire(DataEvents.change, [undefined, 'load'])
    this.events.fire(DataEvents.load)
  }

  override _applySorters(): void {
    for (const key in this._childs) {
      (this as unknown as { _sort: { sort: (a: T[], s: SortRule[]) => T[] } })._sort.sort(this._childs[key], this._sortingStates)
    }
    if (this._initChilds && Object.keys(this._initChilds).length) {
      for (const key in this._initChilds) {
        (this as unknown as { _sort: { sort: (a: T[], s: SortRule[]) => T[] } })._sort.sort(this._initChilds[key], this._sortingStates)
      }
    }
  }

  // --- Private helpers ---

  private _addTree(newItem: T, index: number, parent: string, key?: number): string {
    this._setParent(newItem, parent)
    if (key !== undefined && key > 0 && index !== -1) {
      index = index + 1
    }
    const id = this._addTreeInternal(newItem, index)
    if (Array.isArray(newItem.items)) {
      for (const item of newItem.items) {
        this.add(item as T, -1, newItem.id)
      }
    }
    return id
  }

  private _addTreeInternal(newItem: T, index?: number): string {
    const id = this._addCore(newItem, index)
    this._onChangeInternal('add', newItem.id, newItem)
    this.events.fire(DataEvents.afterAdd, [newItem])
    return id
  }

  private _onChangeInternal(status: 'add' | 'update' | 'remove', id: string, obj: T): void {
    this._changes.order.push({
      id,
      status,
      obj: { ...obj } as DataItem,
      saving: false,
    })
    this.events.fire(DataEvents.change, [id, status, obj])
  }

  private _setParent(item: T, parent: string): void {
    item.parent = item.parent ? String(item.parent) : parent
    const parentItem = this._pull[item.parent] as TreeDataItem | undefined
    if (parentItem && !parentItem.items) {
      parentItem.items = []
    }
  }

  private _fastDeleteChilds(target: Record<string, T[]>, id: string): void {
    if (this._pull[id]) {
      if (this._initFilterOrder?.length) {
        this._initFilterOrder = this._initFilterOrder.filter((el) => el.id !== id)
      }
      if (this._initSortOrder?.length) {
        this._initSortOrder = this._initSortOrder.filter((el) => el.id !== id)
      }
      this._order = this._order.filter((el) => el.id !== id)
      delete this._pull[id]
    }
    if (!target[id]) return
    for (let i = 0; i < target[id].length; i++) {
      this._fastDeleteChilds(target, target[id][i].id)
    }
    delete target[id]
  }

  private _moveItem(id: string, targetId: string, index: number): void {
    const parentId = this.getParent(id) as string
    const childs = this._initChilds || this._childs

    for (const store of [this._childs, this._initChilds]) {
      if (!store || !store[parentId]) continue
      const i = store[parentId].findIndex((item) => item.id === id)
      if (i === -1) continue
      const item = store[parentId].splice(i, 1)[0]
      item.parent = targetId
      addToOrder(store, item, targetId, index)
      if (!store[parentId].length) delete store[parentId]
    }

    if (parentId !== this._root && parentId !== targetId) {
      const parent = this.getItem(parentId) as TreeDataItem
      if (childs[parentId]) {
        parent.items = [...childs[parentId]]
      } else {
        delete parent.items
      }
    }
    if (targetId !== this._root) {
      const target = this.getItem(targetId) as TreeDataItem
      target.items = [...(childs[targetId] || [])]
    }
  }

  private _copyTree(
    id: string,
    index: number,
    target: TreeStore<T>,
    targetId: string,
    key?: number,
  ): string | null {
    if (!this.exists(id)) return null
    const currentChilds = this._childs[id]
    if (key) index = index === -1 ? -1 : index + key

    if (target === this && !this.canCopy(id, targetId)) return null

    const itemCopy = this._copyWithoutInternalTree(this.getItem(id))
    if (target.exists(id)) {
      itemCopy.id = uid()
    }

    if (this.exists(id)) {
      itemCopy.parent = targetId
      if (target !== (this as unknown as TreeStore<T>) && targetId === this._root) {
        itemCopy.parent = target.getRoot()
      }
      target.add(itemCopy as T, index)
      id = itemCopy.id!
    }

    if (currentChilds) {
      for (const child of currentChilds) {
        const childIndex = this.getIndex(child.id)
        this.copy(child.id, childIndex, target as DataStore<T>, id)
      }
    }
    return id
  }

  private _moveTree(
    id: string,
    index: number,
    target: TreeStore<T>,
    targetId: string,
    key?: number,
  ): string | null {
    if (!this.exists(id)) return null
    if (key && index < this.getIndex(id)) {
      index = index === -1 ? -1 : index + key
    }
    if (target !== (this as unknown as TreeStore<T>)) {
      const returnId = this.copy(id, index, target as DataStore<T>, targetId)
      this.remove(id)
      return returnId as string | null
    }
    if (!this.canCopy(id, targetId)) return null
    this._moveItem(id, targetId, index)
    this.events.fire(DataEvents.change, [id, 'update', this.getItem(id)])
    return id
  }

  private _recursiveFilter(
    rule: FilterRule | Record<string, FilterRuleConfig>,
    config: TreeFilterConfig,
    current: string,
    level: number,
    newChilds: Record<string, T[]>,
  ): void {
    const childs = this._childs[current]
    if (!childs) return

    const condition = (item: T): boolean => {
      switch (config.type) {
        case TreeFilterType.all:
          return true
        case TreeFilterType.level:
          return level === config.level
        case TreeFilterType.leafs:
          return !this.haveItems(item.id)
        default:
          return true
      }
    }

    if (typeof rule === 'function') {
      const customRule = (item: T) => condition(item) && (rule as (item: T) => boolean)(item)
      const filtered = childs.filter(customRule)
      if (filtered.length) {
        newChilds[current] = filtered
      } else if (current === this._root) {
        newChilds[current] = []
      }
    } else {
      const ruleMap = rule as Record<string, FilterRuleConfig>
      const customRule = (item: T) => {
        let response = true
        for (const compare in ruleMap) {
          if (ruleMap[compare].by && ruleMap[compare].match !== '') {
            response = ruleMap[compare].compare
              ? ruleMap[compare].compare!(item[ruleMap[compare].by], ruleMap[compare].match, item)
              : String(item[ruleMap[compare].by] ?? '')
                  .toLowerCase()
                  .indexOf(String(ruleMap[compare].match).toLowerCase()) !== -1
          }
          if (!response) break
        }
        return condition(item) && response
      }
      const filtered = childs.filter(customRule)
      if (filtered.length) {
        newChilds[current] = filtered
      } else if (current === this._root) {
        newChilds[current] = []
      }
    }

    for (const child of childs) {
      this._recursiveFilter(rule, config, child.id, level + 1, newChilds)
    }
  }

  private _applyTreeFilter(rule: FilterRule, config: TreeFilterConfig): void {
    if (!rule || (typeof rule !== 'function' && isEmptyObj(rule as Record<string, unknown>))) return

    if (!this._initFilterOrder) {
      this._initFilterOrder = this._order
    }
    if (!this._initChilds) {
      this._initChilds = this._childs
    }

    let filter: FilterRule | Record<string, FilterRuleConfig>
    if (typeof rule !== 'function') {
      if (isDefined((rule as FilterRuleConfig).by)) {
        filter = { [(rule as FilterRuleConfig).by]: rule as FilterRuleConfig }
      } else {
        filter = rule as Record<string, FilterRuleConfig>
      }
    } else {
      filter = rule
    }

    const newChilds: Record<string, T[]> = {}
    this._recursiveFilter(filter, config, this._root, 0, newChilds)

    // Preserve parent chain
    Object.keys(newChilds).forEach((key) => {
      let parentId = this.getParent(key) as string | null
      let current = this.getItem(key)
      while (parentId) {
        if (!newChilds[parentId]) {
          newChilds[parentId] = []
        }
        if (current && !newChilds[parentId].find((x) => x.id === current.id)) {
          newChilds[parentId].push(current)
        }
        current = this.getItem(parentId)
        parentId = this.getParent(parentId) as string | null
      }
    })

    this._childs = newChilds
  }

  private _normalizeTreeFilters(filters: FilterRule | Record<string, { rule: FilterRule }>): FilterRule {
    const rules: Record<string, FilterRule> = {}
    for (const key in filters as Record<string, { rule: FilterRule }>) {
      rules[key] = (filters as Record<string, { rule: FilterRule }>)[key].rule
    }
    return rules as unknown as FilterRule
  }

  private _serializeTree(parent: string = this._root, fn?: (item: Partial<T>) => Partial<T>): Partial<T>[] {
    return this.map((item: T) => {
      const itemCopy: Record<string, unknown> = {}
      for (const key in item) {
        if (key === 'parent' || key === 'items' || key.startsWith('$')) continue
        itemCopy[key] = item[key]
      }
      let result = itemCopy as Partial<T>
      if (fn) result = fn(result)
      if (this.haveItems(item.id)) {
        ;(result as TreeDataItem).items = this._serializeTree(item.id, fn) as TreeDataItem[]
      }
      return result
    }, parent, false) as Partial<T>[]
  }

  private _copyWithoutInternalTree(item: T): Partial<T> {
    const result: Record<string, unknown> = {}
    for (const key in item) {
      if (!key.startsWith('$') && key !== 'items') {
        result[key] = item[key]
      }
    }
    return result as Partial<T>
  }

  private _getPureFiltersInternal(filters: Record<string, { rule: FilterRule; config: FilterConfig }>): Record<string, unknown> {
    return Object.keys(filters).reduce((obj: Record<string, unknown>, key) => {
      if (!filters[key].config?.$local) {
        obj[key] = filters[key]
      }
      return obj
    }, {})
  }
}
