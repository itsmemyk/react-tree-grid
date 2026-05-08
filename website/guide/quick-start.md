# Quick Start

All components require a `ThemeProvider` ancestor. Import it from the root package.

## Grid

```tsx
import { Grid } from '@itsmemyk/react-tree-grid/grid'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { GridColumn, GridRow } from '@itsmemyk/react-tree-grid/grid'

interface Employee extends GridRow {
  name: string
  department: string
  salary: number
}

const columns: GridColumn<Employee>[] = [
  { id: 'name', header: [{ text: 'Name' }], width: 180 },
  { id: 'department', header: [{ text: 'Department' }], width: 160 },
  { id: 'salary', header: [{ text: 'Salary' }], width: 120 },
]

const data: Employee[] = [
  { id: '1', name: 'Alice', department: 'Engineering', salary: 95000 },
  { id: '2', name: 'Bob', department: 'Design', salary: 85000 },
]

export function App() {
  return (
    <ThemeProvider theme="light">
      <Grid columns={columns} data={data} style={{ width: 500, height: 300 }} />
    </ThemeProvider>
  )
}
```

## Tree

```tsx
import { Tree } from '@itsmemyk/react-tree-grid/tree'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { TreeNode } from '@itsmemyk/react-tree-grid/tree'

const data: TreeNode[] = [
  {
    id: 'docs',
    value: 'Documents',
    $opened: true,
    items: [
      { id: 'report', value: 'Q4 Report.pdf' },
      { id: 'notes', value: 'Meeting Notes.txt' },
    ],
  },
  {
    id: 'images',
    value: 'Images',
    items: [
      { id: 'logo', value: 'logo.png' },
    ],
  },
]

export function App() {
  return (
    <ThemeProvider>
      <Tree data={data} onSelect={(id) => console.log('selected', id)} />
    </ThemeProvider>
  )
}
```

## TreeGrid

```tsx
import { TreeGrid } from '@itsmemyk/react-tree-grid/treegrid'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { GridColumn } from '@itsmemyk/react-tree-grid/grid'
import type { TreeGridRow } from '@itsmemyk/react-tree-grid/treegrid'

interface OrgRow extends TreeGridRow {
  name: string
  role: string
  headcount: number
}

const columns: GridColumn<OrgRow>[] = [
  { id: 'name', header: [{ text: 'Name' }], width: 200 },
  { id: 'role', header: [{ text: 'Role' }], width: 160 },
  { id: 'headcount', header: [{ text: 'Headcount' }], width: 100 },
]

const data: OrgRow[] = [
  { id: 'ceo', name: 'Alice', role: 'CEO', headcount: 120, $opened: true },
  { id: 'cto', name: 'Bob', role: 'CTO', headcount: 45, parent: 'ceo', $opened: true },
  { id: 'fe', name: 'Carol', role: 'Frontend Lead', headcount: 12, parent: 'cto' },
  { id: 'be', name: 'Dan', role: 'Backend Lead', headcount: 18, parent: 'cto' },
]

export function App() {
  return (
    <ThemeProvider>
      <TreeGrid
        columns={columns}
        data={data}
        treeColumnId="name"
        style={{ width: 500, height: 300 }}
      />
    </ThemeProvider>
  )
}
```

::: tip
Pass `style={{ width, height }}` to enable virtual scrolling. Without explicit dimensions the grid renders all rows.
:::
