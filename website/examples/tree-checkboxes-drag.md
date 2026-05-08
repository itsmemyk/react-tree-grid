# Tree with Checkboxes & Drag-and-Drop

Checkboxes for multi-selection and drag-and-drop to reorder nodes.

```tsx
import { useState } from 'react'
import { Tree } from '@itsmemyk/react-tree-grid/tree'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { TreeNode } from '@itsmemyk/react-tree-grid/tree'

const initialData: TreeNode[] = [
  {
    id: 'fruits',
    value: 'Fruits',
    $opened: true,
    items: [
      { id: 'apple', value: 'Apple' },
      { id: 'banana', value: 'Banana' },
      { id: 'cherry', value: 'Cherry' },
    ],
  },
  {
    id: 'veggies',
    value: 'Vegetables',
    $opened: true,
    items: [
      { id: 'carrot', value: 'Carrot' },
      { id: 'pea', value: 'Pea' },
    ],
  },
]

export function CheckboxDragTree() {
  const [checked, setChecked] = useState<string[]>([])

  return (
    <ThemeProvider>
      <p>Checked: {checked.join(', ') || 'none'}</p>
      <Tree
        data={initialData}
        checkbox
        dragItem="both"
        checked={checked}
        onCheck={setChecked}
        onDrop={(dragId, targetId, position) => {
          console.log(`Move ${dragId} ${position} ${targetId}`)
          // Update your data state here to persist the reorder
        }}
      />
    </ThemeProvider>
  )
}
```
