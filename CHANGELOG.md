# Changelog

## [0.5.1] - 2026-05-18

### Added

- **New theme tokens** — `colorRowHover`, `colorRowSelected`, `colorSortIdle`, and `colorSortActive` CSS variables for fine-grained theming control over row states and sort indicators.
- **`defaultSortStates` prop** — pre-configure sort state without triggering a sort, useful for matching an externally sorted dataset.
- **Styling story** — new Storybook story with Bootstrap and Material UI theme presets as reference examples.

### Fixed

- **Sort indicator** — replaced Unicode arrow with a CSS-drawn indicator; fixes incorrect sizing when the grid is nested inside another `ThemeProvider`. Idle indicator is also CSS-drawn for consistency.
- **Header filters — options always from original data** — `SelectFilter` and `ComboFilter` now subscribe to the store's filter event so option lists always reflect the full unfiltered dataset regardless of other active filters.
- **Header filters — switching filter value** — selecting a new value in an already-active filter (e.g., Role: Designer → DevOps) now correctly re-evaluates from the base dataset instead of filtering already-filtered rows.
- **ComboFilter dropdown** — dropdown now portals to the nearest ThemeProvider root, preventing clipping by the grid's scroll container and preserving CSS theme variables.
- **Footer cells** — aggregate cells now inherit the column's `align` property. When no footer-specific `template` is defined, the column's `template` is used to format the aggregate value.
- **Row selection** — shift-clicking to extend a row selection no longer triggers browser text selection.

### Documentation

- Full CSS variables reference and UI library theming examples added to the theming guide.
- Expanded README with complete API reference.
- Updated sorting behavior guide.

## [0.5.0] - 2026-05-15

### Added

- **Data Grouping** — group rows by one or more columns with a drag-panel UI above the grid.
  - Set `groupable` on the grid to enable the drag panel; drag any column header into it to add a grouping level.
  - Chips in the panel show a sort-direction toggle (idle `⇅` / asc `↑` / desc `↓`) and a remove button; chips are draggable to reorder grouping priority.
  - Multi-level nesting — each entry in the grouping order adds one indented nesting level.
  - Group header rows show a chevron toggle, the group value, and the leaf-row count, e.g. `Dog (43)`.
  - Groups default to expanded; each can be collapsed/re-expanded independently via the chevron.
  - Per-chip sort direction sorts leaf rows within that group level; regular column-header sorting still works on leaf rows inside groups and is preserved when a column is dragged into the panel.
  - `group?: { order: string[] }` prop sets the initial grouping state.
  - `groupable?: boolean` on `GridColumn` opts a column out of the drag panel.
  - `groupBy(columnIds)` / `clearGroups()` `GridApi` methods for programmatic control.
  - `onBeforeGroupChange` / `onGroupChange` events.
- Column-header sorting now works for grids using the plain `data` prop (no `DataStore`), using the same `naturalCompare` logic as `DataStore` sorting so numeric columns sort `1, 2, 10` rather than `1, 10, 2`.

## [0.4.3] - 2026-05-12

### Fixed

- Fixed collapsed node state not being preserved when tree data is updated in TreeGrid.
- Fixed sort state not being preserved when tree data is updated in TreeGrid.
- Fixed cell editor opening on a double-click that was intended to toggle a tree node.
- Fixed filter state not being fully re-applied when an existing filter key is replaced in TreeStore.

## [0.4.2] - 2026-05-11

### Changed

- Updated generated grid column width CSS variable names to losslessly encode column IDs. External CSS that targets internal `--rgs-col-*` variables for IDs containing special characters must use the new encoded names.

### Fixed

- Fixed column width rendering when distinct column IDs previously collapsed to the same internal `--rgs-col-*` CSS variable name, such as `a-b` and `a.b`.
- Fixed formula cells not evaluating when the grid was used with the `data` prop instead of a data store.
- Fixed frozen column boundary computation to use column width data instead of DOM cell queries, preventing incorrect freeze offsets during initial render.

## [0.4.1] - 2026-05-08

### Changed

- Updated sort icon to animate with a flip transition instead of swapping content.
- Updated idle sort indicator on hover to use a muted color instead of the primary color.
- Updated grid-level `sortable` prop to default to `false` — sorting is now opt-in. Columns with `sortable: true` or grids with a data store still activate sorting without the grid-level prop.

### Fixed

- Fixed gap appearing between the last data row and the footer row when the grid has scrollable rows.
- Fixed sort indicators and header click-to-sort not activating when only a column-level `sortable: true` was set, or when a data store was provided without the grid-level `sortable` prop.

## [0.4.0] - 2026-05-07

### Added

- Added multi-column sorting — hold Ctrl and click column headers to sort by multiple columns simultaneously.

### Fixed

- Fixed grid columns and scrollbar not responding to container resize (e.g., window resize or parent layout changes).
- Fixed sorting being triggered when releasing the mouse after a column resize.

## [0.3.0] - 2026-05-06

### Fixed

- Fixed live column resize so header cells update immediately during drag, not only body cells.
- Fixed frozen left/right panes to stay aligned during live column resize.
- Fixed frozen top/bottom rows so unfrozen center columns stay horizontally aligned while scrolling.
- Fixed far-right horizontal scroll alignment in frozen rows by syncing frozen-row center strips to the actual DOM scroll position.
- Fixed right frozen column boundary rendering to avoid missing, doubled, or drifting divider lines.

### Changed

- Updated sorting behavior so repeated header clicks toggle only between ascending and descending; sorting no longer clears on the third click.
- Updated sort indicators to use the new arrow style.
- Added hover-visible inactive sort indicators on sortable headers.
- Fixed right-aligned headers so the sort indicator appears to the left of the label.

## [0.2.0] - 2025-04-21

- Initial public release with Grid, Tree, and TreeGrid components.
