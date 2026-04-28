import { useRef, useState, useCallback, useEffect } from 'react'
import { Selection } from './Selection'
import { EventSystem } from '../events/EventSystem'
import type { DataStore } from '../data/DataStore'
import type { DataItem } from '../data/types'
import type { SelectionConfig } from './types'
import { SelectionEvents } from './types'

export interface UseSelectionReturn<T extends DataItem> {
  /** Selected id(s) (reactive) */
  selected: string[]
  /** The underlying Selection instance */
  selection: Selection<T>
  /** Add to selection */
  add: (id?: string, isCtrl?: boolean, isShift?: boolean) => void
  /** Remove from selection */
  remove: (id?: string) => void
  /** Check if id is selected */
  contains: (id?: string) => boolean
  /** Get selected id(s) */
  getId: () => string | string[] | undefined
  /** Get selected item(s) */
  getItem: () => T | T[] | null
  /** Enable selection */
  enable: () => void
  /** Disable selection */
  disable: () => void
}

export function useSelection<T extends DataItem>(
  dataStore: DataStore<T>,
  config: SelectionConfig = {},
): UseSelectionReturn<T> {
  const eventsRef = useRef<EventSystem>(null!)
  if (eventsRef.current === null) {
    eventsRef.current = new EventSystem()
  }

  const selRef = useRef<Selection<T>>(null!)
  if (selRef.current === null) {
    selRef.current = new Selection<T>(config, dataStore, eventsRef.current)
  }

  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const events = eventsRef.current
    const sync = () => {
      const id = selRef.current.getId()
      if (Array.isArray(id)) {
        setSelected([...id])
      } else if (id) {
        setSelected([id])
      } else {
        setSelected([])
      }
    }
    events.on(SelectionEvents.afterSelect, sync)
    events.on(SelectionEvents.afterUnSelect, sync)
    return () => {
      selRef.current.destructor()
      events.clear()
    }
  }, [])

  return {
    selected,
    selection: selRef.current,
    add: useCallback(
      (id?: string, isCtrl?: boolean, isShift?: boolean) =>
        selRef.current.add(id, isCtrl, isShift),
      [],
    ),
    remove: useCallback((id?: string) => selRef.current.remove(id), []),
    contains: useCallback((id?: string) => selRef.current.contains(id), []),
    getId: useCallback(() => selRef.current.getId(), []),
    getItem: useCallback(() => selRef.current.getItem(), []),
    enable: useCallback(() => selRef.current.enable(), []),
    disable: useCallback(() => selRef.current.disable(), []),
  }
}
