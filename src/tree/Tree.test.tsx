import { createRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Tree } from './Tree'
import type { TreeNode, TreeRef } from './types'

const data: TreeNode[] = [
  {
    id: 'mail',
    value: 'Mail',
    $opened: true,
    items: [
      { id: 'inbox', value: 'Inbox' },
      { id: 'sent', value: 'Sent' },
    ],
  },
  { id: 'calendar', value: 'Calendar' },
]

describe('Tree', () => {
  it('renders visible nodes', () => {
    render(<Tree data={data} />)
    expect(screen.getByText('Mail')).toBeTruthy()
    expect(screen.getByText('Inbox')).toBeTruthy()
  })

  it('toggles expansion', async () => {
    const onCollapse = vi.fn()
    const onExpand = vi.fn()
    render(<Tree data={data} onExpand={onExpand} onCollapse={onCollapse} />)
    const toggle = document.querySelector('[data-rgs-tree-id="mail"] button') as HTMLElement
    await act(async () => {
      fireEvent.click(toggle)
    })
    expect(screen.queryByText('Inbox')).toBeNull()
    expect(onCollapse).toHaveBeenCalledWith('mail')
    await act(async () => {
      fireEvent.click(toggle)
    })
    expect(screen.getByText('Inbox')).toBeTruthy()
    expect(onExpand).toHaveBeenCalledWith('mail')
  })

  it('selects nodes', async () => {
    const onSelect = vi.fn()
    render(<Tree data={data} onSelect={onSelect} />)
    await act(async () => {
      fireEvent.click(screen.getByText('Inbox'))
    })
    expect(onSelect).toHaveBeenCalledWith('inbox')
  })

  it('checks nodes', async () => {
    const onCheck = vi.fn()
    render(<Tree data={data} checkbox onCheck={onCheck} />)
    await act(async () => {
      fireEvent.click(document.querySelector('[data-rgs-tree-id="inbox"] input[type="checkbox"]') as HTMLElement)
    })
    expect(onCheck).toHaveBeenCalledWith(['inbox'])
  })

  it('edits node labels', async () => {
    const onEdit = vi.fn()
    render(<Tree data={data} editable onEdit={onEdit} />)
    await act(async () => {
      fireEvent.doubleClick(document.querySelector('[data-rgs-tree-id="inbox"] .label') as HTMLElement)
    })
    const input = document.querySelector('[data-rgs-tree-id="inbox"] input') as HTMLInputElement
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Inbox 2' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    expect(onEdit).toHaveBeenCalledWith('inbox', 'Inbox 2')
    expect(screen.getByText('Inbox 2')).toBeTruthy()
  })

  it('imperative ref expands and collapses all', async () => {
    const ref = createRef<TreeRef>()
    render(<Tree ref={ref} data={[
      { id: 'a', value: 'A', items: [{ id: 'a1', value: 'A1' }] },
      { id: 'b', value: 'B', items: [{ id: 'b1', value: 'B1' }] },
    ]} />)
    expect(screen.queryByText('A1')).toBeNull()
    await act(async () => {
      ref.current?.expandAll()
    })
    expect(screen.getByText('A1')).toBeTruthy()
    await act(async () => {
      ref.current?.collapseAll()
    })
    expect(screen.queryByText('A1')).toBeNull()
  })

  it('navigates and toggles with the keyboard', async () => {
    const onSelect = vi.fn()
    render(<Tree data={data} onSelect={onSelect} />)
    const mail = document.querySelector('[data-rgs-tree-id="mail"]') as HTMLElement
    expect(mail.tabIndex).toBe(0)
    await act(async () => {
      mail.focus()
      fireEvent.keyDown(mail, { key: 'ArrowDown' })
    })
    expect(document.activeElement?.getAttribute('data-rgs-tree-id')).toBe('inbox')
    await act(async () => {
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Enter' })
    })
    expect(onSelect).toHaveBeenCalledWith('inbox')
    await act(async () => {
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowLeft' })
    })
    expect(document.activeElement?.getAttribute('data-rgs-tree-id')).toBe('mail')
    await act(async () => {
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowLeft' })
    })
    expect(screen.queryByText('Inbox')).toBeNull()
    await act(async () => {
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowRight' })
    })
    expect(screen.getByText('Inbox')).toBeTruthy()
  })

  it('cascades checks to children and marks partial parents', async () => {
    const onCheck = vi.fn()
    render(<Tree data={data} checkbox onCheck={onCheck} />)
    const box = (id: string) => document.querySelector(`[data-rgs-tree-id="${id}"] input[type="checkbox"]`) as HTMLInputElement
    await act(async () => {
      fireEvent.click(box('mail'))
    })
    expect(new Set(onCheck.mock.calls.at(-1)?.[0])).toEqual(new Set(['mail', 'inbox', 'sent']))
    expect(box('inbox').checked).toBe(true)
    await act(async () => {
      fireEvent.click(box('sent'))
    })
    expect(box('mail').checked).toBe(false)
    expect(box('mail').indeterminate).toBe(true)
    expect(document.querySelector('[data-rgs-tree-id="mail"]')?.getAttribute('aria-checked')).toBe('mixed')
  })

  it('ignores interaction with disabled nodes', async () => {
    const onSelect = vi.fn()
    render(<Tree data={[{ id: 'x', value: 'X', disabled: true }]} editable onSelect={onSelect} />)
    await act(async () => {
      fireEvent.click(screen.getByText('X'))
      fireEvent.doubleClick(screen.getByText('X'))
    })
    expect(onSelect).not.toHaveBeenCalled()
    expect(document.querySelector('[data-rgs-tree-id="x"] input')).toBeNull()
  })

  it('treats an empty edit as a cancel', async () => {
    const onEdit = vi.fn()
    render(<Tree data={data} editable onEdit={onEdit} />)
    await act(async () => {
      fireEvent.doubleClick(screen.getByText('Inbox'))
    })
    const input = document.querySelector('[data-rgs-tree-id="inbox"] input') as HTMLInputElement
    await act(async () => {
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    expect(onEdit).not.toHaveBeenCalled()
    expect(screen.getByText('Inbox')).toBeTruthy()
  })

  it('keeps expansion when the data prop changes', async () => {
    const { rerender } = render(<Tree data={data} />)
    expect(screen.getByText('Inbox')).toBeTruthy()
    rerender(<Tree data={data.map((node) => ({ ...node, $opened: false }))} />)
    expect(screen.getByText('Inbox')).toBeTruthy()
  })

  it('applies the style prop to the root', () => {
    render(<Tree data={data} style={{ width: 280 }} />)
    expect((document.querySelector('[role="tree"]') as HTMLElement).style.width).toBe('280px')
  })
})
