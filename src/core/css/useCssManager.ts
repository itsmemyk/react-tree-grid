import { useRef, useCallback, useEffect } from 'react'
import { CssManager } from './CssManager'

export interface UseCssManagerReturn {
  /** Add a dynamic CSS class. Returns the generated class name. */
  add: (cssList: Record<string, string>, customId?: string) => string
  /** Remove a generated class */
  remove: (className: string) => void
  /** Get CSS properties of a class */
  get: (className: string) => Record<string, string> | null
}

/**
 * React hook for managing dynamic CSS classes.
 * Creates a private CssManager per component instance, cleaned up on unmount.
 */
export function useCssManager(): UseCssManagerReturn {
  const ref = useRef<CssManager>(null!)
  if (ref.current === null) {
    ref.current = new CssManager()
  }

  useEffect(() => {
    return () => {
      ref.current.destructor()
    }
  }, [])

  const add = useCallback(
    (cssList: Record<string, string>, customId?: string): string => {
      return ref.current.add(cssList, customId)
    },
    [],
  )

  const remove = useCallback((className: string) => {
    ref.current.remove(className)
  }, [])

  const get = useCallback(
    (className: string): Record<string, string> | null => {
      return ref.current.get(className)
    },
    [],
  )

  return { add, remove, get }
}
