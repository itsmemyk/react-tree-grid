import { useState, type DragEvent } from 'react'
import styles from './grid.module.css'

export interface GroupPanelProps {
  groupOrder: string[]
  groupSorts: Record<string, 'asc' | 'desc'>
  getColumnLabel: (id: string) => string
  onRemove: (colId: string) => void
  onSortToggle: (colId: string) => void
  onReorder: (newOrder: string[]) => void
  onColumnDrop: (colId: string) => void
}

const GROUP_COL_PREFIX = 'rgs-group-col:'

function getColIdFromTypes(types: DOMStringList | readonly string[] | null | undefined): string | null {
  if (!types) return null
  const t = Array.from(types as Iterable<string>).find((s) => s.startsWith(GROUP_COL_PREFIX))
  return t ? t.slice(GROUP_COL_PREFIX.length) : null
}

export function GroupPanel({
  groupOrder,
  groupSorts,
  getColumnLabel,
  onRemove,
  onSortToggle,
  onReorder,
  onColumnDrop,
}: GroupPanelProps) {
  const [dragOverColId, setDragOverColId] = useState<string | null>(null)

  const handlePanelDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const colId = getColIdFromTypes(e.dataTransfer.types)
    if (colId && colId !== dragOverColId) setDragOverColId(colId)
  }

  const handlePanelDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColId(null)
    }
  }

  const handlePanelDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOverColId(null)
    const colId = e.dataTransfer.getData('text/plain')
    if (colId) onColumnDrop(colId)
  }

  const handleChipDragStart = (e: DragEvent<HTMLDivElement>, colId: string) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('rgs-group-chip', colId)
  }

  const handleChipDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const colId = getColIdFromTypes(e.dataTransfer.types)
    if (colId && colId !== dragOverColId) setDragOverColId(colId)
  }

  const handleChipDrop = (e: DragEvent<HTMLDivElement>, targetColId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const sourceColId = e.dataTransfer.getData('rgs-group-chip')
    if (sourceColId) {
      if (sourceColId === targetColId) return
      const next = [...groupOrder]
      const from = next.indexOf(sourceColId)
      const to = next.indexOf(targetColId)
      if (from < 0 || to < 0) return
      next.splice(from, 1)
      next.splice(to, 0, sourceColId)
      onReorder(next)
    } else {
      const colId = e.dataTransfer.getData('text/plain')
      if (colId) onColumnDrop(colId)
    }
  }

  const showGhost = dragOverColId !== null && !groupOrder.includes(dragOverColId)

  return (
    <div
      className={styles.groupPanel}
      onDragOver={handlePanelDragOver}
      onDragLeave={handlePanelDragLeave}
      onDrop={handlePanelDrop}
      data-testid="group-panel"
    >
      <span className={styles.groupPanelLabel}>Group by:</span>
      {groupOrder.length === 0 && !showGhost ? (
        <span className={styles.groupPanelEmpty}>Drag the column header here</span>
      ) : (
        <>
          {groupOrder.map((colId) => (
            <div
              key={colId}
              className={styles.groupChip}
              draggable
              onDragStart={(e) => handleChipDragStart(e, colId)}
              onDragOver={handleChipDragOver}
              onDrop={(e) => handleChipDrop(e, colId)}
              data-testid={`group-chip-${colId}`}
            >
              <button
                type="button"
                className={styles.groupChipSort}
                onClick={() => onSortToggle(colId)}
                aria-label={
                  groupSorts[colId] === 'desc' ? 'Sort descending' :
                  groupSorts[colId] === 'asc' ? 'Sort ascending' :
                  'Set sort direction'
                }
              >
                <span className={
                  groupSorts[colId] === 'desc' ? styles.sortDesc :
                  groupSorts[colId] === 'asc' ? styles.sortAsc :
                  styles.sortBidirectional
                } />
                <span>{getColumnLabel(colId)}</span>
              </button>
              <button
                type="button"
                className={styles.groupChipRemove}
                onClick={() => onRemove(colId)}
                aria-label={`Remove ${getColumnLabel(colId)} grouping`}
              >
                ×
              </button>
            </div>
          ))}
          {showGhost && (
            <div className={`${styles.groupChip} ${styles.groupChipGhost}`}>
              <span className={styles.sortBidirectional} />
              <span>{getColumnLabel(dragOverColId!)}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
