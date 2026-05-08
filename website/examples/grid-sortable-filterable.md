# Sortable & Filterable Grid

Columns with sort and header filters. Click a header to sort; type in the filter row to filter.

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
  {
    id: 'name',
    header: [{ text: 'Name' }, { content: 'inputFilter' }],
    width: 180,
    sortable: true,
  },
  {
    id: 'department',
    header: [{ text: 'Department' }, { content: 'selectFilter' }],
    width: 160,
    sortable: true,
  },
  {
    id: 'salary',
    header: [{ text: 'Salary' }, { content: 'inputFilter' }],
    footer: [{ content: 'sum', template: (v) => `Total: $${v.toLocaleString()}` }],
    width: 140,
    sortable: true,
  },
]

const data: Employee[] = [
  { id: '1', name: 'Alice', department: 'Engineering', salary: 95000 },
  { id: '2', name: 'Bob', department: 'Design', salary: 85000 },
  { id: '3', name: 'Carol', department: 'Engineering', salary: 92000 },
  { id: '4', name: 'Dan', department: 'Product', salary: 110000 },
]

export function SortableFilterableGrid() {
  return (
    <ThemeProvider>
      <Grid
        columns={columns}
        data={data}
        style={{ width: 520, height: 320 }}
      />
    </ThemeProvider>
  )
}
```
