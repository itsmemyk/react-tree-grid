import type { ReactNode } from 'react'

export interface TreeNode {
  id: string
  value: string
  icon?: ReactNode
  items?: TreeNode[]
  disabled?: boolean
  $opened?: boolean
}

export interface TreeRef {
  expand(id: string): void
  collapse(id: string): void
  expandAll(): void
  collapseAll(): void
  select(ids: string[]): void
  check(ids: string[]): void
}

export interface TreeProps {
  data: TreeNode[]
  checkbox?: boolean
  editable?: boolean
  /** 'item' = item is drag source; 'both' = item is source and drop target */
  dragItem?: 'item' | 'both'
  virtual?: boolean
  expanded?: string[]
  defaultExpanded?: string[]
  selected?: string[]
  checked?: string[]
  css?: string
  onSelect?: (id: string) => void
  onCheck?: (ids: string[]) => void
  onExpand?: (id: string) => void
  onCollapse?: (id: string) => void
  onEdit?: (id: string, newValue: string) => void
  onDrop?: (dragId: string, targetId: string, position: 'before' | 'after' | 'inside') => void
}
