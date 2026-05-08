import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFreeze } from './useFreeze'

const WIDTHS_4 = [100, 100, 100, 100]
const WIDTHS_3 = [100, 100, 100]

function makeContainerRef(left = 0) {
  return {
    current: {
      getBoundingClientRect: () => ({ left } as DOMRect),
      setPointerCapture: vi.fn(),
      releasePointerCapture: vi.fn(),
    } as unknown as HTMLDivElement,
  }
}

describe('useFreeze', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with freeze=0 when no initial value', () => {
    const { result } = renderHook(() => useFreeze({ containerRef: { current: null }, columnWidths: WIDTHS_4 }))
    expect(result.current.freezeCol).toBe(0)
  })

  it('starts with provided initialFreezeCol', () => {
    const { result } = renderHook(() =>
      useFreeze({ containerRef: { current: null }, columnWidths: WIDTHS_4, initialFreezeCol: 2 }),
    )
    expect(result.current.freezeCol).toBe(2)
  })

  it('setFreezeCol clamps to [0, columnCount]', () => {
    const { result } = renderHook(() => useFreeze({ containerRef: { current: null }, columnWidths: WIDTHS_3 }))

    act(() => result.current.setFreezeCol(10))
    expect(result.current.freezeCol).toBe(3)

    act(() => result.current.setFreezeCol(-5))
    expect(result.current.freezeCol).toBe(0)
  })

  it('returns isDragging=false initially', () => {
    const { result } = renderHook(() => useFreeze({ containerRef: { current: null }, columnWidths: WIDTHS_4 }))
    expect(result.current.isDragging).toBe(false)
  })

  it('calls onFreeze callback when freezeCol changes', () => {
    const onFreeze = vi.fn()
    const { result } = renderHook(() =>
      useFreeze({ containerRef: { current: null }, columnWidths: WIDTHS_4, onFreeze }),
    )
    act(() => result.current.setFreezeCol(2))
    expect(onFreeze).toHaveBeenCalledWith(2)
  })

  it('computes freeze col from column widths during drag (no row duplication)', () => {
    // Columns at x: 0-100, 100-200, 200-300, 300-400 (container left=0)
    const containerRef = makeContainerRef(0)
    const onFreeze = vi.fn()
    const { result } = renderHook(() =>
      useFreeze({ containerRef, columnWidths: WIDTHS_4, onFreeze }),
    )

    // Simulate pointer events via document listeners
    let moveHandler: ((e: PointerEvent) => void) | undefined
    let upHandler: ((e: PointerEvent) => void) | undefined
    const addSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, handler) => {
      if (type === 'pointermove') moveHandler = handler as (e: PointerEvent) => void
      if (type === 'pointerup') upHandler = handler as (e: PointerEvent) => void
    })
    vi.spyOn(document, 'removeEventListener').mockImplementation(() => {})

    act(() => {
      result.current.handlePointerDown({ preventDefault: vi.fn(), pointerId: 1 } as unknown as React.PointerEvent)
    })

    // cursor at x=160 → past midpoint of col0(50) and col1(150), not past col2(250) → freeze=2
    act(() => { moveHandler?.({ clientX: 160 } as PointerEvent) })
    expect(result.current.freezeCol).toBe(2)

    // cursor at x=51 → just past midpoint of col0(50) but not col1(150) → freeze=1
    act(() => { moveHandler?.({ clientX: 51 } as PointerEvent) })
    expect(result.current.freezeCol).toBe(1)

    act(() => {
      upHandler?.({ clientX: 51, pointerId: 1 } as PointerEvent)
    })
    expect(onFreeze).toHaveBeenCalledWith(1)

    addSpy.mockRestore()
  })
})
