# Tree

Hierarchical list with expand/collapse, checkboxes, and drag-and-drop.

## Import

```ts
import { Tree } from '@itsmemyk/react-tree-grid/tree'
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `TreeNode[]` | — | Tree data (required) |
| `checkbox` | `boolean` | `false` | Show checkboxes on all nodes |
| `editable` | `boolean` | `false` | Allow double-click to rename labels |
| `dragItem` | `'item' \| 'both'` | — | `'item'`: nodes are drag sources; `'both'`: sources and drop targets |
| `virtual` | `boolean` | `false` | Enable virtual scrolling for flat trees |
| `expanded` | `string[]` | — | Controlled expanded node IDs |
| `defaultExpanded` | `string[]` | — | Initial expanded state (uncontrolled) |
| `selected` | `string[]` | — | Controlled selected node IDs |
| `checked` | `string[]` | — | Controlled checked node IDs |
| `css` | `string` | — | Extra CSS class on root element |

## Events

| Prop | Signature | Description |
|---|---|---|
| `onSelect` | `(id: string) => void` | Fires when a node is clicked |
| `onCheck` | `(ids: string[]) => void` | Fires when a checkbox changes; receives full checked set |
| `onExpand` | `(id: string) => void` | Fires when a node is expanded |
| `onCollapse` | `(id: string) => void` | Fires when a node is collapsed |
| `onEdit` | `(id: string, newValue: string) => void` | Fires after label edit confirmed |
| `onDrop` | `(dragId, targetId, position) => void` | Fires after drag-drop; `position`: `'before' \| 'after' \| 'inside'` |

## TreeRef (ref)

```tsx
import { useRef } from 'react'
import type { TreeRef } from '@itsmemyk/react-tree-grid/tree'

const ref = useRef<TreeRef>(null)

<Tree ref={ref} data={data} />
```

| Method | Signature | Description |
|---|---|---|
| `expand` | `(id: string) => void` | Expand a node |
| `collapse` | `(id: string) => void` | Collapse a node |
| `expandAll` | `() => void` | Expand all nodes |
| `collapseAll` | `() => void` | Collapse all nodes |
| `select` | `(ids: string[]) => void` | Set selected nodes |
| `check` | `(ids: string[]) => void` | Set checked nodes |
