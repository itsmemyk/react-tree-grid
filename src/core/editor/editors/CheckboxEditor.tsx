import { forwardRef, type InputHTMLAttributes } from 'react'

export interface CheckboxEditorProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const CheckboxEditor = forwardRef<HTMLInputElement, CheckboxEditorProps>(
  function CheckboxEditor({ checked, onCheckedChange, ...rest }, ref) {
    return (
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
    )
  },
)
