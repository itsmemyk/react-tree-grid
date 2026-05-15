# Grouping

## Grid — drag-panel grouping

Enable the grouping panel by adding `groupable` to the Grid:

```tsx
<Grid columns={columns} data={data} groupable />
```

A **Group by:** strip appears above the header row. Drag any column header into it to group rows by that column's value. Each group header row shows a chevron toggle, the group value, and the leaf-row count — e.g. `Dog (43)`.

### Initial grouping state

Use the `group` prop to set the starting grouping without waiting for user interaction:

```tsx
<Grid
  columns={columns}
  data={data}
  groupable
  group={{ order: ['animal_type', 'status'] }}
/>
```

The array order sets the nesting priority — the first entry is the outermost group level.

### Sorting within groups

Each chip in the panel has a sort-direction button that cycles through three states:

| Icon | State | Meaning |
|---|---|---|
| ⇅ | idle | Ascending (default) |
| ↑ | asc | Ascending explicitly |
| ↓ | desc | Descending |

This controls the order of group header rows at that level. Regular column-header sorting still works on leaf rows inside groups and is preserved when you drag a column into the panel.

### Reordering and removing groups

Chips are draggable — drop one onto another chip to change priority. Click **✕** on a chip to remove that grouping level.

### Opting a column out of grouping

Set `groupable: false` on a column to prevent it from appearing as a drag target:

```ts
const columns = [
  { id: 'id', header: [{ text: 'ID' }], groupable: false },
  { id: 'name', header: [{ text: 'Name' }] },
]
```

### Group events

```tsx
<Grid
  columns={columns}
  data={data}
  groupable
  onBeforeGroupChange={(order) => {
    // order: string[] — the incoming grouping column IDs
    // return false to cancel the change
  }}
  onGroupChange={(order) => {
    console.log('group order changed', order)
  }}
/>
```

### Programmatic control

Access the imperative API via a ref:

```tsx
import { useRef } from 'react'
import type { GridApi } from '@itsmemyk/react-tree-grid/grid'

const ref = useRef<GridApi>(null)

// Group by one or more columns
ref.current?.groupBy(['animal_type', 'status'])

// Clear all groups
ref.current?.clearGroups()

<Grid ref={ref} columns={columns} data={data} groupable />
```

---

## TreeGrid — static grouping

TreeGrid supports a simpler, data-driven grouping mode via the `groupBy` prop. Rows are grouped by the field value without a drag UI:

```tsx
// Single-level grouping
<TreeGrid
  columns={columns}
  data={data}
  treeColumnId="name"
  groupBy="dept"
/>

// Multi-level grouping
<TreeGrid
  columns={columns}
  data={data}
  treeColumnId="name"
  groupBy={['dept', 'status']}
/>
```

### Aggregation

Use `groupAggregate` to display computed values on group header rows:

```tsx
<TreeGrid
  columns={columns}
  data={data}
  treeColumnId="name"
  groupBy="dept"
  groupAggregate={{ salary: 'avg', headcount: 'count' }}
/>
```

Available aggregate functions: `'sum'`, `'avg'`, `'count'`, `'min'`, `'max'`.

The type is `GroupAggregateConfig = Record<string, 'sum' | 'avg' | 'count' | 'min' | 'max'>`.
