import { useEffect, useRef, type RefObject } from 'react'
import { DragEvents } from '../events/types'
import { dragManager } from './DragManager'
import type { DragData, DropTargetRegistration, UseDropTargetConfig } from './types'

export interface UseDropTargetReturn<T extends HTMLElement> {
  targetRef: RefObject<T | null>
}

export function useDropTarget<T extends HTMLElement>(
  config: UseDropTargetConfig,
): UseDropTargetReturn<T> {
  const targetRef = useRef<T | null>(null)
  const configRef = useRef(config)
  const eventContextRef = useRef({})
  configRef.current = config

  useEffect(() => {
    const node = targetRef.current
    if (!node || configRef.current.disabled) {
      return
    }

    const registration: DropTargetRegistration = {
      id: configRef.current.id,
      componentId: configRef.current.componentId,
      element: node,
      mode: configRef.current.mode,
      type: configRef.current.type,
      accepts: configRef.current.accepts,
      getDropPosition: configRef.current.getDropPosition,
      canDrop: configRef.current.canDrop,
    }

    const unregister = dragManager.registerTarget(registration)
    const handleAfterDrop = (data: unknown) => {
      const current = data as DragData
      if (current.target === configRef.current.id) {
        configRef.current.onDrop?.(current)
      }
    }

    dragManager.events.on(DragEvents.afterDrop, handleAfterDrop, eventContextRef.current)

    return () => {
      unregister()
      dragManager.events.detach(DragEvents.afterDrop, eventContextRef.current)
    }
  }, [config.disabled])

  return { targetRef }
}
