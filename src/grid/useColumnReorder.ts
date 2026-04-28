import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent as ReactDragEvent } from 'react'
import type {
  GridColumn,
  GridColumnDragData,
  GridColumnDropPosition,
  GridDragItem,
  GridDragMode,
  GridRow,
} from './types'

interface ColumnReorderEvents {
  onBeforeColumnDrag?: (data: GridColumnDragData, event: ReactDragEvent) => boolean | void
  onDragColumnStart?: (data: GridColumnDragData, event: ReactDragEvent) => void
  onDragColumnIn?: (data: GridColumnDragData, event: ReactDragEvent) => void
  onDragColumnOut?: (data: GridColumnDragData, event: ReactDragEvent) => void
  onAfterColumnDrag?: (data: GridColumnDragData, event: ReactDragEvent) => void
  canColumnDrop?: (data: GridColumnDragData, event: ReactDragEvent) => boolean | void
  onCancelColumnDrop?: (data: GridColumnDragData, event: ReactDragEvent) => void
  onBeforeColumnDrop?: (data: GridColumnDragData, event: ReactDragEvent) => boolean | void
  onAfterColumnDrop?: (data: GridColumnDragData, event: ReactDragEvent) => void
}

interface ColumnDropIndicator {
  columnId: string
  position: GridColumnDropPosition
}

interface ColumnDragState extends GridColumnDragData {}

function moveColumn<T>(columns: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...columns]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

function getZone(index: number, columnCount: number, leftSplit: number, rightSplit: number): 'left' | 'center' | 'right' {
  if (index < leftSplit) {
    return 'left'
  }
  if (rightSplit > 0 && index >= columnCount - rightSplit) {
    return 'right'
  }
  return 'center'
}

function createDragData(
  start: string,
  target: string | null,
  position: GridColumnDropPosition | null,
): GridColumnDragData {
  return {
    start,
    source: [start],
    target,
    position,
  }
}

