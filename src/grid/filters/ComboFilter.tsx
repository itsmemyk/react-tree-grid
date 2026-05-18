import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type { DataStore } from '../../core/data'
import type { GridColumn, GridRow } from '../types'
import styles from './filters.module.css'

interface ComboFilterProps<T extends GridRow> {
  column: GridColumn<T>
  store: DataStore<T>
  value: unknown
  onChange: (value: string | null) => void
}

export function ComboFilter<T extends GridRow>({
  column,
  store,
  value,
  onChange,
}: ComboFilterProps<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})
  const [filterVersion, setFilterVersion] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = {}
    store.events.on('filter', () => setFilterVersion((v) => v + 1), ctx)
    return () => store.events.detach('filter', ctx)
  }, [store])

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
  }, [filterVersion, store, column.id])

  const filtered = useMemo(() => {
    if (!search) return allOptions
    const lc = search.toLowerCase()
    return allOptions.filter((opt) => opt.toLowerCase().includes(lc))
  }, [allOptions, search])

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    })
    const themed = triggerRef.current.closest('[data-react-tree-grid-theme]') as HTMLElement | null
    setPortalTarget(themed ?? document.body)
  }, [])

  useEffect(() => {
    if (!open) return
    updatePosition()
    const handler = (event: globalThis.MouseEvent) => {
      if (
        triggerRef.current?.contains(event.target as Node) ||
        dropdownRef.current?.contains(event.target as Node)
      ) return
      setOpen(false)
      setSearch('')
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, updatePosition])

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
      className={styles.comboFilter}
      data-rgs-filter="combo"
      data-rgs-col-id={column.id}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.comboTrigger}
        onClick={handleToggle}
      >
        <span className={styles.comboValue}>{displayValue}</span>
        <span className={styles.comboArrow}>&#9662;</span>
      </button>

      {open && portalTarget && createPortal(
        <div
          ref={dropdownRef}
          className={styles.comboDropdown}
          style={dropdownStyle}
        >
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
              ].filter(Boolean).join(' ')}
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
                ].filter(Boolean).join(' ')}
                data-value={opt}
                onClick={handleSelect}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>,
        portalTarget,
      )}
    </div>
  )
}
