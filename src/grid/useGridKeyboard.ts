import { useCallback, useRef } from 'react'
import type { GridColumn, GridRow, GridCellCoord } from './types'

interface GridKeyboardConfig {
  enabled: boolean
  data: GridRow[]
  columns: GridColumn<any>[]
  selectedCell: GridCellCoord | null
  editable: boolean
  isEditing: boolean
  onNavigate: (rowId: string, colId: string, shiftKey: boolean) => void
  onStartEdit: (rowId: string, colId: string) => void
  onEndEdit: (save: boolean) => void
  onScrollTo: (rowIndex: number, colIndex: number) => void
  onPageScroll: (direction: 'up' | 'down' | 'home' | 'end') => void
}

/**
 * Grid keyboard navigation — faithful conversion of DHTMLX suite.js KeyManager (module 246).
 *
 * Key bindings:
 * - Arrow keys: navigate ±1 cell, update selection
 * - Ctrl+Arrow Up/Down: jump to first/last row
 * - Ctrl+Arrow Left/Right: jump to first/last column
 * - Tab / Shift+Tab: forward/backward cell navigation, wraps rows
 * - Enter: start or commit edit
 * - Escape: cancel edit
 * - Space: toggle boolean column
 * - PageUp/Down: scroll viewport (don't move selection)
 * - Home/End: scroll to top/bottom (don't move selection)
 */
export function useGridKeyboard(config: GridKeyboardConfig) {
  const {
    enabled,
    data,
    columns,
    selectedCell,
    editable,
    isEditing,
    onNavigate,
    onStartEdit,
    onEndEdit,
    onScrollTo,
    onPageScroll,
  } = config

  // Track the last navigated cell to avoid stale closure issues with selection
  const lastNavRef = useRef<GridCellCoord | null>(null)

  const getVisibleColumns = useCallback(
    () => columns.filter((c) => !c.hidden),
    [columns],
  )

  const getVisibleData = useCallback(
    () => data.filter((r) => !r.hidden),
    [data],
  )

  const getFocusedIndices = useCallback((): { rowIdx: number; colIdx: number } | null => {
    const cell = selectedCell
    if (!cell) return null

    const visibleData = getVisibleData()
    const visibleCols = getVisibleColumns()

    const rowIdx = visibleData.findIndex((r) => r.id === cell.rowId)
    const colIdx = visibleCols.findIndex((c) => c.id === cell.colId)

    if (rowIdx < 0 || colIdx < 0) return null
    return { rowIdx, colIdx }
  }, [selectedCell, getVisibleData, getVisibleColumns])

  const navigateTo = useCallback(
    (rowIdx: number, colIdx: number, shiftKey: boolean) => {
      const visibleData = getVisibleData()
      const visibleCols = getVisibleColumns()

      if (rowIdx < 0 || rowIdx >= visibleData.length) return
      if (colIdx < 0 || colIdx >= visibleCols.length) return

      const rowId = visibleData[rowIdx].id
      const colId = visibleCols[colIdx].id

      lastNavRef.current = { rowId, colId }
      onNavigate(rowId, colId, shiftKey)
      onScrollTo(rowIdx, colIdx)
    },
    [getVisibleData, getVisibleColumns, onNavigate, onScrollTo],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return

      const key = e.key
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey

      // --- Editing keys (handled regardless of focus) ---
      if (isEditing) {
        // Enter/Escape/Tab during editing are handled by the editor's own keydown.
        // But if the event reaches the grid root, handle it here as a fallback.
        if (key === 'Escape') {
          e.preventDefault()
          onEndEdit(false)
          return
        }
        if (key === 'Enter') {
          e.preventDefault()
          onEndEdit(true)
          return
        }
        // All other keys during editing: let the editor handle them
        return
      }

      // --- Navigation keys (only when not editing) ---
      const focus = getFocusedIndices()

      switch (key) {
        case 'ArrowUp': {
          e.preventDefault()
          if (!focus) break
          if (ctrl) {
            navigateTo(0, focus.colIdx, shift)
          } else {
            navigateTo(focus.rowIdx - 1, focus.colIdx, shift)
          }
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          if (!focus) break
          if (ctrl) {
            navigateTo(getVisibleData().length - 1, focus.colIdx, shift)
          } else {
            navigateTo(focus.rowIdx + 1, focus.colIdx, shift)
          }
          break
        }
        case 'ArrowLeft': {
          e.preventDefault()
          if (!focus) break
          if (ctrl) {
            navigateTo(focus.rowIdx, 0, shift)
          } else {
            navigateTo(focus.rowIdx, focus.colIdx - 1, shift)
          }
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          if (!focus) break
          if (ctrl) {
            navigateTo(focus.rowIdx, getVisibleColumns().length - 1, shift)
          } else {
            navigateTo(focus.rowIdx, focus.colIdx + 1, shift)
          }
          break
        }

        case 'Tab': {
          e.preventDefault()
          if (!focus) break
          const visibleCols = getVisibleColumns()
          const visibleData = getVisibleData()

          if (shift) {
            // Shift+Tab: move backward
            if (focus.colIdx > 0) {
              navigateTo(focus.rowIdx, focus.colIdx - 1, false)
            } else if (focus.rowIdx > 0) {
              // Wrap to last column of previous row
              navigateTo(focus.rowIdx - 1, visibleCols.length - 1, false)
            }
          } else {
            // Tab: move forward
            if (focus.colIdx < visibleCols.length - 1) {
              navigateTo(focus.rowIdx, focus.colIdx + 1, false)
            } else if (focus.rowIdx < visibleData.length - 1) {
              // Wrap to first column of next row
              navigateTo(focus.rowIdx + 1, 0, false)
            }
          }
          break
        }

        case 'Enter': {
          e.preventDefault()
          if (!selectedCell || !editable) break
          onStartEdit(selectedCell.rowId, selectedCell.colId)
          break
        }

        case ' ': {
          // Space: toggle boolean columns
          if (!selectedCell) break
          const col = columns.find((c) => c.id === selectedCell.colId)
          if (col?.type === 'boolean' || col?.editorType === 'checkbox') {
            e.preventDefault()
            onStartEdit(selectedCell.rowId, selectedCell.colId)
          }
          break
        }

        case 'PageUp': {
          e.preventDefault()
          onPageScroll('up')
          break
        }
        case 'PageDown': {
          e.preventDefault()
          onPageScroll('down')
          break
        }
        case 'Home': {
          e.preventDefault()
          onPageScroll('home')
          break
        }
        case 'End': {
          e.preventDefault()
          onPageScroll('end')
          break
        }

        default:
          break
      }
    },
    [
      enabled,
      isEditing,
      selectedCell,
      editable,
      columns,
      getFocusedIndices,
      getVisibleData,
      getVisibleColumns,
      navigateTo,
      onStartEdit,
      onEndEdit,
      onPageScroll,
    ],
  )

  return { handleKeyDown }
}
