import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getGroupCount, getGroupLevel, useGridGroup } from './useGridGroup'
import type { GridRow } from './types'

const data: GridRow[] = [
  { id: '1', dept: 'Eng', status: 'active' },
  { id: '2', dept: 'Eng', status: 'inactive' },
  { id: '3', dept: 'HR', status: 'active' },
  { id: '4', dept: 'HR', status: 'active' },
]

describe('useGridGroup', () => {
  it('returns raw data when no groups active', () => {
    const { result } = renderHook(() => useGridGroup(data))
    expect(result.current.active).toBe(false)
    expect(result.current.visibleRows).toHaveLength(4)
    expect(result.current.visibleRows[0].id).toBe('1')
  })

  it('shows only group rows when grouping active and all collapsed', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept']))
    expect(result.current.active).toBe(true)
    expect(result.current.visibleRows).toHaveLength(2)
    expect(result.current.visibleRows[0].$group).toBe(true)
    expect(result.current.visibleRows[1].$group).toBe(true)
  })

  it('expands a group row to show its children', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept']))
    const engGroupId = result.current.visibleRows[0].id
    act(() => { result.current.toggleExpanded(engGroupId) })
    // Eng group + 2 children + HR group = 4 rows
    expect(result.current.visibleRows).toHaveLength(4)
    expect(result.current.visibleRows[0].$group).toBe(true)
    expect(result.current.visibleRows[1].$group).toBeFalsy()
    expect(result.current.visibleRows[2].$group).toBeFalsy()
    expect(result.current.visibleRows[3].$group).toBe(true)
  })

  it('collapses an expanded group', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept']))
    const engGroupId = result.current.visibleRows[0].id
    act(() => { result.current.toggleExpanded(engGroupId) })
    act(() => { result.current.toggleExpanded(engGroupId) })
    expect(result.current.visibleRows).toHaveLength(2)
  })

  it('child data rows get $groupLevel set to their nesting depth', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept']))
    const engGroupId = result.current.visibleRows[0].id
    act(() => { result.current.toggleExpanded(engGroupId) })
    const groupRow = result.current.visibleRows[0]
    const childRow = result.current.visibleRows[1]
    expect(groupRow.$groupLevel).toBe(0)
    expect(childRow.$groupLevel).toBe(1)
  })

  it('addGroup appends to groupOrder and ignores duplicates', () => {
    const { result } = renderHook(() => useGridGroup(data))
    act(() => { result.current.addGroup('dept') })
    expect(result.current.groupOrder).toEqual(['dept'])
    act(() => { result.current.addGroup('dept') })
    expect(result.current.groupOrder).toEqual(['dept'])
  })

  it('removeGroup removes from groupOrder', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept', 'status']))
    act(() => { result.current.removeGroup('dept') })
    expect(result.current.groupOrder).toEqual(['status'])
  })

  it('setGroupOrder replaces groupOrder and resets expanded', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept']))
    const groupId = result.current.visibleRows[0].id
    act(() => { result.current.toggleExpanded(groupId) })
    expect(result.current.expandedGroups.size).toBe(1)
    act(() => { result.current.setGroupOrder(['status', 'dept']) })
    expect(result.current.groupOrder).toEqual(['status', 'dept'])
    expect(result.current.expandedGroups.size).toBe(0)
  })

  it('toggleGroupSort defaults to desc on first toggle, then back to asc', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept']))
    expect(result.current.groupSorts['dept']).toBeUndefined()
    act(() => { result.current.toggleGroupSort('dept') })
    expect(result.current.groupSorts['dept']).toBe('desc')
    act(() => { result.current.toggleGroupSort('dept') })
    expect(result.current.groupSorts['dept']).toBe('asc')
  })

  it('desc sort reverses group order', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept']))
    act(() => { result.current.toggleGroupSort('dept') })
    expect(result.current.visibleRows[0].dept).toBe('HR')
    expect(result.current.visibleRows[1].dept).toBe('Eng')
  })

  it('toggleGroupSort resets expanded groups', () => {
    const { result } = renderHook(() => useGridGroup(data, ['dept']))
    const groupId = result.current.visibleRows[0].id
    act(() => { result.current.toggleExpanded(groupId) })
    expect(result.current.expandedGroups.size).toBe(1)
    act(() => { result.current.toggleGroupSort('dept') })
    expect(result.current.expandedGroups.size).toBe(0)
  })
})

describe('getGroupLevel', () => {
  it('returns 0 for a top-level group row id', () => {
    expect(getGroupLevel('__group__dept__Eng')).toBe(0)
  })

  it('returns 1 for a nested group row id', () => {
    expect(getGroupLevel('__group__dept__Eng__group__status__active')).toBe(1)
  })

  it('returns 0 for a plain data row id', () => {
    expect(getGroupLevel('user-abc-123')).toBe(0)
  })
})

describe('getGroupCount', () => {
  it('counts direct leaf children', () => {
    const row = {
      id: '__group__dept__Eng',
      $group: true,
      items: [{ id: '1' }, { id: '2' }],
    } as unknown as GridRow
    expect(getGroupCount(row)).toBe(2)
  })

  it('counts leaf children recursively through nested groups', () => {
    const row = {
      id: '__group__dept__Eng',
      $group: true,
      items: [
        {
          id: '__group__dept__Eng__group__status__active',
          $group: true,
          items: [{ id: '1' }, { id: '2' }],
        },
        {
          id: '__group__dept__Eng__group__status__inactive',
          $group: true,
          items: [{ id: '3' }],
        },
      ],
    } as unknown as GridRow
    expect(getGroupCount(row)).toBe(3)
  })
})
