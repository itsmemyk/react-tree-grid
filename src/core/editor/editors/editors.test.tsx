import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CheckboxEditor } from './CheckboxEditor'
import { InputEditor } from './InputEditor'
import { SelectEditor } from './SelectEditor'

describe('cell editors', () => {
  it('updates InputEditor values', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(<InputEditor value="one" onValueChange={onValueChange} aria-label="input editor" />)

    await user.type(screen.getByLabelText('input editor'), '2')

    expect(onValueChange).toHaveBeenLastCalledWith('one2')
  })

  it('updates SelectEditor values', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <SelectEditor
        aria-label="select editor"
        value="a"
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        onValueChange={onValueChange}
      />,
    )

    await user.selectOptions(screen.getByLabelText('select editor'), 'b')

    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('updates CheckboxEditor values', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(
      <CheckboxEditor
        aria-label="checkbox editor"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    )

    await user.click(screen.getByLabelText('checkbox editor'))

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})
