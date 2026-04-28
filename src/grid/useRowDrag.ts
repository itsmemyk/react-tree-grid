import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { dragManager } from '../core/dnd'
import type { DataStore } from '../core/data'
import type { DataItem } from '../core/data/types'
import { uid } from '../core/utils/common'
import type {
  GridDragItem,
  GridDragMode,
  GridRow,
  GridRowDragData,
  GridRowDropPosition,
} from './types'

interface RowDragEvents {
  onBeforeRowDrag?: (data: GridRowDragData, event: PointerEvent) => boolean | void
  onDragRowStart?: (data: GridRowDragData, event: PointerEvent) => void
  onDragRowIn?: (data: GridRowDragData, event: PointerEvent) => void
  onDragRowOut?: (data: GridRowDragData, event: PointerEvent) => void
  canRowDrop?: (data: GridRowDragData, event: PointerEvent) => boolean | void
  onCancelRowDrop?: (data: GridRowDragData, event: PointerEvent) => void
  onBeforeRowDrop?: (data: GridRowDragData, event: PointerEvent) => boolean | void
  onAfterRowDrop?: (data: GridRowDragData, event: PointerEvent) => void
  onAfterRowDrag?: (data: GridRowDragData, event: PointerEvent) => void
}

interface DropIndicator {
  rowId: string
  position: GridRowDropPosition
  top: number
}

interface GridRegistryEntry<T extends GridRow> {
  componentId: string
  dragMode?: GridDragMode
  store?: DataStore<T & DataItem>
  getRowIndex: (rowId: string, position: GridRowDropPosition) => number
}

const gridRegistry = new Map<string, GridRegistryEntry<any>>()
const BODY_NO_SELECT_CLASS = 'rgs-no-select-drag'

