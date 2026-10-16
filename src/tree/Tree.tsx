import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { dragManager } from '../core/dnd/DragManager'
import { useDraggable } from '../core/dnd/useDraggable'
import { useDropTarget } from '../core/dnd/useDropTarget'
import { DragEvents } from '../core/events/types'
import { useTreeStore } from '../core/data'
import type { TreeDataItem } from '../core/data'
import type { DropPosition, TransferData } from '../core/dnd/types'
import type { TreeNode as TreeNodeShape, TreeProps, TreeRef } from './types'
import styles from './tree.module.css'

interface InternalTreeNode extends TreeDataItem {
  value: string
  icon?: React.ReactNode
  items?: InternalTreeNode[]
  disabled?: boolean
  $opened?: boolean
}

type DropIndicator = {
  target: string
  position: DropPosition
} | null

type CheckState = boolean | 'mixed'

interface VisibleNode {
  item: InternalTreeNode
  level: number
  hasChildren: boolean
  posInSet: number
  setSize: number
}

/** How long a collapsed node must be hovered during a drag before it opens. */
const AUTO_EXPAND_DELAY = 700

function asInternal(nodes: TreeNodeShape[]): InternalTreeNode[] {
  return nodes.map((node) => ({
    ...node,
    items: node.items ? asInternal(node.items) : undefined,
  }))
}

function collectExpanded(nodes: TreeNodeShape[], into = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (node.$opened) into.add(node.id)
    if (node.items?.length) collectExpanded(node.items, into)
  }
  return into
}

function dropPositionFor(clientY: number, element: HTMLElement): DropPosition {
  const rect = element.getBoundingClientRect()
  const y = clientY - rect.top
  if (y < rect.height * 0.25) return 'top'
  if (y > rect.height * 0.75) return 'bottom'
  return 'in'
}

