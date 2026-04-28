import { useMemo } from 'react'
import type { GridColumn, GridRow, GridSpan } from './types'

export interface SpanInfo {
  /** Original span config */
  span: GridSpan
  /** Resolved row count */
  rowspan: number
  /** Resolved column count */
  colspan: number
  /** Sum of spanned column widths in pixels */
  width: number
  /** Sum of spanned row heights in pixels */
  height: number
}

export interface GridSpansResult {
  /** Get span info if this cell is the span origin */
  getSpan: (rowId: string, colId: string) => SpanInfo | undefined
  /** Check if this cell is covered (hidden) by another span */
  isCovered: (rowId: string, colId: string) => boolean
  /**
   * Extend the visible row/col range to include span origins that are
   * outside the viewport but whose spanned area overlaps it.
   */
  extendRange: (
    yStart: number,
    yEnd: number,
    xStart: number,
    xEnd: number,
  ) => { yStart: number; yEnd: number; xStart: number; xEnd: number }
}

/**
 * useGridSpans — builds lookup maps for cell spanning.
 *
 * Produces O(1) lookups for:
 * - span origins (cells that render with extended width/height)
 * - covered cells (cells hidden because they're inside a span)
 * - range extension (ensures partially visible spans are rendered)
 */
export function useGridSpans<T extends GridRow>(
  spans: GridSpan[] | undefined,
  columns: GridColumn<T>[],
  rowIds: string[],
  colWidths: Record<string, number>,
  rowHeights: Record<string, number>,
): GridSpansResult {
  return useMemo(() => {
    const origins = new Map<string, SpanInfo>()
    const covered = new Set<string>()

    if (!spans || spans.length === 0) {
      return {
        getSpan: () => undefined,
        isCovered: () => false,
        extendRange: (yStart, yEnd, xStart, xEnd) => ({
          yStart,
          yEnd,
          xStart,
          xEnd,
        }),
      }
    }

    // Build column index lookup
    const colIds = columns.filter((c) => !c.hidden).map((c) => c.id)
    const colIndexMap = new Map<string, number>()
    for (let i = 0; i < colIds.length; i++) {
      colIndexMap.set(colIds[i], i)
    }

    // Build row index lookup
    const rowIndexMap = new Map<string, number>()
    for (let i = 0; i < rowIds.length; i++) {
      rowIndexMap.set(rowIds[i], i)
    }

    for (const span of spans) {
      const rowIdx = rowIndexMap.get(span.row)
      const colIdx = colIndexMap.get(span.column)
      if (rowIdx === undefined || colIdx === undefined) continue

      const rowspan = Math.max(1, span.rowspan ?? 1)
      const colspan = Math.max(1, span.colspan ?? 1)

      // Calculate total pixel dimensions
      let width = 0
      for (
        let c = colIdx;
        c < Math.min(colIdx + colspan, colIds.length);
        c++
      ) {
        width += colWidths[colIds[c]] ?? 0
      }

      let height = 0
      for (
        let r = rowIdx;
        r < Math.min(rowIdx + rowspan, rowIds.length);
        r++
      ) {
        height += rowHeights[rowIds[r]] ?? 0
      }

      const key = `${span.row}-${span.column}`
      origins.set(key, { span, rowspan, colspan, width, height })

      // Mark covered cells (skip the origin itself)
      const rowEnd = Math.min(rowIdx + rowspan, rowIds.length)
      const colEnd = Math.min(colIdx + colspan, colIds.length)
      for (let ri: number = rowIdx; ri < rowEnd; ri++) {
        for (let ci: number = colIdx; ci < colEnd; ci++) {
          if (ri === rowIdx && ci === colIdx) continue
          covered.add(`${rowIds[ri]}-${colIds[ci]}`)
        }
      }
    }

    const getSpan = (rowId: string, colId: string) =>
      origins.get(`${rowId}-${colId}`)

    const isCovered = (rowId: string, colId: string) =>
      covered.has(`${rowId}-${colId}`)

    const extendRange = (
      yStart: number,
      yEnd: number,
      xStart: number,
      xEnd: number,
    ) => {
      let ys = yStart
      let ye = yEnd
      let xs = xStart
      let xe = xEnd

      for (const [, info] of origins) {
        const rIdx = rowIndexMap.get(info.span.row)!
        const cIdx = colIndexMap.get(info.span.column)!
        const rEnd = rIdx + info.rowspan - 1
        const cEnd = cIdx + info.colspan - 1

        // If the span overlaps the visible range, extend to include origin
        const rowOverlap = rIdx <= yEnd && rEnd >= yStart
        const colOverlap = cIdx <= xEnd && cEnd >= xStart
        if (rowOverlap && colOverlap) {
          ys = Math.min(ys, rIdx)
          ye = Math.max(ye, rEnd)
          xs = Math.min(xs, cIdx)
          xe = Math.max(xe, cEnd)
        }
      }

      return { yStart: ys, yEnd: ye, xStart: xs, xEnd: xe }
    }

    return { getSpan, isCovered, extendRange }
  }, [spans, columns, rowIds, colWidths, rowHeights])
}
