# ThemeProvider & Theming

All components read their visual design from the nearest `ThemeProvider` in the React tree. Wrap your app (or any subtree) with it.

## Basic usage

```tsx
import { ThemeProvider } from '@itsmemyk/react-tree-grid'

function App() {
  return (
    <ThemeProvider theme="light">
      {/* Grid, Tree, TreeGrid components */}
    </ThemeProvider>
  )
}
```

`theme` accepts `"light"` (default) or `"dark"`.

## Theme overrides

Pass `overrides` to customise individual design tokens without creating a full custom theme:

```tsx
<ThemeProvider
  theme="light"
  overrides={{
    colorPrimary: '#e91e63',
    fontFamily: 'Inter, sans-serif',
    radiusMd: '2px',
  }}
>
  {/* ... */}
</ThemeProvider>
```

## CSS custom properties

All theme tokens are exposed as CSS custom properties prefixed with `--react-tree-grid-`. You can read them from any CSS rule in your component:

```css
.my-cell {
  color: var(--react-tree-grid-color-text);
  padding: var(--react-tree-grid-spacing-md);
  border-radius: var(--react-tree-grid-radius-sm);
}
```

See the [ThemeProvider API](/api/theme-provider) for the full token list.

## Switching themes at runtime

```tsx
import { useState } from 'react'
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
import type { ThemeName } from '@itsmemyk/react-tree-grid'

function App() {
  const [theme, setTheme] = useState<ThemeName>('light')

  return (
    <ThemeProvider theme={theme}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      {/* components */}
    </ThemeProvider>
  )
}
```
