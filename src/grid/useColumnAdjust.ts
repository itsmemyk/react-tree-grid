import { useMemo } from 'react'
import type { GridColumn, GridHeaderCell, GridFooterCell, GridRow } from './types'

/**
 * Grid `adjust` config option. Mirrors DHTMLX `adjust`:
 *   - `true`        — fit to widest of header/footer/data
 *   - `'header'`    — fit to widest header text only
 *   - `'footer'`    — fit to widest footer text only
 *   - `'data'`      — fit to widest data cell only
 *   - `false`/unset — no adjust
 *
 * Can be set on the grid (applies to all columns without their own adjust) or
 * per column via `GridColumn.adjust`.
 */
export type GridAdjustOption = boolean | 'data' | 'header' | 'footer'

/** Shared text metrics. DHTMLX uses `normal 14.4px Arial` in `getMaxColsWidth`. */
const FONT = 'normal 14.4px Arial'
/** DHTMLX horizontal padding + borders buffer for adjusted widths. */
const HORIZONTAL_OFFSET = 24
/** DHTMLX adds 16px for the sort icon when the column is sortable. */
const SORT_ICON_OFFSET = 16
/** DHTMLX line height for autoHeight measurement. */
const LINE_HEIGHT = 20
/** Minimum seed width used by DHTMLX `getMaxColsWidth`. */
const SEED_WIDTH = 20
/** Default vertical padding added by `getCalculatedRowHeight` when rowHeight ≥ 40. */
const VERTICAL_OFFSET = 10
/** Additional borders buffer used by DHTMLX `getMaxRowHeight` (24 + BORDERS=2). */
const ROW_HEIGHT_HORIZONTAL_OFFSET = 24 + 2

interface AdjustOptions<T extends GridRow> {
  columns: GridColumn<T>[]
  data: T[]
  adjust?: GridAdjustOption
  autoWidth?: boolean
  autoHeight?: boolean
  headerAutoHeight?: boolean
  footerAutoHeight?: boolean
  sortable?: boolean
  containerWidth?: number
  rowHeight: number
  headerRowHeight: number
  footerRowHeight: number
  /** Filtered/sorted rows — used by autoHeight. */
  visibleRows: T[]
  /** Footer aggregate values keyed by columnId. */
  footerValues?: Record<string, Record<number, string | number>>
}

export interface ColumnAdjustResult {
  /** Final width overrides keyed by columnId. */
  widthOverrides: Record<string, number>
  /** Per-row height override keyed by row id (autoHeight). */
  rowHeightOverrides: Record<string, number>
  /** Header row heights (`headerAutoHeight`). */
  headerRowHeights: number[]
  /** Footer row heights (`footerAutoHeight`). */
  footerRowHeights: number[]
}

function getCtx(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) return null
  ctx.font = FONT
  return ctx
}

function stripHtml(v: string): string {
  return v.replace(/<[^>]*>/g, '')
}

function cellText<T extends GridRow>(column: GridColumn<T>, row: T): string {
  const value = row[column.id]
  if (value === null || value === undefined) return ''
  if (column.template) {
    const rendered = column.template(value, row, column)
    const text = typeof rendered === 'string' || typeof rendered === 'number'
      ? String(rendered)
      : String(value)
    return column.htmlEnable ? stripHtml(text) : text
  }
  const text = String(value)
  return column.htmlEnable ? stripHtml(text) : text
}

function headerText(cell: GridHeaderCell | undefined): string {
  if (!cell) return ''
  return typeof cell.text === 'string' ? cell.text : ''
}

function footerText<T extends GridRow>(
  cell: GridFooterCell | undefined,
  column: GridColumn<T>,
  footerValues?: Record<string, Record<number, string | number>>,
  rowIndex = 0,
): string {
  if (!cell) return ''
  if (cell.content && footerValues?.[column.id]?.[rowIndex] !== undefined) {
    const raw = footerValues[column.id][rowIndex]
    if (cell.template) return cell.template(Number(raw), column)
    return String(raw)
  }
  return typeof cell.text === 'string' ? cell.text : ''
}

/** Break a string into wrapped lines by `maxWidth`, DHTMLX `getTextLines` style. */
function countWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): number {
  if (!text) return 1
  if (maxWidth <= 0) return 1
  if (ctx.measureText(text).width <= maxWidth) {
    // Still honor explicit newlines.
    return Math.max(1, text.split('\n').length)
  }
  let total = 0
  for (const segment of text.split('\n')) {
    if (!segment) {
      total += 1
      continue
    }
    const words = segment.split(/(\s+)/)
    let line = ''
    let lines = 0
    for (const word of words) {
      const tentative = line + word
      if (ctx.measureText(tentative).width > maxWidth && line) {
        lines += 1
        line = word.trimStart()
      } else {
        line = tentative
      }
    }
    if (line.length) lines += 1
    total += Math.max(1, lines)
  }
  return total
}

