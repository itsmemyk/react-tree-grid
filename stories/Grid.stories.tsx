import { useMemo, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '../src/core/theme'
import { useDataStore } from '../src/core/data/useDataStore'
import { Grid } from '../src/grid'
import type { GridApi, GridColumn, GridSpan } from '../src/grid'

// ─── Shared data types ────────────────────────────────────────────────

type Employee = {
  id: string
  name: string
  role: string
  team: string
  region: string
  salary: number
  age: number
  active: boolean
}

const ROLES = ['Lead', 'Developer', 'QA Engineer', 'DevOps', 'Designer', 'PM']
const TEAMS = ['Alpha', 'Beta', 'Gamma', 'Delta']
const REGIONS = ['North', 'South', 'East', 'West']
const NAMES = [
  'Alice Chen', 'Bob Rivera', 'Carla Müller', 'David Kim', 'Eva Torres',
  'Frank Osei', 'Grace Liu', 'Hassan Ali', 'Iris Novak', 'James Okoro',
  'Kira Singh', 'Liam Brown', 'Mina Sato', 'Noah Garcia', 'Olivia Jansen',
  'Pavel Sokolov', 'Quinn Murphy', 'Rosa Fernandes', 'Samuel Ek', 'Tara Gupta',
]

function generateData(count: number): Employee[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: NAMES[i % NAMES.length],
    role: ROLES[i % ROLES.length],
    team: TEAMS[i % TEAMS.length],
    region: REGIONS[i % REGIONS.length],
    salary: 45000 + Math.floor(Math.random() * 80000),
    age: 22 + (i % 35),
    active: i % 5 !== 0,
  }))
}

const data50 = generateData(50)
const data200 = generateData(200)
const data5000 = generateData(5000)

// ─── Column presets ───────────────────────────────────────────────────

const baseColumns: GridColumn<Employee>[] = [
  { id: 'id', header: [{ text: '#' }], width: 60, sortable: true },
  { id: 'name', header: [{ text: 'Name' }], width: 160, sortable: true, resizable: true },
  { id: 'role', header: [{ text: 'Role' }], width: 140, sortable: true, resizable: true },
  { id: 'team', header: [{ text: 'Team' }], width: 120, sortable: true, resizable: true },
  { id: 'region', header: [{ text: 'Region' }], width: 120, sortable: true, resizable: true },
  { id: 'salary', header: [{ text: 'Salary' }], width: 120, sortable: true, resizable: true, align: 'right',
    template: (v) => `$${Number(v).toLocaleString()}`,
  },
  { id: 'age', header: [{ text: 'Age' }], width: 80, sortable: true, align: 'center' },
]

// ─── Storybook meta ───────────────────────────────────────────────────

const GRID_HEIGHT = 500

