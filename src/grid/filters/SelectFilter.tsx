import { useMemo, type ChangeEvent } from 'react'
import type { DataStore } from '../../core/data'
import type { GridColumn, GridRow } from '../types'
import styles from './filters.module.css'

interface SelectFilterProps<T extends GridRow> {
  column: GridColumn<T>
  store: DataStore<T>
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
  value,
  onChange,
}: SelectFilterProps<T>) {
  const options = useMemo(() => {
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
