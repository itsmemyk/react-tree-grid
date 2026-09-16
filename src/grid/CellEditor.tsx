import { useCallback, useRef, type KeyboardEvent } from 'react'
import type { GridCellEditorApi, GridColumn, GridRow } from './types'

export interface CellEditorProps<T extends GridRow> {
  column: GridColumn<T>
  row: T
  value: unknown
  className?: string
  onChange: (value: unknown) => void
  onCommit: (value?: unknown) => void
  onCancel: () => void
  onKeyDown?: (e: KeyboardEvent) => void
  onBlur?: () => void
}

/**
 * The inline editor rendered inside an editing cell.
 *
 * Renders `column.editTemplate` when set, otherwise the built-in text input.
 * Span-overlay cells deliberately render no editor — the underlying real cell
 * owns it.
 */
export function CellEditor<T extends GridRow>({
  column,
  row,
  value,
  className,
  onChange,
  onCommit,
  onCancel,
  onKeyDown,
  onBlur,
}: CellEditorProps<T>) {
  const focusTargetRef = useRef<HTMLElement | null>(null)

  // Focus in the ref callback rather than an effect, so a template that swaps
  // its focus target between renders still lands focus on the current node.
  const setFocusTarget = useCallback((node: HTMLElement | null) => {
    focusTargetRef.current = node
    node?.focus()
  }, [])

  if (!column.editTemplate) {
    return (
      <input
        className={className}
        autoFocus
        value={value === null || value === undefined ? '' : String(value)}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    )
  }

  const api: GridCellEditorApi = {
    onChange,
    onCommit,
    onCancel,
    ref: setFocusTarget,
  }

  return <>{column.editTemplate(value, row, column, api)}</>
}
