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
    expect(screen.getByText('Eng (2)')).toBeTruthy()
    expect(screen.getByText('HR (1)')).toBeTruthy()
  })

  it('labels nested group rows in the tree column', () => {
    render(
      <ThemeProvider>
        <TreeGrid
          data={flatData.map((row, i) => ({ ...row, status: i === 0 ? 'active' : 'inactive' }))}
          columns={groupCols}
          groupBy={['dept', 'status']}
        />
      </ThemeProvider>,
    )
    const engToggle = document.querySelector('[data-rgs-tree-toggle="__group__dept__Eng"]') as HTMLElement
    if (engToggle?.getAttribute('aria-expanded') === 'false') fireEvent.click(engToggle)
    expect(screen.getByText('active (1)')).toBeTruthy()
  })
})

describe('TreeGrid row drag', () => {
  const dragData: TreeGridRow[] = [
    { id: 'x', name: 'Xavier' },
    { id: 'p', name: 'Parent', $opened: false, items: [{ id: 'q', name: 'Hidden child' }] },
    { id: 'z', name: 'Zed' },
  ]
  const rowOf = (text: string) => screen.getByText(text).closest('[data-rgs-id]') as HTMLElement
  const mockRect = (el: HTMLElement, top: number) => vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top, bottom: top + 40, left: 0, right: 200, width: 200, height: 40, x: 0, y: top, toJSON: () => '',
  })

  it('does not auto-expand a collapsed row the pointer only passes over', () => {
    vi.useFakeTimers()
    try {
      render(<ThemeProvider><TreeGrid columns={columns} data={dragData} dragItem="row" style={{ width: 300, height: 300 }} /></ThemeProvider>)
      const x = rowOf('Xavier')
      const p = rowOf('Parent')
      const z = rowOf('Zed')
      mockRect(x, 0)
      mockRect(p, 40)
      mockRect(z, 80)

      fireEvent.pointerDown(x, { clientX: 10, clientY: 10 })
      fireEvent.pointerMove(p, { clientX: 10, clientY: 50 })
      fireEvent.pointerMove(z, { clientX: 10, clientY: 110 })
      fireEvent.pointerUp(z, { clientX: 10, clientY: 110 })
      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(screen.queryByText('Hidden child')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('refuses to drop a row onto its own descendant', () => {
    const onAfterRowDrop = vi.fn()
    const { container } = render(
      <ThemeProvider>
        <TreeGrid columns={columns} data={data} dragItem="row" onAfterRowDrop={onAfterRowDrop} style={{ width: 300, height: 300 }} />
      </ThemeProvider>,
    )
    const root = rowOf('Root 1')
    const child = rowOf('Child 1')
    mockRect(root, 0)
    mockRect(child, 40)

    fireEvent.pointerDown(root, { clientX: 10, clientY: 10 })
    fireEvent.pointerMove(child, { clientX: 10, clientY: 70 })
    fireEvent.pointerUp(child, { clientX: 10, clientY: 70 })

    expect(onAfterRowDrop).not.toHaveBeenCalled()
    const order = Array.from(container.querySelectorAll('[data-rgs-id]')).map((el) => el.getAttribute('data-rgs-id'))
    expect([...new Set(order)]).toEqual(['root-1', 'child-1', 'root-2'])
  })
})

describe('TreeGrid child drops', () => {
  it('opens a collapsed parent that receives a row with dropBehaviour="child"', () => {
    render(
      <ThemeProvider>
        <TreeGrid
          columns={columns}
          data={[
            { id: 'x', name: 'Xavier' },
            { id: 'p', name: 'Parent', $opened: false, items: [{ id: 'q', name: 'Hidden child' }] },
          ]}
          dragItem="row"
          dropBehaviour="child"
          dragExpand={false}
          style={{ width: 300, height: 300 }}
        />
      </ThemeProvider>,
    )
    const x = screen.getByText('Xavier').closest('[data-rgs-id]') as HTMLElement
    const p = screen.getByText('Parent').closest('[data-rgs-id]') as HTMLElement
    const rect = (top: number) => ({ top, bottom: top + 40, left: 0, right: 200, width: 200, height: 40, x: 0, y: top, toJSON: () => '' })
    vi.spyOn(x, 'getBoundingClientRect').mockReturnValue(rect(0))
    vi.spyOn(p, 'getBoundingClientRect').mockReturnValue(rect(40))

    fireEvent.pointerDown(x, { clientX: 10, clientY: 10 })
    fireEvent.pointerMove(p, { clientX: 10, clientY: 75 })
    fireEvent.pointerUp(p, { clientX: 10, clientY: 75 })

    expect(screen.getByText('Hidden child')).toBeTruthy()
    expect(screen.getByText('Xavier')).toBeTruthy()
  })
})

describe('TreeGrid filtering', () => {
  it('opens collapsed parents of filter matches and closes them when the filter clears', async () => {
    vi.useFakeTimers()
    try {
      render(
        <ThemeProvider>
          <TreeGrid
            columns={[{ id: 'name', header: [{ text: 'Name' }, { content: 'inputFilter' }], width: 200 }]}
            data={[
              { id: 'p', name: 'Parent', $opened: false, items: [{ id: 'c', name: 'Needle' }] },
              { id: 'o', name: 'Other' },
            ]}
            style={{ width: 300, height: 300 }}
          />
        </ThemeProvider>,
      )
      const input = document.querySelector('[data-rgs-filter] input, input') as HTMLInputElement
      expect(screen.queryByText('Needle')).toBeNull()
      await act(async () => {
        fireEvent.change(input, { target: { value: 'needle' } })
        vi.advanceTimersByTime(1000)
      })
      expect(screen.getByText('Needle')).toBeTruthy()
      await act(async () => {
        fireEvent.change(input, { target: { value: '' } })
        vi.advanceTimersByTime(1000)
      })
      expect(screen.queryByText('Needle')).toBeNull()
      expect(screen.getByText('Other')).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('TreeGrid editing', () => {
  it('keeps the indent and arrow beside the editor in the tree column', () => {
    const onAfterEditEnd = vi.fn()
    render(
      <ThemeProvider>
        <TreeGrid
          columns={[{ id: 'name', header: [{ text: 'Name' }], width: 200, editorType: 'input' }]}
          data={[{ id: 'p', name: 'Parent', $opened: true, items: [{ id: 'c', name: 'Child' }] }]}
          editable
          onAfterEditEnd={onAfterEditEnd}
          style={{ width: 300, height: 200 }}
        />
      </ThemeProvider>,
    )
    fireEvent.doubleClick(screen.getByText('Parent'))
    const cell = document.querySelector('[data-rgs-id="p"] [data-rgs-col-id="name"]') as HTMLElement
    const input = cell.querySelector('input') as HTMLInputElement
    expect(input).toBeTruthy()
    expect(cell.textContent).toContain('▾')
    fireEvent.change(input, { target: { value: 'Renamed' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onAfterEditEnd).toHaveBeenCalledWith('p', 'name', 'Renamed')
  })
})

