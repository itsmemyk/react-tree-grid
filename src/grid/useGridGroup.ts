import { useCallback, useMemo, useState } from 'react'
import { applyGroupBy } from '../core/data/GroupBy'
import type { GridRow } from './types'

function sortGroupTree<T extends GridRow>(
  rows: T[],
  groupOrder: string[],
  groupSorts: Record<string, 'asc' | 'desc'>,
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
    return { ...row, items: sortGroupTree(items, groupOrder, groupSorts, level + 1) }
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
  expandedGroups: Set<string>,
  level: number,
): T[] {
  const result: T[] = []
  for (const row of rows) {
    result.push({ ...row, $groupLevel: level })
    if (row.$group && expandedGroups.has(row.id)) {
      const children = (row as unknown as { items: T[] }).items ?? []
      result.push(...flattenVisible(children, expandedGroups, level + 1))
    }
  }
  return result
}

export interface UseGridGroupResult<T extends GridRow> {
  active: boolean
  visibleRows: T[]
  groupOrder: string[]
  setGroupOrder: (order: string[]) => void
  addGroup: (colId: string) => void
  removeGroup: (colId: string) => void
  groupSorts: Record<string, 'asc' | 'desc'>
  toggleGroupSort: (colId: string) => void
  expandedGroups: Set<string>
  toggleExpanded: (groupRowId: string) => void
}

export function useGridGroup<T extends GridRow>(
  data: T[],
  initialOrder: string[] = [],
): UseGridGroupResult<T> {
  const [groupOrder, setGroupOrderState] = useState<string[]>(initialOrder)
  const [groupSorts, setGroupSorts] = useState<Record<string, 'asc' | 'desc'>>({})
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const sortedTree = useMemo(() => {
    if (groupOrder.length === 0) return null
    const tree = applyGroupBy(data as Record<string, unknown>[], groupOrder) as T[]
    return sortGroupTree(tree, groupOrder, groupSorts, 0)
  }, [data, groupOrder, groupSorts])

  const visibleRows = useMemo<T[]>(() => {
    if (!sortedTree) return data
    return flattenVisible(sortedTree, expandedGroups, 0)
  }, [sortedTree, expandedGroups, data])

  const setGroupOrder = useCallback((order: string[]) => {
    setGroupOrderState(order)
    setExpandedGroups(new Set())
  }, [])

  const addGroup = useCallback((colId: string) => {
    setGroupOrderState((prev) => (prev.includes(colId) ? prev : [...prev, colId]))
    setGroupSorts((prev) => (colId in prev ? prev : { ...prev, [colId]: 'asc' }))
    setExpandedGroups(new Set())
  }, [])

  const removeGroup = useCallback((colId: string) => {
    setGroupOrderState((prev) => prev.filter((id) => id !== colId))
    setGroupSorts((prev) => {
      const next = { ...prev }
      delete next[colId]
      return next
    })
    setExpandedGroups(new Set())
  }, [])

  const toggleGroupSort = useCallback((colId: string) => {
    setGroupSorts((prev) => ({
      ...prev,
      [colId]: prev[colId] === 'desc' ? 'asc' : 'desc',
    }))
    setExpandedGroups(new Set())
  }, [])

  const toggleExpanded = useCallback((groupRowId: string) => {
    setExpandedGroups((prev) => {
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
    expandedGroups,
    toggleExpanded,
  }
}
