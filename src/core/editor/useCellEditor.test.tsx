import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCellEditor } from './useCellEditor'

describe('useCellEditor', () => {
  it('starts and ends edit sessions with save callback', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() =>
      useCellEditor({
        editorType: 'input',
        value: 'Alice',
        row: { id: '1' },
        column: { id: 'name' },
        onSave,
      }),
    )

    act(() => {
      result.current.startEdit()
      result.current.setEditorValue('Bob')
      result.current.endEdit()
    })

    expect(result.current.isEditing).toBe(false)
    expect(onSave).toHaveBeenCalledWith('Bob', {
      row: { id: '1' },
      column: { id: 'name' },
    })
  })

  it('restores the initial value on cancel', () => {
    const onCancel = vi.fn()
    const { result } = renderHook(() =>
      useCellEditor({
        editorType: 'input',
        value: 'Draft',
        onCancel,
      }),
    )

    act(() => {
      result.current.startEdit()
      result.current.setEditorValue('Changed')
      result.current.cancelEdit()
    })

    expect(result.current.editorValue).toBe('Draft')
    expect(result.current.isEditing).toBe(false)
    expect(onCancel).toHaveBeenCalledWith('Draft', {
      row: undefined,
      column: undefined,
    })
  })
})
