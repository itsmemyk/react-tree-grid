# Shared Types

All types are available from the root or sub-path imports.

## GridColumn

```ts
import type { GridColumn } from '@itsmemyk/react-tree-grid/grid'
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Matches a key in row data (required) |
| `header` | `GridHeaderCell[]` | Header row cells |
| `footer` | `GridFooterCell[]` | Footer row cells |
| `width` | `number` | Fixed column width in px |
| `minWidth` | `number` | Minimum resize width |
| `maxWidth` | `number` | Maximum resize width |
| `hidden` | `boolean` | Hide column |
| `sortable` | `boolean` | Enable sort on this column |
| `resizable` | `boolean` | Enable resize handle |
| `type` | `GridColumnType` | Value type for render and sort |
| `editorType` | `GridEditorType` | Editor widget when `editable` is on |
| `template` | `(value, row, col) => ReactNode` | Custom cell renderer |
| `align` | `'left' \| 'center' \| 'right'` | Cell text alignment |
| `adjust` | `boolean \| 'data' \| 'header' \| 'footer'` | Per-column auto-fit |
| `autoWidth` | `boolean` | Participate in auto-width distribution |
| `tooltip` | `boolean` | Override grid-level tooltip for this column |
| `tooltipTemplate` | `(value, row, col) => string \| null` | Custom tooltip content |
| `mark` | `GridMarkConfig` | Auto-apply CSS class based on value range or function |
| `groupable` | `boolean` | Allow this column to be dragged into the grouping panel (`false` to opt out) |

## GridRow

```ts
import type { GridRow } from '@itsmemyk/react-tree-grid/grid'
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (required) |
| `hidden` | `boolean` | Hide row without removing from data |
| `$height` | `number` | Override row height in px |
| `$css` | `string` | Extra CSS class on this row |
| `[key: string]` | `unknown` | Any additional data fields |

## TreeGridRow

```ts
import type { TreeGridRow } from '@itsmemyk/react-tree-grid/treegrid'
```

Extends `GridRow` with:

| Field | Type | Description |
|---|---|---|
| `parent` | `string` | Parent row ID (flat structure) |
| `items` | `TreeGridRow[]` | Nested children (nested structure) |
| `$opened` | `boolean` | Start node expanded |

## TreeNode

```ts
import type { TreeNode } from '@itsmemyk/react-tree-grid/tree'
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (required) |
| `value` | `string` | Display label (required) |
| `icon` | `ReactNode` | Custom icon |
| `items` | `TreeNode[]` | Child nodes |
| `disabled` | `boolean` | Disable interaction |
| `$opened` | `boolean` | Start expanded |

## GridSpan

```ts
import type { GridSpan } from '@itsmemyk/react-tree-grid/grid'

interface GridSpan {
  row: string       // row ID
  column: string    // column ID (top-left cell of span)
  rowspan?: number  // rows to span
  colspan?: number  // columns to span
  text?: string     // override cell text
  css?: string      // extra CSS class
  tooltip?: string  // tooltip text
}
```

## GroupAggregateConfig

```ts
import type { GroupAggregateConfig } from '@itsmemyk/react-tree-grid/treegrid'

type GroupAggregateConfig = Record<string, 'sum' | 'avg' | 'count' | 'min' | 'max'>
```

Maps a column ID to an aggregate function. Used with the `groupAggregate` prop on `TreeGrid`.

```tsx
groupAggregate={{ salary: 'avg', headcount: 'count' }}
```

## SortState

```ts
interface SortState {
  columnId: string
  order: 'asc' | 'desc'
}
```
