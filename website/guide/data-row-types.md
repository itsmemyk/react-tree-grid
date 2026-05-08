# Data & Row Types

## GridRow

Every row object must extend `GridRow`, which requires an `id: string` field:

```ts
import type { GridRow } from '@itsmemyk/react-tree-grid/grid'

interface Product extends GridRow {
  name: string
  price: number
  inStock: boolean
}
```

`GridRow` also supports these reserved keys:

| Key | Type | Description |
|---|---|---|
| `id` | `string` | Unique row identifier (required) |
| `hidden` | `boolean` | Hide this row without removing it |
| `$height` | `number` | Override row height in pixels |
| `$css` | `string` | Extra CSS class applied to the row |

## TreeGridRow

`TreeGridRow` extends `GridRow` with hierarchy fields:

```ts
import type { TreeGridRow } from '@itsmemyk/react-tree-grid/treegrid'

interface OrgRow extends TreeGridRow {
  name: string
  role: string
}
```

Additional fields:

| Key | Type | Description |
|---|---|---|
| `parent` | `string` | ID of parent row (omit for root rows) |
| `items` | `TreeGridRow[]` | Nested children (alternative to flat `parent` references) |
| `$opened` | `boolean` | Whether this node starts expanded |

You can mix `parent` references (flat array) and nested `items` — the grid normalises both.

## TreeNode

Used by the `Tree` component:

```ts
import type { TreeNode } from '@itsmemyk/react-tree-grid/tree'

const nodes: TreeNode[] = [
  {
    id: 'root',
    value: 'Documents',
    $opened: true,
    items: [
      { id: 'file1', value: 'Report.pdf' },
    ],
  },
]
```

| Key | Type | Description |
|---|---|---|
| `id` | `string` | Unique node identifier |
| `value` | `string` | Display label |
| `icon` | `ReactNode` | Custom icon before the label |
| `items` | `TreeNode[]` | Child nodes |
| `disabled` | `boolean` | Disable interaction |
| `$opened` | `boolean` | Start expanded |

## Using a DataStore

For large or server-driven datasets, pass a `DataStore` instead of a plain array:

```ts
import { DataStore } from '@itsmemyk/react-tree-grid'

const store = new DataStore({ data: largeArray })

<Grid columns={columns} store={store} style={{ width: 800, height: 600 }} />
```

`DataStore` supports filtering, sorting, and pagination without re-rendering the full dataset.