const meta: Meta<typeof Grid<Employee>> = {
  title: 'Components/Grid',
  component: Grid<Employee>,
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Default
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const Default: Story = {
  args: {
    columns: baseColumns,
    data: data50.slice(0, 15),
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Virtual Scroll (200 rows)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const VirtualScroll: Story = {
  name: 'Virtual Scroll (5000 rows)',
  args: {
    columns: baseColumns,
    data: data5000,
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Frozen Columns & Rows (Split Areas)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FrozenSplitsDemo() {
  const wideColumns: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '# (frozen)' }], width: 80 },
    { id: 'name', header: [{ text: 'Name (frozen)' }], width: 200 },
    { id: 'role', header: [{ text: 'Role' }], width: 220 },
    { id: 'team', header: [{ text: 'Team' }], width: 220 },
    { id: 'region', header: [{ text: 'Region' }], width: 220 },
    { id: 'salary', header: [{ text: 'Salary' }], width: 200, align: 'right',
      template: (v) => `$${Number(v).toLocaleString()}`,
    },
    { id: 'active', header: [{ text: 'Active' }], width: 200, align: 'center',
      template: (v) => (v ? 'Yes' : 'No'),
    },
    { id: 'age', header: [{ text: 'Age (frozen)' }], width: 120, align: 'center' },
  ]

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Scroll horizontally — first 2 columns and last column stay frozen. First and last rows stay frozen on vertical scroll.
      </p>
      <Grid<Employee>
        columns={wideColumns}
        data={data50}
        leftSplit={2}
        rightSplit={1}
        topSplit={1}
        bottomSplit={1}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const FrozenSplits: Story = {
  name: 'Frozen Columns & Rows',
  render: () => <FrozenSplitsDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Column Resize
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ColumnResize: Story = {
  name: 'Column Resize (drag header edges)',
  args: {
    columns: baseColumns.map((c) => ({
      ...c,
      resizable: true,
      minWidth: 60,
      maxWidth: 400,
    })),
    data: data50.slice(0, 15),
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Sorting (click header)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SortingDemo() {
  const { items, store } = useDataStore<Employee>({ data: data50 })

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Click a header to sort. Ctrl+click for multi-column sort. Click again to cycle: asc → desc → none.
      </p>
      <Grid<Employee>
        columns={baseColumns}
        data={items}
        store={store}
        sortable
        style={{ width: '100%', height: GRID_HEIGHT }}
        onAfterSort={(states) => console.log('Sort states:', states)}
      />
    </div>
  )
}

export const Sorting: Story = {
  name: 'Sorting (click headers)',
  render: () => <SortingDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Row Selection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RowSelection: Story = {
  name: 'Row Selection (click to select)',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 20),
    selection: 'row',
    multiselection: true,
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Cell Selection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CellSelection: Story = {
  name: 'Cell Selection',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 20),
    selection: 'cell',
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Complex Selection (row + cell)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ComplexSelection: Story = {
  name: 'Complex Selection (row + cell)',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 20),
    selection: 'complex',
    multiselection: true,
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Inline Cell Editing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function EditingDemo() {
  const editableColumns: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }], width: 160, editorType: 'input' },
    { id: 'role', header: [{ text: 'Role' }], width: 140, editorType: 'input' },
    { id: 'team', header: [{ text: 'Team' }], width: 120, editorType: 'input' },
    { id: 'region', header: [{ text: 'Region' }], width: 120, editorType: 'input' },
    { id: 'salary', header: [{ text: 'Salary' }], width: 120, align: 'right', editorType: 'input',
      template: (v) => `$${Number(v).toLocaleString()}`,
    },
    { id: 'age', header: [{ text: 'Age' }], width: 80, align: 'center', editorType: 'input' },
  ]

  const { items, store } = useDataStore<Employee>({ data: data50.slice(0, 15) })

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Double-click a cell to edit. Enter to save, Escape to cancel, Tab to move to next editable cell.
      </p>
      <Grid<Employee>
        columns={editableColumns}
        data={items}
        store={store}
        editable
        selection="cell"
        style={{ width: '100%', height: GRID_HEIGHT }}
        onAfterEditEnd={(rowId, colId, value) =>
          console.log(`Edited [${rowId}][${colId}] →`, value)
        }
      />
    </div>
  )
}

