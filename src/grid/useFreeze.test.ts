import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFreeze } from './useFreeze'

function makeContainerRef(columnWidths: number[]) {
  const cols = columnWidths.map((w, i) => ({
    getBoundingClientRect: () => ({ left: columnWidths.slice(0, i).reduce((a, b) => a + b, 0), right: columnWidths.slice(0, i + 1).reduce((a, b) => a + b, 0), width: w } as DOMRect),
  })) as unknown as NodeListOf<HTMLElement>

  return {
    current: {
      querySelectorAll: vi.fn(() => cols),
    } as unknown as HTMLDivElement,
  }
}

describe('useFreeze', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with freeze=0 when no initial value', () => {
    const { result } = renderHook(() => useFreeze({ containerRef: { current: null }, columnCount: 4 }))
    expect(result.current.freezeCol).toBe(0)
  })

  it('starts with provided initialFreezeCol', () => {
    const { result } = renderHook(() =>
      useFreeze({ containerRef: { current: null }, columnCount: 4, initialFreezeCol: 2 }),
    )
    expect(result.current.freezeCol).toBe(2)
  })

  it('setFreezeCol clamps to [0, columnCount]', () => {
    const { result } = renderHook(() => useFreeze({ containerRef: { current: null }, columnCount: 3 }))

    act(() => result.current.setFreezeCol(10))
    expect(result.current.freezeCol).toBe(3)

    act(() => result.current.setFreezeCol(-5))
    expect(result.current.freezeCol).toBe(0)
  })

  it('returns isDragging=false initially', () => {
    const { result } = renderHook(() => useFreeze({ containerRef: { current: null }, columnCount: 4 }))
    expect(result.current.isDragging).toBe(false)
  })

  it('calls onFreeze callback when freezeCol changes', () => {
    const onFreeze = vi.fn()
    const { result } = renderHook(() =>
      useFreeze({ containerRef: { current: null }, columnCount: 4, onFreeze }),
    )
    act(() => result.current.setFreezeCol(2))
    expect(onFreeze).toHaveBeenCalledWith(2)
  })
})
