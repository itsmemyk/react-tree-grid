import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { GridColumn, GridRow } from '../types'
import styles from './filters.module.css'

interface InputFilterProps<T extends GridRow> {
  column: GridColumn<T>
  value: unknown
  onChange: (value: string) => void
}

const DEBOUNCE_MS = 300

/**
 * InputFilter — text input with debounced filter.
 *
 * Renders <input type="text"> in header cell. Applies filter after 300ms
 * of inactivity. Empty string clears the column filter.
 */
export function InputFilter<T extends GridRow>({
  column,
  value,
  onChange,
}: InputFilterProps<T>) {
  const [local, setLocal] = useState(value != null ? String(value) : '')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flush = useCallback(
    (v: string) => {
      onChange(v)
    },
    [onChange],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const v = event.target.value
    setLocal(v)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => flush(v), DEBOUNCE_MS)
  }

  return (
    <input
      type="text"
      className={styles.inputFilter}
      value={local}
      onChange={handleChange}
      placeholder=""
      data-rgs-filter="input"
      data-rgs-col-id={column.id}
    />
  )
}
