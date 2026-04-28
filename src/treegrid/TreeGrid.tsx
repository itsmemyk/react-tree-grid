import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { useTreeStore } from '../core/data'
import { applyGroupBy } from '../core/data/GroupBy'
import { Grid } from '../grid/Grid'
import type { GridColumn, GridProps } from '../grid/types'
import type { TreeDataItem } from '../core/data/types'
import type { TreeGridProps, TreeGridRef, TreeGridRow } from './types'
import styles from './treegrid.module.css'
import gridStyles from '../grid/grid.module.css'

type InternalTreeGridRow = TreeGridRow & TreeDataItem

function cloneRows<T extends InternalTreeGridRow>(rows: T[]): T[] {
  return JSON.parse(JSON.stringify(rows)) as T[]
}

function getLevel(store: ReturnType<typeof useTreeStore<InternalTreeGridRow>>['store'], id: string): number {
  let level = 0
  let parent = store.getParent(id)
  while (parent && parent !== store.getRoot()) {
    level += 1
    parent = store.getParent(parent)
  }
  return level
}

function collectExpandable<T extends InternalTreeGridRow>(rows: T[], into = new Set<string>()): Set<string> {
  for (const row of rows) {
    if (row.items?.length) {
      into.add(row.id)
      collectExpandable(row.items as T[], into)
    }
  }
  return into
}

function applyCollapsedState<T extends InternalTreeGridRow>(rows: T[], collapsed: boolean): T[] {
  return rows.map((row) => ({
    ...row,
    $opened: collapsed ? false : row.$opened,
    items: row.items ? applyCollapsedState(row.items as T[], collapsed) : undefined,
  }))
}

