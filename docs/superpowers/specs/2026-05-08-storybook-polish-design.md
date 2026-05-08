# Storybook Polish — Design Spec

**Date:** 2026-05-08
**Status:** Approved

## Goal

Make the Storybook feel like a professional open-source library — clean branding, logical sidebar structure, and consistent story names without informal interaction hints.

## Scope

Three targeted changes, no new runtime dependencies:

1. Custom Storybook title via `manager.ts`
2. Story hierarchy flattened to component-level top groups
3. Story names cleaned to plain title-case feature labels

---

## Section 1 — Storybook Title

Add `.storybook/manager.ts` using `@storybook/theming` (already a transitive Storybook dependency):

```ts
import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'react-tree-grid',
  }),
})
```

This replaces the default "Storybook" sidebar title with `react-tree-grid`.

---

## Section 2 — Story Hierarchy

Change `title` in each story file's `Meta` object:

| File | Before | After |
|------|--------|-------|
| `stories/Grid.stories.tsx` | `Components/Grid` | `Grid` |
| `stories/TreeGrid.stories.tsx` | `Components/TreeGrid` | `Tree Grid` |
| `stories/Tree.stories.tsx` | `Components/Tree` | `Tree` |

---

## Section 3 — Story Name Cleanup

Remove all parenthetical interaction hints. Normalize to title case.

### Grid

| Before | After |
|--------|-------|
| `Default` | `Basic Usage` |
| `Virtual Scroll (5000 rows)` | `Virtual Scroll` |
| `Frozen Columns & Rows` | `Frozen Columns & Rows` |
| `Column Resize (drag header edges)` | `Column Resize` |
| `Sorting (click headers)` | `Sorting` |
| `Multi sorting` | `Multi-Column Sorting` |
| `Row Selection (click to select)` | `Row Selection` |
| `Cell Selection` | `Cell Selection` |
| `Complex Selection (row + cell)` | `Complex Selection` |
| `Inline Cell Editing (double-click)` | `Inline Editing` |
| `Header Filters (select, input, combo)` | `Header Filters` |
| `Footer Summaries (sum, avg, count, min, max)` | `Footer Summaries` |
| `Cell Spans (rowspan/colspan)` | `Cell Spans` |
| `Column Reorder (drag headers)` | `Column Reorder` |
| `Column Reorder + Frozen Splits` | `Column Reorder with Frozen Splits` |
| `CSV & Excel Export` | `Export` |

### Tree Grid

| Before (export name / name) | After |
|-----------------------------|-------|
| `Default` | `Basic Usage` |
| `CollapsedStart` | `Collapsed by Default` |
| `DeepHierarchy` | `Deep Hierarchy` |
| `WithHeaderFilters` | `Header Filters` |
| `SortingAndSelection` | `Sorting & Selection` |
| `EditableRows` | `Editable Rows` |
| `RowDrag` | `Row Drag` |
| `ImperativeApi` | `Imperative API` |
| `BookLibraryExample` | `Book Library` |
| `DHtmlxShowcase` | `Showcase` |
| `GroupBy — Department (avg salary)` | `Group By Department` |
| `GroupBy — Department > Status (sum salary)` | `Group By Department & Status` |

### Tree

| Before (export name) | After |
|----------------------|-------|
| `Default` | `Basic Usage` |
| `WithCheckboxes` | `With Checkboxes` |
| `Editable` | `Editable` |
| `Draggable` | `Draggable` |
| `ControlledExpansion` | `Controlled Expansion` |
| `ImperativeApi` | `Imperative API` |

---

## Out of Scope

- Custom color theme / Storybook theming beyond the title
- Story `parameters.docs.description` entries
- Changes to story content, data, or component behavior