export function useColumnReorder<T extends GridRow>(
  columns: GridColumn<T>[],
  config: {
    dragItem?: GridDragItem
    dragMode?: GridDragMode
    leftSplit: number
    rightSplit: number
  },
  events: ColumnReorderEvents,
) {
  const [orderedColumnIds, setOrderedColumnIds] = useState(() =>
    columns.map((column) => column.id),
  )
  const [dragState, setDragState] = useState<ColumnDragState | null>(null)
  const [dropIndicator, setDropIndicator] = useState<ColumnDropIndicator | null>(null)
  const dragStateRef = useRef<ColumnDragState | null>(null)
  const suppressClickRef = useRef(false)

  const enabled = config.dragItem === 'column' || config.dragMode === 'both'

  useEffect(() => {
    setOrderedColumnIds((prev) => {
      const nextIds = columns.map((column) => column.id)
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
  }, [columns])

  const orderedColumns = useMemo(() => {
    const columnMap = new Map(columns.map((column) => [column.id, column]))
    return orderedColumnIds
      .map((id) => columnMap.get(id))
      .filter((column): column is GridColumn<T> => Boolean(column))
  }, [columns, orderedColumnIds])

  const canDropAt = useCallback(
    (sourceColId: string, targetColId: string, event: ReactDragEvent): boolean => {
      const sourceIndex = orderedColumns.findIndex((column) => column.id === sourceColId)
      const targetIndex = orderedColumns.findIndex((column) => column.id === targetColId)

      if (sourceIndex < 0 || targetIndex < 0) {
        return false
      }

      const sourceZone = getZone(
        sourceIndex,
        orderedColumns.length,
        config.leftSplit,
        config.rightSplit,
      )
      const targetZone = getZone(
        targetIndex,
        orderedColumns.length,
        config.leftSplit,
        config.rightSplit,
      )

      if (sourceZone !== targetZone) {
        return false
      }

      const position: GridColumnDropPosition =
        sourceIndex > targetIndex ? 'before' : 'after'

      const data = createDragData(sourceColId, targetColId, position)
      if (events.canColumnDrop?.(data, event) === false) {
        return false
      }

      return true
    },
    [config.leftSplit, config.rightSplit, events, orderedColumns],
  )

  const handleHeaderDragStart = useCallback(
    (event: ReactDragEvent, colId: string) => {
      if (!enabled) {
        event.preventDefault()
        return
      }

      const data = createDragData(colId, null, null)
      if (events.onBeforeColumnDrag?.(data, event) === false) {
        event.preventDefault()
        return
      }

      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', colId)
      const nextState = createDragData(colId, null, null)
      dragStateRef.current = nextState
      setDragState(nextState)
      setDropIndicator(null)
      events.onDragColumnStart?.(nextState, event)
    },
    [enabled, events],
  )

  const handleHeaderDragOver = useCallback(
    (
      event: ReactDragEvent,
      targetColId: string,
    ) => {
      const sourceColId = dragStateRef.current?.start
      if (!sourceColId) {
        return
      }

      if (!canDropAt(sourceColId, targetColId, event)) {
        if (dragStateRef.current?.target) {
          events.onCancelColumnDrop?.(dragStateRef.current, event)
          dragStateRef.current = createDragData(sourceColId, null, null)
          setDragState(dragStateRef.current)
          setDropIndicator(null)
        }
        return
      }

      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      const sourceIndex = orderedColumns.findIndex((column) => column.id === sourceColId)
      const targetIndex = orderedColumns.findIndex((column) => column.id === targetColId)
      const position: GridColumnDropPosition =
        sourceIndex > targetIndex ? 'before' : 'after'
      const nextState = createDragData(sourceColId, targetColId, position)

      if (
        dragStateRef.current?.target &&
        (dragStateRef.current.target !== nextState.target ||
          dragStateRef.current.position !== nextState.position)
      ) {
        events.onDragColumnOut?.(dragStateRef.current, event)
      }
      if (
        dragStateRef.current?.target !== nextState.target ||
        dragStateRef.current?.position !== nextState.position
      ) {
        events.onDragColumnIn?.(nextState, event)
      }

      dragStateRef.current = nextState
      setDragState(nextState)
      setDropIndicator((prev) => {
        if (prev?.columnId === targetColId && prev.position === position) {
          return prev
        }
        return { columnId: targetColId, position }
      })
    },
    [canDropAt, orderedColumns],
  )

  const handleHeaderDrop = useCallback(
    (event: ReactDragEvent, targetColId: string) => {
      event.preventDefault()

      const sourceColId = dragStateRef.current?.start
      if (!sourceColId || !canDropAt(sourceColId, targetColId, event)) {
        setDropIndicator(null)
        return
      }

      const currentColumns = orderedColumns
      const sourceIndex = currentColumns.findIndex((column) => column.id === sourceColId)
      const targetIndex = currentColumns.findIndex((column) => column.id === targetColId)
      const position: GridColumnDropPosition =
        sourceIndex > targetIndex ? 'before' : 'after'

      const data = createDragData(sourceColId, targetColId, position)
      if (events.onBeforeColumnDrop?.(data, event) === false) {
        setDropIndicator(null)
        return
      }

      setOrderedColumnIds((prev) => {
        const sourceIndex = prev.indexOf(sourceColId)
        const targetIndex = prev.indexOf(targetColId)
        if (sourceIndex < 0 || targetIndex < 0) {
          return prev
        }
        if (sourceIndex === targetIndex) {
          return prev
        }

        const nextIds = moveColumn(prev, sourceIndex, targetIndex)
        events.onAfterColumnDrop?.(data, event)
        return nextIds
      })

      suppressClickRef.current = true
      setDropIndicator(null)
      dragStateRef.current = data
      setDragState(data)
    },
    [canDropAt, columns, events, orderedColumns],
  )

  const handleHeaderDragEnd = useCallback((event: ReactDragEvent) => {
    if (dragStateRef.current?.target && dragStateRef.current.position) {
      events.onDragColumnOut?.(dragStateRef.current, event)
    }
    if (dragStateRef.current) {
      events.onAfterColumnDrag?.(
        dragStateRef.current,
        event,
      )
    }
    dragStateRef.current = null
    setDragState(null)
    setDropIndicator(null)
  }, [events])

  const shouldPreventHeaderClick = useCallback(() => {
    if (!suppressClickRef.current) {
      return false
    }

    suppressClickRef.current = false
    return true
  }, [])

  return {
    enabled,
    orderedColumns,
    dragState,
    dropIndicator,
    setColumnOrder: setOrderedColumnIds,
    handleHeaderDragStart,
    handleHeaderDragOver,
    handleHeaderDrop,
    handleHeaderDragEnd,
    shouldPreventHeaderClick,
  }
}