export const InlineEditing: Story = {
  name: 'Inline Cell Editing (double-click)',
  render: () => <EditingDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Header Filters
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function HeaderFiltersDemo() {
  const filterColumns: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }, { content: 'inputFilter' }], width: 160 },
    { id: 'role', header: [{ text: 'Role' }, { content: 'selectFilter' }], width: 140 },
    { id: 'team', header: [{ text: 'Team' }, { content: 'selectFilter' }], width: 120 },
    { id: 'region', header: [{ text: 'Region' }, { content: 'comboFilter' }], width: 140 },
    { id: 'salary', header: [{ text: 'Salary' }], width: 120, align: 'right',
      template: (v) => `$${Number(v).toLocaleString()}`,
    },
  ]

  const { items, store } = useDataStore<Employee>({ data: data50 })

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Second header row has filters: text input for Name, dropdown for Role/Team, searchable combo for Region.
      </p>
      <Grid<Employee>
        columns={filterColumns}
        data={items}
        store={store}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const HeaderFilters: Story = {
  name: 'Header Filters (select, input, combo)',
  render: () => <HeaderFiltersDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Footer Summaries
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FooterSummariesDemo() {
  const footerColumns: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], footer: [{ content: 'count' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }], footer: [{ text: 'Totals' }], width: 160 },
    { id: 'role', header: [{ text: 'Role' }], width: 140 },
    { id: 'team', header: [{ text: 'Team' }], width: 120 },
    { id: 'salary', header: [{ text: 'Salary' }], width: 140, align: 'right',
      footer: [{ content: 'sum' }, { content: 'avg' }],
      template: (v) => `$${Number(v).toLocaleString()}`,
    },
    { id: 'age', header: [{ text: 'Age' }], width: 80, align: 'center',
      footer: [{ content: 'min' }, { content: 'max' }],
    },
  ]

  const { items, store } = useDataStore<Employee>({ data: data50 })

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Footer rows show aggregations: count, sum, avg, min, max. Salary has two footer rows (sum + avg).
      </p>
      <Grid<Employee>
        columns={footerColumns}
        data={items}
        store={store}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const FooterSummaries: Story = {
  name: 'Footer Summaries (sum, avg, count, min, max)',
  render: () => <FooterSummariesDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Cell Spans
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CellSpans: Story = {
  name: 'Cell Spans (rowspan/colspan)',
  args: {
    columns: baseColumns.slice(0, 5),
    data: data50.slice(0, 12),
    spans: [
      { row: '1', column: 'name', colspan: 2, text: 'Alice Chen — Lead', css: '' },
      { row: '3', column: 'team', rowspan: 3, text: 'Team Gamma (shared)', css: '' },
      { row: '6', column: 'name', colspan: 3, rowspan: 2, text: 'Merged block (2×3)', css: '' },
    ] satisfies GridSpan[],
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Column Reorder (Drag)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ColumnReorder: Story = {
  name: 'Column Reorder (drag headers)',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 16),
    dragItem: 'column',
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

export const ColumnReorderWithSplits: Story = {
  name: 'Column Reorder + Frozen Splits',
  args: {
    columns: baseColumns,
    data: data50,
    dragItem: 'column',
    leftSplit: 2,
    rightSplit: 1,
    style: { width: '100%', height: GRID_HEIGHT },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: CSV/Excel Export
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ExportDemo() {
  const { items, store } = useDataStore<Employee>({ data: data50.slice(0, 10) })

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={() => {
            import('../src/grid/export').then(({ downloadGridAsCsv }) => {
              downloadGridAsCsv(store, baseColumns, 'employees.csv')
            })
          }}
          style={{ padding: '6px 16px', cursor: 'pointer' }}
        >
          Export CSV
        </button>
        <button
          onClick={() => {
            import('../src/grid/export').then(({ downloadGridAsExcel }) => {
              downloadGridAsExcel(store, baseColumns, 'employees.xlsx')
            })
          }}
          style={{ padding: '6px 16px', cursor: 'pointer' }}
        >
          Export Excel
        </button>
      </div>
      <Grid<Employee>
        columns={baseColumns}
        data={items}
        store={store}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const Export: Story = {
  name: 'CSV & Excel Export',
  render: () => <ExportDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Kitchen Sink (all features combined)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function KitchenSinkDemo() {
  const kitchenColumns: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], footer: [{ content: 'count' }], width: 60, resizable: true },
    { id: 'name', header: [{ text: 'Name' }, { content: 'inputFilter' }], width: 160, sortable: true, resizable: true, editorType: 'input' },
    { id: 'role', header: [{ text: 'Role' }, { content: 'selectFilter' }], width: 140, sortable: true, resizable: true, editorType: 'input' },
    { id: 'team', header: [{ text: 'Team' }, { content: 'selectFilter' }], width: 120, sortable: true, resizable: true },
    { id: 'region', header: [{ text: 'Region' }, { content: 'comboFilter' }], width: 130, sortable: true, resizable: true },
    { id: 'salary', header: [{ text: 'Salary' }], footer: [{ content: 'sum' }, { content: 'avg' }], width: 130, sortable: true, resizable: true, align: 'right', editorType: 'input',
      template: (v) => `$${Number(v).toLocaleString()}`,
    },
    { id: 'age', header: [{ text: 'Age' }], footer: [{ content: 'min' }, { content: 'max' }], width: 80, sortable: true, align: 'center', editorType: 'input' },
  ]

  const { items, store } = useDataStore<Employee>({ data: data200 })

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        All features active: sorting, filters, footers, resize, editing (dbl-click), selection (Ctrl/Shift+click), column drag reorder, 200 rows virtual scroll.
      </p>
      <Grid<Employee>
        columns={kitchenColumns}
        data={items}
        store={store}
        sortable
        editable
        selection="complex"
        multiselection
        dragItem="column"
        leftSplit={1}
        style={{ width: '100%', height: GRID_HEIGHT }}
        onAfterSort={(states) => console.log('Sort:', states)}
        onAfterEditEnd={(r, c, v) => console.log(`Edit [${r}][${c}]:`, v)}
        onAfterSelect={(r, c) => console.log(`Select [${r}][${c}]`)}
      />
    </div>
  )
}

export const KitchenSink: Story = {
  name: 'Kitchen Sink (all features)',
  render: () => <KitchenSinkDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Keyboard Navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function KeyboardNavDemo() {
  const editableColumns: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }], width: 160, editorType: 'input' },
    { id: 'role', header: [{ text: 'Role' }], width: 140, editorType: 'input' },
    { id: 'team', header: [{ text: 'Team' }], width: 120, editorType: 'input' },
    { id: 'region', header: [{ text: 'Region' }], width: 120, editorType: 'input' },
    { id: 'salary', header: [{ text: 'Salary' }], width: 120, align: 'right', editorType: 'input',
      template: (v) => `$${Number(v).toLocaleString()}`,
    },
    { id: 'age', header: [{ text: 'Age' }], width: 80, align: 'center', editorType: 'input' },
  ]

  const { items, store } = useDataStore<Employee>({ data: data50 })

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Click a cell, then use arrow keys to navigate. Tab/Shift+Tab wraps across rows.
        Enter to edit, Escape to cancel. PageUp/Down scrolls viewport. Ctrl+Arrow jumps to first/last row/col.
      </p>
      <Grid<Employee>
        columns={editableColumns}
        data={items}
        store={store}
        editable
        selection="complex"
        keyNavigation
        style={{ width: '100%', height: GRID_HEIGHT }}
        onAfterSelect={(r, c) => console.log(`Select [${r}][${c}]`)}
        onAfterEditEnd={(r, c, v) => console.log(`Edit [${r}][${c}]:`, v)}
      />
    </div>
  )
}

