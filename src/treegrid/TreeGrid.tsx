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
    onDragRowOut,
    canRowDrop,
    onAfterRowDrag,
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
    const openedState = new Map<string, boolean>()
    for (const item of store._order) {
      if (item.$opened !== undefined) openedState.set(item.id, !!item.$opened)
    }
    const sortingStates = [...store._sortingStates]
    store.parse(normalizedData)
    for (const [id, opened] of openedState) {
      if (store.exists(id)) {
        store.update(id, { $opened: opened } as Partial<InternalTreeGridRow>, true)
      }
    }
    if (sortingStates.length > 0) {
      store.sort(sortingStates)
    }
  }, [normalizedData, store])

  // While a filter is active, open the collapsed parents it kept so matches
  // inside them show; close the ones it opened again once the filter clears
  useEffect(() => {
    const context = {}
    const autoOpened = new Set<string>()
    store.events.on('filter', () => {
      if (store._initChilds) {
        const walk = (id: string) => {
          for (const child of store._childs[id] ?? []) {
            if (!store._childs[child.id]?.length) continue
            if (!child.$opened) {
              store.update(child.id, { $opened: true } as Partial<InternalTreeGridRow>, true)
              autoOpened.add(child.id)
            }
            walk(child.id)
          }
        }
        walk(store.getRoot())
      } else {
        for (const id of autoOpened) {
          if (store.exists(id)) store.update(id, { $opened: false } as Partial<InternalTreeGridRow>, true)
        }
        autoOpened.clear()
      }
    }, context)
    return () => store.events.detach('filter', context)
  }, [store])

  const flatRows = useMemo(
    () => store.flatten(store.getItems(rootId)),
    [items, rootId, store],
  )

  const mappedColumns = useMemo(() => columns.map((column) => {
    if (column.id !== activeTreeColumnId) return column

    const originalTemplate = column.template
    const originalEditTemplate = column.editTemplate
    const editable = Boolean(column.editorType || column.editTemplate)
    const next: GridColumn<InternalTreeGridRow> = {
      ...column,
      // Keep the indent and arrow visible while the tree cell is being edited
      editTemplate: editable
        ? (value, row, col, api) => {
            const level = getLevel(store, row.id)
            const hasChildren = store.haveItems(row.id)
            const opened = !!store.getItem(row.id)?.$opened
            return (
              <div className={styles.treeCell} style={{ paddingInlineStart: `${level * 18}px` }}>
                <span className={styles.toggle} aria-hidden="true">
                  {hasChildren ? (opened ? '▾' : '▸') : ''}
                </span>
                <div className={styles.treeEditor}>
                  {originalEditTemplate ? originalEditTemplate(value, row, col, api) : (
                    <input
                      ref={api.ref as never}
                      className={gridStyles.cellEditor}
                      value={value === null || value === undefined ? '' : String(value)}
                      onChange={(e) => api.onChange(e.target.value)}
                    />
                  )}
                </div>
              </div>
            )
          }
        : undefined,
      template: (value, row, col) => {
        const level = getLevel(store, row.id)
        const hasChildren = store.haveItems(row.id)
        const opened = !!store.getItem(row.id)?.$opened
        return (
          <div className={styles.treeCell} style={{ paddingInlineStart: `${level * 18}px` }}>
            {hasChildren ? (
              <button
                type="button"
                className={styles.toggle}
                tabIndex={-1}
                data-rgs-tree-toggle={row.id}
                data-rgs-no-select=""
                aria-label={opened ? 'Collapse row' : 'Expand row'}
                aria-expanded={opened}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                {opened ? '▾' : '▸'}
              </button>
            ) : (
              <span className={styles.toggle} aria-hidden="true" />
            )}
            <span className={styles.cellValue}>
              {row.$group && row.$groupValue !== undefined
                ? `${String(row.$groupValue)} (${String(row.$groupCount ?? 0)})`
                : originalTemplate ? originalTemplate(value, row, col) : String(value ?? '')}
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

  const setOpened = (rowId: string, opened: boolean): boolean => {
    const item = store.getItem(rowId)
    if (!item || !store.haveItems(rowId) || !!item.$opened === opened) return false
    store.update(rowId, { $opened: opened } as Partial<InternalTreeGridRow>)
    return true
  }

  // Runs in the capture phase so tree keys win over the grid's cell navigation
  const handleKeyDownCapture: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    // Keys typed into editors and header filters belong to those fields
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return
    const ctrl = event.ctrlKey || event.metaKey

    if (ctrl && event.key === 'Enter') {
      const selectedRow = event.currentTarget.querySelector(`.${gridStyles.rowSelected}[data-rgs-id]`) as HTMLElement | null
      const rowId = selectedRow?.getAttribute('data-rgs-id')
      const item = rowId ? store.getItem(rowId) : null
      if (rowId && item && setOpened(rowId, !item.$opened)) event.preventDefault()
      return
    }

    // On the tree column, Right/Left open and close a row before moving between cells
    if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && !ctrl && !event.shiftKey) {
      const cell = event.currentTarget.querySelector(`.${gridStyles.cellSelected}[data-rgs-col-id]`) as HTMLElement | null
      let rowId: string | null | undefined
      if (cell) {
        if (cell.getAttribute('data-rgs-col-id') !== activeTreeColumnId) return
        rowId = cell.closest('[data-rgs-id]')?.getAttribute('data-rgs-id')
      } else {
        // Row selection marks no cell, so act on the selected row
        rowId = event.currentTarget.querySelector(`.${gridStyles.rowSelected}[data-rgs-id]`)?.getAttribute('data-rgs-id')
      }
      if (rowId && setOpened(rowId, event.key === 'ArrowRight')) {
        event.preventDefault()
        event.stopPropagation()
      }
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

  const clearExpandTimer = () => {
    if (expandTimerRef.current !== null) {
      window.clearTimeout(expandTimerRef.current)
      expandTimerRef.current = null
    }
  }

  // Leaving a row before the delay elapses cancels its auto-expand
  const handleDragRowOut: GridProps<InternalTreeGridRow>['onDragRowOut'] = (dragData, event) => {
    clearExpandTimer()
    onDragRowOut?.(dragData, event)
  }

  const handleAfterRowDrag: GridProps<InternalTreeGridRow>['onAfterRowDrag'] = (dragData, event) => {
    clearExpandTimer()
    onAfterRowDrag?.(dragData, event)
  }

  // A row can't be dropped onto itself or into its own subtree
  const handleCanRowDrop: GridProps<InternalTreeGridRow>['canRowDrop'] = (dragData, event) => {
    if (dragData.target) {
      let insideSubtree = false
      store.eachParent(dragData.target, (item) => {
        if (item.id === dragData.start) insideSubtree = true
      }, true)
      if (insideSubtree) return false
    }
    return canRowDrop?.(dragData, event)
  }

  const handleAfterRowDrop: GridProps<InternalTreeGridRow>['onAfterRowDrop'] = (dragData, event) => {
    if (dragData.target && dragData.position) {
      if (dropBehaviour === 'child') {
        store.move(dragData.start, -1, undefined, dragData.target)
      } else {
        // useRowDrag.applyDrop moved the row by flat index under the root, which
        // breaks the hierarchy; redo the move next to the target within its parent.
        const target = dragData.target
        const targetItem = store.getItem(target)
        if (dragData.position === 'bottom' && targetItem?.$opened && store.haveItems(target)) {
          // The drop line sits between an open parent and its first child
          store.move(dragData.start, 0, undefined, target)
        } else {
          const parentId = store.getParent(target) ?? rootId
          // Index among the siblings without the dragged row, which leaves its slot first
          const siblings = store.getItems(parentId).filter((item) => item.id !== dragData.start)
          const siblingIndex = siblings.findIndex((item) => item.id === target)
          const insertIndex = dragData.position === 'bottom' ? siblingIndex + 1 : siblingIndex
          store.move(dragData.start, insertIndex, undefined, parentId)
        }
      }
    }
    onAfterRowDrop?.(dragData, event)
  }

  // The drop line starts where the dropped row's tree level will be indented
  const getRowDropIndent: GridProps<InternalTreeGridRow>['getRowDropIndent'] = (rowId, position) => {
    if (!store.exists(rowId)) return 0
    const level = getLevel(store, rowId)
    const intoOpenParent = position === 'bottom' && !!store.getItem(rowId)?.$opened && store.haveItems(rowId)
    return (dropBehaviour === 'child' || intoOpenParent ? level + 1 : level) * 18
  }

  return (
    <div onKeyDownCapture={handleKeyDownCapture}>
      <Grid<InternalTreeGridRow>
        {...gridProps}
        rootParent={rootId}
        columns={mappedColumns}
        data={flatRows}
        store={store}
        onCellClick={handleCellClick}
        onDragRowIn={handleDragRowIn}
        onDragRowOut={handleDragRowOut}
        canRowDrop={handleCanRowDrop}
        getRowDropIndent={getRowDropIndent}
        onAfterRowDrag={handleAfterRowDrag}
        onAfterRowDrop={handleAfterRowDrop}
      />
    </div>
  )
})
