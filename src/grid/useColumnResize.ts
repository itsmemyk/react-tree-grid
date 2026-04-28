import { useCallback, useRef, useState } from 'react'
import type { GridColumn, GridRow } from './types'

/** Edge detection threshold in pixels */
const EDGE_THRESHOLD = 5

interface ColumnResizeEvents {
  onBeforeResizeStart?: (colId: string) => boolean | void
  onResize?: (colId: string, width: number) => void
  onAfterResizeEnd?: (colId: string, width: number) => void
}

/**
 * Manages interactive column resize for the Grid.
 * Faithful conversion of DHTMLX suite.js Resizer module.
 *
 * Detects pointer near column right edge in header, starts resize on drag.
 * Updates column widths in real time via direct DOM manipulation,
 * then commits to React state on drag end.
 */
export function useColumnResize<T extends GridRow>(
  _columns: GridColumn<T>[],
  events: ColumnResizeEvents,
) {
  void _columns
  const [widthOverrides, setWidthOverrides] = useState<Record<string, number>>({})
  const resizeState = useRef<{
    colId: string
    startX: number
    startWidth: number
    minWidth: number
    maxWidth: number
  } | null>(null)

  /** Get the effective width for a column (override or configured) */
  const getWidth = useCallback(
    (col: GridColumn<T>): number => {
      if (widthOverrides[col.id] !== undefined) return widthOverrides[col.id]
      return col.width ?? col.minWidth ?? 100
    },
    [widthOverrides],
  )

  /** Check if pointer is near the right edge of a header cell */
  const isNearRightEdge = useCallback(
    (e: React.PointerEvent, cellEl: HTMLElement): boolean => {
      const rect = cellEl.getBoundingClientRect()
      return e.clientX >= rect.right - EDGE_THRESHOLD
    },
    [],
  )

  /**
   * Pointer down on header cell — start resize if near right edge.
   * Returns the column ID being resized, or null if not starting a resize.
   */
  const handleHeaderPointerDown = useCallback(
    (e: React.PointerEvent, colId: string, currentWidth: number, col: GridColumn<T>): boolean => {
      const cellEl = e.currentTarget as HTMLElement
      if (!isNearRightEdge(e, cellEl)) return false
      if (col.resizable === false) return false

      if (events.onBeforeResizeStart) {
        const result = events.onBeforeResizeStart(colId)
        if (result === false) return false
      }

      e.preventDefault()
      cellEl.setPointerCapture(e.pointerId)

      resizeState.current = {
        colId,
        startX: e.clientX,
        startWidth: currentWidth,
        minWidth: col.minWidth ?? 20,
        maxWidth: col.maxWidth ?? Infinity,
      }

      document.body.classList.add('rgs-no-select-resize')

      const onMove = (moveEvent: PointerEvent) => {
        if (!resizeState.current) return
        const delta = moveEvent.clientX - resizeState.current.startX
        let newWidth = resizeState.current.startWidth + delta
        newWidth = Math.max(resizeState.current.minWidth, newWidth)
        newWidth = Math.min(resizeState.current.maxWidth, newWidth)

        // Direct DOM update for smooth dragging
        const headerCells = document.querySelectorAll(
          `[data-rgs-col-id="${colId}"]`,
        )
        headerCells.forEach((el) => {
          ;(el as HTMLElement).style.width = `${newWidth}px`
        })

        events.onResize?.(colId, newWidth)
      }

      const onUp = () => {
        document.body.classList.remove('rgs-no-select-resize')
        cellEl.removeEventListener('pointermove', onMove)
        cellEl.removeEventListener('pointerup', onUp)
        cellEl.removeEventListener('pointercancel', onUp)

        if (resizeState.current) {
          const finalColId = resizeState.current.colId
          // Read final width from DOM
          const firstCell = document.querySelector(
            `[data-rgs-col-id="${finalColId}"]`,
          ) as HTMLElement
          const finalWidth = firstCell
            ? parseInt(firstCell.style.width, 10) || resizeState.current.startWidth
            : resizeState.current.startWidth

          setWidthOverrides((prev) => ({ ...prev, [finalColId]: finalWidth }))
          events.onAfterResizeEnd?.(finalColId, finalWidth)
          resizeState.current = null
        }
      }

      cellEl.addEventListener('pointermove', onMove)
      cellEl.addEventListener('pointerup', onUp)
      cellEl.addEventListener('pointercancel', onUp)

      return true
    },
    [events, isNearRightEdge],
  )

  /** Pointer move on header cell — update cursor if near edge */
  const handleHeaderPointerMove = useCallback(
    (e: React.PointerEvent, col: GridColumn<T>): string | undefined => {
      if (resizeState.current) return 'col-resize'
      if (col.resizable === false) return undefined
      const cellEl = e.currentTarget as HTMLElement
      return isNearRightEdge(e, cellEl) ? 'col-resize' : undefined
    },
    [isNearRightEdge],
  )

  return {
    widthOverrides,
    getWidth,
    handleHeaderPointerDown,
    handleHeaderPointerMove,
  }
}
