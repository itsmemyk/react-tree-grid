import { useCallback, useRef, useState } from 'react'
import type { DataStore } from '../core/data'
import type { DataItem } from '../core/data/types'
import type { GridColumn, GridRow } from './types'

/** A column is editable if it declares an editor type or a custom editor template. */
export function isColumnEditable<T extends GridRow>(col: GridColumn<T>): boolean {
  return Boolean(col.editorType || col.editTemplate)
}

interface EditingCell {
  rowId: string
  colId: string
  value: unknown
  originalValue: unknown
}

interface GridEditorEvents {
  onBeforeEditStart?: (rowId: string, colId: string) => boolean | void
  onAfterEditStart?: (rowId: string, colId: string) => void
  onBeforeEditEnd?: (rowId: string, colId: string, newValue: unknown, oldValue: unknown) => boolean | void
  onAfterEditEnd?: (rowId: string, colId: string, newValue: unknown) => void
}

/**
 * Manages inline cell editing for the Grid.
 *
 * Behavior:
 * - Double-click cell (or single-click checkbox) → open editor
 * - Enter/Tab → commit and move to next cell
 * - Escape → cancel
 * - Click outside → commit
 * - Updates DataStore on commit
 */
export function useGridEditor<T extends GridRow>(
  store: DataStore<T & DataItem> | undefined,
  data: T[],
  columns: GridColumn<T>[],
  events: GridEditorEvents,
) {
  const [editingCell, setEditingCellState] = useState<EditingCell | null>(null)
  // Mirrors editingCell synchronously, so a second endEdit in the same event
  // (e.g. a template's onBlur commit plus the wrapper's blur) sees the edit closed
  const editingRef = useRef<EditingCell | null>(null)
  const setEditingCell = useCallback((next: EditingCell | null) => {
    editingRef.current = next
    setEditingCellState(next)
  }, [])
  const editorRef = useRef<HTMLInputElement | null>(null)

  const startEdit = useCallback(
    (rowId: string, colId: string) => {
      const col = columns.find((c) => c.id === colId)
      if (!col || !isColumnEditable(col)) return

      if (events.onBeforeEditStart) {
        const result = events.onBeforeEditStart(rowId, colId)
        if (result === false) return
      }

      // Fall back to the store for rows its filter dropped from data (e.g. pinned rows)
      const row = data.find((r) => r.id === rowId) ?? (store?.getItem(rowId) as T | undefined)
      if (!row) return

      const value = row[colId]
      setEditingCell({
        rowId,
        colId,
        value,
        originalValue: value,
      })

      events.onAfterEditStart?.(rowId, colId)
    },
    [columns, data, store, events, setEditingCell],
  )

  const endEdit = useCallback(
    (save: boolean, explicitValue?: unknown) => {
      const current = editingRef.current
      if (!current) return

      const { rowId, colId, originalValue } = current
      const value = explicitValue !== undefined ? explicitValue : current.value

      if (save) {
        if (events.onBeforeEditEnd) {
          const result = events.onBeforeEditEnd(rowId, colId, value, originalValue)
          if (result === false) return
        }

        // Update store
        if (store) {
          store.update(rowId, { [colId]: value } as Partial<T & DataItem>)
        }

        events.onAfterEditEnd?.(rowId, colId, value)
      }

      setEditingCell(null)
    },
    [setEditingCell, store, events],
  )

  const setEditorValue = useCallback(
    (value: unknown) => {
      const current = editingRef.current
      if (current) setEditingCell({ ...current, value })
    },
    [setEditingCell],
  )

  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Stop propagation on the keys handled here: the grid root keeps a
      // fallback handler for Enter/Escape while editing, and letting the event
      // reach it would commit the same edit a second time.
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        endEdit(true)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        endEdit(false)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        endEdit(true)
        // Move to next editable cell
        if (editingCell) {
          const colIdx = columns.findIndex((c) => c.id === editingCell.colId)
          const nextCol = columns.slice(colIdx + 1).find(isColumnEditable)
          if (nextCol) {
            // Start editing next cell in same row (defer to avoid state conflict)
            setTimeout(() => startEdit(editingCell.rowId, nextCol.id), 0)
          }
        }
      }
    },
    [endEdit, editingCell, columns, startEdit],
  )

  const isEditing = useCallback(
    (rowId: string, colId: string): boolean => {
      return editingCell?.rowId === rowId && editingCell?.colId === colId
    },
    [editingCell],
  )

  return {
    editingCell,
    editorRef,
    startEdit,
    endEdit,
    setEditorValue,
    handleEditorKeyDown,
    isEditing,
  }
}
