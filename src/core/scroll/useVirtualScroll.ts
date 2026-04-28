import { useCallback, useMemo, useState } from 'react'

export interface UseVirtualScrollOptions {
  totalRows: number
  totalCols: number
  rowHeight: number
  colWidths: number[]
  containerWidth: number
  containerHeight: number
  overscan?: number
  leftSplit?: number
  rightSplit?: number
  topSplit?: number
  bottomSplit?: number
  headerHeight?: number
  footerHeight?: number
}

export interface UseVirtualScrollReturn {
  xStart: number
  xEnd: number
  yStart: number
  yEnd: number
  totalWidth: number
  totalHeight: number
  offsetX: number
  offsetY: number
  scrollLeft: number
  scrollTop: number
  onScroll: (scrollLeft: number, scrollTop: number) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function sum(values: number[], endExclusive: number): number {
  let total = 0
  for (let i = 0; i < endExclusive; i += 1) {
    total += values[i] ?? 0
  }
  return total
}

function findStartIndex(
  widths: number[],
  scrollLeft: number,
  overscan: number,
): number {
  let consumed = 0
  let index = 0

  while (index < widths.length && consumed + (widths[index] ?? 0) <= scrollLeft) {
    consumed += widths[index] ?? 0
    index += 1
  }

  return Math.max(0, index - overscan)
}

function findEndIndex(
  widths: number[],
  scrollLeft: number,
  containerWidth: number,
  overscan: number,
): number {
  const viewportEnd = scrollLeft + containerWidth
  let consumed = 0
  let index = 0

  while (index < widths.length && consumed < viewportEnd) {
    consumed += widths[index] ?? 0
    index += 1
  }

  return Math.min(widths.length - 1, Math.max(index - 1 + overscan, 0))
}

export function useVirtualScroll({
  totalRows,
  totalCols,
  rowHeight,
  colWidths,
  containerWidth,
  containerHeight,
  overscan = 2,
  leftSplit = 0,
  rightSplit = 0,
  topSplit = 0,
  bottomSplit = 0,
  headerHeight = 0,
  footerHeight = 0,
}: UseVirtualScrollOptions): UseVirtualScrollReturn {
  const [scrollState, setScrollState] = useState({ left: 0, top: 0 })

  const totalWidth = useMemo(
    () => colWidths.slice(0, totalCols).reduce((acc, width) => acc + width, 0),
    [colWidths, totalCols],
  )
  const totalHeight = totalRows * rowHeight

  const maxScrollLeft = Math.max(0, totalWidth - containerWidth)
  const maxScrollTop = Math.max(0, totalHeight - containerHeight)
  const scrollLeft = clamp(scrollState.left, 0, maxScrollLeft)
  const scrollTop = clamp(scrollState.top, 0, maxScrollTop)

  const fixedLeftWidth = sum(colWidths, leftSplit)
  const fixedRightWidth = rightSplit > 0 ? sum(colWidths, totalCols) - sum(colWidths, totalCols - rightSplit) : 0
  const adjustedContainerWidth = Math.max(
    containerWidth - fixedLeftWidth - fixedRightWidth,
    0,
  )
  const fixedTopHeight = topSplit * rowHeight
  const fixedBottomHeight = bottomSplit * rowHeight
  const adjustedContainerHeight = Math.max(
    containerHeight - headerHeight - footerHeight - fixedTopHeight - fixedBottomHeight,
    0,
  )

  const viewportRowCount = Math.max(totalRows - topSplit - bottomSplit, 0)
  const visibleRowCount = Math.ceil(adjustedContainerHeight / rowHeight)
  const rawYStart = Math.floor(scrollTop / rowHeight)
  const yStart = Math.max(0, rawYStart - overscan)
  const yEnd = Math.min(
    Math.max(viewportRowCount - 1, 0),
    rawYStart + visibleRowCount + overscan - 1,
  )

  const effectiveWidths = colWidths.slice(leftSplit, totalCols - rightSplit || totalCols)
  const xStart = effectiveWidths.length
    ? findStartIndex(effectiveWidths, scrollLeft, overscan)
    : 0
  const xEnd = effectiveWidths.length
    ? findEndIndex(effectiveWidths, scrollLeft, adjustedContainerWidth, overscan)
    : 0

  const offsetX = effectiveWidths.length ? sum(effectiveWidths, xStart) : 0
  const offsetY = yStart * rowHeight

  const onScroll = useCallback((left: number, top: number) => {
    setScrollState({
      left,
      top,
    })
  }, [])

  return {
    xStart: xStart + leftSplit,
    xEnd: xEnd + leftSplit,
    yStart: yStart + topSplit,
    yEnd: yEnd + topSplit,
    totalWidth,
    totalHeight,
    offsetX: offsetX + fixedLeftWidth,
    offsetY,
    scrollLeft,
    scrollTop,
    onScroll,
  }
}
