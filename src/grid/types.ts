import type { CSSProperties, ReactNode } from 'react'
import type { DataStore } from '../core/data'

export type GridColumnType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'combo'
  | 'checkbox'

export type GridEditorType =
  | 'input'
  | 'select'
  | 'combo'
  | 'checkbox'
  | 'datePicker'
  | 'multiselect'

export type GridHeaderFilterContent =
  | 'selectFilter'
  | 'inputFilter'
  | 'comboFilter'

export type GridFooterContent =
  | 'sum'
  | 'avg'
  | 'count'
  | 'min'
  | 'max'

export interface GridHeaderCell {
  id?: string
  text?: string
  css?: string
  content?: GridHeaderFilterContent
}

export interface GridFooterCell {
  id?: string
  text?: string
  css?: string
  content?: GridFooterContent
  template?: (value: number, column: GridColumn<any>) => string
}

export type GridAdjustOption = boolean | 'data' | 'header' | 'footer'

export type GridMarkFunction<T = Record<string, unknown>> = (
  cellValue: unknown,
  allColumnValues: unknown[],
  row: T,
  column: GridColumn<T>,
) => string | false | null | undefined

export interface GridMarkRange {
  min?: string
  max?: string
}

export type GridMarkConfig<T = Record<string, unknown>> =
  | GridMarkRange
  | GridMarkFunction<T>

export interface GridColumn<T = Record<string, unknown>> {
  id: string
  header?: GridHeaderCell[]
  footer?: GridFooterCell[]
  width?: number
  minWidth?: number
  maxWidth?: number
  hidden?: boolean
  sortable?: boolean
  resizable?: boolean
  gravity?: number
  type?: GridColumnType
  editorType?: GridEditorType
  template?: (value: unknown, row: T, column: GridColumn<T>) => ReactNode
  align?: 'left' | 'center' | 'right'
  htmlEnable?: boolean
  /** Per-column auto-fit width. Overrides grid-level `adjust`. */
  adjust?: GridAdjustOption
  /** Per-column opt-in/out of `autoWidth` distribution. */
  autoWidth?: boolean
  /** Override tooltip content for this column. Return null/empty to suppress. */
  tooltipTemplate?: (value: unknown, row: T, column: GridColumn<T>) => string | null | undefined
  /** Explicitly enable/disable tooltip for this column. Default: inherits grid `tooltip`. */
  tooltip?: boolean
  /** Auto-applied cell CSS derived from min/max or a custom function. */
  mark?: GridMarkConfig<T>
}

export interface GridRow {
  id: string
  hidden?: boolean
  $height?: number
  $css?: string
  [key: string]: unknown
}

export interface GridSpan {
  row: string
  column: string
  rowspan?: number
  colspan?: number
  text?: string
  css?: string
  tooltip?: string
}

export type SortOrder = 'asc' | 'desc'

export interface SortState {
  columnId: string
  order: SortOrder
}

export interface GridCellCoord {
  rowId: string
  colId: string
}

export type GridDragItem = 'row' | 'column'
export type GridDragMode = 'source' | 'target' | 'both'
export type GridColumnDropPosition = 'before' | 'after'
export type GridRowDropPosition = 'top' | 'bottom' | 'in'

export interface GridColumnDragData {
  start: string
  source: string[]
  target: string | null
  position: GridColumnDropPosition | null
}

export interface GridRowDragData {
  start: string
  source: string[]
  target: string | null
  position: GridRowDropPosition | null
}

export interface GridApi<T extends GridRow = GridRow> {
  addRowCss: (rowId: string, css: string) => void
  removeRowCss: (rowId: string, css: string) => void
  addCellCss: (rowId: string, colId: string, css: string) => void
  removeCellCss: (rowId: string, colId: string, css: string) => void
  showColumn: (colId: string) => void
  hideColumn: (colId: string) => void
  getColumn: (colId: string) => GridColumn<T> | undefined
  setColumns: (columns: GridColumn<T>[]) => void
}

