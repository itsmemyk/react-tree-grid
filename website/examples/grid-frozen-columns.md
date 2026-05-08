# Frozen Columns

Use `leftSplit` and `rightSplit` to freeze columns on either side while the middle columns scroll.

```tsx
import { Grid } from '@itsmemyk/react-tree-grid/grid'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { GridColumn, GridRow } from '@itsmemyk/react-tree-grid/grid'

interface Report extends GridRow {
  name: string
  q1: number
  q2: number
  q3: number
  q4: number
  total: number
}

const columns: GridColumn<Report>[] = [
  { id: 'name', header: [{ text: 'Name' }], width: 160 },   // frozen left
  { id: 'q1', header: [{ text: 'Q1' }], width: 100 },
  { id: 'q2', header: [{ text: 'Q2' }], width: 100 },
  { id: 'q3', header: [{ text: 'Q3' }], width: 100 },
  { id: 'q4', header: [{ text: 'Q4' }], width: 100 },
  { id: 'total', header: [{ text: 'Total' }], width: 120 },  // frozen right
]

const data: Report[] = [
  { id: '1', name: 'Alice', q1: 12000, q2: 14000, q3: 13500, q4: 16000, total: 55500 },
  { id: '2', name: 'Bob',   q1: 9000,  q2: 10500, q3: 11000, q4: 12000, total: 42500 },
  { id: '3', name: 'Carol', q1: 15000, q2: 15500, q3: 14000, q4: 17000, total: 61500 },
]

export function FrozenColumnsGrid() {
  return (
    <ThemeProvider>
      <Grid
        columns={columns}
        data={data}
        leftSplit={1}
        rightSplit={1}
        style={{ width: 480, height: 260 }}
      />
    </ThemeProvider>
  )
}
```
