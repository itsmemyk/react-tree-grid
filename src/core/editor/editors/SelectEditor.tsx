import { forwardRef, type SelectHTMLAttributes } from 'react'
import type { CellEditorOption } from '../useCellEditor'

export interface SelectEditorProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  value: string
  options: CellEditorOption[]
  onValueChange: (value: string) => void
}

export const SelectEditor = forwardRef<HTMLSelectElement, SelectEditorProps>(
  function SelectEditor({ value, options, onValueChange, ...rest }, ref) {
    return (
      <select
        {...rest}
        ref={ref}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  },
)