export const KeyboardNavigation: Story = {
  name: 'Keyboard Navigation (arrow/tab/enter)',
  render: () => <KeyboardNavDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Auto-fit widths & heights
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AdjustAutoWidthDemo() {
  const longData = useMemo(
    () =>
      data50.slice(0, 20).map((row, i) => ({
        ...row,
        role: i % 4 === 0 ? 'Senior Principal Software Engineer' : row.role,
        region: i % 3 === 0 ? 'North American Operations' : row.region,
      })),
    [],
  )

  const cols: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }], adjust: 'data' },
    { id: 'role', header: [{ text: 'Role' }], adjust: true },
    { id: 'team', header: [{ text: 'Team' }], adjust: 'header' },
    { id: 'region', header: [{ text: 'Region' }], adjust: 'data' },
    { id: 'salary', header: [{ text: 'Salary' }], adjust: 'data', align: 'right',
      template: (v) => `$${Number(v).toLocaleString()}`,
    },
  ]

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Columns auto-fit to widest data/header value via <code>adjust</code>.
      </p>
      <Grid<Employee>
        columns={cols}
        data={longData}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const AdjustColumns: Story = {
  name: 'Adjust columns (auto-fit to content)',
  render: () => <AdjustAutoWidthDemo />,
}

function AutoWidthDemo() {
  const cols: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }], gravity: 2 },
    { id: 'role', header: [{ text: 'Role' }], gravity: 1 },
    { id: 'team', header: [{ text: 'Team' }], gravity: 1 },
    { id: 'region', header: [{ text: 'Region' }], gravity: 1 },
    { id: 'salary', header: [{ text: 'Salary' }], width: 120, align: 'right',
      template: (v) => `$${Number(v).toLocaleString()}`,
    },
  ]

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Flexible columns fill the container proportionally by <code>gravity</code>. name takes 2× the share of its siblings.
      </p>
      <Grid<Employee>
        autoWidth
        columns={cols}
        data={data50}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const AutoWidth: Story = {
  name: 'Auto width (fill container by gravity)',
  render: () => <AutoWidthDemo />,
}

