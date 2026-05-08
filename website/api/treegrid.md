# TreeGrid

Data grid with hierarchical rows shown in a tree column. Extends all `Grid` props.

## Import

```ts
import { TreeGrid } from '@itsmemyk/react-tree-grid/treegrid'
```

## Props

TreeGrid accepts all [Grid props](/api/grid) plus these additional ones:

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `TreeGridRow[]` | — | Hierarchical row data (required) |
| `treeColumnId` | `string` | — | Column ID that renders the expand toggle |
| `collapsed` | `boolean` | `false` | Start all nodes collapsed |
| `rootParent` | `string` | — | Root parent ID for partial tree rendering |
| `dropBehaviour` | `'child' \| 'sibling' \| 'complex'` | `'complex'` | How dropped rows are inserted |
| `dragExpand` | `boolean` | `false` | Auto-expand nodes when hovering during drag |
| `groupBy` | `string \| string[]` | — | Group flat rows by field value |
| `groupAggregate` | `GroupAggregateConfig` | — | Aggregation config for grouped rows |

## TreeGridRef (ref)

```tsx
import { useRef } from 'react'
import type { TreeGridRef } from '@itsmemyk/react-tree-grid/treegrid'

const ref = useRef<TreeGridRef>(null)

<TreeGrid ref={ref} columns={columns} data={data} treeColumnId="name" />
```

| Method | Signature | Description |
|---|---|---|
| `open` | `(id: string) => void` | Expand a row |
| `close` | `(id: string) => void` | Collapse a row |
| `openAll` | `() => void` | Expand all rows |
| `closeAll` | `() => void` | Collapse all rows |

## TreeGridRow

```ts
interface TreeGridRow extends GridRow {
  parent?: string        // parent row ID (flat structure)
  items?: TreeGridRow[]  // nested children (nested structure)
  $opened?: boolean      // start expanded
}
```

Both flat (`parent` references) and nested (`items`) data formats are accepted and can be mixed.
