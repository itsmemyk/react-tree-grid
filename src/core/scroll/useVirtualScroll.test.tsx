import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useVirtualScroll } from './useVirtualScroll'

describe('useVirtualScroll', () => {
  it('returns initial 2D visible ranges and offsets', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalRows: 100,
        totalCols: 5,
        rowHeight: 20,
        colWidths: [100, 120, 140, 160, 180],
        containerWidth: 260,
        containerHeight: 100,
        overscan: 1,
      }),
    )

    expect(result.current.yStart).toBe(0)
    expect(result.current.yEnd).toBe(5)
    expect(result.current.xStart).toBe(0)
    expect(result.current.xEnd).toBe(3)
    expect(result.current.totalHeight).toBe(2000)
    expect(result.current.totalWidth).toBe(700)
    expect(result.current.offsetX).toBe(0)
    expect(result.current.offsetY).toBe(0)
  })

  it('updates both row and column windows on scroll', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalRows: 200,
        totalCols: 6,
        rowHeight: 25,
        colWidths: [80, 100, 120, 140, 160, 180],
        containerWidth: 250,
        containerHeight: 100,
        overscan: 1,
      }),
    )

    act(() => {
      result.current.onScroll(190, 175)
    })

    expect(result.current.scrollLeft).toBe(190)
    expect(result.current.scrollTop).toBe(175)
    expect(result.current.yStart).toBe(6)
    expect(result.current.yEnd).toBe(11)
    expect(result.current.xStart).toBe(1)
    expect(result.current.xEnd).toBe(4)
    expect(result.current.offsetX).toBe(80)
    expect(result.current.offsetY).toBe(150)
  })

  it('clamps scroll positions to content bounds', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalRows: 10,
        totalCols: 3,
        rowHeight: 30,
        colWidths: [100, 100, 100],
        containerWidth: 250,
        containerHeight: 120,
        overscan: 0,
      }),
    )

    act(() => {
      result.current.onScroll(999, 999)
    })

    expect(result.current.scrollLeft).toBe(50)
    expect(result.current.scrollTop).toBe(180)
    expect(result.current.yStart).toBe(6)
    expect(result.current.yEnd).toBe(9)
    expect(result.current.xStart).toBe(0)
    expect(result.current.xEnd).toBe(2)
  })

  it('accounts for split rows and columns like the suite visible-range helper', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalRows: 20,
        totalCols: 5,
        rowHeight: 20,
        colWidths: [50, 60, 70, 80, 90],
        containerWidth: 200,
        containerHeight: 160,
        topSplit: 1,
        bottomSplit: 1,
        leftSplit: 1,
        rightSplit: 1,
        headerHeight: 20,
        footerHeight: 20,
        overscan: 0,
      }),
    )

    act(() => {
      result.current.onScroll(70, 40)
    })

    expect(result.current.xStart).toBe(2)
    expect(result.current.xEnd).toBe(2)
    expect(result.current.yStart).toBe(3)
    expect(result.current.yEnd).toBe(6)
  })
})