function AutoHeightDemo() {
  const wrapData = useMemo(
    () =>
      [
        { id: '1', name: 'Alice Chen', role: 'Senior Principal Software Engineer working on distributed systems and event-sourcing pipelines', team: 'Alpha', region: 'North', salary: 120000, age: 34, active: true },
        { id: '2', name: 'Bob Rivera', role: 'QA Engineer', team: 'Beta', region: 'South', salary: 80000, age: 28, active: true },
        { id: '3', name: 'Carla Müller', role: 'Frontend Developer specializing in accessibility and design systems across product surfaces', team: 'Gamma', region: 'East', salary: 95000, age: 31, active: true },
      ] as Employee[],
    [],
  )

  const cols: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }], width: 140 },
    { id: 'role', header: [{ text: 'Role' }], width: 200 },
    { id: 'team', header: [{ text: 'Team' }], width: 100 },
    { id: 'region', header: [{ text: 'Region' }], width: 100 },
  ]

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Rows grow vertically to fit wrapped cell text when <code>autoHeight</code> is on.
      </p>
      <Grid<Employee>
        autoHeight
        columns={cols}
        data={wrapData}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const AutoHeight: Story = {
  name: 'Auto height (wrap cell content)',
  render: () => <AutoHeightDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Tooltip
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TooltipDemo() {
  const cols: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }], width: 160 },
    { id: 'role', header: [{ text: 'Role' }], width: 140,
      tooltipTemplate: (v, row) => `${row.name} — ${v}`,
    },
    { id: 'team', header: [{ text: 'Team' }], width: 120 },
    { id: 'region', header: [{ text: 'Region' }], width: 120 },
    { id: 'salary', header: [{ text: 'Salary' }], width: 120, align: 'right',
      template: (v) => `$${Number(v).toLocaleString()}`,
      tooltipTemplate: (v) => `Annual salary: $${Number(v).toLocaleString()}`,
    },
    { id: 'age', header: [{ text: 'Age' }], width: 80, align: 'center' },
  ]

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Hover over cells. Role and Salary columns use <code>tooltipTemplate</code>; other columns show raw value.
      </p>
      <Grid<Employee>
        tooltip
        columns={cols}
        data={data50.slice(0, 20)}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const TooltipStory: Story = {
  name: 'Tooltip (cell hover)',
  render: () => <TooltipDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: Row Drag & Drop
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function RowDragDemo() {
  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Drag rows to reorder them. A horizontal drop line shows the insertion point.
      </p>
      <Grid<Employee>
        columns={baseColumns}
        data={data50.slice(0, 14)}
        dragItem="row"
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const RowDrag: Story = {
  name: 'Row drag & drop',
  render: () => <RowDragDemo />,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORY: CSS API + Marks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CssApiAndMarksDemo() {
  const gridRef = useRef<GridApi<Employee>>(null)
  const [cityVisible, setCityVisible] = useState(true)

  const cols: GridColumn<Employee>[] = [
    { id: 'id', header: [{ text: '#' }], width: 60 },
    { id: 'name', header: [{ text: 'Name' }], width: 160 },
    { id: 'city', header: [{ text: 'City' }], width: 120 },
    { id: 'salary', header: [{ text: 'Salary' }], width: 120, align: 'right',
      template: (v) => `$${Number(v).toLocaleString()}`,
      mark: { min: 'gridStoryMarkMin', max: 'gridStoryMarkMax' },
    },
    { id: 'team', header: [{ text: 'Team' }], width: 120,
      mark: (_value, _values, row) => (row.team === 'Gamma' ? 'gridStoryMarkGamma' : false),
    },
  ]

  const rows = data50.slice(0, 12)

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
        Imperative API: addRowCss, addCellCss, showColumn/hideColumn. Salary uses min/max marks; Team uses a function mark.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => { gridRef.current?.addRowCss('1', 'gridStoryRowAccent'); gridRef.current?.addCellCss('1', 'salary', 'gridStoryCellAccent') }}>
          Highlight first row
        </button>
        <button type="button" onClick={() => { gridRef.current?.removeRowCss('1', 'gridStoryRowAccent'); gridRef.current?.removeCellCss('1', 'salary', 'gridStoryCellAccent') }}>
          Clear highlight
        </button>
        <button type="button" onClick={() => { if (cityVisible) { gridRef.current?.hideColumn('city') } else { gridRef.current?.showColumn('city') }; setCityVisible((prev) => !prev) }}>
          {cityVisible ? 'Hide' : 'Show'} city column
        </button>
      </div>
      <style>{`
        .gridStoryRowAccent { background: rgba(255, 214, 102, 0.28); }
        .gridStoryCellAccent { background: rgba(255, 107, 107, 0.16); color: #8f1d21; font-weight: 600; }
        .gridStoryMarkMin { background: rgba(56, 217, 169, 0.18); color: #087f5b; }
        .gridStoryMarkMax { background: rgba(255, 146, 43, 0.18); color: #d9480f; font-weight: 600; }
        .gridStoryMarkGamma { box-shadow: inset 0 0 0 1px rgba(66, 99, 235, 0.35); color: #364fc7; }
      `}</style>
      <Grid<Employee>
        ref={gridRef}
        columns={cols}
        data={rows}
        style={{ width: '100%', height: GRID_HEIGHT }}
      />
    </div>
  )
}

export const CssApiAndMarks: Story = {
  name: 'CSS API + marks',
  render: () => <CssApiAndMarksDemo />,
}

// ─── DataProxy Stories ────────────────────────────────────────────────────────

const ALL_EMPLOYEES: Employee[] = Array.from({ length: 200 }, (_, i) => ({
  id: `${i + 1}`,
  name: NAMES[i % NAMES.length],
  role: ROLES[i % ROLES.length],
  team: TEAMS[i % TEAMS.length],
  region: REGIONS[i % REGIONS.length],
  salary: 50000 + (i * 317) % 60000,
  age: 22 + (i * 7) % 40,
  active: i % 3 !== 0,
}))

function makeMockFetch(allData: Employee[]) {
  return async (url: string): Promise<Response> => {
    await new Promise((r) => setTimeout(r, 300))
    const params = new URLSearchParams(url.split('?')[1])
    const page = Number(params.get('page') ?? 1)
    const size = Number(params.get('size') ?? 50)
    const sortBy = params.get('sortBy')
    const sortDir = params.get('sortDir')

    let items = [...allData]
    if (sortBy) {
      items.sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortBy] ?? '')
        const bv = String((b as Record<string, unknown>)[sortBy] ?? '')
        return sortDir === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv)
      })
    }
    const start = (page - 1) * size
    return {
      ok: true,
      json: async () => ({ data: items.slice(start, start + size), total: items.length }),
    } as Response
  }
}