export const Tree = forwardRef<TreeRef, TreeProps>(function Tree(props, ref) {
  const {
    data,
    checkbox = false,
    editable = false,
    dragItem,
    expanded,
    defaultExpanded,
    selected,
    checked,
    css,
    style,
    onSelect,
    onCheck,
    onExpand,
    onCollapse,
    onEdit,
    onDrop,
  } = props

  const componentId = useId()
  const internalData = useMemo(() => asInternal(data), [data])
  const tree = useTreeStore<InternalTreeNode>({ data: internalData })
  const { store } = tree
  const rootId = store.getRoot()

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpanded ?? Array.from(collectExpanded(data))),
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(selected ?? []))
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set(checked ?? []))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftValue, setDraftValue] = useState('')
  const [dropIndicator, setDropIndicator] = useState<DropIndicator>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const rowRefs = useRef(new Map<string, HTMLDivElement>())

  const isExpandedControlled = expanded !== undefined
  const isSelectedControlled = selected !== undefined
  const isCheckedControlled = checked !== undefined

  const isFirstData = useRef(true)
  useEffect(() => {
    if (isFirstData.current) {
      isFirstData.current = false
      return
    }
    store.parse(internalData)
  }, [internalData, store])

  useEffect(() => {
    if (selected !== undefined) setSelectedIds(new Set(selected))
  }, [selected])

  useEffect(() => {
    if (checked !== undefined) setCheckedIds(new Set(checked))
  }, [checked])

  const expandedSet = useMemo(
    () => (isExpandedControlled ? new Set(expanded) : expandedIds),
    [expanded, expandedIds, isExpandedControlled],
  )
  const selectedSet = useMemo(
    () => (isSelectedControlled ? new Set(selected) : selectedIds),
    [isSelectedControlled, selected, selectedIds],
  )
  const checkedSet = useMemo(
    () => (isCheckedControlled ? new Set(checked) : checkedIds),
    [checked, checkedIds, isCheckedControlled],
  )

  // Visibility comes from the expanded set, never from the store's $opened
  // flags, so reloading data or controlling `expanded` cannot desync them.
  const storeItems = tree.items
  const visibleNodes = useMemo(() => {
    const result: VisibleNode[] = []
    const walk = (parentId: string, level: number) => {
      const children = store.getItems(parentId)
      children.forEach((item, index) => {
        const hasChildren = store.haveItems(item.id)
        result.push({ item, level, hasChildren, posInSet: index + 1, setSize: children.length })
        if (hasChildren && expandedSet.has(item.id)) walk(item.id, level + 1)
      })
    }
    walk(rootId, 0)
    return result
    // storeItems changes whenever the store does, which invalidates the walk
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedSet, rootId, store, storeItems])

  // Tri-state: a parent is checked when every enabled child is, mixed when
  // only some descendants are.
  const checkStates = useMemo(() => {
    const states = new Map<string, CheckState>()
    if (!checkbox) return states
    const resolve = (id: string): CheckState => {
      const children = store.getItems(id).filter((child) => !child.disabled)
      if (!children.length) {
        const own = checkedSet.has(id)
        states.set(id, own)
        return own
      }
      const childStates = children.map((child) => resolve(child.id))
      let state: CheckState
      if (childStates.every((s) => s === true)) state = true
      else if (childStates.some((s) => s !== false)) state = 'mixed'
      else state = false
      states.set(id, state)
      return state
    }
    for (const item of store.getItems(rootId)) resolve(item.id)
    // Disabled nodes are excluded from the walk above, so give them their own state
    store.forEach((item: InternalTreeNode) => {
      if (!states.has(item.id)) states.set(item.id, checkedSet.has(item.id))
    })
    return states
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkbox, checkedSet, rootId, store, storeItems])

  const applyExpanded = useCallback((ids: Set<string>, toggledId?: string, expanding?: boolean) => {
    if (!isExpandedControlled) setExpandedIds(new Set(ids))
    if (toggledId !== undefined) {
      if (expanding) onExpand?.(toggledId)
      else onCollapse?.(toggledId)
    }
  }, [isExpandedControlled, onExpand, onCollapse])

  const setNodeExpanded = useCallback((id: string, open: boolean) => {
    if (expandedSet.has(id) === open || !store.haveItems(id)) return
    const next = new Set(expandedSet)
    if (open) next.add(id)
    else next.delete(id)
    applyExpanded(next, id, open)
  }, [applyExpanded, expandedSet, store])

  const toggleExpanded = useCallback((id: string) => {
    setNodeExpanded(id, !expandedSet.has(id))
  }, [expandedSet, setNodeExpanded])

  const applySelected = useCallback((id: string) => {
    if (store.getItem(id)?.disabled) return
    if (!isSelectedControlled) setSelectedIds(new Set([id]))
    onSelect?.(id)
  }, [isSelectedControlled, onSelect, store])

  const applyChecked = useCallback((ids: string[]) => {
    if (!isCheckedControlled) setCheckedIds(new Set(ids))
    onCheck?.(ids)
  }, [isCheckedControlled, onCheck])

  const toggleChecked = useCallback((id: string) => {
    const item = store.getItem(id)
    if (!item || item.disabled) return
    const checking = checkStates.get(id) !== true
    const next = new Set(checkedSet)
    const setOne = (nodeId: string) => {
      if (checking) next.add(nodeId)
      else next.delete(nodeId)
    }
    const cascade = (nodeId: string) => {
      setOne(nodeId)
      for (const child of store.getItems(nodeId)) {
        if (!child.disabled) cascade(child.id)
      }
    }
    cascade(id)
    // Keep ancestors consistent with their children
    let parentId = store.getParent(id)
    while (parentId && parentId !== rootId) {
      const children = store.getItems(parentId).filter((child) => !child.disabled)
      if (children.every((child) => next.has(child.id))) next.add(parentId)
      else next.delete(parentId)
      parentId = store.getParent(parentId)
    }
    applyChecked(Array.from(next))
  }, [applyChecked, checkStates, checkedSet, rootId, store])

  const focusRow = useCallback((id: string) => {
    setFocusedId(id)
    rowRefs.current.get(id)?.focus()
  }, [])

  const beginEdit = useCallback((id: string) => {
    const item = store.getItem(id)
    if (!editable || !item || item.disabled) return
    setEditingId(id)
    setDraftValue(String(item.value ?? ''))
  }, [editable, store])

  const commitEdit = useCallback(() => {
    if (!editingId) return
    const value = draftValue.trim()
    // An empty label is never a useful rename, so treat it as a cancel
    if (value && value !== store.getItem(editingId)?.value) {
      store.update(editingId, { value } as Partial<InternalTreeNode>)
      onEdit?.(editingId, value)
    }
    setEditingId(null)
  }, [draftValue, editingId, onEdit, store])

  const canDropOn = useCallback((transfer: TransferData | null, targetId: string) => {
    if (!transfer || transfer.componentId !== componentId) return false
    // canCopy refuses the dragged node itself and anything inside its subtree
    return store.exists(transfer.start) && store.canCopy(transfer.start, targetId)
  }, [componentId, store])

  const handleDrop = useCallback((dragId: string, targetId: string, position: DropPosition) => {
    if (!canDropOn(dragManager.transfer ?? ({ start: dragId, componentId } as TransferData), targetId)) return
    let moved: string | string[] | null
    if (position === 'in') {
      moved = store.move(dragId, -1, undefined, targetId)
      setNodeExpanded(targetId, true)
    } else {
      const parentId = store.getParent(targetId) ?? rootId
      let index = store.getIndex(targetId) + (position === 'bottom' ? 1 : 0)
      // The dragged node leaves its old slot first, shifting later siblings up
      if (store.getParent(dragId) === parentId && store.getIndex(dragId) < index) index -= 1
      moved = store.move(dragId, index, undefined, parentId)
    }
    setDropIndicator(null)
    if (moved === null) return
    onDrop?.(dragId, targetId, position === 'top' ? 'before' : position === 'bottom' ? 'after' : 'inside')
  }, [canDropOn, componentId, onDrop, rootId, setNodeExpanded, store])

  // Any finished or cancelled drag clears the indicator
  useEffect(() => {
    const context = {}
    dragManager.events.on(DragEvents.afterDrag, () => setDropIndicator(null), context)
    return () => dragManager.events.detach(DragEvents.afterDrag, context)
  }, [])

  // Hovering the middle of a collapsed node during a drag opens it
  const autoExpandTarget = dropIndicator?.position === 'in' ? dropIndicator.target : null
  useEffect(() => {
    if (!autoExpandTarget || expandedSet.has(autoExpandTarget) || !store.haveItems(autoExpandTarget)) return
    const timer = window.setTimeout(() => setNodeExpanded(autoExpandTarget, true), AUTO_EXPAND_DELAY)
    return () => window.clearTimeout(timer)
  }, [autoExpandTarget, expandedSet, setNodeExpanded, store])

  const expandAncestors = useCallback((ids: string[]) => {
    const next = new Set(expandedSet)
    let changed = false
    for (const id of ids) {
      let parentId = store.exists(id) ? store.getParent(id) : null
      while (parentId && parentId !== rootId) {
        if (!next.has(parentId)) {
          next.add(parentId)
          changed = true
        }
        parentId = store.getParent(parentId)
      }
    }
    if (changed) applyExpanded(next)
  }, [applyExpanded, expandedSet, rootId, store])

  useImperativeHandle(ref, () => ({
    expand: (id: string) => setNodeExpanded(id, true),
    collapse: (id: string) => setNodeExpanded(id, false),
    expandAll: () => {
      const all = new Set<string>()
      store.forEach((item: InternalTreeNode) => {
        if (store.haveItems(item.id)) all.add(item.id)
      })
      applyExpanded(all)
    },
    collapseAll: () => applyExpanded(new Set()),
    select: (ids: string[]) => {
      if (!ids[0]) return
      expandAncestors([ids[0]])
      applySelected(ids[0])
      setFocusedId(ids[0])
    },
    check: (ids: string[]) => applyChecked(ids),
  }), [applyChecked, applyExpanded, applySelected, expandAncestors, setNodeExpanded, store])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (editingId !== null || !visibleNodes.length) return
    const index = Math.max(0, visibleNodes.findIndex((node) => node.item.id === focusedId))
    const current = visibleNodes[index]
    const id = current.item.id
    const open = expandedSet.has(id)
    let handled = true

    switch (event.key) {
      case 'ArrowDown':
        focusRow(visibleNodes[Math.min(index + 1, visibleNodes.length - 1)].item.id)
        break
      case 'ArrowUp':
        focusRow(visibleNodes[Math.max(index - 1, 0)].item.id)
        break
      case 'Home':
        focusRow(visibleNodes[0].item.id)
        break
      case 'End':
        focusRow(visibleNodes[visibleNodes.length - 1].item.id)
        break
      case 'ArrowRight':
        if (current.hasChildren && !open) setNodeExpanded(id, true)
        else if (current.hasChildren) focusRow(visibleNodes[index + 1].item.id)
        break
      case 'ArrowLeft': {
        if (current.hasChildren && open) {
          setNodeExpanded(id, false)
        } else {
          const parentId = store.getParent(id)
          if (parentId && parentId !== rootId) focusRow(parentId)
        }
        break
      }
      case 'Enter':
        applySelected(id)
        break
      case ' ':
        if (checkbox) toggleChecked(id)
        else applySelected(id)
        break
      case 'F2':
        beginEdit(id)
        break
      default:
        handled = false
    }

    if (handled) event.preventDefault()
  }

  // Exactly one row is tabbable: the focused one, or the first as a fallback
  const tabbableId = visibleNodes.some((node) => node.item.id === focusedId)
    ? focusedId
    : visibleNodes[0]?.item.id ?? null

  const isDraggable = !!dragItem
  const isDropTarget = dragItem === 'both'

  return (
    <div
      className={[styles.tree, css].filter(Boolean).join(' ')}
      style={style}
      role="tree"
      onKeyDown={handleKeyDown}
    >
      {visibleNodes.map(({ item, level, hasChildren, posInSet, setSize }) => (
        <TreeRow
          key={item.id}
          componentId={componentId}
          item={item}
          level={level}
          posInSet={posInSet}
          setSize={setSize}
          hasChildren={hasChildren}
          expanded={expandedSet.has(item.id)}
          selected={selectedSet.has(item.id)}
          checkState={checkbox ? checkStates.get(item.id) ?? false : undefined}
          tabbable={tabbableId === item.id}
          editable={editable}
          draggable={isDraggable}
          dropTarget={isDropTarget}
          editing={editingId === item.id}
          draftValue={draftValue}
          dropIndicator={dropIndicator}
          canDropOn={canDropOn}
          rowRef={(element) => {
            if (element) rowRefs.current.set(item.id, element)
            else rowRefs.current.delete(item.id)
          }}
          onFocus={() => setFocusedId(item.id)}
          onToggle={() => toggleExpanded(item.id)}
          onSelect={() => applySelected(item.id)}
          onCheck={() => toggleChecked(item.id)}
          onBeginEdit={() => beginEdit(item.id)}
          onDraftChange={setDraftValue}
          onCommitEdit={(refocus) => {
            commitEdit()
            if (refocus) focusRow(item.id)
          }}
          onCancelEdit={() => {
            setEditingId(null)
            focusRow(item.id)
          }}
          onDropIndicatorChange={setDropIndicator}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
})

interface TreeRowProps {
  componentId: string
  item: InternalTreeNode
  level: number
  posInSet: number
  setSize: number
  hasChildren: boolean
  expanded: boolean
  selected: boolean
  /** undefined when the tree has no checkboxes */
  checkState: CheckState | undefined
  tabbable: boolean
  editable: boolean
  draggable: boolean
  dropTarget: boolean
  editing: boolean
  draftValue: string
  dropIndicator: DropIndicator
  canDropOn: (transfer: TransferData | null, targetId: string) => boolean
  rowRef: (element: HTMLDivElement | null) => void
  onFocus: () => void
  onToggle: () => void
  onSelect: () => void
  onCheck: () => void
  onBeginEdit: () => void
  onDraftChange: (value: string) => void
  onCommitEdit: (refocus: boolean) => void
  onCancelEdit: () => void
  onDropIndicatorChange: (value: DropIndicator | ((prev: DropIndicator) => DropIndicator)) => void
  onDrop: (dragId: string, targetId: string, position: DropPosition) => void
}

function TreeRow(props: TreeRowProps) {
  const {
    componentId,
    item,
    level,
    posInSet,
    setSize,
    hasChildren,
    expanded,
    selected,
    checkState,
    tabbable,
    editable,
    draggable,
    dropTarget,
    editing,
    draftValue,
    dropIndicator,
    canDropOn,
    rowRef,
    onFocus,
    onToggle,
    onSelect,
    onCheck,
    onBeginEdit,
    onDraftChange,
    onCommitEdit,
    onCancelEdit,
    onDropIndicatorChange,
    onDrop,
  } = props

  const disabled = !!item.disabled
  const checkboxRef = useRef<HTMLInputElement | null>(null)
  const { draggableProps } = useDraggable({
    id: item.id,
    componentId,
    type: 'group',
    disabled: !draggable || disabled || editing,
    ghost: () => {
      const ghost = document.createElement('div')
      ghost.className = styles.dragGhost
      ghost.textContent = item.value
      return ghost
    },
  })
  const { targetRef } = useDropTarget<HTMLDivElement>({
    id: item.id,
    componentId,
    accepts: ['group'],
    disabled: !dropTarget || disabled,
    getDropPosition: (event, element) => dropPositionFor(event.clientY, element),
    canDrop: (transfer) => canDropOn(transfer, item.id),
    onDrop: (data) => {
      if (data.target && data.dropPosition) onDrop(data.start, data.target, data.dropPosition)
    },
  })

  useEffect(() => {
    if (checkboxRef.current) checkboxRef.current.indeterminate = checkState === 'mixed'
  }, [checkState])

  const clearOwnIndicator = () => {
    onDropIndicatorChange((prev) => (prev?.target === item.id ? null : prev))
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dropTarget || disabled || !targetRef.current) return
    if (!canDropOn(dragManager.transfer, item.id)) {
      clearOwnIndicator()
      return
    }
    const position = dropPositionFor(event.clientY, targetRef.current)
    onDropIndicatorChange((prev) =>
      prev?.target === item.id && prev.position === position ? prev : { target: item.id, position },
    )
  }

  const stopDoubleClick = (event: React.MouseEvent) => event.stopPropagation()

  return (
    <div
      ref={(element) => {
        targetRef.current = element
        rowRef(element)
      }}
      className={[
        styles.rowWrap,
        dropIndicator?.target === item.id ? styles[`drop${capitalize(dropIndicator.position)}`] : '',
      ].filter(Boolean).join(' ')}
      data-rgs-tree-id={item.id}
      role="treeitem"
      tabIndex={tabbable ? 0 : -1}
      aria-level={level + 1}
      aria-posinset={posInSet}
      aria-setsize={setSize}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selected}
      aria-checked={checkState === undefined ? undefined : checkState}
      aria-disabled={disabled || undefined}
      style={{ paddingInlineStart: `${level * 18}px` }}
      onFocus={(event) => {
        if (event.target === event.currentTarget) onFocus()
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearOwnIndicator}
    >
      <div
        className={[
          styles.row,
          selected ? styles.rowSelected : '',
          disabled ? styles.rowDisabled : '',
        ].filter(Boolean).join(' ')}
        onClick={onSelect}
        onDoubleClick={() => {
          if (editable) onBeginEdit()
          else if (hasChildren) onToggle()
        }}
        onPointerDown={(event) => {
          if (!draggable || editing) return
          // The toggle and checkbox keep their own click behaviour
          if ((event.target as Element).closest('button, input')) return
          draggableProps.onPointerDown(event)
        }}
      >
        <button
          type="button"
          className={styles.toggle}
          tabIndex={-1}
          aria-hidden={hasChildren ? undefined : true}
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) onToggle()
          }}
          onDoubleClick={stopDoubleClick}
          aria-label={hasChildren ? (expanded ? 'Collapse node' : 'Expand node') : undefined}
        >
          {hasChildren ? (expanded ? '▾' : '▸') : ''}
        </button>
        {checkState !== undefined ? (
          <input
            ref={checkboxRef}
            type="checkbox"
            tabIndex={-1}
            checked={checkState === true}
            disabled={disabled}
            aria-label={item.value}
            onChange={(e) => {
              e.stopPropagation()
              onCheck()
            }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={stopDoubleClick}
          />
        ) : null}
        {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
        {editing ? (
          <input
            autoFocus
            className={styles.editInput}
            value={draftValue}
            aria-label="Edit node label"
            onChange={(e) => onDraftChange(e.target.value)}
            onBlur={() => onCommitEdit(false)}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={stopDoubleClick}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') onCommitEdit(true)
              if (e.key === 'Escape') onCancelEdit()
            }}
          />
        ) : (
          <span className={styles.label}>{item.value}</span>
        )}
      </div>
    </div>
  )
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
