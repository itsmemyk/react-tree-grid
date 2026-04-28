import { useCallback, useRef, useState } from 'react'
import type { DataStore } from '../core/data'
import type { DataItem } from '../core/data/types'
import type { GridColumn, GridRow } from './types'

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
 * Faithful conversion of DHTMLX suite.js Grid editing (editCell/editEnd).
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
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const editorRef = useRef<HTMLInputElement | null>(null)

  const startEdit = useCallback(
    (rowId: string, colId: string) => {
      const col = columns.find((c) => c.id === colId)
      if (!col || !col.editorType) return

      if (events.onBeforeEditStart) {
        const result = events.onBeforeEditStart(rowId, colId)
        if (result === false) return
      }

      const row = data.find((r) => r.id === rowId)
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
    [columns, data, events],
  )

  const endEdit = useCallback(
    (save: boolean) => {
      if (!editingCell) return

      const { rowId, colId, value, originalValue } = editingCell

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
    [editingCell, store, events],
  )

  const setEditorValue = useCallback(
    (value: unknown) => {
      setEditingCell((prev) => (prev ? { ...prev, value } : null))
    },
    [],
  )

  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        endEdit(true)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        endEdit(false)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        endEdit(true)
        // Move to next editable cell
        if (editingCell) {
          const colIdx = columns.findIndex((c) => c.id === editingCell.colId)
          const nextCol = columns.slice(colIdx + 1).find((c) => c.editorType)
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
