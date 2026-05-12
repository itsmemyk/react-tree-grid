# Changelog

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
