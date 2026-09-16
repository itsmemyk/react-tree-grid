import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useGridEditor } from './useGridEditor'
import type { GridColumn } from './types'

type Row = { id: string; name: string }

const columns: GridColumn<Row>[] = [
  { id: 'id' },
  { id: 'name', editorType: 'input' },
]

const data: Row[] = [{ id: '1', name: 'Alice' }]

const makeStore = () => ({ update: vi.fn() })

describe('useGridEditor', () => {
  it('commits an explicit value instead of the staged one', () => {
    const store = makeStore()
    const onAfterEditEnd = vi.fn()

    const { result } = renderHook(() =>
      useGridEditor(store as never, data, columns, { onAfterEditEnd }),
    )

    act(() => result.current.startEdit('1', 'name'))
    act(() => result.current.endEdit(true, 'Bob'))

    expect(store.update).toHaveBeenCalledWith('1', { name: 'Bob' })
    expect(onAfterEditEnd).toHaveBeenCalledWith('1', 'name', 'Bob')
  })

  it('commits the staged value when no explicit value is given', () => {
    const store = makeStore()

    const { result } = renderHook(() =>
      useGridEditor(store as never, data, columns, {}),
    )

    act(() => result.current.startEdit('1', 'name'))
    act(() => result.current.setEditorValue('Carol'))
    act(() => result.current.endEdit(true))

    expect(store.update).toHaveBeenCalledWith('1', { name: 'Carol' })
  })

  it('passes the explicit value to onBeforeEditEnd and honors a veto', () => {
    const store = makeStore()
    const onBeforeEditEnd = vi.fn().mockReturnValue(false)

    const { result } = renderHook(() =>
      useGridEditor(store as never, data, columns, { onBeforeEditEnd }),
    )

    act(() => result.current.startEdit('1', 'name'))
    act(() => result.current.endEdit(true, 'Bob'))

    expect(onBeforeEditEnd).toHaveBeenCalledWith('1', 'name', 'Bob', 'Alice')
    expect(store.update).not.toHaveBeenCalled()
  })
})
