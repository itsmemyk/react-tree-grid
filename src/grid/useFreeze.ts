import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseFreezeOptions {
  containerRef: React.RefObject<HTMLDivElement | null>
  columnCount: number
  initialFreezeCol?: number
  onFreeze?: (col: number) => void
}

export interface UseFreezeReturn {
  freezeCol: number
  setFreezeCol: (col: number) => void
  isDragging: boolean
  handlePointerDown: (e: React.PointerEvent) => void
}

export function useFreeze({
  containerRef,
  columnCount,
  initialFreezeCol = 0,
  onFreeze,
}: UseFreezeOptions): UseFreezeReturn {
  const [freezeCol, setFreezeColState] = useState(() =>
    Math.max(0, Math.min(initialFreezeCol, columnCount)),
  )
  const [isDragging, setIsDragging] = useState(false)
  const onFreezeRef = useRef(onFreeze)
  onFreezeRef.current = onFreeze

  const setFreezeCol = useCallback(
    (col: number) => {
      const clamped = Math.max(0, Math.min(col, columnCount))
      setFreezeColState(clamped)
      onFreezeRef.current?.(clamped)
    },
    [columnCount],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const container = containerRef.current
      if (!container) return

      e.preventDefault()
      setIsDragging(true)
      const pointerId = e.pointerId

      const onPointerMove = (ev: PointerEvent) => {
        const cols = Array.from(container.querySelectorAll<HTMLElement>('[data-rgs-col-id]'))
        if (!cols.length) return

        const x = ev.clientX
        let best = 0
        for (let i = 0; i < cols.length; i++) {
          const rect = cols[i].getBoundingClientRect()
          if (x > rect.left + rect.width / 2) best = i + 1
        }
        setFreezeColState(Math.max(0, Math.min(best, columnCount)))
      }

      const onPointerUp = (ev: PointerEvent) => {
        container.releasePointerCapture(ev.pointerId)
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerup', onPointerUp)
        setIsDragging(false)

        const cols = Array.from(container.querySelectorAll<HTMLElement>('[data-rgs-col-id]'))
        if (!cols.length) return
        const x = ev.clientX
        let best = 0
        for (let i = 0; i < cols.length; i++) {
          const rect = cols[i].getBoundingClientRect()
          if (x > rect.left + rect.width / 2) best = i + 1
        }
        const final = Math.max(0, Math.min(best, columnCount))
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
    [containerRef, columnCount],
  )

  // Keep freezeCol in bounds if columnCount changes
  useEffect(() => {
    setFreezeColState((prev) => {
      const clamped = Math.max(0, Math.min(prev, columnCount))
      return clamped !== prev ? clamped : prev
    })
  }, [columnCount])

  return { freezeCol, setFreezeCol, isDragging, handlePointerDown }
}
