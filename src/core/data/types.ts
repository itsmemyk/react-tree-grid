/** Base data item — all items must have a string id */
export interface DataItem {
  id: string
  [key: string]: unknown
}

/** Sort direction */
export type SortDir = 'asc' | 'desc'

/** Sort rule for a single column */
export interface SortRule {
  /** Field to sort by */
  by: string
  /** Sort direction */
  dir: SortDir
  /** Custom value accessor (e.g. parse date before compare) */
  as?: (value: unknown) => unknown
  /** Custom comparison function (overrides natural compare) */
  rule?: (a: DataItem, b: DataItem) => number
  /** Whether this was set via smart sorting (click cycling) */
  smartSorting?: boolean
}

/** Config-based filter rule */
export interface FilterRuleConfig {
  /** Field to filter by */
  by: string
  /** Value to match */
  match: unknown
  /** Custom compare function */
  compare?: (
    value: unknown,
    match: unknown,
    item: DataItem,
    multi?: unknown,
  ) => boolean
  /** Multi-value for compare */
  multi?: unknown
}

/** Filter rule — either a function or a config object */
export type FilterRule =
  | ((item: DataItem) => boolean)
  | FilterRuleConfig
  | Record<string, FilterRuleConfig>

/** Stored filter entry */
export interface StoredFilter {
  rule: FilterRule
  config: FilterConfig
}

/** Filter configuration */
export interface FilterConfig {
  /** Add to existing filters (stack) instead of replacing */
  add?: boolean
  /** Permanent filter — reapplied on add/remove */
  permanent?: boolean
  /** Smart filter mode */
  smartFilter?: boolean
  /** Filter ID for stacking */
  id?: string
  /** Internal: local filter (excluded from getFilters) */
  $local?: boolean
  /** Internal: restore mode */
  $restore?: boolean
}

/** Change tracking entry */
export interface ChangeEntry {
  id: string
  status: 'add' | 'update' | 'remove'
  obj: DataItem
  saving: boolean
  error?: boolean
}

/** Sort configuration */
export interface SortConfig {
  /** Enable smart sorting: click cycles asc → desc → none */
  smartSorting?: boolean
}

/** DataStore configuration */
export interface DataStoreConfig {
  /** Item init callback — called on each item during add/parse */
  init?: (item: DataItem) => DataItem
  /** Item update callback — called after update */
  update?: (item: DataItem) => void
}

/** Tree filter type — which nodes to apply filter to */
export enum TreeFilterType {
  all = 'all',
  level = 'level',
  leafs = 'leafs',
}

/** Tree filter config extends FilterConfig */
export interface TreeFilterConfig extends FilterConfig {
  /** Which nodes to filter */
  type?: TreeFilterType
  /** Level number (when type='level') */
  level?: number
}

/** Tree item — extends DataItem with parent and items */
export interface TreeDataItem extends DataItem {
  parent?: string
  items?: TreeDataItem[]
  $opened?: boolean
}

/** Data events emitted by DataStore */
export enum DataEvents {
  change = 'change',
  load = 'load',
  afterAdd = 'afteradd',
  beforeAdd = 'beforeadd',
  afterRemove = 'afterremove',
  beforeRemove = 'beforeremove',
  removeAll = 'removeall',
  filter = 'filter',
  dataRequest = 'datarequest',
  loadError = 'loaderror',
}
