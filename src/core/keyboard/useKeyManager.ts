import { useRef, useCallback, useEffect } from 'react'
import { KeyManager } from './KeyManager'

type HotKeyHandler = (e: KeyboardEvent) => void

export interface UseKeyManagerReturn {
  /** Register a hotkey (e.g. "ctrl+s", "escape", "shift+enter") */
  addHotKey: (key: string, handler: HotKeyHandler) => void
  /** Remove a hotkey */
  removeHotKey: (key?: string, handler?: HotKeyHandler) => void
  /** Check if a hotkey exists */
  exist: (key: string) => boolean
  /** The underlying KeyManager instance */
  keyManager: KeyManager
}

/**
 * React hook wrapping KeyManager. Auto-cleans up on unmount.
 */
export function useKeyManager(
  beforeCall?: (e: KeyboardEvent) => boolean | void,
): UseKeyManagerReturn {
  const ref = useRef<KeyManager>(null!)
  if (ref.current === null) {
    ref.current = new KeyManager(beforeCall)
  }

  useEffect(() => {
    return () => {
      ref.current.destructor()
    }
  }, [])

  return {
    addHotKey: useCallback(
      (key: string, handler: HotKeyHandler) => ref.current.addHotKey(key, handler),
      [],
    ),
    removeHotKey: useCallback(
      (key?: string, handler?: HotKeyHandler) => ref.current.removeHotKey(key, handler),
      [],
    ),
    exist: useCallback((key: string) => ref.current.exist(key), []),
    keyManager: ref.current,
  }
}
