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

// ─── DHTMLX snippet recreation (https://snippet.dhtmlx.com/0gd4dn8p) ───────

type ShowcaseRow = TreeGridRow & {
  owner?: string
  start_date?: string
  end_date?: string
  status?: string
  hours?: number
  cost?: number
  budget?: number
  balance?: number
  paid?: boolean
  renewals?: string
  access?: string
  project_id?: string
}

const srcPhoto = 'https://snippet.dhtmlx.com/codebase/data/common/img/02/'

const showcaseUsers: Array<{ id: string; name: string; ava?: string; color?: string }> = [
  { id: '1', name: 'Gary Ortiz', ava: 'avatar_01.jpg' },
  { id: '2', name: 'Albert Williamson', ava: 'avatar_02.jpg' },
  { id: '3', name: 'Mildred Fuller', ava: 'avatar_03.jpg' },
  { id: '4', name: 'Russell Robinson', ava: 'avatar_04.jpg' },
  { id: '5', name: 'Phyllis Webb', color: '#61C874' },
  { id: '6', name: 'Louise Fisher', color: '#61C504' },
  { id: '7', name: 'Daniel Peterson', color: '#61C456' },
]

const showcaseRawProjects = [
  { name: 'Real Estate', owner: 'Louise Fisher', start_date: '02/02/2024', end_date: '05/06/2024', status: 'Done', hours: 92, cost: 3588, budget: 11768, balance: 8180, paid: true, renewals: '1-2 times', access: '4, 5, 7', project_id: 'ISS-124.5' },
  { name: 'HR System', owner: 'Daniel Peterson', start_date: '03/03/2024', end_date: '07/02/2024', status: 'Done', hours: 340, cost: 15980, budget: 18856, balance: 2876, paid: true, renewals: '1 time', access: '2, 4', project_id: 'ISS-900.9' },
  { name: 'Inventory', owner: 'Fred Duncan', start_date: '01/01/2024', end_date: '09/01/2024', status: 'Done', hours: 484, cost: 21296, budget: 14907, balance: -6389, paid: false, renewals: '1 time', access: '3, 1, 2', project_id: 'ISS-777.4' },
  { name: 'Trip Planner', owner: 'Michael Rice', start_date: '01/01/2024', end_date: '11/06/2024', status: 'Done', hours: 345, cost: 14835, budget: 70911, balance: 56076, paid: false, renewals: '1-2 times', access: '5, 3, 6', project_id: 'ISS-642.2' },
  { name: 'HR System', owner: 'Andrew Stewart', start_date: '01/01/2024', end_date: '09/02/2024', status: 'Done', hours: 57, cost: 2052, budget: 5068, balance: 3016, paid: true, renewals: '1-2 times', access: '4, 2, 1, 7', project_id: 'ISS-256.2' },
  { name: 'HR System', owner: 'Martin Thompson', start_date: '02/06/2024', end_date: '06/01/2024', status: 'Done', hours: 211, cost: 8229, budget: 16540, balance: 8311, paid: false, renewals: 'more than 5 times', access: '3, 5, 2, 6', project_id: 'ISS-263.2' },
  { name: 'Ticket System', owner: 'Martin Thompson', start_date: '05/06/2025', end_date: '07/03/2025', status: 'In Progress', hours: 3, cost: 144, budget: 122, balance: -22, paid: true, renewals: '1 time', access: '2, 3', project_id: 'ISS-634.3' },
  { name: 'Education System', owner: 'Mark Harper', start_date: '04/02/2025', end_date: '08/03/2025', status: 'In Progress', hours: 76, cost: 3496, budget: 12515, balance: 9019, paid: true, renewals: 'more than 5 times', access: '1, 5, 4', project_id: 'ISS-256.7' },
]

function buildShowcaseData(): ShowcaseRow[] {
  return showcaseUsers.map((user) => ({
    id: user.id,
    name: user.name,
    $opened: true,
    items: showcaseRawProjects
      .filter((p) => p.access.split(', ').includes(user.id))
      .map((p, pi) => ({ id: `${user.id}_${pi}`, ...p })),
  }))
}

