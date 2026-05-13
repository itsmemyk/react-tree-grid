import type { DragEvent } from 'react'
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

export function GroupPanel({
  groupOrder,
  groupSorts,
  getColumnLabel,
  onRemove,
  onSortToggle,
  onReorder,
  onColumnDrop,
}: GroupPanelProps) {
  const handlePanelDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handlePanelDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
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
  }

  const handleChipDrop = (e: DragEvent<HTMLDivElement>, targetColId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const sourceColId = e.dataTransfer.getData('rgs-group-chip')
    if (!sourceColId || sourceColId === targetColId) return
    const next = [...groupOrder]
    const from = next.indexOf(sourceColId)
    const to = next.indexOf(targetColId)
    if (from < 0 || to < 0) return
    next.splice(from, 1)
    next.splice(to, 0, sourceColId)
    onReorder(next)
  }

  return (
    <div
      className={styles.groupPanel}
      onDragOver={handlePanelDragOver}
      onDrop={handlePanelDrop}
      data-testid="group-panel"
    >
      <span className={styles.groupPanelLabel}>Group by:</span>
      {groupOrder.length === 0 ? (
        <span className={styles.groupPanelEmpty}>Drag the column header here</span>
      ) : (
        groupOrder.map((colId) => (
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
              aria-label={groupSorts[colId] === 'desc' ? 'Sort descending' : 'Sort ascending'}
            >
              {groupSorts[colId] === 'desc' ? '↓' : '↑'}
            </button>
            <span>{getColumnLabel(colId)}</span>
            <button
              type="button"
              className={styles.groupChipRemove}
              onClick={() => onRemove(colId)}
              aria-label={`Remove ${getColumnLabel(colId)} grouping`}
            >
              ⊗
            </button>
          </div>
        ))
      )}
    </div>
  )
}
