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
import { useDraggable } from '../core/dnd/useDraggable'
import { useDropTarget } from '../core/dnd/useDropTarget'
import { useTreeStore } from '../core/data'
import type { TreeDataItem } from '../core/data'
import type { DropPosition } from '../core/dnd/types'
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

function allExpandable(nodes: InternalTreeNode[], into = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (node.items?.length) {
      into.add(node.id)
      allExpandable(node.items, into)
    }
  }
  return into
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

  const isExpandedControlled = expanded !== undefined
  const isSelectedControlled = selected !== undefined
  const isCheckedControlled = checked !== undefined

  useEffect(() => {
    store.parse(internalData)
  }, [internalData, store])

  useEffect(() => {
    if (expanded !== undefined) setExpandedIds(new Set(expanded))
  }, [expanded])

  useEffect(() => {
    if (selected !== undefined) setSelectedIds(new Set(selected))
  }, [selected])

  useEffect(() => {
    if (checked !== undefined) setCheckedIds(new Set(checked))
  }, [checked])

  const visibleNodes = useMemo(() => tree.flatten(tree.getItems(rootId)), [rootId, tree, tree.items])

  const applyExpanded = useCallback((ids: Set<string>, toggledId?: string, expanding?: boolean) => {
    store.forEach((item: InternalTreeNode) => {
      store.update(item.id, { $opened: ids.has(item.id) } as Partial<InternalTreeNode>, true)
    })
    if (!isExpandedControlled) setExpandedIds(new Set(ids))
    if (toggledId !== undefined) {
      if (expanding) onExpand?.(toggledId)
      else onCollapse?.(toggledId)
    }
  }, [isExpandedControlled, onExpand, onCollapse, store])

  const toggleExpanded = useCallback((id: string) => {
    const next = new Set(expandedIds)
    const expanding = !next.has(id)
    if (expanding) next.add(id)
    else next.delete(id)
    applyExpanded(next, id, expanding)
  }, [applyExpanded, expandedIds])

  const applySelected = useCallback((id: string) => {
    if (!isSelectedControlled) setSelectedIds(new Set([id]))
    onSelect?.(id)
  }, [isSelectedControlled, onSelect])

  const applyChecked = useCallback((ids: string[]) => {
    if (!isCheckedControlled) setCheckedIds(new Set(ids))
    onCheck?.(ids)
  }, [isCheckedControlled, onCheck])

  const beginEdit = useCallback((id: string) => {
    const item = store.getItem(id)
    if (!editable || !item) return
    setEditingId(id)
    setDraftValue(String(item.value ?? ''))
  }, [editable, store])

  const commitEdit = useCallback(() => {
    if (!editingId) return
    store.update(editingId, { value: draftValue } as Partial<InternalTreeNode>)
    onEdit?.(editingId, draftValue)
    setEditingId(null)
  }, [draftValue, editingId, onEdit, store])

  const handleDrop = useCallback((dragId: string, targetId: string, position: DropPosition) => {
    if (dragId === targetId) return
    if (position === 'in') {
      store.move(dragId, -1, undefined, targetId)
    } else {
      const parentId = store.getParent(targetId) ?? rootId
      const targetIndex = store.getIndex(targetId)
      const nextIndex = position === 'top' ? targetIndex : targetIndex + 1
      store.move(dragId, nextIndex, undefined, parentId)
    }
    onDrop?.(dragId, targetId, position === 'top' ? 'before' : position === 'bottom' ? 'after' : 'inside')
    setDropIndicator(null)
  }, [onDrop, rootId, store])

  useImperativeHandle(ref, () => ({
    expand: (id: string) => {
      const next = new Set(expandedIds)
      next.add(id)
      applyExpanded(next, id, true)
    },
    collapse: (id: string) => {
      const next = new Set(expandedIds)
      next.delete(id)
      applyExpanded(next, id, false)
    },
    expandAll: () => applyExpanded(allExpandable(store.serialize() as InternalTreeNode[])),
    collapseAll: () => applyExpanded(new Set()),
    select: (ids: string[]) => { if (ids[0]) applySelected(ids[0]) },
    check: (ids: string[]) => applyChecked(ids),
  }), [applyChecked, applyExpanded, applySelected, expandedIds, store])

  const isDraggable = !!dragItem
  const expandedSet = isExpandedControlled ? new Set(expanded) : expandedIds
  const selectedSet = isSelectedControlled ? new Set(selected) : selectedIds
  const checkedSet = isCheckedControlled ? new Set(checked) : checkedIds

  return (
    <div className={[styles.tree, css].filter(Boolean).join(' ')} role="tree">
      {visibleNodes.map((item) => {
        const level = getLevel(store, item.id)
        const children = store.getItems(item.id)

        return (
          <TreeRow
            key={item.id}
            componentId={componentId}
            item={item}
            level={level}
            hasChildren={children.length > 0}
            expanded={expandedSet.has(item.id)}
            selected={selectedSet.has(item.id)}
            checked={checkedSet.has(item.id)}
            checkbox={checkbox}
            editable={editable}
            draggable={isDraggable}
            editing={editingId === item.id}
            draftValue={draftValue}
            dropIndicator={dropIndicator}
            onToggle={() => toggleExpanded(item.id)}
            onSelect={() => applySelected(item.id)}
            onCheck={() => {
              const next = new Set(checkedSet)
              if (next.has(item.id)) next.delete(item.id)
              else next.add(item.id)
              applyChecked(Array.from(next))
            }}
            onBeginEdit={() => beginEdit(item.id)}
            onDraftChange={setDraftValue}
            onCommitEdit={commitEdit}
            onCancelEdit={() => setEditingId(null)}
            onDropIndicatorChange={setDropIndicator}
            onDrop={handleDrop}
          />
        )
      })}
    </div>
  )
})