const proxyColumns: GridColumn<Employee>[] = [
  { id: 'name',   header: [{ text: 'Name' }],   width: 160 },
  { id: 'role',   header: [{ text: 'Role' }],   width: 140 },
  { id: 'team',   header: [{ text: 'Team' }],   width: 100 },
  { id: 'salary', header: [{ text: 'Salary' }], width: 100 },
]

export const RemotePagination: StoryObj = {
  name: 'DataProxy — Remote Pagination (append)',
  render: () => (
    <ThemeProvider>
      <Grid
        columns={proxyColumns}
        data={[]}
        dataProxy={{
          url: 'https://api.test/employees',
          pageSize: 20,
          fetchFn: makeMockFetch(ALL_EMPLOYEES),
        }}
        paginationMode="append"
        style={{ height: 400, width: '100%' }}
      />
    </ThemeProvider>
  ),
}

export const RemoteSortFilter: StoryObj = {
  name: 'DataProxy — Remote Sort',
  render: () => (
    <ThemeProvider>
      <Grid
        columns={proxyColumns}
        data={[]}
        dataProxy={{
          url: 'https://api.test/employees',
          pageSize: 50,
          fetchFn: makeMockFetch(ALL_EMPLOYEES),
        }}
        remoteSort
        sortable
        style={{ height: 400, width: '100%' }}
      />
    </ThemeProvider>
  ),
}