/** DHTMLX `getCalculatedRowHeight`. */
function getCalculatedRowHeight(height: number, rowHeight: number): number {
  const withOffset = rowHeight < 40 ? height : height + VERTICAL_OFFSET * 2
  return height < rowHeight ? rowHeight : withOffset
}

function computeAdjustForColumn<T extends GridRow>(
  ctx: CanvasRenderingContext2D,
  column: GridColumn<T>,
  mode: GridAdjustOption,
  rows: T[],
  sortable: boolean,
  footerValues?: Record<string, Record<number, string | number>>,
): number | undefined {
  let best = SEED_WIDTH
  const isHeader = mode === true || mode === 'header'
  const isFooter = mode === true || mode === 'footer'
  const isData = mode === true || mode === 'data'

  if (isHeader && column.header?.length) {
    for (const cell of column.header) {
      const width = ctx.measureText(headerText(cell)).width
      if (width > best) best = width
    }
  }

  if (isFooter && column.footer?.length) {
    for (let i = 0; i < column.footer.length; i += 1) {
      const width = ctx.measureText(
        footerText(column.footer[i], column, footerValues, i),
      ).width
      if (width > best) best = width
    }
  }

  if (isData) {
    for (const row of rows) {
      const width = ctx.measureText(cellText(column, row)).width
      if (width > best) best = width
    }
  }

  if (best === SEED_WIDTH && !(isHeader || isFooter || isData)) {
    return undefined
  }

  let adjusted = Math.ceil(best) + HORIZONTAL_OFFSET
  const columnSortable =
    column.sortable !== false && (sortable || column.sortable === true)
  if (isHeader && columnSortable) adjusted += SORT_ICON_OFFSET

  if (column.maxWidth !== undefined && adjusted > column.maxWidth) {
    adjusted = column.maxWidth
  }
  if (column.minWidth !== undefined && adjusted < column.minWidth) {
    adjusted = column.minWidth
  }
  return adjusted
}

interface AutoWidthColumn<T extends GridRow> {
  id: string
  column: GridColumn<T>
  baseWidth: number
  minWidth?: number
  maxWidth?: number
  fixed: boolean
  $width: number
}

/** Mirrors DHTMLX `applyAutoWidth` (render.js `applyAutoWidth`). */
function applyAutoWidthDistribution<T extends GridRow>(
  cols: AutoWidthColumn<T>[],
  totalWidth: number,
  isColumnFlexible: (col: GridColumn<T>) => boolean,
): void {
  if (totalWidth <= 0) return
  let flexible = cols.filter((c) => !c.fixed && isColumnFlexible(c.column))
  const fixed = cols.filter((c) => c.fixed || !isColumnFlexible(c.column))
  let checkLimit = true
  while (checkLimit) {
    checkLimit = false
    const fullGravity = flexible.reduce(
      (acc, c) => acc + (c.column.gravity ?? 1),
      0,
    )
    const fixedWidth = fixed.reduce((acc, c) => acc + c.$width, 0)
    const remaining = totalWidth - fixedWidth
    let clamped: AutoWidthColumn<T> | null = null
    for (const col of flexible) {
      const share = remaining > 0
        ? (remaining * (col.column.gravity ?? 1)) / fullGravity
        : 0
      const minLimit = col.minWidth !== undefined && share < col.minWidth
      const maxLimit = col.maxWidth !== undefined && share > col.maxWidth
      if (minLimit || maxLimit) {
        col.$width = minLimit ? col.minWidth! : col.maxWidth!
        clamped = col
        checkLimit = true
        break
      }
      col.$width = share
    }
    if (clamped) {
      flexible = flexible.filter((c) => c.id !== clamped!.id)
      fixed.push(clamped)
    }
  }
}