function renderAccessCell(value: unknown): ReactNode {
  if (!value) return null
  const ids = String(value).split(', ')
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {ids.map((id) => {
        const user = showcaseUsers.find((u) => u.id === id)
        if (!user) return null
        return user.ava ? (
          <img
            key={id}
            src={`${srcPhoto}${user.ava}`}
            alt={user.name}
            width={24}
            height={24}
            style={{ borderRadius: '50%', border: '1px solid #fff', marginRight: -3, objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            key={id}
            style={{
              width: 24, height: 24, borderRadius: '50%',
              background: user.color ?? '#999',
              border: '1px solid #fff', marginRight: -3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}
          >
            {user.name[0]}
          </div>
        )
      })}
    </div>
  )
}

function renderStatusCell(value: unknown): ReactNode {
  if (!value) return null
  const v = String(value)
  const dot = v === 'Done' ? '#1fb26b' : v === 'In Progress' ? '#1d9bf0' : '#ff4d4f'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: dot, flexShrink: 0, display: 'inline-block' }} />
      <span>{v}</span>
    </span>
  )
}

function renderBalanceCell(value: unknown, row: TreeGridRow): ReactNode {
  if (value === null || value === undefined || value === '') return null
  const balance = (row as ShowcaseRow).balance
  if (balance === undefined) return null
  const pos = balance > 0
  return (
    <span style={{ color: pos ? '#16a34a' : '#dc2626', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span>{pos ? '⬆' : '⬇'}</span>
      <span>${Number(value).toLocaleString()}</span>
    </span>
  )
}

const showcaseColumns = [
  {
    id: 'name',
    header: [{ text: 'Project' }, { content: 'inputFilter' as const }],
    footer: [{ text: 'Total' }],
    minWidth: 200,
    resizable: true,
    sortable: true,
    editorType: 'input' as const,
  },
  {
    id: 'paid',
    header: [{ text: 'Paid' }],
    width: 60,
    align: 'center' as const,
    template: (value: unknown) => (
      <input type="checkbox" checked={Boolean(value)} readOnly style={{ width: 16, height: 16, accentColor: '#1d9bf0' }} />
    ),
  },
  {
    id: 'access',
    header: [{ text: 'Access' }, { content: 'inputFilter' as const }],
    width: 160,
    template: renderAccessCell,
  },
  {
    id: 'status',
    header: [{ text: 'Status' }, { content: 'selectFilter' as const }],
    width: 140,
    sortable: true,
    editorType: 'input' as const,
    template: renderStatusCell,
  },
  {
    id: 'owner',
    header: [{ text: 'Owner' }, { content: 'inputFilter' as const }],
    width: 150,
    sortable: true,
    editorType: 'input' as const,
  },
  {
    id: 'balance',
    header: [{ text: 'Balance' }],
    footer: [{ content: 'sum' as const }],
    width: 130,
    template: renderBalanceCell,
  },
  {
    id: 'hours',
    header: [{ text: 'Number of Hours' }, { content: 'inputFilter' as const }],
    footer: [{ content: 'sum' as const }],
    width: 150,
    align: 'right' as const,
    sortable: true,
  },
  {
    id: 'renewals',
    header: [{ text: 'Number of Renewals' }, { content: 'inputFilter' as const }],
    width: 160,
    editorType: 'input' as const,
  },
  {
    id: 'start_date',
    header: [{ text: 'Start Date' }],
    width: 115,
    align: 'center' as const,
  },
  {
    id: 'end_date',
    header: [{ text: 'End Date' }],
    width: 115,
    align: 'center' as const,
  },
  {
    id: 'cost',
    header: [{ text: 'Cost' }, { content: 'inputFilter' as const }],
    footer: [{ content: 'sum' as const }],
    width: 110,
    align: 'right' as const,
    sortable: true,
  },
  {
    id: 'budget',
    header: [{ text: 'Budget' }, { content: 'inputFilter' as const }],
    footer: [{ content: 'sum' as const }],
    width: 110,
    align: 'right' as const,
    sortable: true,
  },
  {
    id: 'project_id',
    header: [{ text: 'Project ID' }, { content: 'inputFilter' as const }],
    width: 115,
    align: 'center' as const,
  },
] satisfies NonNullable<Story['args']>['columns']

export const DHtmlxShowcase: Story = {
  render: () => {
    const data = useMemo(() => buildShowcaseData(), [])
    return (
      <StoryFrame note="Faithful recreation of the DHTMLX TreeGrid snippet: users as root rows, their assigned projects as children. Drag to reorder, multiselect, inline edit, header filters, footer sums, avatar access column, status badges, signed balance.">
        <TreeGrid
          columns={showcaseColumns}
          data={data}
          dragItem="row"
          selection="row"
          editable
          keyNavigation
          multiselection
          sortable
          style={{ width: '100%', height: 640 }}
        />
      </StoryFrame>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Recreation of the DHTMLX TreeGrid showcase (snippet.dhtmlx.com/0gd4dn8p). Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection.',
      },
    },
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
