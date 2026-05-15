# Grid

High-performance flat data grid component.

## Import

```ts
import { Grid } from '@itsmemyk/react-tree-grid/grid'
```

## Props

### Data

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `GridColumn[]` | — | Column definitions (required) |
| `data` | `GridRow[]` | — | Row data array (required unless `store` is set) |
| `store` | `DataStore` | — | Data store for large/server-driven datasets |
| `spans` | `GridSpan[]` | — | Cell span definitions |

### Layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | `CSSProperties` | — | Set `width` and `height` to enable virtual scroll |
| `className` | `string` | — | Extra CSS class on root element |
| `rowHeight` | `number` | `34` | Default row height in px |
| `headerRowHeight` | `number` | — | Header row height in px |
| `footerRowHeight` | `number` | — | Footer row height in px |
| `autoWidth` | `boolean` | `false` | Distribute remaining width across flexible columns |
| `autoHeight` | `boolean` | `false` | Wrap rows to tallest cell height |
| `headerAutoHeight` | `boolean` | `false` | Wrap header to tallest cell |
| `adjust` | `boolean \| 'data' \| 'header' \| 'footer'` | — | Auto-fit column widths |

### Behaviour

| Prop | Type | Default | Description |
|---|---|---|---|
| `sortable` | `boolean` | `false` | Enable sorting on all columns |
| `editable` | `boolean` | `false` | Enable inline cell editing |
| `tooltip` | `boolean` | `false` | Show cell value tooltip on overflow |
| `keyNavigation` | `boolean` | `false` | Arrow key navigation between cells |
| `selection` | `boolean \| 'row' \| 'cell' \| 'complex'` | `false` | Selection mode |
| `multiselection` | `boolean` | `false` | Allow multi-row/cell selection |
| `leftSplit` | `number` | — | Freeze N columns from the left |
| `rightSplit` | `number` | — | Freeze N columns from the right |
| `topSplit` | `number` | — | Freeze N header rows from the top |
| `dragItem` | `'row' \| 'column'` | — | Enable drag-and-drop for rows or columns |
| `dragMode` | `'source' \| 'target' \| 'both'` | — | Drag role of this grid |
| `formulas` | `boolean` | `false` | Enable formula engine in cells |

### Grouping

| Prop | Type | Default | Description |
|---|---|---|---|
| `groupable` | `boolean` | `false` | Show the Group by panel and allow column headers to be dragged into it |
| `group` | `{ order: string[] }` | — | Initial grouping state — array of column IDs in nesting order |
| `onBeforeGroupChange` | `(order: string[]) => boolean \| void` | — | Return `false` to cancel a grouping change |
| `onGroupChange` | `(order: string[]) => void` | — | Fires after grouping order changes |

Set `groupable: false` on a `GridColumn` to opt that column out of the drag panel.

See the [Grouping guide](/guide/grouping) for usage examples.

### Events

#### Sort
| Prop | Signature | Description |
|---|---|---|
| `onBeforeSort` | `(states: SortState[]) => boolean \| void` | Return `false` to cancel sort |
| `onAfterSort` | `(states: SortState[]) => void` | Fires after sort applied |

#### Selection
| Prop | Signature | Description |
|---|---|---|
| `onBeforeSelect` | `(rowId, colId) => boolean \| void` | Return `false` to cancel |
| `onAfterSelect` | `(rowId, colId) => void` | Fires after selection |
| `onBeforeUnSelect` | `(rowId, colId) => boolean \| void` | |
| `onAfterUnSelect` | `(rowId, colId) => void` | |
| `onCellClick` | `(rowId, colId, event) => void` | Cell single click |
| `onCellDblClick` | `(rowId, colId, event) => void` | Cell double click |

#### Editing
| Prop | Signature | Description |
|---|---|---|
| `onBeforeEditStart` | `(rowId, colId) => boolean \| void` | Return `false` to prevent editing |
| `onAfterEditStart` | `(rowId, colId) => void` | |
| `onBeforeEditEnd` | `(rowId, colId, newValue, oldValue) => boolean \| void` | Return `false` to reject value |
| `onAfterEditEnd` | `(rowId, colId, newValue) => void` | Fires after value saved |

#### Column resize
| Prop | Signature | Description |
|---|---|---|
| `onBeforeResizeStart` | `(colId) => boolean \| void` | |
| `onResize` | `(colId, width) => void` | Fires during drag |
| `onAfterResizeEnd` | `(colId, width) => void` | Fires after drag ends |

#### Row drag
| Prop | Signature | Description |
|---|---|---|
| `onBeforeRowDrag` | `(data, event) => boolean \| void` | |
| `onDragRowStart` | `(data, event) => void` | |
| `canRowDrop` | `(data, event) => boolean \| void` | Return `false` to reject drop target |
| `onBeforeRowDrop` | `(data, event) => boolean \| void` | |
| `onAfterRowDrop` | `(data, event) => void` | |
| `onAfterRowDrag` | `(data, event) => void` | |

#### Column drag
| Prop | Signature | Description |
|---|---|---|
| `onBeforeColumnDrag` | `(data, event) => boolean \| void` | |
| `onDragColumnStart` | `(data, event) => void` | |
| `canColumnDrop` | `(data, event) => boolean \| void` | |
| `onBeforeColumnDrop` | `(data, event) => boolean \| void` | |
| `onAfterColumnDrop` | `(data, event) => void` | |

#### Scroll
| Prop | Signature | Description |
|---|---|---|
| `onScroll` | `({ x, y }) => void` | Fires on scroll |

## GridApi (ref)

Pass a `ref` to access the imperative API:

```tsx
import { useRef } from 'react'
import type { GridApi } from '@itsmemyk/react-tree-grid/grid'

const ref = useRef<GridApi>(null)

<Grid ref={ref} columns={columns} data={data} />
```

| Method | Signature | Description |
|---|---|---|
| `showColumn` | `(colId: string) => void` | Make a hidden column visible |
| `hideColumn` | `(colId: string) => void` | Hide a column |
| `getColumn` | `(colId: string) => GridColumn \| undefined` | Get column definition |
| `setColumns` | `(columns: GridColumn[]) => void` | Replace all column definitions |
| `addRowCss` | `(rowId, css) => void` | Add a CSS class to a row |
| `removeRowCss` | `(rowId, css) => void` | Remove a CSS class from a row |
| `addCellCss` | `(rowId, colId, css) => void` | Add a CSS class to a cell |
| `removeCellCss` | `(rowId, colId, css) => void` | Remove a CSS class from a cell |
| `groupBy` | `(columnIds: string[]) => void` | Set the active grouping order programmatically |
| `clearGroups` | `() => void` | Remove all active groupings |
