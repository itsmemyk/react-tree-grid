import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputEditorProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string
  onValueChange: (value: string) => void
}

export const InputEditor = forwardRef<HTMLInputElement, InputEditorProps>(
  function InputEditor({ value, onValueChange, ...rest }, ref) {
    return (
      <input
        {...rest}
        ref={ref}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
    )
  },
)
