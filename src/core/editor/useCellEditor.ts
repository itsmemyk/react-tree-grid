import { useCallback, useRef, useState, type RefObject } from 'react'

export type CellEditorType =
  | 'input'
  | 'select'
  | 'checkbox'
  | 'combo'
  | 'date'
  | 'custom'

export interface CellEditorOption {
  value: string
  label: string
}

export interface UseCellEditorOptions<TValue = unknown> {
  editorType: CellEditorType
  value: TValue
  column?: unknown
  row?: unknown
  onSave?: (value: TValue, meta: { column?: unknown; row?: unknown }) => void
  onCancel?: (value: TValue, meta: { column?: unknown; row?: unknown }) => void
}

export interface UseCellEditorReturn<TValue = unknown> {
  isEditing: boolean
  editorRef: RefObject<HTMLElement | null>
  editorValue: TValue
  setEditorValue: (value: TValue) => void
  startEdit: () => void
  endEdit: () => void
  cancelEdit: () => void
}

export function useCellEditor<TValue = unknown>({
  value,
  column,
  row,
  onSave,
  onCancel,
}: UseCellEditorOptions<TValue>): UseCellEditorReturn<TValue> {
  const [isEditing, setIsEditing] = useState(false)
  const [editorValue, setEditorValueState] = useState<TValue>(value)
  const editorRef = useRef<HTMLElement | null>(null)
  const initialValueRef = useRef(value)
  const valueRef = useRef(editorValue)

  const setEditorValue = useCallback((nextValue: TValue) => {
    valueRef.current = nextValue
    setEditorValueState(nextValue)
  }, [])

  const startEdit = useCallback(() => {
    initialValueRef.current = value
    valueRef.current = value
    setEditorValueState(value)
    setIsEditing(true)
  }, [value])

  const endEdit = useCallback(() => {
    setIsEditing(false)
    onSave?.(valueRef.current, { column, row })
  }, [column, onSave, row])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    valueRef.current = initialValueRef.current
    setEditorValueState(initialValueRef.current)
    onCancel?.(initialValueRef.current, { column, row })
  }, [column, onCancel, row])

  return {
    isEditing,
    editorRef,
    editorValue,
    setEditorValue,
    startEdit,
    endEdit,
    cancelEdit,
  }
}
