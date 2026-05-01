import { useCallback, useRef, useState } from 'react'
import type { GridColumn, GridRow } from './types'

/** Default delays match DHTMLX tooltip timing. */
const SHOW_DELAY = 300
const HIDE_DELAY = 100

export interface TooltipState {
  content: string
  x: number
  y: number
  visible: boolean
}

interface GridTooltipResult {
  tooltipState: TooltipState | null
  handleCellMouseEnter: (
    e: React.MouseEvent,
    rowId: string,
    colId: string,
    row: GridRow,
    column: GridColumn,
  ) => void
  handleCellMouseLeave: () => void
}

/**
 * Manages Grid cell tooltip display.
 *
 * Faithful conversion of DHTMLX tooltip show/hide with delay pattern.
 * - Show after SHOW_DELAY ms on mouseenter; position below cursor.
 * - Hide after HIDE_DELAY ms on mouseleave.
 * - `tooltipTemplate(value, row, column)` on column overrides default content.
 * - Returns null content → no tooltip shown.
 */
export function useGridTooltip(tooltipEnabled: boolean): GridTooltipResult {
  const [tooltipState, setTooltipState] = useState<TooltipState | null>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (showTimer.current) {
      clearTimeout(showTimer.current)
      showTimer.current = null
    }
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }

  const handleCellMouseEnter = useCallback(
    (
      e: React.MouseEvent,
      _rowId: string,
      _colId: string,
      row: GridRow,
      column: GridColumn,
    ) => {
      if (!tooltipEnabled) return
      if (column.tooltip === false) return

      // Compute content: tooltipTemplate → column.template → raw value
      const rawValue = row[column.id]
      let content: string | null | undefined

      if (column.tooltipTemplate) {
        content = column.tooltipTemplate(rawValue, row, column)
      } else if (column.template) {
        const rendered = column.template(rawValue, row, column)
        if (
          typeof rendered === 'string' ||
          typeof rendered === 'number' ||
          typeof rendered === 'boolean'
        ) {
          content = String(rendered)
        }
        // JSX template with no tooltipTemplate → no tooltip
      } else {
        content = rawValue === null || rawValue === undefined ? '' : String(rawValue)
      }

      if (!content) return

      const x = e.clientX
      const y = e.clientY

      clearTimers()

      showTimer.current = setTimeout(() => {
        setTooltipState({ content, x, y, visible: true })
      }, SHOW_DELAY)
    },
    [tooltipEnabled],
  )

  const handleCellMouseLeave = useCallback(() => {
    clearTimers()
    hideTimer.current = setTimeout(() => {
      setTooltipState(null)
    }, HIDE_DELAY)
  }, [])

  return {
    tooltipState,
    handleCellMouseEnter,
    handleCellMouseLeave,
  }
}
