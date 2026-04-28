import { useCallback, useState } from 'react'
import type { GridCellCoord, GridRow } from './types'

type SelectionMode = 'row' | 'cell' | 'complex'

interface GridSelectionEvents {
  onBeforeSelect?: (rowId: string, colId: string) => boolean | void
  onAfterSelect?: (rowId: string, colId: string) => void
  onBeforeUnSelect?: (rowId: string, colId: string) => boolean | void
  onAfterUnSelect?: (rowId: string, colId: string) => void
}

interface GridSelectionConfig {
  mode: SelectionMode
  multiselection: boolean
  disabled: boolean
  events: GridSelectionEvents
}

/**
 * Manages row and cell selection for the Grid.
 * Faithful conversion of DHTMLX suite.js Grid Selection (module 230).
 *
 * Modes:
 * - 'row': clicking a cell selects the entire row
 * - 'cell': clicking a cell selects just that cell
 * - 'complex': clicking selects both the row and highlights the specific cell
 *
 * Multi-selection:
 * - Ctrl+click: toggle item in selection
 * - Shift+click: range select from last selected to current
 */
export function useGridSelection<T extends GridRow>(
  data: T[],
  config: GridSelectionConfig,
) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [selectedCell, setSelectedCell] = useState<GridCellCoord | null>(null)
  const [lastClickedRow, setLastClickedRow] = useState<string | null>(null)

  const handleClick = useCallback(
    (rowId: string, colId: string, ctrlKey: boolean, shiftKey: boolean) => {
      if (config.disabled) return

      const { mode, multiselection, events } = config

      // Fire before event
      if (events.onBeforeSelect) {
        const result = events.onBeforeSelect(rowId, colId)
        if (result === false) return
      }

      // Always track the focused cell coordinate (needed for keyboard navigation).
      // Visual cell highlight only shows in cell/complex modes (see isCellSelected).
      setSelectedCell({ rowId, colId })

      if (mode === 'cell') {
        // Cell mode: select just the cell
        setSelectedRows(new Set())
      } else if (mode === 'row') {
        // Row mode: select the full row
        if (multiselection && ctrlKey) {
          setSelectedRows((prev) => {
            const next = new Set(prev)
            if (next.has(rowId)) {
              next.delete(rowId)
              events.onBeforeUnSelect?.(rowId, colId)
              events.onAfterUnSelect?.(rowId, colId)
            } else {
              next.add(rowId)
            }
            return next
          })
        } else if (multiselection && shiftKey && lastClickedRow) {
          // Range select
          const startIdx = data.findIndex((r) => r.id === lastClickedRow)
          const endIdx = data.findIndex((r) => r.id === rowId)
          if (startIdx >= 0 && endIdx >= 0) {
            const from = Math.min(startIdx, endIdx)
            const to = Math.max(startIdx, endIdx)
            const rangeIds = data.slice(from, to + 1).map((r) => r.id)
            setSelectedRows(new Set(rangeIds))
          }
        } else {
          setSelectedRows(new Set([rowId]))
        }
      } else {
        // Complex mode: select row + highlight cell
        if (multiselection && ctrlKey) {
          setSelectedRows((prev) => {
            const next = new Set(prev)
            if (next.has(rowId)) {
              next.delete(rowId)
            } else {
              next.add(rowId)
            }
            return next
          })
        } else if (multiselection && shiftKey && lastClickedRow) {
          const startIdx = data.findIndex((r) => r.id === lastClickedRow)
          const endIdx = data.findIndex((r) => r.id === rowId)
          if (startIdx >= 0 && endIdx >= 0) {
            const from = Math.min(startIdx, endIdx)
            const to = Math.max(startIdx, endIdx)
            const rangeIds = data.slice(from, to + 1).map((r) => r.id)
            setSelectedRows(new Set(rangeIds))
          }
        } else {
          setSelectedRows(new Set([rowId]))
        }
      }

      setLastClickedRow(rowId)
      events.onAfterSelect?.(rowId, colId)
    },
    [config, data, lastClickedRow],
  )

  const isRowSelected = useCallback(
    (rowId: string): boolean => selectedRows.has(rowId),
    [selectedRows],
  )

  const isCellSelected = useCallback(
    (rowId: string, colId: string): boolean => {
      // In row mode, don't highlight individual cells visually
      if (config.mode === 'row') return false
      return selectedCell?.rowId === rowId && selectedCell?.colId === colId
    },
    [selectedCell, config.mode],
  )

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set())
    setSelectedCell(null)
    setLastClickedRow(null)
  }, [])

  return {
    selectedRows,
    selectedCell,
    handleClick,
    isRowSelected,
    isCellSelected,
    clearSelection,
  }
}
