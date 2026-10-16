import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { DragEvents } from '../events/types'
import { dragManager } from './DragManager'
import type { DragData, TransferData, UseDraggableConfig } from './types'

export interface UseDraggableReturn {
  draggableProps: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  }
}

const DRAG_THRESHOLD = 4

export function useDraggable(config: UseDraggableConfig): UseDraggableReturn {
  const configRef = useRef(config)
  const eventContextRef = useRef({})
  configRef.current = config

  useEffect(() => {
    const handleDragStart = (_data: unknown, transfer: unknown) => {
      const current = transfer as TransferData
      if (current.start === configRef.current.id && current.componentId === configRef.current.componentId) {
        configRef.current.onDragStart?.(current)
      }
    }

    const handleAfterDrag = (data: unknown) => {
      const current = data as DragData
      if (current.start === configRef.current.id) {
        configRef.current.onAfterDrag?.(current)
      }
    }

    const handleCancelDrop = (data: unknown) => {
      const current = data as DragData
      if (current.start === configRef.current.id) {
        configRef.current.onCancelDrop?.(current)
      }
    }

    dragManager.events.on(DragEvents.dragStart, handleDragStart, eventContextRef.current)
    dragManager.events.on(DragEvents.afterDrag, handleAfterDrag, eventContextRef.current)
    dragManager.events.on(DragEvents.cancelDrop, handleCancelDrop, eventContextRef.current)

    return () => {
      dragManager.events.detach(DragEvents.dragStart, eventContextRef.current)
      dragManager.events.detach(DragEvents.afterDrag, eventContextRef.current)
      dragManager.events.detach(DragEvents.cancelDrop, eventContextRef.current)
    }
  }, [])

  return {
    draggableProps: {
      onPointerDown: (event) => {
        if (configRef.current.disabled || event.button !== 0) {
          return
        }

        const downEvent = event.nativeEvent
        const offset = configRef.current.getInitialOffset?.(event) ?? {
          x: 0,
          y: 0,
        }
        let started = false

        // Plain clicks must not start a drag, so wait until the pointer
        // has travelled a few pixels before creating the ghost.
        const begin = () => {
          const ghost =
            typeof configRef.current.ghost === 'function'
              ? configRef.current.ghost()
              : configRef.current.ghost ?? null
          const transfer = dragManager.dragStart(downEvent, {
            id: configRef.current.id,
            source: configRef.current.source,
            type: configRef.current.type,
            ghost,
            initXOffset: offset.x,
            initYOffset: offset.y,
          }, {
            componentId: configRef.current.componentId,
          })
          started = transfer !== null
          return started
        }

        const cleanup = () => {
          window.removeEventListener('pointermove', handleMove)
          window.removeEventListener('pointerup', handleUp)
          window.removeEventListener('pointercancel', handleCancel)
          window.removeEventListener('keydown', handleKey, true)
        }

        const handleMove = (moveEvent: PointerEvent) => {
          if (!started) {
            const dx = moveEvent.clientX - downEvent.clientX
            const dy = moveEvent.clientY - downEvent.clientY
            if (dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return
            if (!begin()) {
              cleanup()
              return
            }
          }
          dragManager.drag(moveEvent)
        }

        const handleUp = (upEvent: PointerEvent) => {
          cleanup()
          if (!started) return
          dragManager.drop(upEvent)
          // The browser follows the release with a click on whatever is under
          // the pointer; a finished drag shouldn't also select that item
          const swallowClick = (clickEvent: MouseEvent) => {
            clickEvent.stopPropagation()
            clickEvent.preventDefault()
          }
          window.addEventListener('click', swallowClick, { capture: true, once: true })
          setTimeout(() => window.removeEventListener('click', swallowClick, true), 0)
        }

        // The browser took over the pointer (e.g. a native text drag): no pointerup will follow
        const handleCancel = () => {
          cleanup()
          if (started) dragManager.cancelDrop()
        }

        const handleKey = (keyEvent: KeyboardEvent) => {
          if (keyEvent.key !== 'Escape') return
          if (started) {
            keyEvent.preventDefault()
            keyEvent.stopPropagation()
            dragManager.cancelDrop()
          }
          cleanup()
        }

        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', handleUp)
        window.addEventListener('pointercancel', handleCancel)
        window.addEventListener('keydown', handleKey, true)
      },
    },
  }
}
