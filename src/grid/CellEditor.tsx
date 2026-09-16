import type { KeyboardEvent } from 'react'

export interface CellEditorProps {
  value: unknown
  className?: string
  onChange: (value: unknown) => void
  onKeyDown?: (e: KeyboardEvent) => void
  onBlur?: () => void
}

/**
 * The inline editor rendered inside an editing cell.
 *
 * Single source of truth for editor markup. Span-overlay cells deliberately
 * render no editor — the underlying real cell owns it.
 */
export function CellEditor({ value, className, onChange, onKeyDown, onBlur }: CellEditorProps) {
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
