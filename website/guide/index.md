# What is react-tree-grid?

**react-tree-grid** is an open-source, high-performance component library for React 18+ that provides three components: `Grid`, `Tree`, and `TreeGrid`.

It is a drop-in alternative to [DHTMLX TreeGrid](https://dhtmlx.com/docs/products/dhtmlxTreeGrid/) — replicating its API surface while being fully open-source, zero-dependency, and TypeScript-first.

## Components

| Component | Use when… |
|---|---|
| `Grid` | You need a flat tabular data grid with sorting, filtering, editing, and selection |
| `Tree` | You need a hierarchical file-tree style list with expand/collapse and checkboxes |
| `TreeGrid` | You need a data grid where rows have parent–child relationships shown in a tree column |

## Key features

- **Virtual scrolling** — renders only visible rows, handles 100,000+ rows smoothly
- **Inline editing** — `input`, `select`, `checkbox`, `combo`, `datePicker` editor types
- **Sorting & filtering** — per-column header filters with `inputFilter`, `selectFilter`, `comboFilter`
- **Drag and drop** — reorder rows and columns; tree drag between nodes
- **Column operations** — resize, reorder, freeze, hide/show, auto-width
- **Theming** — light/dark presets + full CSS custom property overrides
- **TypeScript** — all props, events, and types fully typed
- **Zero dependencies** — React 18+ is the only peer dependency

## Package

```bash
npm install @itsmemyk/react-tree-grid
```

The package ships ES modules and CJS with full TypeScript declarations. Sub-path exports allow tree-shaking individual components.
