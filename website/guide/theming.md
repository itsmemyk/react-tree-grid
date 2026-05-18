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

Every key in `overrides` maps directly to a CSS variable (see the [full reference](#css-variables-reference) below).

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

## Overriding via CSS

You don't need `ThemeProvider` to customise the look. Every token is a CSS custom property set on the theme root element. Override them on any ancestor element and they cascade into the grid:

```css
/* globals.css */
.my-grid-wrapper {
  --react-tree-grid-color-primary: #e91e63;
  --react-tree-grid-color-header-background: #1a237e;
  --react-tree-grid-color-header-text: #ffffff;
  --react-tree-grid-font-family: 'Roboto', sans-serif;
  --react-tree-grid-radius-md: '2px';
}
```

```tsx
<div className="my-grid-wrapper">
  <ThemeProvider>
    <Grid columns={columns} data={data} style={{ height: 400 }} />
  </ThemeProvider>
</div>
```

::: tip
CSS overrides take precedence over `ThemeProvider` because they are applied on an ancestor element and the browser cascade resolves them first.
:::

## CSS Variables Reference

All tokens follow the naming convention `--react-tree-grid-{token-in-kebab-case}`. The table below lists every variable, its default light-theme value, and what it controls.

### Colour

| CSS Variable | Light default | Description |
|---|---|---|
| `--react-tree-grid-color-primary` | `#1976d2` | Primary accent — sort arrows, selection highlight, active states |
| `--react-tree-grid-color-primary-hover` | `#1565c0` | Hovered state of primary-coloured elements |
| `--react-tree-grid-color-secondary` | `#9c27b0` | Secondary accent colour |
| `--react-tree-grid-color-danger` | `#d32f2f` | Destructive / error colour |
| `--react-tree-grid-color-success` | `#2e7d32` | Success / positive colour |
| `--react-tree-grid-color-warning` | `#ed6c02` | Warning colour |
| `--react-tree-grid-color-background` | `#ffffff` | Page / container background |
| `--react-tree-grid-color-surface` | `#f5f5f5` | Alternating row, footer, and group panel background |
| `--react-tree-grid-color-text` | `#212121` | Primary text colour |
| `--react-tree-grid-color-text-secondary` | `#757575` | Muted / secondary text colour |
| `--react-tree-grid-color-border` | `#e0e0e0` | Cell and container border colour |

### Header

| CSS Variable | Light default | Description |
|---|---|---|
| `--react-tree-grid-color-header-background` | `#f5f5f5` | Header row background colour |
| `--react-tree-grid-color-header-text` | `#212121` | Header cell text colour |
| `--react-tree-grid-color-row-hover` | `rgba(0,0,0,0.04)` | Row and header-cell hover tint |
| `--react-tree-grid-color-row-selected` | `rgba(25,118,210,0.08)` | Selected row background tint |
| `--react-tree-grid-color-sort-idle` | `rgba(0,0,0,0.35)` | Idle (unsorted column) sort-arrow colour |

::: tip Styling the header
`--react-tree-grid-color-header-background` and `--react-tree-grid-color-header-text` are the dedicated tokens for the column header row. Set them independently of the rest of the surface colours:

```tsx
<ThemeProvider
  theme="light"
  overrides={{
    colorHeaderBackground: '#1976d2',
    colorHeaderText: '#ffffff',
  }}
>
  <Grid ... />
</ThemeProvider>
```
:::

### Typography

| CSS Variable | Light default | Description |
|---|---|---|
| `--react-tree-grid-font-family` | `system-ui, …` | Font stack for all grid text |
| `--react-tree-grid-font-size-sm` | `12px` | Small text (tooltips, badges) |
| `--react-tree-grid-font-size-md` | `14px` | Default cell and header text size |
| `--react-tree-grid-font-size-lg` | `16px` | Large text |
| `--react-tree-grid-font-weight-normal` | `400` | Regular weight |
| `--react-tree-grid-font-weight-medium` | `500` | Header and label weight |
| `--react-tree-grid-font-weight-bold` | `700` | Bold weight |

### Spacing

| CSS Variable | Light default | Description |
|---|---|---|
| `--react-tree-grid-spacing-xs` | `4px` | Extra-small gap |
| `--react-tree-grid-spacing-sm` | `8px` | Small gap / cell padding |
| `--react-tree-grid-spacing-md` | `16px` | Medium gap |
| `--react-tree-grid-spacing-lg` | `24px` | Large gap |
| `--react-tree-grid-spacing-xl` | `32px` | Extra-large gap |

### Shape

| CSS Variable | Light default | Description |
|---|---|---|
| `--react-tree-grid-radius-sm` | `2px` | Small border-radius (cells) |
| `--react-tree-grid-radius-md` | `4px` | Medium border-radius (inputs, dropdowns) |
| `--react-tree-grid-radius-lg` | `8px` | Large border-radius (modals, badges) |

### Shadow

| CSS Variable | Light default | Description |
|---|---|---|
| `--react-tree-grid-shadow-sm` | `0 1px 3px rgba(0,0,0,0.12)` | Subtle shadow (tooltips) |
| `--react-tree-grid-shadow-md` | `0 4px 6px rgba(0,0,0,0.12)` | Medium shadow (dropdowns) |
| `--react-tree-grid-shadow-lg` | `0 8px 24px rgba(0,0,0,0.16)` | Heavy shadow (modals) |

### Z-index

| CSS Variable | Light default | Description |
|---|---|---|
| `--react-tree-grid-z-index-dropdown` | `1000` | Dropdown menus |
| `--react-tree-grid-z-index-modal` | `1100` | Modals |
| `--react-tree-grid-z-index-popup` | `1200` | Popups |
| `--react-tree-grid-z-index-tooltip` | `1300` | Tooltips |

## Matching a UI library's look

Use `overrides` to make the grid blend into an existing design system. Pass only the tokens that differ — everything else inherits from the base theme.

**Bootstrap 5**

```tsx
<ThemeProvider
  theme="light"
  overrides={{
    colorPrimary: '#0d6efd',
    colorSuccess: '#198754',
    colorWarning: '#ffc107',
    colorDanger: '#dc3545',
    colorSurface: '#f8f9fa',
    colorBorder: '#dee2e6',
    colorText: '#212529',
    colorTextSecondary: '#6c757d',
    colorHeaderBackground: '#0d6efd',
    colorHeaderText: '#ffffff',
    fontSizeMd: '16px',
    radiusMd: '6px',
    radiusLg: '12px',
  }}
>
  <Grid ... />
</ThemeProvider>
```

**Material UI**

```tsx
<ThemeProvider
  theme="light"
  overrides={{
    colorPrimary: '#1976d2',
    colorSurface: '#fafafa',
    colorBorder: 'rgba(0,0,0,0.12)',
    colorHeaderBackground: '#673ab7',
    colorHeaderText: '#ffffff',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightMedium: '500',
    radiusSm: '0px',
  }}
>
  <Grid ... />
</ThemeProvider>
```

See the **Styling** story in the [live demo](https://itsmemyk.github.io/react-tree-grid/?path=/story/grid--styling) for an interactive comparison.