export const TreeGrid = forwardRef<TreeGridRef, TreeGridProps<TreeGridRow>>(function TreeGrid(
  props,
  ref,
) {
  const {
    data,
    columns,
    treeColumnId,
    collapsed = false,
    rootParent,
    dropBehaviour = 'sibling',
    dragExpand = true,
    groupBy,
    groupAggregate,
    onCellClick,
    onDragRowIn,
    onAfterRowDrop,
    ...gridProps
  } = props

  const expandTimerRef = useRef<number | null>(null)
  const normalizedData = useMemo(() => {
    let rows = cloneRows(data as InternalTreeGridRow[])
    if (groupBy && !gridProps.dataProxy) {
      const keys = Array.isArray(groupBy) ? groupBy : [groupBy]
      rows = applyGroupBy(
        rows as Record<string, unknown>[],
        keys,
        groupAggregate,
      ) as InternalTreeGridRow[]
    }
    return applyCollapsedState(rows, collapsed)
  }, [collapsed, data, groupBy, groupAggregate, gridProps.dataProxy])

  const tree = useTreeStore<InternalTreeGridRow>({
    data: normalizedData,
    config: rootParent ? { rootId: rootParent } : undefined,
  })
  const { store, items } = tree
  const rootId = store.getRoot()
  const activeTreeColumnId = treeColumnId ?? columns[0]?.id

  useEffect(() => {
    store.parse(normalizedData)
  }, [normalizedData, store])

  const flatRows = useMemo(
    () => store.flatten(store.getItems(rootId)),
    [items, rootId, store],
  )

  const mappedColumns = useMemo(() => columns.map((column) => {
    if (column.id !== activeTreeColumnId) return column

    const originalTemplate = column.template
    const next: GridColumn<InternalTreeGridRow> = {
      ...column,
      template: (value, row, col) => {
        const level = getLevel(store, row.id)
        const hasChildren = store.haveItems(row.id)
        const opened = !!store.getItem(row.id)?.$opened
        return (
          <div className={styles.treeCell} style={{ paddingInlineStart: `${level * 18}px` }}>
            <button
              type="button"
              className={styles.toggle}
              data-rgs-tree-toggle={row.id}
              aria-label={opened ? 'Collapse row' : 'Expand row'}
            >
              {hasChildren ? (opened ? '▾' : '▸') : ''}
            </button>
            <span className={styles.cellValue}>
              {originalTemplate ? originalTemplate(value, row, col) : String(value ?? '')}
            </span>
          </div>
        )
      },
    }
    return next
  }), [activeTreeColumnId, columns, store])

  useImperativeHandle(ref, () => ({
    open: (id: string) => {
      if (store.exists(id)) store.update(id, { $opened: true } as Partial<InternalTreeGridRow>)
    },
    close: (id: string) => {
      if (store.exists(id)) store.update(id, { $opened: false } as Partial<InternalTreeGridRow>)
    },
    openAll: () => {
      for (const id of Array.from(collectExpandable(store.serialize() as InternalTreeGridRow[]))) {
        if (store.exists(id)) store.update(id, { $opened: true } as Partial<InternalTreeGridRow>, true)
      }
      store.events.fire('change', [undefined, 'update'])
    },
    closeAll: () => {
      for (const id of Array.from(collectExpandable(store.serialize() as InternalTreeGridRow[]))) {
        if (store.exists(id)) store.update(id, { $opened: false } as Partial<InternalTreeGridRow>, true)
      }
      store.events.fire('change', [undefined, 'update'])
    },
  }), [store])

  const handleCellClick: GridProps<InternalTreeGridRow>['onCellClick'] = (rowId, colId, event) => {
    const target = event.target as HTMLElement
    if (target.closest(`[data-rgs-tree-toggle="${rowId}"]`)) {
      const item = store.getItem(rowId)
      if (item && store.haveItems(rowId)) {
        store.update(rowId, { $opened: !item.$opened } as Partial<InternalTreeGridRow>)
      }
    }
    onCellClick?.(rowId, colId, event)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.key !== 'Enter') return
    const selectedRow = event.currentTarget.querySelector(`.${gridStyles.rowSelected}[data-rgs-id]`) as HTMLElement | null
    const rowId = selectedRow?.getAttribute('data-rgs-id')
    if (!rowId) return
    const item = store.getItem(rowId)
    if (item && store.haveItems(rowId)) {
      store.update(rowId, { $opened: !item.$opened } as Partial<InternalTreeGridRow>)
      event.preventDefault()
    }
  }

  const handleDragRowIn: GridProps<InternalTreeGridRow>['onDragRowIn'] = (dragData, event) => {
    if (dragExpand && dragData.target) {
      const item = store.getItem(dragData.target)
      if (item && store.haveItems(dragData.target) && !item.$opened) {
        if (expandTimerRef.current !== null) window.clearTimeout(expandTimerRef.current)
        expandTimerRef.current = window.setTimeout(() => {
          store.update(dragData.target!, { $opened: true } as Partial<InternalTreeGridRow>)
        }, 200)
      }
    }
    onDragRowIn?.(dragData, event)
  }

  const handleAfterRowDrop: GridProps<InternalTreeGridRow>['onAfterRowDrop'] = (dragData, event) => {
    if (dragData.target && dragData.position) {
      if (dropBehaviour === 'child') {
        store.move(dragData.start, -1, undefined, dragData.target)
      } else {
        // useRowDrag.applyDrop calls store.move(id, flatIndex) which defaults targetId to root,
        // breaking tree hierarchy. Redo the move tree-aware: place next to target within its parent.
        // getParent/getIndex reflect post-applyDrop state (target was never moved, only the dragged item).
        const parentId = store.getParent(dragData.target) ?? rootId
        const siblingIndex = store.getIndex(dragData.target)
        const insertIndex = dragData.position === 'bottom' ? siblingIndex + 1 : siblingIndex
        store.move(dragData.start, insertIndex, undefined, parentId)
      }
    }
    onAfterRowDrop?.(dragData, event)
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <Grid<InternalTreeGridRow>
        {...gridProps}
        rootParent={rootId}
        columns={mappedColumns}
        data={flatRows}
        store={store}
        onCellClick={handleCellClick}
        onDragRowIn={handleDragRowIn}
        onAfterRowDrop={handleAfterRowDrop}
      />
    </div>
  )
})
