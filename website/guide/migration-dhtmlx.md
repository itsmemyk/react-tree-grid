# Migrating from DHTMLX TreeGrid

react-tree-grid is a drop-in open-source replacement for [DHTMLX TreeGrid](https://dhtmlx.com/docs/products/dhtmlxTreeGrid/). This page maps the most common DHTMLX API patterns to their react-tree-grid equivalents.

## Installation

```diff
- import { TreeGrid } from 'dhtmlx-treegrid'
+ import { TreeGrid } from '@itsmemyk/react-tree-grid/treegrid'
+ import { ThemeProvider } from '@itsmemyk/react-tree-grid'
```

## Initialisation

DHTMLX uses imperative DOM-based init; react-tree-grid is declarative React:

```diff
- const grid = new TreeGrid('container', {
-   columns: [...],
-   data: [...],
- })
+ <ThemeProvider>
+   <TreeGrid columns={columns} data={data} treeColumnId="name" />
+ </ThemeProvider>
```

## Column config

| DHTMLX | react-tree-grid |
|---|---|
| `id` | `id` |
| `header` array | `header` array of `GridHeaderCell` |
| `width` | `width` |
| `hidden` | `hidden: true` |
| `sortable` | `sortable: true` |
| `resizable` | `resizable: true` |
| `template` callback | `template: (value, row, col) => ReactNode` |
| `type: "date"` | `type: "date"` |
| `type: "checkbox"` | `type: "checkbox"` |
| `editorType` | `editorType` |

## Data format

DHTMLX uses flat arrays with `parent` references — react-tree-grid accepts the same:

```ts
// DHTMLX format — works as-is in react-tree-grid
const data = [
  { id: 'ceo', name: 'Alice', role: 'CEO' },
  { id: 'cto', name: 'Bob', role: 'CTO', parent: 'ceo' },
]
```

You can also use nested `items` arrays:

```ts
const data = [
  {
    id: 'ceo',
    name: 'Alice',
    role: 'CEO',
    $opened: true,
    items: [
      { id: 'cto', name: 'Bob', role: 'CTO' },
    ],
  },
]
```

## Events

DHTMLX uses string event names with `grid.events.on()`; react-tree-grid uses prop callbacks:

| DHTMLX | react-tree-grid prop |
|---|---|
| `afterSelect` | `onAfterSelect` |
| `beforeSelect` | `onBeforeSelect` |
| `afterEditEnd` | `onAfterEditEnd` |
| `beforeEditEnd` | `onBeforeEditEnd` |
| `afterSort` | `onAfterSort` |
| `beforeSort` | `onBeforeSort` |
| `afterColumnDrag` | `onAfterColumnDrag` |
| `afterRowDrag` | `onAfterRowDrag` |

## Imperative API

DHTMLX exposes methods directly on the grid instance. react-tree-grid uses the same method names via a `ref`:

```tsx
import { useRef } from 'react'
import type { GridApi } from '@itsmemyk/react-tree-grid/grid'

const apiRef = useRef<GridApi>(null)

// DHTMLX: grid.hideColumn('salary')
// react-tree-grid:
apiRef.current?.hideColumn('salary')

<Grid ref={apiRef} columns={columns} data={data} />
```

## Theming

DHTMLX themes are CSS files you import. react-tree-grid uses `ThemeProvider`:

```diff
- import 'dhtmlx-treegrid/codebase/skins/dhtmlxgrid_skyblue.css'
+ import { ThemeProvider } from '@itsmemyk/react-tree-grid'
+
+ <ThemeProvider theme="light">...</ThemeProvider>
```