export function useColumnAdjust<T extends GridRow>(options: AdjustOptions<T>): ColumnAdjustResult {
  const {
    columns,
    data,
    adjust,
    autoWidth,
    autoHeight,
    headerAutoHeight,
    footerAutoHeight,
    sortable = false,
    containerWidth,
    rowHeight,
    headerRowHeight,
    footerRowHeight,
    visibleRows,
    footerValues,
  } = options

  return useMemo<ColumnAdjustResult>(() => {
    const result: ColumnAdjustResult = {
      widthOverrides: {},
      rowHeightOverrides: {},
      headerRowHeights: [],
      footerRowHeights: [],
    }

    const ctx = getCtx()

    // ── 1. Adjust widths (per-column or grid-level) ──────────────────
    const visibleCols = columns.filter((col) => !col.hidden)
    const adjustedWidths: Record<string, number> = {}
    const fixedByAdjust = new Set<string>()

    if (ctx) {
      for (const col of visibleCols) {
        const mode: GridAdjustOption | undefined =
          (col as GridColumn<T> & { adjust?: GridAdjustOption }).adjust ?? adjust
        if (!mode) continue
        const width = computeAdjustForColumn(ctx, col, mode, data, sortable, footerValues)
        if (width !== undefined) {
          adjustedWidths[col.id] = width
          fixedByAdjust.add(col.id)
        }
      }
    }

    // ── 2. AutoWidth distribution (fill container width) ─────────────
    if (autoWidth && containerWidth && containerWidth > 0) {
      const workingCols: AutoWidthColumn<T>[] = visibleCols.map((col) => {
        const base =
          adjustedWidths[col.id] ??
          col.width ??
          col.minWidth ??
          100
        const fixed = col.width !== undefined || fixedByAdjust.has(col.id)
        return {
          id: col.id,
          column: col,
          baseWidth: base,
          minWidth: col.minWidth,
          maxWidth: col.maxWidth,
          fixed,
          $width: base,
        }
      })

      const isColumnFlexible = (col: GridColumn<T>): boolean => {
        const colAuto = (col as GridColumn<T> & { autoWidth?: boolean }).autoWidth
        if (colAuto === true) return true
        if (colAuto === false) return false
        return Boolean(autoWidth)
      }

      applyAutoWidthDistribution(workingCols, containerWidth, isColumnFlexible)
      for (const c of workingCols) {
        // Only override if flexible (skip columns with explicit `width`).
        if (!c.fixed) {
          result.widthOverrides[c.id] = Math.max(SEED_WIDTH, Math.floor(c.$width))
        } else if (adjustedWidths[c.id] !== undefined) {
          result.widthOverrides[c.id] = adjustedWidths[c.id]
        }
      }
    } else {
      Object.assign(result.widthOverrides, adjustedWidths)
    }

    if (!ctx) return result

    // ── 3. Auto row heights ──────────────────────────────────────────
    if (autoHeight) {
      const widthFor = (col: GridColumn<T>): number => {
        const override = result.widthOverrides[col.id]
        if (override !== undefined) return override
        return col.width ?? col.minWidth ?? 100
      }
      for (const row of visibleRows) {
        let maxLines = 1
        for (const col of visibleCols) {
          const innerWidth = widthFor(col) - ROW_HEIGHT_HORIZONTAL_OFFSET
          const lines = countWrappedLines(ctx, cellText(col, row), innerWidth)
          if (lines > maxLines) maxLines = lines
        }
        const measured = maxLines * LINE_HEIGHT
        const finalHeight = getCalculatedRowHeight(measured, rowHeight)
        if (finalHeight !== rowHeight) {
          result.rowHeightOverrides[row.id] = finalHeight
        }
      }
    }

    // ── 4. Header auto row height ────────────────────────────────────
    if (headerAutoHeight) {
      const headerRowCount = visibleCols.reduce(
        (max, col) => Math.max(max, col.header?.length ?? 0),
        0,
      )
      for (let rowIdx = 0; rowIdx < headerRowCount; rowIdx += 1) {
        let maxLines = 1
        for (const col of visibleCols) {
          const colWidth =
            result.widthOverrides[col.id] ??
            col.width ??
            col.minWidth ??
            100
          const innerWidth = colWidth - ROW_HEIGHT_HORIZONTAL_OFFSET
          const cell = col.header?.[rowIdx]
          const lines = countWrappedLines(ctx, headerText(cell), innerWidth)
          if (lines > maxLines) maxLines = lines
        }
        const finalHeight = getCalculatedRowHeight(maxLines * LINE_HEIGHT, headerRowHeight)
        result.headerRowHeights[rowIdx] = finalHeight
      }
    }

    // ── 5. Footer auto row height ────────────────────────────────────
    if (footerAutoHeight) {
      const footerRowCount = visibleCols.reduce(
        (max, col) => Math.max(max, col.footer?.length ?? 0),
        0,
      )
      for (let rowIdx = 0; rowIdx < footerRowCount; rowIdx += 1) {
        let maxLines = 1
        for (const col of visibleCols) {
          const colWidth =
            result.widthOverrides[col.id] ??
            col.width ??
            col.minWidth ??
            100
          const innerWidth = colWidth - ROW_HEIGHT_HORIZONTAL_OFFSET
          const cell = col.footer?.[rowIdx]
          const lines = countWrappedLines(
            ctx,
            footerText(cell, col, footerValues, rowIdx),
            innerWidth,
          )
          if (lines > maxLines) maxLines = lines
        }
        const finalHeight = getCalculatedRowHeight(maxLines * LINE_HEIGHT, footerRowHeight)
        result.footerRowHeights[rowIdx] = finalHeight
      }
    }

    return result
  }, [
    columns,
    data,
    adjust,
    autoWidth,
    autoHeight,
    headerAutoHeight,
    footerAutoHeight,
    sortable,
    containerWidth,
    rowHeight,
    headerRowHeight,
    footerRowHeight,
    visibleRows,
    footerValues,
  ])
}
