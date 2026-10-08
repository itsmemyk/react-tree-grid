import { useCallback, useMemo, useState } from 'react'

export interface UseVirtualScrollOptions {
  totalRows: number
  totalCols: number
  rowHeight: number
  /** Per-row heights (indexed like the rows); omit when every row is `rowHeight` tall. */
  rowHeights?: number[]
  colWidths: number[]
  containerWidth: number
  containerHeight: number
  overscan?: number
  leftSplit?: number
  rightSplit?: number
  topSplit?: number
  bottomSplit?: number
  /** Actual height of the top fixed rows; defaults to `topSplit * rowHeight`. */
  fixedTopHeight?: number
  /** Actual height of the bottom fixed rows; defaults to `bottomSplit * rowHeight`. */
  fixedBottomHeight?: number
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
  /** Top of a scrollable row (absolute index), relative to the start of the scroll area. */
  getRowTop: (index: number) => number
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

/** Index of the row containing `y`, given prefix offsets (offsets[i] = top of row i). */
function findRowAt(offsets: number[], y: number): number {
  let low = 0
  let high = offsets.length - 2
  while (low < high) {
    const mid = (low + high + 1) >> 1
    if (offsets[mid] <= y) low = mid
    else high = mid - 1
  }
  return Math.max(0, low)
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
  rowHeights,
  colWidths,
  containerWidth,
  containerHeight,
  overscan = 2,
  leftSplit = 0,
  rightSplit = 0,
  topSplit = 0,
  bottomSplit = 0,
  fixedTopHeight = topSplit * rowHeight,
  fixedBottomHeight = bottomSplit * rowHeight,
  headerHeight = 0,
  footerHeight = 0,
}: UseVirtualScrollOptions): UseVirtualScrollReturn {
  const [scrollState, setScrollState] = useState({ left: 0, top: 0 })

  const totalWidth = useMemo(
    () => colWidths.slice(0, totalCols).reduce((acc, width) => acc + width, 0),
    [colWidths, totalCols],
  )
  const viewportRowCount = Math.max(totalRows - topSplit - bottomSplit, 0)
  // Prefix offsets of the scrollable rows, only when heights vary
  const rowOffsets = useMemo(() => {
    if (!rowHeights) return null
    const offsets = new Array<number>(viewportRowCount + 1)
    offsets[0] = 0
    for (let i = 0; i < viewportRowCount; i += 1) {
      offsets[i + 1] = offsets[i] + (rowHeights[topSplit + i] ?? rowHeight)
    }
    return offsets
  }, [rowHeights, topSplit, viewportRowCount, rowHeight])
  const scrollRowsHeight = rowOffsets ? rowOffsets[viewportRowCount] : viewportRowCount * rowHeight
  const totalHeight = fixedTopHeight + scrollRowsHeight + fixedBottomHeight

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
  const adjustedContainerHeight = Math.max(
    containerHeight - headerHeight - footerHeight - fixedTopHeight - fixedBottomHeight,
    0,
  )

  let rawYStart: number
  let rawYEnd: number
  if (rowOffsets) {
    rawYStart = findRowAt(rowOffsets, scrollTop)
    rawYEnd = findRowAt(rowOffsets, scrollTop + Math.max(adjustedContainerHeight - 1, 0))
  } else {
    rawYStart = Math.floor(scrollTop / rowHeight)
    rawYEnd = rawYStart + Math.ceil(adjustedContainerHeight / rowHeight) - 1
  }
  const yStart = Math.max(0, rawYStart - overscan)
  // No scrollable rows → empty window (yEnd < yStart)
  const yEnd = viewportRowCount === 0
    ? yStart - 1
    : Math.min(viewportRowCount - 1, rawYEnd + overscan)

  const effectiveWidths = colWidths.slice(leftSplit, totalCols - rightSplit || totalCols)
  const xStart = effectiveWidths.length
    ? findStartIndex(effectiveWidths, scrollLeft, overscan)
    : 0
  const xEnd = effectiveWidths.length
    ? findEndIndex(effectiveWidths, scrollLeft, adjustedContainerWidth, overscan)
    : 0

  const offsetX = effectiveWidths.length ? sum(effectiveWidths, xStart) : 0
  const offsetY = rowOffsets ? rowOffsets[yStart] : yStart * rowHeight

  const getRowTop = useCallback(
    (index: number) => {
      const scrollIndex = index - topSplit
      return rowOffsets ? (rowOffsets[scrollIndex] ?? scrollRowsHeight) : scrollIndex * rowHeight
    },
    [rowOffsets, topSplit, rowHeight, scrollRowsHeight],
  )

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
    getRowTop,
    onScroll,
  }
}
