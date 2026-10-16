import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import type { DataStore } from '../../core/data'
import type { GridColumn, GridRow } from '../types'
import styles from './filters.module.css'

interface SelectFilterProps<T extends GridRow> {
  column: GridColumn<T>
  /** Source of the distinct values; optional when `options` is given */
  store?: DataStore<T>
  /** Fixed choices, used instead of scanning the store */
  options?: string[]
  value: unknown
  onChange: (value: string | null) => void
}

/**
 * SelectFilter — dropdown with unique column values.
 *
 * Scans the DataStore's full (unfiltered) data for unique values in the column
 * and renders a native <select>. Empty selection = "All" (clears filter).
 */
export function SelectFilter<T extends GridRow>({
  column,
  store,
  options: fixedOptions,
  value,
  onChange,
}: SelectFilterProps<T>) {
  const [filterVersion, setFilterVersion] = useState(0)

  useEffect(() => {
    if (!store) return
    const ctx = {}
    store.events.on('filter', () => setFilterVersion((v) => v + 1), ctx)
    return () => store.events.detach('filter', ctx)
  }, [store])

  const options = useMemo(() => {
    if (fixedOptions) return fixedOptions
    if (!store) return []
    const seen = new Set<string>()
    const source = store._initFilterOrder ?? store._order
    for (const item of source) {
      const v = item[column.id]
      if (v !== null && v !== undefined && v !== '') {
        seen.add(String(v))
      }
    }
    return Array.from(seen).sort()
  }, [filterVersion, store, column.id, fixedOptions])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const v = event.target.value
    onChange(v === '' ? null : v)
  }

  return (
    <select
      className={styles.selectFilter}
      value={value != null ? String(value) : ''}
      onChange={handleChange}
      data-rgs-filter="select"
      data-rgs-col-id={column.id}
    >
      <option value="">{''}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