function createRowDragData(
  start: string,
  target: string | null,
  position: GridRowDropPosition | null,
): GridRowDragData {
  return {
    start,
    source: [start],
    target,
    position,
  }
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function useRowDrag<T extends GridRow>(
  rows: T[],
  config: {
    store?: DataStore<T & DataItem>
    dragItem?: GridDragItem
    dragMode?: GridDragMode
    rowHeight: number
    viewportRef: RefObject<HTMLDivElement | null>
  },
  events: RowDragEvents,
) {
  const enabled = config.dragItem === 'row' || config.dragMode === 'both'
  const componentIdRef = useRef(`grid-row-dnd-${uid()}`)
  const rowNodesRef = useRef(new Map<string, HTMLElement>())
  const rowTargetDisposersRef = useRef(new Map<string, () => void>())
  const dragStateRef = useRef<GridRowDragData | null>(null)
  const dragStartRef = useRef<string | null>(null)
  const [orderedRowIds, setOrderedRowIds] = useState(() => rows.map((row) => row.id))
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null)

  useEffect(() => {
    if (config.store) {
      return
    }

    setOrderedRowIds((prev) => {
      const nextIds = rows.map((row) => row.id)
      const nextSet = new Set(nextIds)
      const merged = prev.filter((id) => nextSet.has(id))
      nextIds.forEach((id) => {
        if (!merged.includes(id)) {
          merged.push(id)
        }
      })
      if (merged.length === prev.length && merged.every((id, index) => id === prev[index])) {
        return prev
      }
      return merged
    })
  }, [config.store, rows])

  const orderedRows = useMemo(() => {
    if (config.store) {
      return rows
    }

    const rowMap = new Map(rows.map((row) => [row.id, row]))
    return orderedRowIds
      .map((rowId) => rowMap.get(rowId))
      .filter((row): row is T => Boolean(row))
  }, [config.store, orderedRowIds, rows])

  const getDropIndex = useCallback((rowId: string, position: GridRowDropPosition) => {
    const currentRows = config.store ? rows : orderedRows
    const index = currentRows.findIndex((row) => row.id === rowId)
    if (index < 0) {
      return -1
    }
    return position === 'bottom' ? index + 1 : index
  }, [config.store, orderedRows, rows])

  useEffect(() => {
    const entry: GridRegistryEntry<T> = {
      componentId: componentIdRef.current,
      dragMode: config.dragMode,
      store: config.store,
      getRowIndex: getDropIndex,
    }

    gridRegistry.set(componentIdRef.current, entry)
    return () => {
      gridRegistry.delete(componentIdRef.current)
    }
  }, [config.dragMode, config.store, getDropIndex])

  const unregisterRowTarget = useCallback((rowId: string) => {
    const disposer = rowTargetDisposersRef.current.get(rowId)
    if (disposer) {
      disposer()
      rowTargetDisposersRef.current.delete(rowId)
    }
  }, [])

  const registerRow = useCallback((rowId: string, node: HTMLElement | null) => {
    rowNodesRef.current.delete(rowId)
    unregisterRowTarget(rowId)

    if (!node || !enabled || config.dragMode === 'source') {
      return
    }

    rowNodesRef.current.set(rowId, node)
    const registrationId = `${componentIdRef.current}:${rowId}`
    const unregister = dragManager.registerTarget({
      id: registrationId,
      componentId: componentIdRef.current,
      element: node,
      mode: config.dragMode,
      accepts: ['row'],
      canDrop: (transfer) => {
        if (transfer.type !== 'row') {
          return false
        }

        if (transfer.componentId === componentIdRef.current) {
          return true
        }

        const sourceGrid = gridRegistry.get(transfer.componentId)
        const targetGrid = gridRegistry.get(componentIdRef.current)
        return Boolean(sourceGrid?.store && targetGrid?.store)
      },
      getDropPosition: (event, element) => {
        const rect = element.getBoundingClientRect()
        const midpoint = rect.top + rect.height / 2
        return event.clientY <= midpoint ? 'top' : 'bottom'
      },
    })
    rowTargetDisposersRef.current.set(rowId, unregister)
  }, [config.dragMode, enabled, unregisterRowTarget])

  useEffect(() => () => {
    rowTargetDisposersRef.current.forEach((dispose) => dispose())
    rowTargetDisposersRef.current.clear()
  }, [])

  const resolvePayload = useCallback((): {
    payload: GridRowDragData
    transferTargetComponentId: string | null
    top: number | null
  } | null => {
    const transfer = dragManager.transfer
    const start = dragStartRef.current
    if (!transfer || !start) {
      return null
    }

    const target = transfer.target
    const position = (transfer.dropPosition ?? null) as GridRowDropPosition | null
    if (!target || !position) {
      return {
        payload: createRowDragData(start, null, null),
        transferTargetComponentId: transfer.dropComponentId,
        top: null,
      }
    }

    const [componentId, rowId] = target.split(':')
    const rowNode = rowNodesRef.current.get(rowId) ?? null
    const viewportNode = config.viewportRef.current
    let top: number | null = null
    if (rowNode && viewportNode) {
      const rowRect = rowNode.getBoundingClientRect()
      const viewportRect = viewportNode.getBoundingClientRect()
      top = (position === 'bottom' ? rowRect.bottom : rowRect.top) - viewportRect.top
    }

    return {
      payload: createRowDragData(start, rowId, position),
      transferTargetComponentId: componentId ?? transfer.dropComponentId,
      top,
    }
  }, [config.viewportRef])

  const applyDrop = useCallback((payload: GridRowDragData, targetComponentId: string | null) => {
    if (!payload.target || !payload.position) {
      return
    }

    const dropTarget = gridRegistry.get(targetComponentId ?? componentIdRef.current)
    if (!dropTarget) {
      return
    }

    const targetIndex = dropTarget.getRowIndex(payload.target, payload.position)
    if (targetIndex < 0) {
      return
    }

    if (targetComponentId && targetComponentId !== componentIdRef.current) {
      const sourceGrid = gridRegistry.get(componentIdRef.current)
      if (sourceGrid?.store && dropTarget.store) {
        sourceGrid.store.move(payload.start, targetIndex, dropTarget.store)
      }
      return
    }

    if (config.store) {
      config.store.move(payload.start, targetIndex)
      return
    }

    setOrderedRowIds((prev) => {
      const fromIndex = prev.indexOf(payload.start)
      if (fromIndex < 0) {
        return prev
      }
      let nextIndex = targetIndex
      if (payload.position === 'bottom' && fromIndex < targetIndex) {
        nextIndex -= 1
      }
      if (fromIndex === nextIndex) {
        return prev
      }
      return moveItem(prev, fromIndex, nextIndex)
    })
  }, [config.store])

  const handleRowPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>, rowId: string) => {
    if (!enabled || config.dragMode === 'target') {
      return
    }

    event.preventDefault()
    window.getSelection?.()?.removeAllRanges()
    document.body.classList.add(BODY_NO_SELECT_CLASS)

    const sourceNode = event.currentTarget
    const ghost = sourceNode.cloneNode(true) as HTMLElement
    dragStartRef.current = rowId
    const startPayload = createRowDragData(rowId, null, null)
    if (events.onBeforeRowDrag?.(startPayload, event.nativeEvent) === false) {
      document.body.classList.remove(BODY_NO_SELECT_CLASS)
      dragStartRef.current = null
      return
    }

    const rect = sourceNode.getBoundingClientRect()
    const transfer = dragManager.dragStart(event.nativeEvent, {
      id: rowId,
      source: [rowId],
      type: 'row',
      ghost,
      initXOffset: event.clientX - rect.left,
      initYOffset: event.clientY - rect.top,
    }, {
      componentId: componentIdRef.current,
    })

    if (!transfer) {
      document.body.classList.remove(BODY_NO_SELECT_CLASS)
      dragStartRef.current = null
      return
    }

    ghost.classList.add('rgs-row-drag-ghost')
    dragStateRef.current = startPayload
    events.onDragRowStart?.(startPayload, event.nativeEvent)

    const handleMove = (moveEvent: PointerEvent) => {
      dragManager.drag(moveEvent)
      const resolved = resolvePayload()
      if (!resolved) {
        return
      }

      const { payload, top } = resolved
      if (payload.target && payload.position && events.canRowDrop?.(payload, moveEvent) === false) {
        if (dragStateRef.current?.target) {
          events.onCancelRowDrop?.(dragStateRef.current, moveEvent)
        }
        dragStateRef.current = createRowDragData(rowId, null, null)
        setDropIndicator(null)
        return
      }

      if (
        dragStateRef.current?.target &&
        (dragStateRef.current.target !== payload.target ||
          dragStateRef.current.position !== payload.position)
      ) {
        events.onDragRowOut?.(dragStateRef.current, moveEvent)
      }

      if (
        payload.target &&
        (dragStateRef.current?.target !== payload.target ||
          dragStateRef.current?.position !== payload.position)
      ) {
        events.onDragRowIn?.(payload, moveEvent)
      }

      dragStateRef.current = payload
      setDropIndicator(payload.target && payload.position && top !== null
        ? {
            rowId: payload.target,
            position: payload.position,
            top,
          }
        : null)
    }

    const handleUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      document.body.classList.remove(BODY_NO_SELECT_CLASS)

      const resolved = resolvePayload()
      const payload = resolved?.payload ?? createRowDragData(rowId, null, null)
      const targetComponentId = resolved?.transferTargetComponentId ?? null

      if (!payload.target || !payload.position || events.canRowDrop?.(payload, upEvent) === false) {
        if (payload.target && payload.position) {
          events.onCancelRowDrop?.(payload, upEvent)
        } else if (dragStateRef.current?.target) {
          events.onCancelRowDrop?.(dragStateRef.current, upEvent)
          events.onDragRowOut?.(dragStateRef.current, upEvent)
        }
        dragManager.cancelDrop()
        events.onAfterRowDrag?.(payload, upEvent)
      } else if (events.onBeforeRowDrop?.(payload, upEvent) === false) {
        dragManager.cancelDrop()
        events.onAfterRowDrag?.(payload, upEvent)
      } else {
        applyDrop(payload, targetComponentId)
        dragManager.drop(upEvent)
        events.onAfterRowDrop?.(payload, upEvent)
        if (dragStateRef.current?.target) {
          events.onDragRowOut?.(dragStateRef.current, upEvent)
        }
        events.onAfterRowDrag?.(payload, upEvent)
      }

      dragStateRef.current = null
      dragStartRef.current = null
      setDropIndicator(null)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp, { once: true })
  }, [applyDrop, config.dragMode, enabled, events, resolvePayload])

  const getRowProps = useCallback((rowId: string) => ({
    ref: (node: HTMLDivElement | null) => registerRow(rowId, node),
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => handleRowPointerDown(event, rowId),
  }), [handleRowPointerDown, registerRow])

  return {
    enabled,
    orderedRows,
    dropIndicator,
    getRowProps,
  }
}
