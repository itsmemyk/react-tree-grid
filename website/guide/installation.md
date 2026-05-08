# Installation

## Requirements

- React 18 or later
- React DOM 18 or later
- Node 18+ (for development)

## Install

::: code-group

```bash [npm]
npm install @itsmemyk/react-tree-grid
```

```bash [yarn]
yarn add @itsmemyk/react-tree-grid
```

```bash [pnpm]
pnpm add @itsmemyk/react-tree-grid
```

:::

## Imports

The package supports a single entry point and sub-path imports for tree-shaking:

```ts
// All components from one import
import { Grid, Tree, TreeGrid, ThemeProvider } from '@itsmemyk/react-tree-grid'

// Tree-shakeable sub-path imports (recommended)
import { Grid } from '@itsmemyk/react-tree-grid/grid'
import { Tree } from '@itsmemyk/react-tree-grid/tree'
import { TreeGrid } from '@itsmemyk/react-tree-grid/treegrid'
```

## TypeScript

Types are bundled — no `@types/` package needed. All props, events, and data types are fully typed.

```ts
import type { GridColumn, GridRow } from '@itsmemyk/react-tree-grid/grid'
import type { TreeNode } from '@itsmemyk/react-tree-grid/tree'
import type { TreeGridRow } from '@itsmemyk/react-tree-grid/treegrid'
```