export const Polling: StoryObj = {
  name: 'DataProxy — Polling (2s)',
  render: () => {
    const [tick, setTick] = useState(0)
    return (
      <ThemeProvider>
        <p style={{ margin: '0 0 8px' }}>Tick: {tick} (data refreshes every 2s via polling)</p>
        <Grid
          columns={proxyColumns}
          data={[]}
          dataProxy={{
            url: 'https://api.test/employees',
            pageSize: 10,
            polling: 2000,
            fetchFn: async (url) => {
              setTick((t) => t + 1)
              return makeMockFetch(ALL_EMPLOYEES)(url)
            },
          }}
          style={{ height: 320, width: '100%' }}
        />
      </ThemeProvider>
    )
  },
}

export const FormulaEngine: Story = {
  name: 'Formula Engine',
  render() {
    return (
      <ThemeProvider>
        <Grid
          columns={[
            { id: 'label', header: [{ text: 'Label' }], width: 120 },
            { id: 'value', header: [{ text: 'Value' }], width: 100 },
            { id: 'doubled', header: [{ text: 'Doubled (=value*2)' }], width: 160 },
            { id: 'total', header: [{ text: 'Total (=SUM)' }], width: 160 },
          ]}
          data={[
            { id: 'r1', label: 'Alpha', value: 10, doubled: '=B1*2', total: '' },
            { id: 'r2', label: 'Beta', value: 20, doubled: '=B2*2', total: '' },
            { id: 'r3', label: 'Gamma', value: 30, doubled: '=B3*2', total: '=SUM(B1:B3)' },
          ]}
          formulas={true}
          style={{ height: 200, width: '100%' }}
        />
      </ThemeProvider>
    )
  },
}

export const FreezePanes: Story = {
  name: 'Freeze Panes (draggable)',
  render() {
    const [frozen, setFrozen] = useState(2)
    return (
      <ThemeProvider>
        <p style={{ margin: '0 0 8px', fontSize: 13 }}>
          Frozen columns: <strong>{frozen}</strong> — drag the blue handle to change
        </p>
        <Grid
          columns={[
            { id: 'id', header: [{ text: '#' }], width: 50 },
            { id: 'name', header: [{ text: 'Name' }], width: 140 },
            { id: 'dept', header: [{ text: 'Department' }], width: 140 },
            { id: 'role', header: [{ text: 'Role' }], width: 140 },
            { id: 'salary', header: [{ text: 'Salary' }], width: 100 },
            { id: 'city', header: [{ text: 'City' }], width: 120 },
            { id: 'start', header: [{ text: 'Start Date' }], width: 120 },
          ]}
          data={[
            { id: '1', name: 'Alice', dept: 'Engineering', role: 'Lead', salary: 120000, city: 'SF', start: '2020-01' },
            { id: '2', name: 'Bob', dept: 'Product', role: 'PM', salary: 110000, city: 'NYC', start: '2019-06' },
            { id: '3', name: 'Carol', dept: 'Design', role: 'Senior', salary: 95000, city: 'Austin', start: '2021-03' },
            { id: '4', name: 'Dave', dept: 'Engineering', role: 'Mid', salary: 90000, city: 'Seattle', start: '2022-01' },
          ]}
          leftSplit={frozen}
          freezable={true}
          onFreeze={({ left }) => setFrozen(left)}
          style={{ height: 240, width: '100%' }}
        />
      </ThemeProvider>
    )
  },
}
