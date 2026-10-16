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

interface GridEditorOptions<T extends GridRow> {
  /** Rows in on-screen order, used to wrap Tab across rows */
  getDisplayRows?: () => T[]
  /** Moves the grid's focused cell when Tab carries the edit to another cell */
  onMove?: (rowId: string, colId: string) => void
}

/**
 * Number columns store numbers: a numeric string is converted, an empty one
 * clears the cell, anything else is rejected (undefined).
 */
function coerceValue<T extends GridRow>(col: GridColumn<T> | undefined, value: unknown): unknown {
  if (col?.type !== 'number' || typeof value !== 'string') return value
  const text = value.trim()
  if (text === '') return null
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : undefined
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
 * - Enter → commit; Tab / Shift+Tab → commit and edit the next / previous editable cell
 * - Escape → cancel
 * - Click outside → commit
 * - Updates DataStore on commit
 */
export function useGridEditor<T extends GridRow>(
  store: DataStore<T & DataItem> | undefined,
  data: T[],
  columns: GridColumn<T>[],
  events: GridEditorEvents,
  options: GridEditorOptions<T> = {},
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
  const optionsRef = useRef(options)
  optionsRef.current = options

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
      const rawValue = explicitValue !== undefined ? explicitValue : current.value
      const value = coerceValue(columns.find((c) => c.id === colId), rawValue)

      // An unparsable value for a typed column is dropped, like a cancel
      if (save && value === undefined && rawValue !== undefined) save = false

      if (save) {
        if (events.onBeforeEditEnd) {
          const result = events.onBeforeEditEnd(rowId, colId, value, originalValue)
          if (result === false) return
        }

        // Skip the store write when nothing changed, so it fires no change events
        if (store && !Object.is(value, originalValue)) {
          store.update(rowId, { [colId]: value } as Partial<T & DataItem>)
        }

        events.onAfterEditEnd?.(rowId, colId, value)
      }

      setEditingCell(null)
    },
    [setEditingCell, store, events, columns],
  )

  const setEditorValue = useCallback(
    (value: unknown) => {
      const current = editingRef.current
      if (current) setEditingCell({ ...current, value })
    },
    [setEditingCell],
  )

  /** The next (or previous) editable cell in display order, wrapping across rows. */
  const findNextEditable = useCallback(
    (rowId: string, colId: string, backward: boolean): { rowId: string; colId: string } | null => {
      const editableCols = columns.filter((c) => !c.hidden && isColumnEditable(c))
      if (!editableCols.length) return null
      const rows = optionsRef.current.getDisplayRows?.() ?? data
      const rowIdx = rows.findIndex((r) => r.id === rowId)
      const colIdx = editableCols.findIndex((c) => c.id === colId)
      if (rowIdx < 0 || colIdx < 0) return null
      const step = backward ? -1 : 1
      const nextCol = colIdx + step
      if (nextCol >= 0 && nextCol < editableCols.length) {
        return { rowId, colId: editableCols[nextCol].id }
      }
      const nextRow = rows[rowIdx + step]
      if (!nextRow) return null
      return { rowId: nextRow.id, colId: editableCols[backward ? editableCols.length - 1 : 0].id }
    },
    [columns, data],
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
        const current = editingRef.current
        endEdit(true)
        if (!current) return
        const next = findNextEditable(current.rowId, current.colId, e.shiftKey)
        if (next) {
          optionsRef.current.onMove?.(next.rowId, next.colId)
          // Defer so the closing edit's state settles before the next one opens
          setTimeout(() => startEdit(next.rowId, next.colId), 0)
        }
      }
    },
    [endEdit, findNextEditable, startEdit],
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
