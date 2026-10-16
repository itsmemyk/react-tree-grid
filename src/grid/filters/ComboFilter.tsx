import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
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
  // Keyboard-highlighted option; 0 is "(All)", then the filtered options
  const [activeIndex, setActiveIndex] = useState(0)
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
    setActiveIndex(event.target.value ? 1 : 0)
  }

  const choose = (opt: string) => {
    onChange(opt === '' ? null : opt)
    setOpen(false)
    setSearch('')
    triggerRef.current?.focus()
  }

  const handleSelect = (event: MouseEvent<HTMLDivElement>) => {
    const opt = event.currentTarget.dataset.value
    if (opt === undefined) return
    choose(opt)
  }

  const options = useMemo(() => ['', ...filtered], [filtered])

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        setActiveIndex((index) => Math.min(index + 1, options.length - 1))
        break
      case 'ArrowUp':
        setActiveIndex((index) => Math.max(index - 1, 0))
        break
      case 'Enter':
        if (options[activeIndex] !== undefined) choose(options[activeIndex])
        break
      case 'Escape':
        setOpen(false)
        setSearch('')
        triggerRef.current?.focus()
        break
      default:
        return
    }
    event.preventDefault()
    event.stopPropagation()
  }

  // Open with the current value highlighted
  useEffect(() => {
    if (open) setActiveIndex(Math.max(0, options.indexOf(value != null ? String(value) : '')))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    dropdownRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex])

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
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
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
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            aria-label={`Filter ${column.id}`}
            autoFocus
          />
          <div className={styles.comboList} role="listbox">
            {options.map((opt, index) => (
              <div
                key={opt === '' ? '__all' : opt}
                role="option"
                aria-selected={opt === displayValue}
                className={[
                  styles.comboOption,
                  opt === displayValue ? styles.comboOptionSelected : '',
                  index === activeIndex ? styles.comboOptionActive : '',
                ].filter(Boolean).join(' ')}
                data-value={opt}
                data-index={index}
                onClick={handleSelect}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {opt === '' ? '(All)' : opt}
              </div>
            ))}
          </div>
        </div>,
        portalTarget,
      )}
    </div>
  )
}
