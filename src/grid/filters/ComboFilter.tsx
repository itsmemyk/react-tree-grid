import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react'
import type { DataStore } from '../../core/data'
import type { GridColumn, GridRow } from '../types'
import styles from './filters.module.css'

interface ComboFilterProps<T extends GridRow> {
  column: GridColumn<T>
  store: DataStore<T>
  value: unknown
  onChange: (value: string | null) => void
}

/**
 * ComboFilter — searchable dropdown (filterable select).
 *
 * Like SelectFilter but with a text search input inside the dropdown.
 * Full Combobox component (Phase 3h) can replace this later.
 */
export function ComboFilter<T extends GridRow>({
  column,
  store,
  value,
  onChange,
}: ComboFilterProps<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  const allOptions = useMemo(() => {
    const seen = new Set<string>()
    const source = store._initFilterOrder ?? store._order
    for (const item of source) {
      const v = item[column.id]
      if (v !== null && v !== undefined && v !== '') {
        seen.add(String(v))
      }
    }
    return Array.from(seen).sort()
  }, [store._initFilterOrder, store._order, column.id])

  const filtered = useMemo(() => {
    if (!search) return allOptions
    const lc = search.toLowerCase()
    return allOptions.filter((opt) => opt.toLowerCase().includes(lc))
  }, [allOptions, search])

  // Click outside to close
  useEffect(() => {
    if (!open) return
    const handler = (event: globalThis.MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev)
    setSearch('')
  }, [])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleSelect = (event: MouseEvent<HTMLDivElement>) => {
    const opt = event.currentTarget.dataset.value
    if (opt === undefined) return
    onChange(opt === '' ? null : opt)
    setOpen(false)
    setSearch('')
  }

  const displayValue = value != null ? String(value) : ''

  return (
    <div
      ref={rootRef}
      className={styles.comboFilter}
      data-rgs-filter="combo"
      data-rgs-col-id={column.id}
    >
      <button
        type="button"
        className={styles.comboTrigger}
        onClick={handleToggle}
      >
        <span className={styles.comboValue}>{displayValue}</span>
        <span className={styles.comboArrow}>&#9662;</span>
      </button>

      {open && (
        <div className={styles.comboDropdown}>
          <input
            type="text"
            className={styles.comboSearch}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
            autoFocus
          />
          <div className={styles.comboList}>
            <div
              className={[
                styles.comboOption,
                displayValue === '' ? styles.comboOptionSelected : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-value=""
              onClick={handleSelect}
            >
              {'(All)'}
            </div>
            {filtered.map((opt) => (
              <div
                key={opt}
                className={[
                  styles.comboOption,
                  opt === displayValue ? styles.comboOptionSelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-value={opt}
                onClick={handleSelect}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
