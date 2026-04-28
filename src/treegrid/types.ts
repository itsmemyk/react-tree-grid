import type { GridColumn, GridProps, GridRow } from '../grid/types'
import type { GroupAggregateConfig } from '../core/data/GroupBy'

export interface TreeGridRow extends GridRow {
  parent?: string
  items?: TreeGridRow[]
  $opened?: boolean
}

export interface TreeGridRef {
  open(id: string): void
  close(id: string): void
  openAll(): void
  closeAll(): void
}

export type TreeGridDropBehaviour = 'child' | 'sibling' | 'complex'

export interface TreeGridProps<T extends TreeGridRow = TreeGridRow>
  extends Omit<GridProps<T>, 'data' | 'store'> {
  data: T[]
  columns: GridColumn<T>[]
  treeColumnId?: string
  collapsed?: boolean
  rootParent?: string
  dropBehaviour?: TreeGridDropBehaviour
  dragExpand?: boolean
  groupBy?: string | string[]
  groupAggregate?: GroupAggregateConfig
}
