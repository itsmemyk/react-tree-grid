# Roadmap

Current version: **v0.5.1**

Features are grouped into milestones. Each milestone is independently releasable.

---

## v0.5.0 — Data Grouping

Group rows by one or more columns with a drag-panel UI, nested groups, and expand/collapse.

### Props
- [x] `groupable?: boolean` — grid-level, enables drag panel and grouping UI; default `false`
- [x] `group?: { order: string[] }` — initial grouping state; `order` is an array of column IDs
- [x] `groupable?: boolean` on `GridColumn` — opt a column out of the drag panel (default `true` when grid `groupable` is on)

### Drag panel
- [x] Rendered above the grid when `groupable: true`
- [x] Each chip shows: column label + sort direction toggle (idle/asc/desc) + × remove button
- [x] Chips are draggable to reorder grouping priority
- [x] Columns can be dragged from the header into the panel to add a group level

### Group rows
- [x] Multi-level nesting — each entry in `order` adds one nesting level with increased indentation
- [x] Group header row shows: chevron + group value + row count e.g. `Dog (43)`
- [x] Expand/collapse per row (chevron toggle); groups default to expanded
- [x] `groupBy(columnIds)` / `clearGroups()` GridApi methods

### Sorting & events
- [x] Per-chip sort direction toggle sorts leaf rows within that group level
- [x] Regular column header sort still works on leaf rows within groups
- [x] `onBeforeGroupChange` / `onGroupChange` events

---

## v0.6.0 — Custom Cell Editors

Allow fully custom React components as cell editors, not just the built-in input types.

- [ ] `editTemplate` column prop — `(value, row, col, onChange, onCommit) => ReactNode`
- [ ] Editor lifecycle: focus management, commit on blur/Enter, cancel on Escape
- [ ] Works alongside existing `editorType` values — `editTemplate` takes precedence when set

---

## v0.7.0 — Pinned Rows

Pin arbitrary rows by ID to the top or bottom of the grid, keeping them visible while the rest of the data scrolls.

### Props
- [ ] `pinnedTopRows?: string[]` — row IDs to pin at the top; rows are removed from the scrollable area
- [ ] `pinnedBottomRows?: string[]` — row IDs to pin at the bottom; rows are removed from the scrollable area

### Behaviour
- [ ] Pinned rows scroll horizontally in sync with the grid body
- [ ] Pinned rows support inline editing when `editable: true`
- [ ] Per-row height via `$height` already works; pinned rows respect it
- [ ] Pinned rows interact correctly with frozen left/right columns (corner cells rendered separately)
- [ ] Selection, CSS overrides, and tooltips work the same as regular rows

### Events
- [ ] `onBeforePin` / `onAfterPin` — called when `pinnedTopRows` or `pinnedBottomRows` changes

---

## v0.8.0 — Enhanced Drag & Drop

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

## v0.9.0 — History & Undo/Redo

Track cell edit history and expose undo/redo for data-entry workflows.

- [ ] History module — tracks cell value changes automatically
- [ ] `undo()` / `redo()` / `clearHistory()` API methods
- [ ] `onBeforeUndo` / `onAfterUndo` / `onBeforeRedo` / `onAfterRedo` events

---

## v1.0.0 — Row Expander

Expand rows inline to show nested content: sub-grids, forms, custom React components.

- [ ] `subRow` prop — callback returning `ReactNode` for expanded content
- [ ] `subRowConfig` — `expanded`, `preserve`, `toggleIcon`, `height`, `padding`, `css`, `fullWidth`
- [ ] `expand(rowId)` / `collapse(rowId)` / `expandAll()` / `collapseAll()` API methods
- [ ] `onBeforeExpand` / `onAfterExpand` / `onBeforeCollapse` / `onAfterCollapse` events

---

## v1.1.0 — Advanced Selection & Clipboard

Spreadsheet-style range and block selection with copy/paste.

- [ ] Range selection — rectangular multi-cell selection via Shift+click or Shift+arrow
- [ ] Block selection — block-based cell selection module
- [ ] Clipboard — copy/paste cell data (`onBeforeCopy`, `onAfterCopy`, `onBeforePaste`, `onAfterPaste`)

---

## v1.2.0 — API Completeness

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

## v1.3.0 — Formatting & Filter Enhancements

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

## v1.4.0 — Column Groups & Collapse

Group related columns under a shared header label, with toggle to collapse the group into a narrow strip.

### Column definition
- [ ] Nested `columns` tree — group objects carry a `header` label and a `children: GridColumn[]` array; leaf nodes are the existing data columns
- [ ] `collapsed?: boolean` on group columns — initial collapsed state
- [ ] Groups can be nested (e.g. "Main client info" > "User" > "First Name" / "Last Name")

### Header rendering
- [ ] Group header cells span their children's widths (`colspan` equivalent)
- [ ] Each group cell shows a `›` / `‹` toggle button to expand/collapse
- [ ] When collapsed, child columns are hidden and replaced by a single narrow strip showing the group label rotated vertically
- [ ] Multi-level groups collapse independently — collapsing a child group does not collapse the parent

### Interactions
- [ ] Collapsed state can be controlled via prop or toggled interactively
- [ ] Resize and reorder are disabled on group header cells; they still work on leaf columns
- [ ] Frozen left/right columns that belong to a group collapse correctly within their fixed panel
- [ ] `onBeforeCollapse` / `onAfterCollapse` / `onBeforeExpand` / `onAfterExpand` events
- [ ] `collapseColumn(groupId)` / `expandColumn(groupId)` GridApi methods

---

## v1.5.0 — Localization

Allow grids to display built-in UI text in any language via a `locale` prop, with an optional `LocaleProvider` for app-wide configuration.

### Locale object
- [ ] `locale` prop on `Grid` — accepts a partial locale object; missing keys fall back to the built-in English defaults
- [ ] Built-in strings to localize: group column header (`"Group"`), group row count wrapper (e.g. `"(43)"`), expand/collapse aria-labels, filter input placeholder

### LocaleProvider
- [ ] `<LocaleProvider locale={...}>` context — all `Grid` instances inside inherit the locale without needing a per-grid prop
- [ ] Per-grid `locale` prop overrides the context for that instance
- [ ] Export `type GridLocale` so users can type their locale objects

### Shipped locales
- [ ] `enLocale` — English (default, built-in)
- [ ] `frLocale` — French
- [ ] `deLocale` — German
- [ ] `esLocale` — Spanish

---

## v2.0.0 — Extended Export & Polish

- [ ] PDF export (`pdf(filename?)` API method)
- [ ] PNG export (`png(filename?)` API method)
- [ ] Final API surface review and documentation pass
