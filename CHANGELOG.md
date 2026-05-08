# Changelog

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
