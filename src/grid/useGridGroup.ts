import { useCallback, useMemo, useState } from 'react'
import { applyGroupBy } from '../core/data/GroupBy'
import type { GridRow, SortState } from './types'

export function sortItems<T extends GridRow>(rows: T[], rules: SortState[]): T[] {
  if (rules.length === 0) return rows
  return [...rows].sort((a, b) => {
    for (const { columnId, order } of rules) {
      const aVal = String(a[columnId as keyof T] ?? '')
      const bVal = String(b[columnId as keyof T] ?? '')
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      if (cmp !== 0) return order === 'asc' ? cmp : -cmp
    }
    return 0
  })
}

function sortGroupTree<T extends GridRow>(
  rows: T[],
  groupOrder: string[],
  groupSorts: Record<string, 'asc' | 'desc'>,
  columnSortRules: SortState[],
  level: number,
): T[] {
  if (rows.length === 0 || level >= groupOrder.length) return rows
  const colId = groupOrder[level]
  const dir = groupSorts[colId] ?? 'asc'

  const sorted = [...rows].sort((a, b) => {
    const aVal = String(a[colId] ?? '')
    const bVal = String(b[colId] ?? '')
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return dir === 'asc' ? cmp : -cmp
  })

  return sorted.map((row) => {
    if (!row.$group) return row
    const items = (row as unknown as { items: T[] }).items ?? []
    const isLeafGroup = level === groupOrder.length - 1
    const sortedItems = isLeafGroup ? sortItems(items, columnSortRules) : items
    return { ...row, items: sortGroupTree(sortedItems, groupOrder, groupSorts, columnSortRules, level + 1) }
  })
}

export function getGroupLevel(rowId: string): number {
  const matches = rowId.match(/__group__/g)
  return matches ? matches.length - 1 : 0
}

export function getGroupCount(row: GridRow): number {
  const items = (row as unknown as { items?: GridRow[] }).items ?? []
  let count = 0
  for (const child of items) {
    if (child.$group) {
      count += getGroupCount(child)
    } else {
      count++
    }
  }
  return count
}

function flattenVisible<T extends GridRow>(
  rows: T[],
  collapsedGroups: Set<string>,
  level: number,
): T[] {
  const result: T[] = []
  for (const row of rows) {
    result.push({ ...row, $groupLevel: level })
    if (row.$group && !collapsedGroups.has(row.id)) {
      const children = (row as unknown as { items: T[] }).items ?? []
      result.push(...flattenVisible(children, collapsedGroups, level + 1))
    }
  }
  return result
}

export interface UseGridGroupResult<T extends GridRow> {
  active: boolean
  visibleRows: T[]
  groupOrder: string[]
  setGroupOrder: (order: string[]) => void
  addGroup: (colId: string, initialSort?: 'asc' | 'desc') => void
  removeGroup: (colId: string) => void
  groupSorts: Record<string, 'asc' | 'desc'>
  toggleGroupSort: (colId: string) => void
  collapsedGroups: Set<string>
  toggleExpanded: (groupRowId: string) => void
}

export function useGridGroup<T extends GridRow>(
  data: T[],
  initialOrder: string[] = [],
  columnSortRules: SortState[] = [],
): UseGridGroupResult<T> {
  const [groupOrder, setGroupOrderState] = useState<string[]>(initialOrder)
  const [groupSorts, setGroupSorts] = useState<Record<string, 'asc' | 'desc'>>({})
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const sortedTree = useMemo(() => {
    if (groupOrder.length === 0) return null
    const tree = applyGroupBy(data as Record<string, unknown>[], groupOrder) as T[]
    return sortGroupTree(tree, groupOrder, groupSorts, columnSortRules, 0)
  }, [data, groupOrder, groupSorts, columnSortRules])

  const visibleRows = useMemo<T[]>(() => {
    if (!sortedTree) return data
    return flattenVisible(sortedTree, collapsedGroups, 0)
  }, [sortedTree, collapsedGroups, data])

  const setGroupOrder = useCallback((order: string[]) => {
    setGroupOrderState(order)
    setCollapsedGroups(new Set())
  }, [])

  const addGroup = useCallback((colId: string, initialSort?: 'asc' | 'desc') => {
    setGroupOrderState((prev) => (prev.includes(colId) ? prev : [...prev, colId]))
    if (initialSort !== undefined) {
      setGroupSorts((prev) => ({ ...prev, [colId]: initialSort }))
    }
    setCollapsedGroups(new Set())
  }, [])

  const removeGroup = useCallback((colId: string) => {
    setGroupOrderState((prev) => prev.filter((id) => id !== colId))
    setGroupSorts((prev) => {
      const next = { ...prev }
      delete next[colId]
      return next
    })
    setCollapsedGroups(new Set())
  }, [])

  const toggleGroupSort = useCallback((colId: string) => {
    setGroupSorts((prev) => ({
      ...prev,
      [colId]: prev[colId] === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  const toggleExpanded = useCallback((groupRowId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupRowId)) {
        next.delete(groupRowId)
      } else {
        next.add(groupRowId)
      }
      return next
    })
  }, [])

  return {
    active: groupOrder.length > 0,
    visibleRows,
    groupOrder,
    setGroupOrder,
    addGroup,
    removeGroup,
    groupSorts,
    toggleGroupSort,
    collapsedGroups,
    toggleExpanded,
  }
}
