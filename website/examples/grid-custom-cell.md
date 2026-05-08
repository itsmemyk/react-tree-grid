# Custom Cell Renderer

Use the `template` function on a column to render any React content inside a cell.

```tsx
import { Grid } from '@itsmemyk/react-tree-grid/grid'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { GridColumn, GridRow } from '@itsmemyk/react-tree-grid/grid'

interface Employee extends GridRow {
  name: string
  avatar: string
  status: 'active' | 'inactive' | 'pending'
  salary: number
}

const statusColor: Record<string, string> = {
  active: '#22c55e',
  inactive: '#ef4444',
  pending: '#f59e0b',
}

const columns: GridColumn<Employee>[] = [
  {
    id: 'name',
    header: [{ text: 'Employee' }],
    width: 200,
    template: (_, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src={row.avatar}
          alt={row.name}
          style={{ width: 28, height: 28, borderRadius: '50%' }}
        />
        <span>{row.name}</span>
      </div>
    ),
  },
  {
    id: 'status',
    header: [{ text: 'Status' }],
    width: 110,
    template: (value) => (
      <span
        style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 600,
          background: statusColor[String(value)] + '22',
          color: statusColor[String(value)],
          textTransform: 'capitalize',
        }}
      >
        {String(value)}
      </span>
    ),
  },
  {
    id: 'salary',
    header: [{ text: 'Salary' }],
    width: 130,
    align: 'right',
    template: (value) => `$${Number(value).toLocaleString()}`,
  },
]

const data: Employee[] = [
  { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/40?u=alice', status: 'active', salary: 95000 },
  { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/40?u=bob', status: 'inactive', salary: 85000 },
  { id: '3', name: 'Carol', avatar: 'https://i.pravatar.cc/40?u=carol', status: 'pending', salary: 92000 },
]

export function CustomCellGrid() {
  return (
    <ThemeProvider>
      <Grid
        columns={columns}
        data={data}
        style={{ width: 480, height: 240 }}
      />
    </ThemeProvider>
  )
}
```