function getLevel(store: ReturnType<typeof useTreeStore<InternalTreeNode>>['store'], id: string): number {
  let level = 0
  let current = store.getParent(id)
  while (current && current !== store.getRoot()) {
    level += 1
    current = store.getParent(current)
  }
  return level
}

interface TreeRowProps {
  componentId: string
  item: InternalTreeNode
  level: number
  hasChildren: boolean
  expanded: boolean
  selected: boolean
  checked: boolean
  checkbox: boolean
  editable: boolean
  draggable: boolean
  editing: boolean
  draftValue: string
  dropIndicator: DropIndicator
  onToggle: () => void
  onSelect: () => void
  onCheck: () => void
  onBeginEdit: () => void
  onDraftChange: (value: string) => void
  onCommitEdit: () => void
  onCancelEdit: () => void
  onDropIndicatorChange: (value: DropIndicator) => void
  onDrop: (dragId: string, targetId: string, position: DropPosition) => void
}

function TreeRow(props: TreeRowProps) {
  const {
    componentId,
    item,
    level,
    hasChildren,
    expanded,
    selected,
    checked,
    checkbox,
    editable,
    draggable,
    editing,
    draftValue,
    dropIndicator,
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

  const rowRef = useRef<HTMLDivElement | null>(null)
  const { draggableProps } = useDraggable({
    id: item.id,
    componentId,
    type: 'group',
    disabled: !draggable || item.disabled,
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
    disabled: !draggable || item.disabled,
    getDropPosition: (event, element) => {
      const rect = element.getBoundingClientRect()
      const y = event.clientY - rect.top
      if (y < rect.height * 0.25) return 'top'
      if (y > rect.height * 0.75) return 'bottom'
      return 'in'
    },
    onDrop: (data) => {
      if (data.target && data.dropPosition) onDrop(data.start, data.target, data.dropPosition)
    },
  })

  useEffect(() => {
    const node = targetRef.current
    rowRef.current = node
  }, [targetRef])

  useEffect(() => {
    const node = rowRef.current
    if (!node || !draggable) return
    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return
      }
      const y = event.clientY - rect.top
      const position: DropPosition = y < rect.height * 0.25 ? 'top' : y > rect.height * 0.75 ? 'bottom' : 'in'
      onDropIndicatorChange({ target: item.id, position })
    }
    node.addEventListener('pointermove', handleMove)
    return () => node.removeEventListener('pointermove', handleMove)
  }, [draggable, item.id, onDropIndicatorChange])

  return (
    <div
      ref={targetRef}
      className={[
        styles.rowWrap,
        dropIndicator?.target === item.id ? styles[`drop${capitalize(dropIndicator.position)}`] : '',
      ].filter(Boolean).join(' ')}
      data-rgs-tree-id={item.id}
      role="treeitem"
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selected}
      style={{ paddingInlineStart: `${level * 18}px` }}
    >
      <div
        className={[
          styles.row,
          selected ? styles.rowSelected : '',
          item.disabled ? styles.rowDisabled : '',
        ].filter(Boolean).join(' ')}
        onClick={onSelect}
        onDoubleClick={editable ? onBeginEdit : undefined}
        {...(draggable ? draggableProps : {})}
      >
        <button
          type="button"
          className={styles.toggle}
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) onToggle()
          }}
          aria-label={expanded ? 'Collapse node' : 'Expand node'}
        >
          {hasChildren ? (expanded ? '▾' : '▸') : ''}
        </button>
        {checkbox ? (
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              e.stopPropagation()
              onCheck()
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : null}
        {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
        {editing ? (
          <input
            autoFocus
            className={styles.editInput}
            value={draftValue}
            onChange={(e) => onDraftChange(e.target.value)}
            onBlur={onCommitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onCommitEdit()
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
