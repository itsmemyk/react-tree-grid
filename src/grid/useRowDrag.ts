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
const DROP_LINE_HEIGHT = 2
/** Matches DragManager's default auto-scroll threshold */
const AUTO_SCROLL_EDGE = 24
const AUTO_SCROLL_INTERVAL = 50

/**
 * Clone a row for the drag ghost. The ghost lives on <body>, outside the grid
 * and theme roots, so the column-width variables and theme font no longer
 * apply; freeze the measured sizes and typography onto the clone instead.
 */
function createRowGhost(sourceNode: HTMLElement): HTMLElement {
  const ghost = sourceNode.cloneNode(true) as HTMLElement
  const rowRect = sourceNode.getBoundingClientRect()
  const rowStyle = window.getComputedStyle(sourceNode)
  ghost.style.width = `${rowRect.width}px`
  ghost.style.height = `${rowRect.height}px`
  ghost.style.boxSizing = 'border-box'
  ghost.style.font = rowStyle.font
  ghost.style.color = rowStyle.color
  ghost.style.background = rowStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ? rowStyle.backgroundColor : '#fff'
  ghost.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.18)'
  ghost.style.overflow = 'hidden'

  const sourceCells = sourceNode.querySelectorAll<HTMLElement>('[data-rgs-col-id]')
  const ghostCells = ghost.querySelectorAll<HTMLElement>('[data-rgs-col-id]')
  sourceCells.forEach((cell, index) => {
    const target = ghostCells[index]
    if (!target) return
    const cellRect = cell.getBoundingClientRect()
    const cellStyle = window.getComputedStyle(cell)
    target.style.width = `${cellRect.width}px`
    target.style.flex = 'none'
    target.style.borderColor = cellStyle.borderRightColor
  })
  return ghost
}

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
  // A row can render in several sections (frozen columns, pinned panels), so each
  // rendered element is its own drop target, keyed by a unique registration id
  const rowTargetsRef = useRef(new Map<HTMLElement, { registrationId: string; dispose: () => void }>())
  const targetNodesRef = useRef(new Map<string, HTMLElement>())
  const registrationSeqRef = useRef(0)
  const dragStateRef = useRef<GridRowDragData | null>(null)
  const dragStartRef = useRef<string | null>(null)
  const [orderedRowIds, setOrderedRowIds] = useState(() => rows.map((row) => row.id))
  const prevPropIdsRef = useRef<string[]>(rows.map((row) => row.id))
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null)

  useEffect(() => {
    if (config.store) {
      return
    }

    const nextIds = rows.map((row) => row.id)
    const nextSet = new Set(nextIds)
    const prevPropIds = prevPropIdsRef.current
    prevPropIdsRef.current = nextIds

    // The parent reordered rows it already had: adopt its order over any local drag order
    const prevSet = new Set(prevPropIds)
    const keptNow = nextIds.filter((id) => prevSet.has(id))
    const keptBefore = prevPropIds.filter((id) => nextSet.has(id))
    if (keptNow.some((id, index) => id !== keptBefore[index])) {
      setOrderedRowIds(nextIds)
      return
    }

    // Otherwise keep the local order, dropping removed rows and appending new ones
    setOrderedRowIds((prev) => {
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

  const unregisterNode = useCallback((node: HTMLElement) => {
    const entry = rowTargetsRef.current.get(node)
    if (!entry) return
    entry.dispose()
    rowTargetsRef.current.delete(node)
    targetNodesRef.current.delete(entry.registrationId)
  }, [])

  const registerRow = useCallback((rowId: string, node: HTMLElement | null) => {
    if (!node) return
    // Refresh: a new ref (settings changed) replaces this element's old registration
    unregisterNode(node)
    if (!enabled || config.dragMode === 'source') return

    registrationSeqRef.current += 1
    const registrationId = `${componentIdRef.current}:${rowId}:${registrationSeqRef.current}`
    targetNodesRef.current.set(registrationId, node)
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
    rowTargetsRef.current.set(node, { registrationId, dispose: unregister })
  }, [config.dragMode, enabled, unregisterNode])

  // Drop registrations whose element has left the DOM (unmounted row or section)
  useEffect(() => {
    for (const node of [...rowTargetsRef.current.keys()]) {
      if (!node.isConnected) unregisterNode(node)
    }
  })

  useEffect(() => () => {
    for (const node of [...rowTargetsRef.current.keys()]) unregisterNode(node)
  }, [unregisterNode])

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
    const rowNode = targetNodesRef.current.get(target) ?? null
    const viewportNode = config.viewportRef.current
    let top: number | null = null
    if (rowNode && viewportNode) {
      const rowRect = rowNode.getBoundingClientRect()
      const viewportRect = viewportNode.getBoundingClientRect()
      top = (position === 'bottom' ? rowRect.bottom : rowRect.top) - viewportRect.top
      // Keep the line inside the viewport for partly scrolled first/last rows
      top = Math.min(Math.max(top, 0), Math.max(viewportRect.height - DROP_LINE_HEIGHT, 0))
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

    // The target index counts the dragged row itself; moving down, it's removed first
    if (config.store) {
      const fromIndex = config.store.getIndex(payload.start)
      config.store.move(payload.start, fromIndex >= 0 && fromIndex < targetIndex ? targetIndex - 1 : targetIndex)
      return
    }

    setOrderedRowIds((prev) => {
      const fromIndex = prev.indexOf(payload.start)
      if (fromIndex < 0) {
        return prev
      }
      const nextIndex = fromIndex < targetIndex ? targetIndex - 1 : targetIndex
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
    const ghost = createRowGhost(sourceNode)
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

    let lastMove: PointerEvent | null = null
    const handleMove = (moveEvent: PointerEvent) => {
      lastMove = moveEvent
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

    // Auto-scroll runs from pointer moves, so keep feeding the last position
    // while the pointer rests in the viewport's edge zone
    const autoScrollTimer = window.setInterval(() => {
      const viewport = config.viewportRef.current
      if (!lastMove || !viewport) return
      const rect = viewport.getBoundingClientRect()
      const y = lastMove.clientY
      if (y < rect.top + AUTO_SCROLL_EDGE || y > rect.bottom - AUTO_SCROLL_EDGE) handleMove(lastMove)
    }, AUTO_SCROLL_INTERVAL)

    const handleUp = (upEvent: PointerEvent) => {
      window.clearInterval(autoScrollTimer)
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
  }, [applyDrop, config.dragMode, config.viewportRef, enabled, events, resolvePayload])

  // Stable per-row refs, so React doesn't detach and re-attach every row on each render
  const rowRefsRef = useRef(new Map<string, (node: HTMLDivElement | null) => void>())
  const registerRowRef = useRef(registerRow)
  if (registerRowRef.current !== registerRow) {
    registerRowRef.current = registerRow
    rowRefsRef.current = new Map()
  }

  const getRowProps = useCallback((rowId: string) => {
    let ref = rowRefsRef.current.get(rowId)
    if (!ref) {
      ref = (node: HTMLDivElement | null) => registerRow(rowId, node)
      rowRefsRef.current.set(rowId, ref)
    }
    return {
      ref,
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => handleRowPointerDown(event, rowId),
    }
  }, [handleRowPointerDown, registerRow])

  return {
    enabled,
    orderedRows,
    dropIndicator,
    getRowProps,
  }
}
