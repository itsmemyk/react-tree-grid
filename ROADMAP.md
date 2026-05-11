# Roadmap

Current version: **v0.4.2**

Features are grouped into milestones. Each milestone is independently releasable.

---

## v0.5.0 — API Completeness

Filling in missing imperative API methods and events for programmatic control.

- [ ] `textarea` editor type
- [ ] `scrollTo(rowId, colId)` API method
- [ ] `editCell(rowId, colId)` / `editEnd(save?)` API methods
- [ ] `isColumnHidden(colId)` API method
- [ ] `hideRow` / `showRow` / `isRowHidden` API methods
- [ ] `adjustColumnWidth`, `getCellRect`, `paint` API methods
- [ ] `getSummary`, `getHeaderFilter` API methods
- [ ] Cell mouse events: `onCellMouseDown`, `onCellMouseOver`, `onCellRightClick`
- [ ] Filter lifecycle events: `onBeforeFilter`, `onFilterChange`
- [ ] Column visibility events: `onBeforeColumnHide`, `onAfterColumnHide`, `onBeforeColumnShow`, `onAfterColumnShow`
- [ ] Row visibility events: `onBeforeRowHide`, `onAfterRowHide`, `onBeforeRowShow`, `onAfterRowShow`
- [ ] Keyboard events: `onBeforeKeyDown`, `onAfterKeyDown`
- [ ] `autoEmptyRow` prop (auto-append empty row for data entry)

---

## v0.6.0 — Formatting & Filter Enhancements

Column-level data formatting and richer filter configuration.

- [ ] `dateFormat` — per-column date display format
- [ ] `numberMask` — prefix, suffix, decimal places, thousands separator
- [ ] `patternMask` — input mask (e.g. phone, postal code)
- [ ] `eventHandlers` — attach event listeners to HTML elements in cells
- [ ] `dateFilter` — calendar-based filter in column headers
- [ ] `customFilter` — per-column custom filter logic callback
- [ ] `filterConfig` — placeholder, icons, multiselection options per filter
- [ ] `footerPosition: "bottom"` — anchor footer to container bottom
- [ ] `getSummary()` — read aggregated footer values programmatically
- [ ] Dynamic span API: `addSpan()`, `removeSpan()`, `getSpan()`

---

## v0.7.0 — Row Expander

Expand rows inline to show nested content: sub-grids, forms, custom React components.

- [ ] `subRow` prop — callback returning `ReactNode` for expanded content
- [ ] `subRowConfig` — `expanded`, `preserve`, `toggleIcon`, `height`, `padding`, `css`, `fullWidth`
- [ ] `expand(rowId)` / `collapse(rowId)` / `expandAll()` / `collapseAll()` API methods
- [ ] `onBeforeExpand` / `onAfterExpand` / `onBeforeCollapse` / `onAfterCollapse` events

---

## v0.8.0 — Advanced Selection

Spreadsheet-style range and block selection with clipboard support.

- [ ] Range selection — rectangular multi-cell selection via Shift+click or Shift+arrow
- [ ] Block selection — block-based cell selection module
- [ ] Clipboard — copy/paste cell data (`onBeforeCopy`, `onAfterCopy`, `onBeforePaste`, `onAfterPaste`)

---

## v0.9.0 — History & Grouping

Undo/redo for cell edits and column-based row grouping with a drag panel.

- [ ] History module — undo/redo cell edits (`undo()`, `redo()`, `clearHistory()`)
- [ ] `onBeforeUndo` / `onAfterUndo` / `onBeforeRedo` / `onAfterRedo` events
- [ ] `groupBy` prop — group rows by column value with aggregation
- [ ] `dragPanel` — drag columns to a panel above the grid to set grouping

---

## v1.0.0 — Extended Export & Polish

- [ ] PDF export (`pdf(filename?)` API method)
- [ ] PNG export (`png(filename?)` API method)
- [ ] Final API surface review and documentation pass
