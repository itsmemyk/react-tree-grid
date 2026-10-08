# Pinned Rows

Use `pinnedTopRows` and `pinnedBottomRows` to pin specific rows by ID. Pinned rows leave the scrollable area and stay visible while the rest of the data scrolls vertically; they still scroll horizontally with the body and work with frozen columns, selection, inline editing and tooltips.

```tsx
import { useState } from 'react'
import { Grid } from '@itsmemyk/react-tree-grid/grid'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { GridColumn, GridRow } from '@itsmemyk/react-tree-grid/grid'

interface Account extends GridRow {
  name: string
  balance: number
}

const columns: GridColumn<Account>[] = [
  { id: 'name', header: [{ text: 'Account' }], width: 200 },
  { id: 'balance', header: [{ text: 'Balance' }], width: 140, align: 'right' },
]

const data: Account[] = [
  { id: 'total', name: 'Total', balance: 128400 },
  ...Array.from({ length: 200 }, (_, i) => ({
    id: String(i + 1),
    name: `Account ${i + 1}`,
    balance: 1000 + i * 37,
  })),
]

export function PinnedRowsGrid() {
  const [pinned, setPinned] = useState<string[]>([])

  return (
    <ThemeProvider>
      <Grid
        columns={columns}
        data={data}
        pinnedTopRows={pinned}
        pinnedBottomRows={['total']}
        selection="row"
        onCellDblClick={(rowId) =>
          setPinned((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
        }
        style={{ width: 380, height: 320 }}
      />
    </ThemeProvider>
  )
}
```

## Rules

- Rows appear in the panel in the order their IDs are listed.
- Each ID pins once. An ID listed in both props pins to the top; IDs that match no row are ignored.
- Pinned rows are controlled props: update the arrays to pin or unpin.
- Pinned rows stay visible when a store filter would hide them, and they sit outside grouping, so collapsing a group never hides them. Rows with `hidden: true` are not shown.
- `topSplit` / `bottomSplit` freeze the first / last *unpinned* rows, below / above the pinned ones.
- Pinned rows can't be dragged and aren't drop targets. Cell spans stay within the panel or body they start in.
