# Basic Tree

A file-explorer-style tree with expand/collapse.

```tsx
import { Tree } from '@itsmemyk/react-tree-grid/tree'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { TreeNode } from '@itsmemyk/react-tree-grid/tree'

const data: TreeNode[] = [
  {
    id: 'docs',
    value: 'Documents',
    $opened: true,
    items: [
      { id: 'report', value: 'Q4 Report.pdf' },
      { id: 'notes', value: 'Meeting Notes.txt' },
      {
        id: 'projects',
        value: 'Projects',
        items: [
          { id: 'alpha', value: 'Project Alpha.docx' },
          { id: 'beta', value: 'Project Beta.docx' },
        ],
      },
    ],
  },
  {
    id: 'images',
    value: 'Images',
    items: [
      { id: 'logo', value: 'logo.png' },
      { id: 'banner', value: 'banner.jpg' },
    ],
  },
]

export function BasicTree() {
  return (
    <ThemeProvider>
      <Tree
        data={data}
        onSelect={(id) => console.log('selected:', id)}
        onExpand={(id) => console.log('expanded:', id)}
        onCollapse={(id) => console.log('collapsed:', id)}
      />
    </ThemeProvider>
  )
}
```
