# ThemeProvider

Context provider that applies a light or dark theme to all descendant components.

## Import

```ts
import { ThemeProvider } from '@itsmemyk/react-tree-grid'
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `'light' \| 'dark'` | `'light'` | Base theme |
| `overrides` | `Partial<ThemeTokens>` | — | Token overrides applied on top of the base theme |
| `children` | `ReactNode` | — | Components to theme (required) |

## Theme tokens

All tokens become CSS custom properties as `--react-tree-grid-{token-in-kebab-case}`.

### Colour

| Token | CSS variable | Description |
|---|---|---|
| `colorPrimary` | `--react-tree-grid-color-primary` | Brand / accent colour |
| `colorPrimaryHover` | `--react-tree-grid-color-primary-hover` | Hover state of primary |
| `colorSecondary` | `--react-tree-grid-color-secondary` | Secondary accent |
| `colorDanger` | `--react-tree-grid-color-danger` | Error / destructive |
| `colorSuccess` | `--react-tree-grid-color-success` | Success state |
| `colorWarning` | `--react-tree-grid-color-warning` | Warning state |
| `colorBackground` | `--react-tree-grid-color-background` | Page / container background |
| `colorSurface` | `--react-tree-grid-color-surface` | Alternating row, footer, and group panel background |
| `colorHeaderBackground` | `--react-tree-grid-color-header-background` | Header row background colour |
| `colorHeaderText` | `--react-tree-grid-color-header-text` | Header cell text colour |
| `colorRowHover` | `--react-tree-grid-color-row-hover` | Row / header-cell hover background |
| `colorRowSelected` | `--react-tree-grid-color-row-selected` | Selected row background tint |
| `colorText` | `--react-tree-grid-color-text` | Primary text |
| `colorTextSecondary` | `--react-tree-grid-color-text-secondary` | Muted text |
| `colorBorder` | `--react-tree-grid-color-border` | Border colour |
| `colorSortActive` | `--react-tree-grid-color-sort-active` | Active (asc / desc) sort-arrow colour |
| `colorSortIdle` | `--react-tree-grid-color-sort-idle` | Idle (unsorted) sort-arrow colour |

### Typography

| Token | CSS variable | Description |
|---|---|---|
| `fontFamily` | `--react-tree-grid-font-family` | Base font stack |
| `fontSizeSm` | `--react-tree-grid-font-size-sm` | Small text |
| `fontSizeMd` | `--react-tree-grid-font-size-md` | Default text |
| `fontSizeLg` | `--react-tree-grid-font-size-lg` | Large text |
| `fontWeightNormal` | `--react-tree-grid-font-weight-normal` | |
| `fontWeightMedium` | `--react-tree-grid-font-weight-medium` | |
| `fontWeightBold` | `--react-tree-grid-font-weight-bold` | |

### Spacing

| Token | CSS variable |
|---|---|
| `spacingXs` | `--react-tree-grid-spacing-xs` |
| `spacingSm` | `--react-tree-grid-spacing-sm` |
| `spacingMd` | `--react-tree-grid-spacing-md` |
| `spacingLg` | `--react-tree-grid-spacing-lg` |
| `spacingXl` | `--react-tree-grid-spacing-xl` |

### Shape & Shadow

| Token | CSS variable |
|---|---|
| `radiusSm` | `--react-tree-grid-radius-sm` |
| `radiusMd` | `--react-tree-grid-radius-md` |
| `radiusLg` | `--react-tree-grid-radius-lg` |
| `shadowSm` | `--react-tree-grid-shadow-sm` |
| `shadowMd` | `--react-tree-grid-shadow-md` |
| `shadowLg` | `--react-tree-grid-shadow-lg` |

### Z-index

| Token | CSS variable |
|---|---|
| `zIndexDropdown` | `--react-tree-grid-z-index-dropdown` |
| `zIndexModal` | `--react-tree-grid-z-index-modal` |
| `zIndexPopup` | `--react-tree-grid-z-index-popup` |
| `zIndexTooltip` | `--react-tree-grid-z-index-tooltip` |

## Utility functions

```ts
import { tokenToCssVar, tokensToCssVars } from '@itsmemyk/react-tree-grid'

tokenToCssVar('colorPrimary')
// → '--react-tree-grid-color-primary'

tokensToCssVars({ colorPrimary: '#e91e63', ... })
// → { '--react-tree-grid-color-primary': '#e91e63', ... }
```
