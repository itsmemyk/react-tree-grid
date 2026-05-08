# Basic Grid

A minimal Grid with typed columns and data.

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
  { id: '3', name: 'Carol', department: 'Engineering', salary: 92000 },
  { id: '4', name: 'Dan', department: 'Product', salary: 110000 },
]

export function BasicGrid() {
  return (
    <ThemeProvider theme="light">
      <Grid
        columns={columns}
        data={data}
        style={{ width: 500, height: 300 }}
      />
    </ThemeProvider>
  )
}
```
