# Basic TreeGrid

Hierarchical rows with a tree expand column.

```tsx
import { TreeGrid } from '@itsmemyk/react-tree-grid/treegrid'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { GridColumn } from '@itsmemyk/react-tree-grid/grid'
import type { TreeGridRow } from '@itsmemyk/react-tree-grid/treegrid'

interface OrgRow extends TreeGridRow {
  name: string
  role: string
  location: string
}

const columns: GridColumn<OrgRow>[] = [
  { id: 'name', header: [{ text: 'Name' }], width: 200 },
  { id: 'role', header: [{ text: 'Role' }], width: 160 },
  { id: 'location', header: [{ text: 'Location' }], width: 140 },
]

const data: OrgRow[] = [
  { id: 'ceo', name: 'Alice', role: 'CEO', location: 'New York', $opened: true },
  { id: 'cto', name: 'Bob', role: 'CTO', location: 'San Francisco', parent: 'ceo', $opened: true },
  { id: 'fe', name: 'Carol', role: 'Frontend Lead', location: 'Remote', parent: 'cto' },
  { id: 'be', name: 'Dan', role: 'Backend Lead', location: 'Austin', parent: 'cto' },
  { id: 'cmo', name: 'Eve', role: 'CMO', location: 'New York', parent: 'ceo' },
]

export function BasicTreeGrid() {
  return (
    <ThemeProvider>
      <TreeGrid
        columns={columns}
        data={data}
        treeColumnId="name"
        style={{ width: 540, height: 280 }}
      />
    </ThemeProvider>
  )
}
```
