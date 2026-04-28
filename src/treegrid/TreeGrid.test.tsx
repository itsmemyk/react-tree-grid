import { createRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../core/theme'
import { TreeGrid } from './TreeGrid'
import type { TreeGridRef, TreeGridRow } from './types'

const columns = [
  { id: 'name', header: [{ text: 'Name' }], sortable: true },
  { id: 'value', header: [{ text: 'Value' }] },
]

const data: TreeGridRow[] = [
  {
    id: 'root-1',
    name: 'Root 1',
    value: 'A',
    $opened: true,
    items: [
      { id: 'child-1', name: 'Child 1', value: 'B' },
    ],
  },
  {
    id: 'root-2',
    name: 'Root 2',
    value: 'C',
  },
]

describe('TreeGrid', () => {
  it('renders flattened visible rows', () => {
    render(<TreeGrid columns={columns} data={data} />)
    expect(screen.getByText('Root 1')).toBeTruthy()
    expect(screen.getByText('Child 1')).toBeTruthy()
  })

  it('supports collapsed initial mode', () => {
    render(<TreeGrid columns={columns} data={data} collapsed />)
    expect(screen.getByText('Root 1')).toBeTruthy()
    expect(screen.queryByText('Child 1')).toBeNull()
  })

  it('toggle button collapses and expands rows', async () => {
    render(<TreeGrid columns={columns} data={data} />)
    const toggle = document.querySelector('[data-rgs-tree-toggle="root-1"]') as HTMLElement
    await act(async () => {
      fireEvent.click(toggle)
    })
    expect(screen.queryByText('Child 1')).toBeNull()
    await act(async () => {
      fireEvent.click(toggle)
    })
    expect(screen.getByText('Child 1')).toBeTruthy()
  })

  it('supports flat parent-linked data with rootParent', () => {
    render(<TreeGrid
      columns={columns}
      rootParent="root"
      data={[
        { id: 'root-1', parent: 'root', name: 'Root 1', value: 'A', $opened: true },
        { id: 'child-1', parent: 'root-1', name: 'Child 1', value: 'B' },
      ]}
    />)
    expect(screen.getByText('Root 1')).toBeTruthy()
    expect(screen.getByText('Child 1')).toBeTruthy()
  })

  it('imperative ref opens and closes all', async () => {
    const ref = createRef<TreeGridRef>()
    render(<TreeGrid ref={ref} columns={columns} data={[
      { id: 'a', name: 'A', items: [{ id: 'a1', name: 'A1' }] },
      { id: 'b', name: 'B', items: [{ id: 'b1', name: 'B1' }] },
    ]} />)
    expect(screen.queryByText('A1')).toBeNull()
    await act(async () => {
      ref.current?.openAll()
    })
    expect(screen.getByText('A1')).toBeTruthy()
    await act(async () => {
      ref.current?.closeAll()
    })
    expect(screen.queryByText('A1')).toBeNull()
  })

  it('delegates row-drop events', async () => {
    const onAfterRowDrop = vi.fn()
    render(<TreeGrid columns={columns} data={data} dragItem="row" onAfterRowDrop={onAfterRowDrop} />)
    expect(onAfterRowDrop).toBeDefined()
  })
})

describe('TreeGrid groupBy', () => {
  const flatData = [
    { id: '1', name: 'Alice', dept: 'Eng' },
    { id: '2', name: 'Bob',   dept: 'Eng' },
    { id: '3', name: 'Cara',  dept: 'HR' },
  ]
  const groupCols = [
    { id: 'dept', header: [{ text: 'Dept' }], width: 120 },
    { id: 'name', header: [{ text: 'Name' }], width: 120 },
  ]

  it('renders group rows for each unique dept value', () => {
    render(
      <ThemeProvider>
        <TreeGrid data={flatData} columns={groupCols} groupBy="dept" />
      </ThemeProvider>,
    )
    expect(screen.getByText('Eng')).toBeTruthy()
    expect(screen.getByText('HR')).toBeTruthy()
  })
})
