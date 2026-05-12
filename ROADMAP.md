# Roadmap

Current version: **v0.4.3**

Features are grouped into milestones. Each milestone is independently releasable.

---

## v0.5.0 — Data Grouping

Group rows by one or more columns with a drag-panel UI, nested groups, and expand/collapse.

### Props
- [ ] `groupable?: boolean` — grid-level, enables drag panel and grouping UI; default `false`
- [ ] `group?: { order: string[] }` — initial grouping state; `order` is an array of column IDs
- [ ] `groupable?: boolean` on `GridColumn` — opt a column out of the drag panel (default `true` when grid `groupable` is on)

### Drag panel
- [ ] Rendered above the grid when `groupable: true`
- [ ] Each chip shows: column label + sort direction toggle (asc/desc) + × remove button
- [ ] Chips are draggable to reorder grouping priority
- [ ] Columns can be dragged from the header into the panel to add a group level

### Group rows
- [ ] Multi-level nesting — each entry in `order` adds one nesting level with increased indentation
- [ ] Group header row shows: chevron + group value + row count e.g. `Dog (43)`
- [ ] Expand/collapse per row; `expandGroup(key)` / `collapseGroup(key)` / `expandAllGroups()` / `collapseAllGroups()` API methods

### Sorting & events
- [ ] Per-chip sort direction toggle sorts leaf rows within that group level
- [ ] Regular column header sort still works on leaf rows within groups
- [ ] `onBeforeGroupChange` / `onAfterGroupChange` events

---

## v0.6.0 — Custom Cell Editors

Allow fully custom React components as cell editors, not just the built-in input types.

- [ ] `editTemplate` column prop — `(value, row, col, onChange, onCommit) => ReactNode`
- [ ] Editor lifecycle: focus management, commit on blur/Enter, cancel on Escape
- [ ] Works alongside existing `editorType` values — `editTemplate` takes precedence when set

---

## v0.7.0 — Enhanced Drag & Drop

Multi-row drag via a dedicated handle column, with ghost preview and group-row drag support.

### Handle column
- [ ] `dragItem: "row"` + new `dragHandle: true` grid prop — renders a `⋮⋮` (six-dot) handle as the leftmost column on every row
- [ ] Drag only initiates from the handle icon; clicking the row body does not start a drag
- [ ] Handle column has no header label, fixed narrow width, non-resizable, non-sortable

### Multi-row drag
- [ ] When multiple rows are selected, dragging any of their handles drags all selected rows together
- [ ] Origin rows appear ghosted/semi-transparent during drag
- [ ] Drag preview shows a stacked multi-row card with a move cursor (↕)
- [ ] Group header rows are also draggable via their handle — moves the entire group

### Drop behaviour
- [ ] Drop indicator line shown between rows at the insertion point
- [ ] Rows can only be dropped within their own group — cross-group drops are disabled
- [ ] Group header rows can only be reordered at the same nesting level — cannot be dropped inside another group
- [ ] Cross-grid drag — drop rows from one grid instance into another
- [ ] Touch drag support

### Events
- [ ] `onBeforeRowDrag` / `onAfterRowDrop` / `onDragStart` / `onDragEnd`

---

## v0.8.0 — History & Undo/Redo

Track cell edit history and expose undo/redo for data-entry workflows.

- [ ] History module — tracks cell value changes automatically
- [ ] `undo()` / `redo()` / `clearHistory()` API methods
- [ ] `onBeforeUndo` / `onAfterUndo` / `onBeforeRedo` / `onAfterRedo` events

---

## v0.9.0 — Row Expander

Expand rows inline to show nested content: sub-grids, forms, custom React components.

- [ ] `subRow` prop — callback returning `ReactNode` for expanded content
- [ ] `subRowConfig` — `expanded`, `preserve`, `toggleIcon`, `height`, `padding`, `css`, `fullWidth`
- [ ] `expand(rowId)` / `collapse(rowId)` / `expandAll()` / `collapseAll()` API methods
- [ ] `onBeforeExpand` / `onAfterExpand` / `onBeforeCollapse` / `onAfterCollapse` events

---

## v1.0.0 — Advanced Selection & Clipboard

Spreadsheet-style range and block selection with copy/paste.

- [ ] Range selection — rectangular multi-cell selection via Shift+click or Shift+arrow
- [ ] Block selection — block-based cell selection module
- [ ] Clipboard — copy/paste cell data (`onBeforeCopy`, `onAfterCopy`, `onBeforePaste`, `onAfterPaste`)

---

## v1.1.0 — API Completeness

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

## v1.2.0 — Formatting & Filter Enhancements

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

## v2.0.0 — Extended Export & Polish

- [ ] PDF export (`pdf(filename?)` API method)
- [ ] PNG export (`png(filename?)` API method)
- [ ] Final API surface review and documentation pass
