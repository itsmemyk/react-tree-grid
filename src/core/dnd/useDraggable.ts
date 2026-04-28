import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { DragEvents } from '../events/types'
import { dragManager } from './DragManager'
import type { DragData, TransferData, UseDraggableConfig } from './types'

export interface UseDraggableReturn {
  draggableProps: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  }
}

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
        if (configRef.current.disabled) {
          return
        }

        const ghost =
          typeof configRef.current.ghost === 'function'
            ? configRef.current.ghost()
            : configRef.current.ghost ?? null
        const offset = configRef.current.getInitialOffset?.(event) ?? {
          x: 0,
          y: 0,
        }

        const transfer = dragManager.dragStart(event.nativeEvent, {
          id: configRef.current.id,
          source: configRef.current.source,
          type: configRef.current.type,
          ghost,
          initXOffset: offset.x,
          initYOffset: offset.y,
        }, {
          componentId: configRef.current.componentId,
        })

        if (!transfer) {
          return
        }

        const handleMove = (moveEvent: PointerEvent) => {
          dragManager.drag(moveEvent)
        }

        const handleUp = (upEvent: PointerEvent) => {
          window.removeEventListener('pointermove', handleMove)
          window.removeEventListener('pointerup', handleUp)
          dragManager.drop(upEvent)
        }

        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', handleUp, { once: true })
      },
    },
  }
}
