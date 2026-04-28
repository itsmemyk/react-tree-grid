import { useMemo, useRef, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '../src/core/theme'
import { TreeGrid } from '../src/treegrid'
import type { TreeGridRef, TreeGridRow } from '../src/treegrid'

const GRID_HEIGHT = 360

const meta: Meta<typeof TreeGrid> = {
  title: 'Components/TreeGrid',
  component: TreeGrid,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', height: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const baseColumns = [
  { id: 'name', header: [{ text: 'Name' }], width: 280, sortable: true, resizable: true },
  { id: 'owner', header: [{ text: 'Owner' }], width: 160, sortable: true, resizable: true },
  { id: 'status', header: [{ text: 'Status' }], width: 140, sortable: true, resizable: true },
  { id: 'hours', header: [{ text: 'Hours' }], width: 110, align: 'right' as const, sortable: true, resizable: true },
] satisfies NonNullable<Story['args']>['columns']

const editableColumns = [
  { id: 'name', header: [{ text: 'Name' }], width: 280, sortable: true, resizable: true, editorType: 'input' as const },
  { id: 'owner', header: [{ text: 'Owner' }], width: 160, sortable: true, resizable: true, editorType: 'input' as const },
  { id: 'status', header: [{ text: 'Status' }], width: 140, sortable: true, resizable: true, editorType: 'input' as const },
  { id: 'hours', header: [{ text: 'Hours' }], width: 110, align: 'right' as const, sortable: true, resizable: true, editorType: 'input' as const },
] satisfies NonNullable<Story['args']>['columns']

const filterColumns = [
  { id: 'name', header: [{ text: 'Name' }, { content: 'inputFilter' }], width: 280, sortable: true, resizable: true },
  { id: 'owner', header: [{ text: 'Owner' }, { content: 'selectFilter' }], width: 160, sortable: true, resizable: true },
  { id: 'status', header: [{ text: 'Status' }, { content: 'selectFilter' }], width: 140, sortable: true, resizable: true },
  { id: 'hours', header: [{ text: 'Hours' }], width: 110, align: 'right' as const, sortable: true, resizable: true },
] satisfies NonNullable<Story['args']>['columns']

const baseData: TreeGridRow[] = [
  {
    id: 'program-alpha',
    name: 'Program Alpha',
    owner: 'Nina',
    status: 'Active',
    hours: 240,
    $opened: true,
    items: [
      {
        id: 'alpha-discovery',
        name: 'Discovery',
        owner: 'Kai',
        status: 'Done',
        hours: 48,
        $opened: true,
        items: [
          { id: 'alpha-research', name: 'Research', owner: 'Kai', status: 'Done', hours: 20 },
          { id: 'alpha-interviews', name: 'Interviews', owner: 'Mira', status: 'Done', hours: 28 },
        ],
      },
      { id: 'alpha-build', name: 'Build', owner: 'Mira', status: 'Active', hours: 132 },
      { id: 'alpha-qa', name: 'QA', owner: 'Rae', status: 'Queued', hours: 60 },
    ],
  },
  {
    id: 'program-beta',
    name: 'Program Beta',
    owner: 'Jules',
    status: 'Planned',
    hours: 180,
    items: [
      { id: 'beta-outline', name: 'Outline', owner: 'Rae', status: 'Queued', hours: 24 },
      { id: 'beta-implementation', name: 'Implementation', owner: 'Noah', status: 'Planned', hours: 156 },
    ],
  },
  {
    id: 'ops',
    name: 'Operations',
    owner: 'Lina',
    status: 'Active',
    hours: 96,
  },
]

function cloneData(): TreeGridRow[] {
  return JSON.parse(JSON.stringify(baseData)) as TreeGridRow[]
}

function StoryFrame({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div>
      {note ? (
        <p style={{ margin: '0 0 12px', color: '#667085', fontSize: 13 }}>{note}</p>
      ) : null}
      {children}
    </div>
  )
}

export const Default: Story = {
  args: {
    columns: baseColumns,
    data: cloneData(),
    sortable: true,
    selection: 'row',
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

export const CollapsedStart: Story = {
  args: {
    columns: baseColumns,
    data: cloneData().map((row) => ({ ...row, $opened: false })),
    selection: 'row',
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

export const DeepHierarchy: Story = {
  render: () => {
    const data = useMemo(() => cloneData(), [])
    return (
      <StoryFrame note="Expanded multi-level hierarchy with nested tasks in the first column.">
        <TreeGrid
          columns={baseColumns}
          data={data}
          selection="row"
          sortable
          style={{ width: '100%', height: GRID_HEIGHT }}
        />
      </StoryFrame>
    )
  },
}

export const WithHeaderFilters: Story = {
  render: () => {
    const data = useMemo(() => cloneData(), [])
    return (
      <StoryFrame note="Header filters reuse the existing Grid filter controls on top of hierarchical rows.">
        <TreeGrid
          columns={filterColumns}
          data={data}
          selection="row"
          sortable
          style={{ width: '100%', height: GRID_HEIGHT }}
        />
      </StoryFrame>
    )
  },
}

export const SortingAndSelection: Story = {
  render: () => {
    const data = useMemo(() => cloneData(), [])
    return (
      <StoryFrame note="Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.">
        <TreeGrid
          columns={baseColumns}
          data={data}
          sortable
          selection="row"
          multiselection
          style={{ width: '100%', height: GRID_HEIGHT }}
        />
      </StoryFrame>
    )
  },
}

export const EditableRows: Story = {
  render: () => {
    const data = useMemo(() => cloneData(), [])
    return (
      <StoryFrame note="Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.">
        <TreeGrid
          columns={editableColumns}
          data={data}
          editable
          selection="complex"
          style={{ width: '100%', height: GRID_HEIGHT }}
        />
      </StoryFrame>
    )
  },
}

export const RowDrag: Story = {
  render: () => {
    const data = useMemo(() => cloneData(), [])
    return (
      <StoryFrame note="Drag rows to reorder within the flattened tree view.">
        <TreeGrid
          columns={baseColumns}
          data={data}
          dragItem="row"
          selection="row"
          style={{ width: '100%', height: GRID_HEIGHT }}
        />
      </StoryFrame>
    )
  },
}

export const ImperativeApi: Story = {
  render: () => {
    const ref = useRef<TreeGridRef>(null)
    const data = useMemo(() => cloneData().map((row) => ({ ...row, $opened: false })), [])
    return (
      <StoryFrame note="Imperative ref mirrors DHTMLX TreeGrid API: open(id), close(id), openAll(), closeAll().">
        <TreeGrid
          ref={ref}
          columns={baseColumns}
          data={data}
          selection="row"
          style={{ width: '100%', height: GRID_HEIGHT }}
        />
        <div style={{ display: 'flex', gap: 8, paddingTop: 12 }}>
          <button type="button" onClick={() => ref.current?.openAll()}>Open All</button>
          <button type="button" onClick={() => ref.current?.closeAll()}>Close All</button>
          <button type="button" onClick={() => ref.current?.open('program-beta')}>Open Beta</button>
          <button type="button" onClick={() => ref.current?.close('program-alpha')}>Close Alpha</button>
        </div>
      </StoryFrame>
    )
  },
}

// ─── Book Library Example ─────────────────────────────────────────────────────

type BookRow = TreeGridRow & {
  checked?: boolean
  price?: string
  shipsIn?: string
  status?: 'available' | 'reserved' | 'missing'
  publishingDate?: string
  cover?: string
}

const bookColumns = [
  { id: 'name', header: [{ text: 'Book Name' }], width: 300, sortable: true, resizable: true },
  {
    id: 'checked',
    header: [{ text: '' }],
    width: 52,
    align: 'center' as const,
    template: (value: unknown) => (
      <input type="checkbox" checked={Boolean(value)} readOnly style={{ width: 18, height: 18, accentColor: '#1d9bf0' }} />
    ),
  },
  { id: 'price', header: [{ text: 'Price' }], width: 100, align: 'right' as const },
  { id: 'shipsIn', header: [{ text: 'Ships in' }], width: 110 },
  {
    id: 'status',
    header: [{ text: 'Status' }],
    width: 150,
    template: (value: unknown) => {
      const status = String(value ?? '').toLowerCase()
      const color = status === 'available' ? '#1fb26b' : status === 'reserved' ? '#1d9bf0' : '#ff4d4f'
      return status ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: '999px', background: color, display: 'inline-block' }} />
          <span style={{ color: '#5f6b7a' }}>{String(value ?? '')}</span>
        </span>
      ) : null
    },
  },
  { id: 'publishingDate', header: [{ text: 'Publishing date' }], width: 160, align: 'right' as const },
  { id: 'cover', header: [{ text: 'Cover' }], width: 120 },
] satisfies NonNullable<Story['args']>['columns']

const bookData: BookRow[] = [
  {
    id: 'bestsellers', name: 'Bestsellers', $opened: true,
    items: [
      {
        id: 'john-grisham', name: 'John Grisham', $opened: true,
        items: [
          { id: 'time-to-kill', name: 'A Time to Kill', checked: true, price: '$12.25', shipsIn: '12 hours', status: 'available', publishingDate: '05/10/2019 12:00', cover: 'Hardcover' },
          { id: 'rainmaker', name: 'The Rainmaker', checked: true, price: '$5.5', shipsIn: '1 hour', status: 'reserved', publishingDate: '13/12/2005 12:00', cover: 'Paperback' },
          { id: 'partner', name: 'The Partner', checked: false, price: '$11.7', shipsIn: '1 week', publishingDate: '25/11/2017 12:00', cover: 'Hardcover' },
          { id: 'firm', name: 'The Firm', checked: true, price: '$6', shipsIn: '24 hours', status: 'available', publishingDate: '15/02/2020 12:00', cover: 'Paperback' },
        ],
      },
      {
        id: 'stephen-king', name: 'Stephen King', status: 'missing', $opened: true,
        items: [
          { id: 'misery', name: 'Misery', checked: false, price: '$5.25', shipsIn: '1 week', status: 'missing', publishingDate: '26/10/2014 12:00', cover: 'Paperback' },
          { id: 'it', name: 'It', checked: true, price: '$15.75', shipsIn: '1 hour', status: 'available', publishingDate: '05/04/2020 12:00', cover: 'Hardcover' },
          { id: 'dark-tower', name: 'The Dark Tower', checked: true, price: '$5.33', shipsIn: '2 days', status: 'reserved', publishingDate: '08/05/2018 12:00', cover: 'Paperback' },
        ],
      },
    ],
  },
  {
    id: 'classics', name: 'Classics', $opened: true,
    items: [
      {
        id: 'pushkin', name: 'Pushkin', status: 'missing', $opened: true,
        items: [
          { id: 'onegin', name: 'Eugene Onegin', checked: true, price: '$14.4', shipsIn: '24 hours', status: 'available', publishingDate: '05/03/2020 12:00', cover: 'Hardcover' },
          { id: 'boris-godunov', name: 'Boris Godunov', checked: false, price: '$8.1', shipsIn: '24 hours', status: 'missing', publishingDate: '18/09/2019 12:00', cover: 'Paperback' },
        ],
      },
      { id: 'balzac', name: 'Honore De Balzac', status: 'missing' },
    ],
  },
]

export const BookLibraryExample: Story = {
  render: () => {
    const data = useMemo(() => JSON.parse(JSON.stringify(bookData)) as BookRow[], [])
    return (
      <StoryFrame note="Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.">
        <TreeGrid columns={bookColumns} data={data} selection="row" style={{ width: '100%', height: 680 }} />
      </StoryFrame>
    )
  },
}

// ─── GroupBy Stories ──────────────────────────────────────────────────────────

const GROUP_NAMES = ['Alice', 'Bob', 'Cara', 'Dan', 'Eva', 'Frank', 'Grace', 'Hans']

const flatEmployees = Array.from({ length: 24 }, (_, i) => ({
  id: `e${i}`,
  name: GROUP_NAMES[i % GROUP_NAMES.length],
  dept: ['Engineering', 'HR', 'Finance'][i % 3],
  status: i % 2 === 0 ? 'active' : 'inactive',
  salary: 50000 + i * 1000,
}))

const groupCols = [
  { id: 'dept',   header: [{ text: 'Department' }], width: 160 },
  { id: 'status', header: [{ text: 'Status' }],     width: 100 },
  { id: 'name',   header: [{ text: 'Name' }],       width: 140 },
  { id: 'salary', header: [{ text: 'Salary' }],     width: 100 },
]

export const GroupByDepartment: StoryObj = {
  name: 'GroupBy — Department (avg salary)',
  render: () => (
    <ThemeProvider>
      <TreeGrid
        data={flatEmployees as TreeGridRow[]}
        columns={groupCols}
        groupBy="dept"
        groupAggregate={{ salary: 'avg' }}
        style={{ height: 360, width: '100%' }}
      />
    </ThemeProvider>
  ),
}

export const MultiLevelGroupBy: StoryObj = {
  name: 'GroupBy — Department > Status (sum salary)',
  render: () => (
    <ThemeProvider>
      <TreeGrid
        data={flatEmployees as TreeGridRow[]}
        columns={groupCols}
        groupBy={['dept', 'status']}
        groupAggregate={{ salary: 'sum' }}
        style={{ height: 400, width: '100%' }}
      />
    </ThemeProvider>
  ),
}