export interface GridProps<T extends GridRow = GridRow> {
  columns: GridColumn<T>[]
  data: T[]
  store?: DataStore<T>
  spans?: GridSpan[]
  rowHeight?: number
  headerRowHeight?: number
  footerRowHeight?: number
  sortable?: boolean
  keyNavigation?: boolean
  tooltip?: boolean
  selection?: boolean | 'row' | 'cell' | 'complex'
  multiselection?: boolean
  editable?: boolean
  leftSplit?: number
  rightSplit?: number
  topSplit?: number
  bottomSplit?: number
  /** Auto-fit column widths to content (grid-level). */
  adjust?: GridAdjustOption
  /** Distribute remaining width proportionally across flexible columns. */
  autoWidth?: boolean
  /** Per-row height wraps to fit widest cell content. */
  autoHeight?: boolean
  /** Header row height wraps to fit widest header text. */
  headerAutoHeight?: boolean
  /** Footer row height wraps to fit widest footer text. */
  footerAutoHeight?: boolean
  dragItem?: GridDragItem
  dragMode?: GridDragMode
  rootParent?: string
  className?: string
  style?: CSSProperties
  onScroll?: (state: { x: number; y: number }) => void

  // Column resize events
  onBeforeResizeStart?: (colId: string) => boolean | void
  onResize?: (colId: string, width: number) => void
  onAfterResizeEnd?: (colId: string, width: number) => void

  // Sort events
  onBeforeSort?: (states: SortState[]) => boolean | void
  onAfterSort?: (states: SortState[]) => void

  // Selection events
  onBeforeSelect?: (rowId: string, colId: string) => boolean | void
  onAfterSelect?: (rowId: string, colId: string) => void
  onBeforeUnSelect?: (rowId: string, colId: string) => boolean | void
  onAfterUnSelect?: (rowId: string, colId: string) => void
  onCellClick?: (rowId: string, colId: string, event: React.MouseEvent) => void
  onCellDblClick?: (rowId: string, colId: string, event: React.MouseEvent) => void

  // Editor events
  onBeforeEditStart?: (rowId: string, colId: string) => boolean | void
  onAfterEditStart?: (rowId: string, colId: string) => void
  onBeforeEditEnd?: (rowId: string, colId: string, newValue: unknown, oldValue: unknown) => boolean | void
  onAfterEditEnd?: (rowId: string, colId: string, newValue: unknown) => void

  // Column drag events
  onBeforeColumnDrag?: (data: GridColumnDragData, event: React.DragEvent) => boolean | void
  onDragColumnStart?: (data: GridColumnDragData, event: React.DragEvent) => void
  onDragColumnIn?: (data: GridColumnDragData, event: React.DragEvent) => void
  onDragColumnOut?: (data: GridColumnDragData, event: React.DragEvent) => void
  onAfterColumnDrag?: (data: GridColumnDragData, event: React.DragEvent) => void
  canColumnDrop?: (data: GridColumnDragData, event: React.DragEvent) => boolean | void
  onCancelColumnDrop?: (data: GridColumnDragData, event: React.DragEvent) => void
  onBeforeColumnDrop?: (data: GridColumnDragData, event: React.DragEvent) => boolean | void
  onAfterColumnDrop?: (data: GridColumnDragData, event: React.DragEvent) => void

  // Row drag events
  onBeforeRowDrag?: (data: GridRowDragData, event: PointerEvent) => boolean | void
  onDragRowStart?: (data: GridRowDragData, event: PointerEvent) => void
  onDragRowIn?: (data: GridRowDragData, event: PointerEvent) => void
  onDragRowOut?: (data: GridRowDragData, event: PointerEvent) => void
  canRowDrop?: (data: GridRowDragData, event: PointerEvent) => boolean | void
  onCancelRowDrop?: (data: GridRowDragData, event: PointerEvent) => void
  onBeforeRowDrop?: (data: GridRowDragData, event: PointerEvent) => boolean | void
  onAfterRowDrop?: (data: GridRowDragData, event: PointerEvent) => void
  onAfterRowDrag?: (data: GridRowDragData, event: PointerEvent) => void

  // DataProxy
  dataProxy?: import('../core/data/DataProxy').DataProxyConfig
  paginationMode?: 'append' | 'replace'
  remoteSort?: boolean
  remoteFilter?: boolean
  onLoadStart?: () => void
  onLoadEnd?: () => void
  onLoadError?: (error: Error) => void

  // Freeze panes
  freezable?: boolean
  onFreeze?: (splits: { left: number; top: number }) => void

  // Formula engine
  formulas?: boolean
}
