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

  it('sizes the row window from explicit fixed panel heights', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalRows: 20,
        totalCols: 1,
        rowHeight: 40,
        colWidths: [100],
        containerWidth: 100,
        containerHeight: 200,
        overscan: 0,
        topSplit: 2,
        // Two pinned rows of 20px each, not 2 × rowHeight
        fixedTopHeight: 40,
      }),
    )

    // 160px of scrollable band → 4 rows (indexes 2..5)
    expect(result.current.yStart).toBe(2)
    expect(result.current.yEnd).toBe(5)
  })

  it('returns an empty row window when every row is fixed', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalRows: 3,
        totalCols: 1,
        rowHeight: 40,
        colWidths: [100],
        containerWidth: 100,
        containerHeight: 200,
        topSplit: 1,
        bottomSplit: 2,
      }),
    )

    expect(result.current.yEnd).toBeLessThan(result.current.yStart)
  })

  describe('variable row heights', () => {
    // Every third row is 120px, the rest 40px: each triple spans 200px
    const heights = Array.from({ length: 300 }, (_, i) => (i % 3 === 0 ? 120 : 40))
    const total = heights.reduce((a, b) => a + b, 0)

    const setup = () => renderHook(() =>
      useVirtualScroll({
        totalRows: heights.length,
        totalCols: 1,
        rowHeight: 40,
        rowHeights: heights,
        colWidths: [100],
        containerWidth: 100,
        containerHeight: 400,
        overscan: 0,
      }),
    )

    it('uses the real total height', () => {
      expect(setup().result.current.totalHeight).toBe(total)
    })

    it('finds the first visible row from real offsets', () => {
      const { result } = setup()
      act(() => result.current.onScroll(0, 1000))
      // 1000px = 5 triples → row 15 starts exactly at 1000
      expect(result.current.yStart).toBe(15)
      expect(result.current.offsetY).toBe(1000)
      // 400px band: rows 15 (120) 16 (40) 17 (40) 18 (120) 19 (40) 20 (40) = 400
      expect(result.current.yEnd).toBe(20)
      expect(result.current.getRowTop(16)).toBe(1120)
    })

    it('reaches the last row at the end of the scroll range', () => {
      const { result } = setup()
      act(() => result.current.onScroll(0, total))
      expect(result.current.yEnd).toBe(heights.length - 1)
    })
  })
})
