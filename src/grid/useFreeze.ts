import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseFreezeOptions {
  containerRef: React.RefObject<HTMLDivElement | null>
  columnWidths: number[]
  initialFreezeCol?: number
  onFreeze?: (col: number) => void
}

export interface UseFreezeReturn {
  freezeCol: number
  setFreezeCol: (col: number) => void
  isDragging: boolean
  handlePointerDown: (e: React.PointerEvent) => void
}

function bestFreezeCol(clientX: number, containerLeft: number, columnWidths: number[]): number {
  const x = clientX - containerLeft
  let offset = 0
  let best = 0
  for (let i = 0; i < columnWidths.length; i++) {
    if (x > offset + columnWidths[i] / 2) best = i + 1
    offset += columnWidths[i]
  }
  return Math.max(0, Math.min(best, columnWidths.length))
}

export function useFreeze({
  containerRef,
  columnWidths,
  initialFreezeCol = 0,
  onFreeze,
}: UseFreezeOptions): UseFreezeReturn {
  const columnCount = columnWidths.length
  const [freezeCol, setFreezeColState] = useState(() =>
    Math.max(0, Math.min(initialFreezeCol, columnCount)),
  )
  const [isDragging, setIsDragging] = useState(false)
  const onFreezeRef = useRef(onFreeze)
  onFreezeRef.current = onFreeze
  const columnWidthsRef = useRef(columnWidths)
  columnWidthsRef.current = columnWidths

  const setFreezeCol = useCallback(
    (col: number) => {
      const clamped = Math.max(0, Math.min(col, columnWidthsRef.current.length))
      setFreezeColState(clamped)
      onFreezeRef.current?.(clamped)
    },
    [],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const container = containerRef.current
      if (!container) return

      e.preventDefault()
      setIsDragging(true)
      const pointerId = e.pointerId

      const onPointerMove = (ev: PointerEvent) => {
        const left = container.getBoundingClientRect().left
        setFreezeColState(bestFreezeCol(ev.clientX, left, columnWidthsRef.current))
      }

      const onPointerUp = (ev: PointerEvent) => {
        container.releasePointerCapture(ev.pointerId)
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerup', onPointerUp)
        setIsDragging(false)

        const left = container.getBoundingClientRect().left
        const final = bestFreezeCol(ev.clientX, left, columnWidthsRef.current)
        setFreezeColState(final)
        onFreezeRef.current?.(final)
      }

      try {
        container.setPointerCapture(pointerId)
      } catch {
        // not all envs support capture on non-target elements
      }

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    },
    [containerRef],
  )

  useEffect(() => {
    setFreezeColState((prev) => {
      const clamped = Math.max(0, Math.min(prev, columnCount))
      return clamped !== prev ? clamped : prev
    })
  }, [columnCount])

  return { freezeCol, setFreezeCol, isDragging, handlePointerDown }
}
