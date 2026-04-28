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
})
