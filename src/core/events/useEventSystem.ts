import { useRef, useCallback, useEffect } from 'react'
import { EventSystem } from './EventSystem'
import type { EventCallback } from './types'

export interface UseEventSystemReturn {
  /** Subscribe to an event */
  on: (name: string, callback: EventCallback, context?: unknown) => void
  /** Detach handler(s) for an event */
  detach: (name: string, context?: unknown) => void
  /** Fire an event — returns false if any handler vetoes */
  fire: (name: string, args?: unknown[]) => boolean
  /** Remove all handlers */
  clear: () => void
  /** Direct access to the underlying EventSystem instance */
  eventSystem: EventSystem
}

/**
 * React hook wrapper around EventSystem.
 * Provides stable callbacks and auto-cleanup on unmount.
 */
export function useEventSystem(): UseEventSystemReturn {
  const ref = useRef<EventSystem>(null!)
  if (ref.current === null) {
    ref.current = new EventSystem()
  }

  useEffect(() => {
    return () => {
      ref.current.clear()
    }
  }, [])

  const on = useCallback(
    (name: string, callback: EventCallback, context?: unknown) => {
      ref.current.on(name, callback, context)
    },
    [],
  )

  const detach = useCallback((name: string, context?: unknown) => {
    ref.current.detach(name, context)
  }, [])

  const fire = useCallback((name: string, args: unknown[] = []): boolean => {
    return ref.current.fire(name, args)
  }, [])

  const clear = useCallback(() => {
    ref.current.clear()
  }, [])

  return { on, detach, fire, clear, eventSystem: ref.current }
}
