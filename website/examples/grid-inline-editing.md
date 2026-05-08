# Inline Editing

Double-click any cell to edit. `onAfterEditEnd` receives the new value so you can update your state.

```tsx
import { useState } from 'react'
import { Grid } from '@itsmemyk/react-tree-grid/grid'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { GridColumn, GridRow } from '@itsmemyk/react-tree-grid/grid'

interface Task extends GridRow {
  title: string
  status: string
  priority: string
}

const columns: GridColumn<Task>[] = [
  {
    id: 'title',
    header: [{ text: 'Title' }],
    width: 220,
    editorType: 'input',
  },
  {
    id: 'status',
    header: [{ text: 'Status' }],
    width: 140,
    editorType: 'select',
  },
  {
    id: 'priority',
    header: [{ text: 'Priority' }],
    width: 120,
    editorType: 'select',
  },
]

const initialData: Task[] = [
  { id: '1', title: 'Design system audit', status: 'In Progress', priority: 'High' },
  { id: '2', title: 'API documentation', status: 'Todo', priority: 'Medium' },
  { id: '3', title: 'Performance review', status: 'Done', priority: 'Low' },
]

export function InlineEditingGrid() {
  const [data, setData] = useState(initialData)

  return (
    <ThemeProvider>
      <Grid
        columns={columns}
        data={data}
        editable
        style={{ width: 520, height: 260 }}
        onAfterEditEnd={(rowId, colId, newValue) => {
          setData(prev =>
            prev.map(row =>
              row.id === rowId ? { ...row, [colId]: newValue } : row
            )
          )
        }}
      />
    </ThemeProvider>
  )
}
```
