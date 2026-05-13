import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GroupPanel } from './GroupPanel'

function makeDataTransfer(payload: Record<string, string> = {}) {
  return {
    effectAllowed: 'move' as DataTransfer['effectAllowed'],
    dropEffect: 'move' as DataTransfer['dropEffect'],
    setData: vi.fn(),
    getData: vi.fn((key: string) => payload[key] ?? ''),
  } as unknown as DataTransfer
}

function dispatchDrag(
  node: HTMLElement,
  type: 'dragStart' | 'dragOver' | 'drop' | 'dragEnd',
  dt: DataTransfer,
) {
  const event = createEvent[type](node)
  Object.defineProperty(event, 'dataTransfer', { configurable: true, value: dt })
  fireEvent(node, event)
}

const base = {
  groupOrder: [] as string[],
  groupSorts: {} as Record<string, 'asc' | 'desc'>,
  getColumnLabel: (id: string) => id.charAt(0).toUpperCase() + id.slice(1),
  onRemove: vi.fn(),
  onSortToggle: vi.fn(),
  onReorder: vi.fn(),
  onColumnDrop: vi.fn(),
}

describe('GroupPanel', () => {
  it('renders placeholder text when no groups active', () => {
    render(<GroupPanel {...base} />)
    expect(screen.getByText('Drag the column header here')).toBeTruthy()
  })

  it('does not render placeholder when groups are active', () => {
    render(<GroupPanel {...base} groupOrder={['dept']} groupSorts={{ dept: 'asc' }} />)
    expect(screen.queryByText('Drag the column header here')).toBeNull()
  })

  it('renders a chip for each active group column', () => {
    render(
      <GroupPanel
        {...base}
        groupOrder={['dept', 'status']}
        groupSorts={{ dept: 'asc', status: 'desc' }}
      />,
    )
    expect(screen.getByTestId('group-chip-dept')).toBeTruthy()
    expect(screen.getByTestId('group-chip-status')).toBeTruthy()
  })

  it('shows asc aria-label when sort is asc', () => {
    render(<GroupPanel {...base} groupOrder={['dept']} groupSorts={{ dept: 'asc' }} />)
    expect(screen.getByLabelText('Sort ascending')).toBeTruthy()
  })

  it('shows desc aria-label when sort is desc', () => {
    render(<GroupPanel {...base} groupOrder={['dept']} groupSorts={{ dept: 'desc' }} />)
    expect(screen.getByLabelText('Sort descending')).toBeTruthy()
  })

  it('calls onSortToggle with column id when sort button clicked', () => {
    const onSortToggle = vi.fn()
    render(
      <GroupPanel
        {...base}
        groupOrder={['dept']}
        groupSorts={{ dept: 'asc' }}
        onSortToggle={onSortToggle}
      />,
    )
    fireEvent.click(screen.getByLabelText('Sort ascending'))
    expect(onSortToggle).toHaveBeenCalledWith('dept')
  })

  it('calls onRemove with column id when remove button clicked', () => {
    const onRemove = vi.fn()
    render(
      <GroupPanel
        {...base}
        groupOrder={['dept']}
        groupSorts={{ dept: 'asc' }}
        onRemove={onRemove}
      />,
    )
    fireEvent.click(screen.getByLabelText('Remove Dept grouping'))
    expect(onRemove).toHaveBeenCalledWith('dept')
  })

  it('calls onColumnDrop when a column id is dropped onto the panel', () => {
    const onColumnDrop = vi.fn()
    render(<GroupPanel {...base} onColumnDrop={onColumnDrop} />)
    const panel = screen.getByTestId('group-panel')
    const dt = makeDataTransfer({ 'text/plain': 'dept' })
    dispatchDrag(panel, 'dragOver', dt)
    dispatchDrag(panel, 'drop', dt)
    expect(onColumnDrop).toHaveBeenCalledWith('dept')
  })

  it('does not call onColumnDrop when dropped payload is empty', () => {
    const onColumnDrop = vi.fn()
    render(<GroupPanel {...base} onColumnDrop={onColumnDrop} />)
    const panel = screen.getByTestId('group-panel')
    const dt = makeDataTransfer({})
    dispatchDrag(panel, 'dragOver', dt)
    dispatchDrag(panel, 'drop', dt)
    expect(onColumnDrop).not.toHaveBeenCalled()
  })

  it('calls onReorder when a chip is dragged onto another chip', () => {
    const onReorder = vi.fn()
    render(
      <GroupPanel
        {...base}
        groupOrder={['dept', 'status']}
        groupSorts={{ dept: 'asc', status: 'asc' }}
        onReorder={onReorder}
      />,
    )
    const statusChip = screen.getByTestId('group-chip-status')
    const deptChip = screen.getByTestId('group-chip-dept')
    const dt = makeDataTransfer({ 'rgs-group-chip': 'status' })
    dispatchDrag(statusChip, 'dragStart', dt)
    dispatchDrag(deptChip, 'dragOver', dt)
    dispatchDrag(deptChip, 'drop', dt)
    expect(onReorder).toHaveBeenCalledWith(['status', 'dept'])
  })
})
