import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type RefAttributes,
  type ReactElement,
  type UIEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { useVirtualScroll } from '../core/scroll'
import type { DataStore } from '../core/data'
import type { DataItem } from '../core/data/types'
import styles from './grid.module.css'
import type {
  GridApi,
  GridColumn,
  GridFooterCell,
  GridHeaderCell,
  GridProps,
  GridRow,
} from './types'
import { useGridFilter } from './useGridFilter'
import { useGridFooter, type FooterValues } from './useGridFooter'
import { useGridSpans } from './useGridSpans'
import { useColumnResize } from './useColumnResize'
import { useGridSort } from './useGridSort'
import { useGridSelection } from './useGridSelection'
import { useGridEditor } from './useGridEditor'
import { useGridKeyboard } from './useGridKeyboard'
import { useColumnReorder } from './useColumnReorder'
import { useColumnAdjust } from './useColumnAdjust'
import { useGridTooltip } from './useGridTooltip'
import { useGridCss } from './useGridCss'
import { useRowDrag } from './useRowDrag'
import { useDataProxy } from '../core/data/useDataProxy'
import type { DataProxyConfig, LoadOptions } from '../core/data/DataProxy'
import { useFormulas } from '../core/formula/useFormulas'
import { useFreeze } from './useFreeze'
import { SelectFilter } from './filters/SelectFilter'
import { InputFilter } from './filters/InputFilter'
import { ComboFilter } from './filters/ComboFilter'
import { getScrollbarHeight, getScrollbarWidth } from '../core/utils'

interface NormalizedHeaderCell {
  id: string
  text?: string
  css?: string
  content?: GridHeaderCell['content']
}

interface NormalizedColumn<T extends GridRow> extends GridColumn<T> {
  $width: number
  header: NormalizedHeaderCell[]
}

type RowWithHeight<T extends GridRow> = T & {
  $height: number
}

function normalizeColumns<T extends GridRow>(
  columns: GridColumn<T>[],
): NormalizedColumn<T>[] {
  return columns
    .filter((column) => !column.hidden)
    .map((column) => {
      let width = column.minWidth || 100

      if (column.width !== undefined) {
        width = column.width
      }
      if (column.maxWidth !== undefined && width > column.maxWidth) {
        width = column.maxWidth
      }
      if (column.minWidth !== undefined && width < column.minWidth) {
        width = column.minWidth
      }
      if (width < 20) {
        width = 20
      }

      return {
        ...column,
        $width: width,
        header:
          column.header?.map((cell, cellIndex) => ({
            id: cell.id ?? `${column.id}-${cellIndex}`,
            text: cell.text,
            css: cell.css,
            content: cell.content,
          })) ?? [{ id: `${column.id}-0`, text: column.id }],
      }
    })
}

function getCellValue<T extends GridRow>(
  row: T,
  column: NormalizedColumn<T>,
): React.ReactNode {
  const value = row[column.id]
  if (column.template) {
    return column.template(value, row, column)
  }
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
}

function getRowHeight(row: GridRow, fallback: number): number {
  return typeof row.$height === 'number' ? row.$height : fallback
}

function sumWidths<T extends GridRow>(columns: NormalizedColumn<T>[]): number {
  return columns.reduce((sum, column) => sum + column.$width, 0)
}

function sumRowHeights<T extends GridRow>(rows: RowWithHeight<T>[], fallback: number): number {
  return rows.reduce((sum, row) => sum + getRowHeight(row, fallback), 0)
}

interface RowInteraction {
  isRowSelected?: (rowId: string) => boolean
  isCellSelected?: (rowId: string, colId: string) => boolean
  getRowClassName?: (rowId: string) => string | undefined
  getCellClassName?: (rowId: string, colId: string) => string | undefined
  getRowRef?: (rowId: string) => ((node: HTMLDivElement | null) => void) | undefined
  onRowPointerDown?: (rowId: string, e: React.PointerEvent<HTMLElement>) => void
  rowDragEnabled?: boolean
  onCellClick?: (rowId: string, colId: string, e: React.MouseEvent) => void
  onCellDblClick?: (rowId: string, colId: string, e: React.MouseEvent) => void
  onCellMouseEnter?: (e: React.MouseEvent, rowId: string, colId: string) => void
  onCellMouseLeave?: () => void
  isEditing?: (rowId: string, colId: string) => boolean
  editingValue?: unknown
  onEditorChange?: (value: unknown) => void
  onEditorKeyDown?: (e: React.KeyboardEvent) => void
  onEditorBlur?: () => void
  getComputedValue?: (rowId: string, colIndex: number) => unknown
}

function renderRow<T extends GridRow>(
  row: RowWithHeight<T>,
  columns: NormalizedColumn<T>[],
  stylesMap: typeof styles,
  interaction?: RowInteraction,
) {
  const rowSelected = interaction?.isRowSelected?.(row.id)

  return (
    <div
      ref={interaction?.getRowRef?.(row.id)}
      key={row.id}
      className={[
        stylesMap.row,
        row.$css ? row.$css : '',
        interaction?.getRowClassName?.(row.id) ?? '',
        interaction?.rowDragEnabled ? stylesMap.rowDraggable : '',
        rowSelected ? stylesMap.rowSelected : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ height: getRowHeight(row, 40) }}
      data-rgs-id={row.id}
      onPointerDown={
        interaction?.rowDragEnabled
          ? (e) => interaction.onRowPointerDown?.(row.id, e)
          : undefined
      }
    >
      {columns.map((column, colIndex) => {
        const cellWidth = column.$width
        const cellHeight = getRowHeight(row, 40)
        const cellSelected = interaction?.isCellSelected?.(row.id, column.id)
        const editing = interaction?.isEditing?.(row.id, column.id)

        return (
          <div
            key={`${row.id}-${column.id}`}
            className={[
              stylesMap.cell,
              column.align === 'center'
                ? stylesMap.alignCenter
                : column.align === 'right'
                  ? stylesMap.alignRight
                  : stylesMap.alignLeft,
              interaction?.getCellClassName?.(row.id, column.id) ?? '',
              cellSelected ? stylesMap.cellSelected : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              width: cellWidth,
              height: cellHeight,
            }}
            data-rgs-col-id={column.id}
            onClick={(e) => interaction?.onCellClick?.(row.id, column.id, e)}
            onDoubleClick={(e) => interaction?.onCellDblClick?.(row.id, column.id, e)}
            onMouseEnter={(e) => interaction?.onCellMouseEnter?.(e, row.id, column.id)}
            onMouseLeave={interaction?.onCellMouseLeave}
          >
            {editing ? (
              <input
                className={stylesMap.cellEditor}
                autoFocus
                value={interaction?.editingValue === null || interaction?.editingValue === undefined ? '' : String(interaction.editingValue)}
                onChange={(e) => interaction?.onEditorChange?.(e.target.value)}
                onKeyDown={interaction?.onEditorKeyDown}
                onBlur={interaction?.onEditorBlur}
              />
            ) : (
              interaction?.getComputedValue != null
                ? String(interaction.getComputedValue(row.id, colIndex) ?? getCellValue(row, column))
                : getCellValue(row, column)
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Render span cells as a separate overlay layer (mirrors dhtmlx `.dhx_span-spans`).
 *
 * Spans are absolutely positioned on top of normal row cells so they don't
 * disrupt the flex row layout. Covered cells render normally underneath; the
 * span paints over them with an opaque background.
 */
function renderSpansOverlay<T extends GridRow>(
  rows: RowWithHeight<T>[],
  columns: NormalizedColumn<T>[],
  stylesMap: typeof styles,
  gridSpans: {
    getSpan: (rowId: string, colId: string) => {
      span: { text?: React.ReactNode; css?: string; tooltip?: string }
      width: number
      height: number
    } | undefined
  },
  interaction?: RowInteraction,
  defaultRowHeight = 40,
): React.ReactNode[] {
  const cells: React.ReactNode[] = []
  let top = 0
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]
    const rowH = getRowHeight(row, defaultRowHeight)
    let left = 0
    for (let c = 0; c < columns.length; c++) {
      const column = columns[c]
      const spanInfo = gridSpans.getSpan(row.id, column.id)
      if (spanInfo) {
        const cellSelected = interaction?.isCellSelected?.(row.id, column.id)
        const editing = interaction?.isEditing?.(row.id, column.id)
        cells.push(
          <div
            key={`span-${row.id}-${column.id}`}
            className={[
              stylesMap.cell,
              stylesMap.spanCell,
              column.align === 'center'
                ? stylesMap.alignCenter
                : column.align === 'right'
                  ? stylesMap.alignRight
                  : stylesMap.alignLeft,
              spanInfo.span.css ?? '',
              interaction?.getCellClassName?.(row.id, column.id) ?? '',
              cellSelected ? stylesMap.cellSelected : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              position: 'absolute',
              top,
              left,
              width: spanInfo.width,
              height: spanInfo.height,
            }}
            data-rgs-id={row.id}
            data-rgs-col-id={column.id}
            title={spanInfo.span.tooltip}
            onClick={(e) => interaction?.onCellClick?.(row.id, column.id, e)}
            onDoubleClick={(e) => interaction?.onCellDblClick?.(row.id, column.id, e)}
            onMouseEnter={(e) => interaction?.onCellMouseEnter?.(e, row.id, column.id)}
            onMouseLeave={interaction?.onCellMouseLeave}
          >
            {editing ? (
              <input
                className={stylesMap.cellEditor}
                autoFocus
                value={interaction?.editingValue === null || interaction?.editingValue === undefined ? '' : String(interaction.editingValue)}
                onChange={(e) => interaction?.onEditorChange?.(e.target.value)}
                onKeyDown={interaction?.onEditorKeyDown}
                onBlur={interaction?.onEditorBlur}
              />
            ) : (
              spanInfo.span.text ?? getCellValue(row, column)
            )}
          </div>,
        )
      }
      left += column.$width
    }
    top += rowH
  }
  return cells
}

function GridInner<T extends GridRow>({
  columns,
  data,
  store,
  spans,
  rowHeight = 40,
  headerRowHeight = 40,
  footerRowHeight = 40,
  sortable = true,
  keyNavigation = true,
  tooltip = true,
  selection: selectionProp = false,
  multiselection = false,
  editable = false,
  leftSplit = 0,
  rightSplit = 0,
  topSplit = 0,
  bottomSplit = 0,
  adjust,
  autoWidth,
  autoHeight,
  headerAutoHeight,
  footerAutoHeight,
  dragItem,
  dragMode,
  className,
  style,
  onScroll,
  onBeforeResizeStart,
  onResize,
  onAfterResizeEnd,
  onBeforeSort,
  onAfterSort,
  onBeforeSelect,
  onAfterSelect,
  onBeforeUnSelect,
  onAfterUnSelect,
  onCellClick,
  onCellDblClick,
  onBeforeEditStart,
  onAfterEditStart,
  onBeforeEditEnd,
  onAfterEditEnd,
  onBeforeColumnDrag,
  onDragColumnStart,
  onDragColumnIn,
  onDragColumnOut,
  onAfterColumnDrag,
  canColumnDrop,
  onCancelColumnDrop,
  onBeforeColumnDrop,
  onAfterColumnDrop,
  onBeforeRowDrag,
  onDragRowStart,
  onDragRowIn,
  onDragRowOut,
  canRowDrop,
  onCancelRowDrop,
  onBeforeRowDrop,
  onAfterRowDrop,
  onAfterRowDrag,
  dataProxy,
  paginationMode,
  remoteSort,
  remoteFilter,
  onLoadStart,
  onLoadEnd,
  onLoadError,
  freezable,
  onFreeze,
  formulas,
}: GridProps<T>, ref: ForwardedRef<GridApi<T>>) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const headerScrollRef = useRef<HTMLDivElement | null>(null)
  const footerScrollRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const [runtimeColumns, setRuntimeColumns] = useState(columns)

  useEffect(() => {
    setRuntimeColumns(columns)
  }, [columns])

  const columnReorder = useColumnReorder(runtimeColumns, {
    dragItem,
    dragMode,
    leftSplit,
    rightSplit,
  }, {
    onBeforeColumnDrag,
    onDragColumnStart,
    onDragColumnIn,
    onDragColumnOut,
    onAfterColumnDrag,
    canColumnDrop,
    onCancelColumnDrop,
    onBeforeColumnDrop,
    onAfterColumnDrop,
  })

  // ─── Column Resize ────────────────────────────────────────────────
  const columnResize = useColumnResize(columnReorder.orderedColumns, {
    onBeforeResizeStart,
    onResize,
    onAfterResizeEnd,
  })

  // ─── DataProxy ────────────────────────────────────────────────────
  const [proxyOpts, setProxyOpts] = useState<LoadOptions>({})
  const dataProxyHook = useDataProxy(
    dataProxy as DataProxyConfig | undefined,
    { paginationMode, onLoadStart, onLoadEnd, onLoadError },
  )
  const activeData: T[] = dataProxy
    ? (dataProxyHook.proxyData as unknown as T[])
    : data

  useEffect(() => {
    if (dataProxy) {
      dataProxyHook.load(1, proxyOpts)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProxy])

  // ─── Sorting ──────────────────────────────────────────────────────
  const gridSort = useGridSort(
    store as unknown as import('../core/data').DataStore<T & DataItem> | undefined,
    columnReorder.orderedColumns,
    {
      onBeforeSort,
      onAfterSort,
      onRemoteSort: (remoteSort && dataProxy)
        ? (sortBy, sortDir) => {
            const newOpts: LoadOptions = {
              ...proxyOpts,
              sortBy: sortBy ?? undefined,
              sortDir: sortDir ?? undefined,
            }
            setProxyOpts(newOpts)
            dataProxyHook.load(1, newOpts)
          }
        : undefined,
    },
  )

  const rowDrag = useRowDrag<T>(activeData, {
    store: store as DataStore<T & DataItem> | undefined,
    dragItem,
    dragMode,
    rowHeight,
    viewportRef: bodyRef,
  }, {
    onBeforeRowDrag,
    onDragRowStart,
    onDragRowIn,
    onDragRowOut,
    canRowDrop,
    onCancelRowDrop,
    onBeforeRowDrop,
    onAfterRowDrop,
    onAfterRowDrag,
  })

  // ─── Selection ────────────────────────────────────────────────────
  const selectionMode = typeof selectionProp === 'string' ? selectionProp : 'complex'
  const selectionDisabled = selectionProp === false
  const gridSelection = useGridSelection(rowDrag.orderedRows, {
    mode: selectionMode,
    multiselection,
    disabled: selectionDisabled,
    events: { onBeforeSelect, onAfterSelect, onBeforeUnSelect, onAfterUnSelect },
  })

  // ─── Inline Editing ───────────────────────────────────────────────
  const gridEditor = useGridEditor(
    store as unknown as import('../core/data').DataStore<T & DataItem> | undefined,
    rowDrag.orderedRows,
    columnReorder.orderedColumns,
    { onBeforeEditStart, onAfterEditStart, onBeforeEditEnd, onAfterEditEnd },
  )

  const gridFilter = useGridFilter(
    store,
    columnReorder.orderedColumns,
    (remoteFilter && dataProxy)
      ? (filters) => {
          const newOpts: LoadOptions = { ...proxyOpts, filters }
          setProxyOpts(newOpts)
          dataProxyHook.load(1, newOpts)
        }
      : undefined,
  )

  const footerValues = useGridFooter(store, columnReorder.orderedColumns, activeData)

  const columnIds = useMemo(
    () => columnReorder.orderedColumns.map((c) => String(c.id)),
    [columnReorder.orderedColumns],
  )
  const formulaHook = useFormulas(
    store as unknown as import('../core/data').DataStore<{ id: string } & Record<string, unknown>> | undefined,
    columnIds,
    !!formulas,
  )

  const visibleDataRows = useMemo(
    () => rowDrag.orderedRows.filter((row) => !row.hidden),
    [rowDrag.orderedRows],
  )

  const gridCss = useGridCss(activeData, runtimeColumns)

  const [viewportSize, setViewportSize] = useState({
    width: typeof style?.width === 'number' ? style.width : 640,
    height: typeof style?.height === 'number' ? style.height : 320,
  })

  const adjustResult = useColumnAdjust<T>({
    columns: columnReorder.orderedColumns,
    data: rowDrag.orderedRows,
    adjust,
    autoWidth,
    autoHeight,
    headerAutoHeight,
    footerAutoHeight,
    sortable,
    containerWidth: viewportSize.width,
    rowHeight,
    headerRowHeight,
    footerRowHeight,
    visibleRows: visibleDataRows,
    footerValues,
  })

  const normalizedColumns = useMemo(() => {
    const cols = normalizeColumns(columnReorder.orderedColumns)
    // Apply adjust/autoWidth as baseline, then resize overrides win.
    return cols.map((col) => {
      const resize = columnResize.widthOverrides[col.id]
      if (resize !== undefined) {
        return { ...col, $width: resize }
      }
      const adjusted = adjustResult.widthOverrides[col.id]
      if (adjusted !== undefined) {
        return { ...col, $width: adjusted }
      }
      return col
    })
  }, [columnReorder.orderedColumns, columnResize.widthOverrides, adjustResult.widthOverrides])

  // Compute number of header rows (max across all columns)
  const headerRowCount = useMemo(
    () =>
      normalizedColumns.reduce(
        (max, col) => Math.max(max, col.header.length),
        1,
      ),
    [normalizedColumns],
  )
  const totalHeaderHeight = adjustResult.headerRowHeights.length
    ? adjustResult.headerRowHeights.reduce((sum, h) => sum + h, 0)
    : headerRowCount * headerRowHeight

  // Compute number of footer rows
  const footerRowCount = useMemo(
    () =>
      normalizedColumns.reduce(
        (max, col) => Math.max(max, col.footer?.length ?? 0),
        0,
      ),
    [normalizedColumns],
  )
  const totalFooterHeight = adjustResult.footerRowHeights.length
    ? adjustResult.footerRowHeights.reduce((sum, h) => sum + h, 0)
    : footerRowCount * footerRowHeight

  // Pre-compute row/col dimension maps for spans (before normalizedData to avoid dependency cycle)
  const normalizedData = useMemo(
    () =>
      rowDrag.orderedRows
        .filter((row) => !row.hidden)
        .map((row) => ({
          ...row,
          $height:
            adjustResult.rowHeightOverrides[row.id] ?? row.$height ?? rowHeight,
        })) as RowWithHeight<T>[],
    [rowDrag.orderedRows, rowHeight, adjustResult.rowHeightOverrides],
  )

  // Span support
  const rowIds = useMemo(
    () => normalizedData.map((r) => r.id),
    [normalizedData],
  )
  const colWidthMap = useMemo(() => {
    const m: Record<string, number> = {}
    for (const c of normalizedColumns) m[c.id] = c.$width
    return m
  }, [normalizedColumns])
  const rowHeightMap = useMemo(() => {
    const m: Record<string, number> = {}
    for (const r of normalizedData) m[r.id] = r.$height
    return m
  }, [normalizedData])

  const gridSpans = useGridSpans(spans, columnReorder.orderedColumns, rowIds, colWidthMap, rowHeightMap)

  useImperativeHandle(
    ref,
    () => ({
      addRowCss: gridCss.addRowCss,
      removeRowCss: gridCss.removeRowCss,
      addCellCss: gridCss.addCellCss,
      removeCellCss: gridCss.removeCellCss,
      showColumn: (colId: string) => {
        setRuntimeColumns((prev) =>
          prev.map((column) => (column.id === colId ? { ...column, hidden: false } : column)),
        )
      },
      hideColumn: (colId: string) => {
        setRuntimeColumns((prev) =>
          prev.map((column) => (column.id === colId ? { ...column, hidden: true } : column)),
        )
      },
      getColumn: (colId: string) => runtimeColumns.find((column) => column.id === colId),
      setColumns: (nextColumns: GridColumn<T>[]) => {
        setRuntimeColumns(nextColumns)
        columnReorder.setColumnOrder(nextColumns.map((column) => column.id))
      },
    }),
    [
      columnReorder,
      gridCss.addCellCss,
      gridCss.addRowCss,
      gridCss.removeCellCss,
      gridCss.removeRowCss,
      runtimeColumns,
    ],
  )

  useLayoutEffect(() => {
    const node = rootRef.current
    if (!node) {
      return
    }

    const rect = node.getBoundingClientRect()
    const width =
      typeof style?.width === 'number' ? style.width : Math.round(rect.width)
    const height =
      typeof style?.height === 'number' ? style.height : Math.round(rect.height)

    if (
      width &&
      height &&
      (viewportSize.width !== width || viewportSize.height !== height)
    ) {
      setViewportSize({ width, height })
    }
  }, [style?.height, style?.width, viewportSize.height, viewportSize.width])

  const freezeHook = useFreeze({
    containerRef: bodyRef as React.RefObject<HTMLDivElement | null>,
    columnCount: normalizedColumns.length,
    initialFreezeCol: leftSplit,
    onFreeze: onFreeze ? (col) => onFreeze({ left: col, top: 0 }) : undefined,
  })
  const effectiveLeftSplit = freezable ? freezeHook.freezeCol : leftSplit

  const fixedLeftColumns = normalizedColumns.slice(0, effectiveLeftSplit)
  const fixedRightColumns =
    rightSplit > 0
      ? normalizedColumns.slice(normalizedColumns.length - rightSplit)
      : []
  const centerColumns = normalizedColumns.slice(
    effectiveLeftSplit,
    normalizedColumns.length - rightSplit || normalizedColumns.length,
  )

  const topRows = normalizedData.slice(0, topSplit)
  const bottomRows =
    bottomSplit > 0 ? normalizedData.slice(normalizedData.length - bottomSplit) : []

  const totalWidth = normalizedColumns.reduce(
    (sum, column) => sum + column.$width,
    0,
  )
  const totalHeight = normalizedData.reduce(
    (sum, row) => sum + (typeof row.$height === 'number' ? row.$height : rowHeight),
    0,
  )
  const fixedLeftWidth = sumWidths(fixedLeftColumns)
  const fixedRightWidth = sumWidths(fixedRightColumns)
  const fixedTopHeight = sumRowHeights(topRows, rowHeight)
  const fixedBottomHeight = sumRowHeights(bottomRows, rowHeight)
  const baseBodyHeight = Math.max(
    0,
    viewportSize.height - totalHeaderHeight - totalFooterHeight,
  )
  let verticalScrollbarWidth = 0
  let horizontalScrollbarHeight = 0

  for (let pass = 0; pass < 2; pass += 1) {
    const bodyClientWidth = Math.max(0, viewportSize.width - verticalScrollbarWidth)
    const bodyClientHeight = Math.max(0, baseBodyHeight - horizontalScrollbarHeight)

    verticalScrollbarWidth =
      totalHeight > bodyClientHeight ? getScrollbarWidth() : 0
    horizontalScrollbarHeight =
      totalWidth > bodyClientWidth ? getScrollbarHeight() : 0
  }

  const bodyClientWidth = Math.max(0, viewportSize.width - verticalScrollbarWidth)
  const bodyClientHeight = Math.max(0, baseBodyHeight - horizontalScrollbarHeight)
  const rightFixedLeft = fixedRightWidth
    ? totalWidth < bodyClientWidth
      ? Math.max(fixedLeftWidth, totalWidth - fixedRightWidth)
      : Math.max(fixedLeftWidth, bodyClientWidth - fixedRightWidth)
    : 0
  const virtual = useVirtualScroll({
    totalRows: normalizedData.length,
    totalCols: normalizedColumns.length,
    rowHeight,
    colWidths: normalizedColumns.map((column) => column.$width),
    containerWidth: bodyClientWidth,
    containerHeight: bodyClientHeight,
    leftSplit: effectiveLeftSplit,
    rightSplit,
    topSplit,
    bottomSplit,
    headerHeight: totalHeaderHeight,
    footerHeight: totalFooterHeight,
  })
  const visibleColumns = normalizedColumns.slice(virtual.xStart, virtual.xEnd + 1)
  const visibleRows = normalizedData.slice(virtual.yStart, virtual.yEnd + 1)

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const next = {
      x: event.currentTarget.scrollLeft,
      y: event.currentTarget.scrollTop,
    }
    // Sync header/footer scrollLeft directly in the same frame — no React re-render lag
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = next.x
    }
    if (footerScrollRef.current) {
      footerScrollRef.current.scrollLeft = next.x
    }
    virtual.onScroll(next.x, next.y)
    onScroll?.(next)

    // DataProxy: trigger next page load when scrolled near the bottom
    if (dataProxy && paginationMode === 'append' && !dataProxyHook.loading) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
      if (scrollHeight - scrollTop - clientHeight < 50) {
        dataProxyHook.loadNextPage(proxyOpts)
      }
    }
  }

  const headerDropLineLeft = useMemo(() => {
    const indicator = columnReorder.dropIndicator
    if (!indicator) {
      return null
    }

    const targetIndex = normalizedColumns.findIndex((column) => column.id === indicator.columnId)
    if (targetIndex < 0) {
      return null
    }

    const targetColumn = normalizedColumns[targetIndex]
    const placeAfter = indicator.position === 'after'

    if (targetIndex < effectiveLeftSplit) {
      const beforeWidth = sumWidths(normalizedColumns.slice(0, targetIndex))
      return beforeWidth + (placeAfter ? targetColumn.$width : 0)
    }

    if (rightSplit > 0 && targetIndex >= normalizedColumns.length - rightSplit) {
      const rightIndex = targetIndex - (normalizedColumns.length - rightSplit)
      const beforeWidth = sumWidths(fixedRightColumns.slice(0, rightIndex))
      return rightFixedLeft + beforeWidth + (placeAfter ? targetColumn.$width : 0)
    }

    const centerIndex = targetIndex - effectiveLeftSplit
    const beforeWidth = sumWidths(centerColumns.slice(0, centerIndex))
    return fixedLeftWidth + beforeWidth - virtual.scrollLeft + (placeAfter ? targetColumn.$width : 0)
  }, [
    centerColumns,
    columnReorder.dropIndicator,
    fixedLeftColumns,
    fixedLeftWidth,
    fixedRightColumns,
    effectiveLeftSplit,
    normalizedColumns,
    rightFixedLeft,
    rightSplit,
    virtual.scrollLeft,
  ])

  const renderHeaderCellContent = (
    column: NormalizedColumn<T>,
    cell: NormalizedHeaderCell,
    rowIndex: number,
  ) => {
    if (!cell.content || !store) {
      if (rowIndex === 0) {
        return cell.text ?? column.id
      }
      return cell.text ?? ''
    }

    const filterValue = gridFilter.values[column.id]

    switch (cell.content) {
      case 'selectFilter':
        return (
          <SelectFilter
            column={column}
            store={store}
            value={filterValue}
            onChange={(v) => gridFilter.setFilterValue(column.id, v)}
          />
        )
      case 'inputFilter':
        return (
          <InputFilter
            column={column}
            value={filterValue}
            onChange={(v) => gridFilter.setFilterValue(column.id, v)}
          />
        )
      case 'comboFilter':
        return (
          <ComboFilter
            column={column}
            store={store}
            value={filterValue}
            onChange={(v) => gridFilter.setFilterValue(column.id, v)}
          />
        )
      default:
        return cell.text ?? ''
    }
  }

  const renderFooterCellContent = (
    column: NormalizedColumn<T>,
    cell: GridFooterCell,
    rowIndex: number,
    values: FooterValues,
  ) => {
    if (cell.content) {
      const computed = values[column.id]?.[rowIndex]
      if (computed !== undefined) {
        return String(computed)
      }
      return ''
    }
    return cell.text ?? ''
  }

  const renderFooterColumns = (cols: NormalizedColumn<T>[]) =>
    cols.map((column) => (
      <div key={column.id} className={styles.headerColumn} style={{ width: column.$width }}>
        {Array.from({ length: footerRowCount }, (_, rowIdx) => {
          const cell = column.footer?.[rowIdx]
          return (
            <div
              key={cell?.id ?? `${column.id}-f${rowIdx}`}
              className={[styles.footerCell, cell?.css ?? ''].filter(Boolean).join(' ')}
              style={{
                width: column.$width,
                height: adjustResult.footerRowHeights[rowIdx] ?? footerRowHeight,
              }}
              data-rgs-col-id={column.id}
            >
              {cell ? renderFooterCellContent(column, cell, rowIdx, footerValues) : ''}
            </div>
          )
        })}
      </div>
    ))

  const renderHeaderColumns = (cols: NormalizedColumn<T>[]) =>
    cols.map((column) => (
      <div key={column.id} className={styles.headerColumn} style={{ width: column.$width }}>
        {Array.from({ length: headerRowCount }, (_, rowIdx) => {
          const cell = column.header[rowIdx]
          const sortOrder = rowIdx === 0 ? gridSort.getSortOrder(column.id) : undefined
          const sortIndex = rowIdx === 0 ? gridSort.getSortIndex(column.id) : -1
          return (
            <div
              key={cell?.id ?? `${column.id}-${rowIdx}`}
              className={[
                styles.headerCell,
                cell?.css ?? '',
                sortable && column.sortable !== false && rowIdx === 0 ? styles.headerCellSortable : '',
              ].filter(Boolean).join(' ')}
              style={{
                width: column.$width,
                height: adjustResult.headerRowHeights[rowIdx] ?? headerRowHeight,
              }}
              data-rgs-col-id={column.id}
              onClick={
                sortable && column.sortable !== false && rowIdx === 0
                  ? (e) => {
                      if (columnReorder.shouldPreventHeaderClick()) {
                        return
                      }
                      gridSort.handleHeaderClick(column.id, e.ctrlKey || e.metaKey)
                    }
                  : undefined
              }
              onPointerDown={
                column.resizable !== false
                  ? (e) => columnResize.handleHeaderPointerDown(e, column.id, column.$width, column)
                  : undefined
              }
              onPointerMove={
                column.resizable !== false
                  ? (e) => {
                      const cursor = columnResize.handleHeaderPointerMove(e, column)
                      ;(e.currentTarget as HTMLElement).style.cursor = cursor ?? ''
                    }
                  : undefined
              }
              draggable={columnReorder.enabled && rowIdx === 0}
              onDragStart={
                columnReorder.enabled && rowIdx === 0
                  ? (e) => columnReorder.handleHeaderDragStart(e, column.id)
                  : undefined
              }
              onDragOver={
                columnReorder.enabled && rowIdx === 0
                  ? (e) => columnReorder.handleHeaderDragOver(e, column.id)
                  : undefined
              }
              onDrop={
                columnReorder.enabled && rowIdx === 0
                  ? (e) => columnReorder.handleHeaderDrop(e, column.id)
                  : undefined
              }
              onDragEnd={
                columnReorder.enabled && rowIdx === 0
                  ? (e) => columnReorder.handleHeaderDragEnd(e)
                  : undefined
              }
            >
              {cell ? renderHeaderCellContent(column, cell, rowIdx) : ''}
              {sortOrder && (
                <span className={styles.sortIndicator}>
                  <span className={sortOrder === 'asc' ? styles.sortAsc : styles.sortDesc} />
                  {sortIndex > 0 && <span className={styles.sortIndex}>{sortIndex}</span>}
                </span>
              )}
            </div>
          )
        })}
      </div>
    ))

  // ─── Tooltip ─────────────────────────────────────────────────────
  const gridTooltip = useGridTooltip(tooltip)

  // ─── Row interaction handlers ─────────────────────────────────────
  const rowInteraction: RowInteraction = {
    isRowSelected: gridSelection.isRowSelected,
    isCellSelected: gridSelection.isCellSelected,
    getRowClassName: (rowId) => gridCss.rowCssMap[rowId],
    getCellClassName: (rowId, colId) => gridCss.cellCssMap[colId]?.[rowId],
    getRowRef: rowDrag.enabled ? (rowId) => rowDrag.getRowProps(rowId).ref : undefined,
    onRowPointerDown: rowDrag.enabled
      ? (rowId, e) => rowDrag.getRowProps(rowId).onPointerDown(e)
      : undefined,
    rowDragEnabled: rowDrag.enabled,
    onCellClick: (rowId, colId, e) => {
      gridSelection.handleClick(rowId, colId, e.ctrlKey || e.metaKey, e.shiftKey)
      onCellClick?.(rowId, colId, e)
    },
    onCellDblClick: (rowId, colId, e) => {
      if (editable) {
        gridEditor.startEdit(rowId, colId)
      }
      onCellDblClick?.(rowId, colId, e)
    },
    isEditing: gridEditor.isEditing,
    editingValue: gridEditor.editingCell?.value,
    onEditorChange: gridEditor.setEditorValue,
    onEditorKeyDown: gridEditor.handleEditorKeyDown,
    onEditorBlur: () => gridEditor.endEdit(true),
    onCellMouseEnter: (e, rowId, colId) => {
      if (!tooltip) return
      const row = normalizedData.find((r) => r.id === rowId)
      const column = normalizedColumns.find((c) => c.id === colId)
      if (row && column) {
        gridTooltip.handleCellMouseEnter(e, rowId, colId, row as GridRow, column as GridColumn)
      }
    },
    onCellMouseLeave: gridTooltip.handleCellMouseLeave,
    getComputedValue: formulas ? formulaHook.getComputedValue : undefined,
  }

  // ─── Keyboard Navigation ─────────────────────────────────────────
  const scrollToCell = useCallback(
    (rowIdx: number, colIdx: number) => {
      const body = bodyRef.current
      if (!body) return

      const visibleCols = normalizedColumns

      // Vertical: scroll to make row visible
      const rowTop = rowIdx * rowHeight
      const rowBottom = rowTop + rowHeight
      const viewTop = body.scrollTop
      const viewBottom = viewTop + bodyClientHeight

      if (rowTop < viewTop) {
        body.scrollTop = rowTop
      } else if (rowBottom > viewBottom) {
        body.scrollTop = rowBottom - bodyClientHeight
      }

      // Horizontal: scroll to make column visible (accounting for frozen columns)
      let colLeft = 0
      for (let i = 0; i < colIdx; i++) {
        colLeft += visibleCols[i]?.$width ?? 0
      }
      const colRight = colLeft + (visibleCols[colIdx]?.$width ?? 0)
      const scrollableLeft = fixedLeftWidth
      const scrollableRight = bodyClientWidth - fixedRightWidth
      const viewLeft = body.scrollLeft + scrollableLeft
      const viewRight = body.scrollLeft + scrollableRight

      // Only scroll if column is in the center (non-frozen) area
      if (colIdx >= effectiveLeftSplit && colIdx < visibleCols.length - rightSplit) {
        if (colLeft < viewLeft) {
          body.scrollLeft = colLeft - scrollableLeft
        } else if (colRight > viewRight) {
          body.scrollLeft = colRight - scrollableRight
        }
      }
    },
    [normalizedColumns, rowHeight, bodyClientHeight, bodyClientWidth, fixedLeftWidth, fixedRightWidth, effectiveLeftSplit, rightSplit],
  )

  const pageScroll = useCallback(
    (direction: 'up' | 'down' | 'home' | 'end') => {
      const body = bodyRef.current
      if (!body) return
      switch (direction) {
        case 'up':
          body.scrollTop -= body.clientHeight
          break
        case 'down':
          body.scrollTop += body.clientHeight
          break
        case 'home':
          body.scrollTop = 0
          break
        case 'end':
          body.scrollTop = body.scrollHeight
          break
      }
    },
    [],
  )

  const gridKeyboard = useGridKeyboard({
    enabled: keyNavigation,
    data: normalizedData,
    columns: columnReorder.orderedColumns,
    selectedCell: gridSelection.selectedCell,
    editable,
    isEditing: gridEditor.editingCell !== null,
    onNavigate: (rowId, colId, shiftKey) => {
      gridSelection.handleClick(rowId, colId, false, shiftKey)
    },
    onStartEdit: (rowId, colId) => {
      gridEditor.startEdit(rowId, colId)
    },
    onEndEdit: (save) => {
      gridEditor.endEdit(save)
    },
    onScrollTo: scrollToCell,
    onPageScroll: pageScroll,
  })

  return (
    <div
      ref={rootRef}
      className={[
        styles.grid,
        autoHeight ? styles.gridAutoHeight : '',
        headerAutoHeight ? styles.gridHeaderAutoHeight : '',
        footerAutoHeight ? styles.gridFooterAutoHeight : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      tabIndex={keyNavigation ? 0 : undefined}
      onKeyDown={keyNavigation ? gridKeyboard.handleKeyDown : undefined}
      data-rgs-sortable={sortable}
      data-rgs-key-navigation={keyNavigation}
      data-rgs-tooltip={tooltip}
    >
      <div className={styles.header} style={{ height: totalHeaderHeight }}>
        {headerDropLineLeft !== null ? (
          <div
            className={styles.headerDropLine}
            style={{ left: headerDropLineLeft, height: totalHeaderHeight }}
          />
        ) : null}
        <div
          ref={headerScrollRef}
          className={styles.headerScroller}
          style={{
            marginLeft: fixedLeftWidth,
            marginRight: fixedRightWidth + verticalScrollbarWidth,
            overflow: 'scroll',
          }}
        >
          <div
            className={styles.headerTrack}
            style={{
              width: totalWidth - fixedLeftWidth - fixedRightWidth,
            }}
          >
            {renderHeaderColumns(centerColumns)}
          </div>
        </div>

        {fixedLeftColumns.length ? (
          <div
            className={[styles.fixedHeader, styles.fixedHeaderLeft].join(' ')}
            style={{ width: fixedLeftWidth }}
          >
            {renderHeaderColumns(fixedLeftColumns)}
          </div>
        ) : null}

        {freezable ? (
          <div
            className={[
              styles.freezeHandle,
              freezeHook.isDragging ? styles.freezeHandleDragging : '',
            ].filter(Boolean).join(' ')}
            style={{ left: fixedLeftWidth }}
            onPointerDown={freezeHook.handlePointerDown}
          />
        ) : null}

        {fixedRightColumns.length ? (
          <div
            className={[styles.fixedHeader, styles.fixedHeaderRight].join(' ')}
            style={{ width: fixedRightWidth, left: rightFixedLeft }}
          >
            {renderHeaderColumns(fixedRightColumns)}
          </div>
        ) : null}
      </div>

      <div className={styles.bodyViewport}>
        {rowDrag.dropIndicator ? (
          <div
            className={styles.rowDropLine}
            style={{ top: rowDrag.dropIndicator.top }}
          />
        ) : null}
        <div ref={bodyRef} className={styles.body} onScroll={handleScroll} data-testid="grid-body">
          {/* Spacer establishes scroll dimensions */}
          <div
            className={styles.bodyInner}
            style={{ width: totalWidth, height: totalHeight }}
          >
            {/* Main scrollable rows (center area) */}
            <div
              className={styles.rows}
              style={{
                transform: `translate(${virtual.offsetX}px, ${virtual.offsetY + fixedTopHeight}px)`,
              }}
            >
              {visibleRows.map((row) => renderRow(row, visibleColumns, styles, rowInteraction))}
              {/* Span overlay — absolutely-positioned cells over the rows */}
              {renderSpansOverlay(visibleRows, visibleColumns, styles, gridSpans, rowInteraction, rowHeight)}
            </div>
          </div>
        </div>

        {topRows.length ? (
          <div
            className={[styles.fixedRows, styles.fixedRowsTop].join(' ')}
            style={{
              height: fixedTopHeight,
              width: bodyClientWidth,
              overflow: 'hidden',
            }}
          >
            {/* Center scrollable section */}
            <div
              style={{
                position: 'absolute',
                left: fixedLeftWidth,
                width: bodyClientWidth - fixedLeftWidth - fixedRightWidth,
                height: fixedTopHeight,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -virtual.scrollLeft,
                  width: totalWidth - fixedLeftWidth - fixedRightWidth,
                }}
              >
                {topRows.map((row) => renderRow(row, centerColumns, styles, rowInteraction))}
              </div>
            </div>

            {/* Left corner overlay */}
            {fixedLeftColumns.length ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  width: fixedLeftWidth,
                  height: fixedTopHeight,
                  background: 'var(--react-tree-grid-color-background)',
                  zIndex: 1,
                }}
              >
                {topRows.map((row) => renderRow(row, fixedLeftColumns, styles, rowInteraction))}
              </div>
            ) : null}

            {/* Right corner overlay */}
            {fixedRightColumns.length ? (
              <div
                style={{
                  position: 'absolute',
                  left: rightFixedLeft,
                  width: fixedRightWidth,
                  height: fixedTopHeight,
                  background: 'var(--react-tree-grid-color-background)',
                  zIndex: 1,
                }}
              >
                {topRows.map((row) => renderRow(row, fixedRightColumns, styles, rowInteraction))}
              </div>
            ) : null}
          </div>
        ) : null}

        {bottomRows.length ? (
          <div
            className={[styles.fixedRows, styles.fixedRowsBottom].join(' ')}
            style={{
              height: fixedBottomHeight,
              width: bodyClientWidth,
              overflow: 'hidden',
              bottom: horizontalScrollbarHeight,
            }}
          >
            {/* Center scrollable section */}
            <div
              style={{
                position: 'absolute',
                left: fixedLeftWidth,
                width: bodyClientWidth - fixedLeftWidth - fixedRightWidth,
                height: fixedBottomHeight,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -virtual.scrollLeft,
                  width: totalWidth - fixedLeftWidth - fixedRightWidth,
                }}
              >
                {bottomRows.map((row) => renderRow(row, centerColumns, styles, rowInteraction))}
              </div>
            </div>

            {/* Left corner overlay */}
            {fixedLeftColumns.length ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  width: fixedLeftWidth,
                  height: fixedBottomHeight,
                  background: 'var(--react-tree-grid-color-background)',
                  zIndex: 1,
                }}
              >
                {bottomRows.map((row) => renderRow(row, fixedLeftColumns, styles, rowInteraction))}
              </div>
            ) : null}

            {/* Right corner overlay */}
            {fixedRightColumns.length ? (
              <div
                style={{
                  position: 'absolute',
                  left: rightFixedLeft,
                  width: fixedRightWidth,
                  height: fixedBottomHeight,
                  background: 'var(--react-tree-grid-color-background)',
                  zIndex: 1,
                }}
              >
                {bottomRows.map((row) => renderRow(row, fixedRightColumns, styles, rowInteraction))}
              </div>
            ) : null}
          </div>
        ) : null}

        {fixedLeftColumns.length ? (
          <div
            className={[styles.fixedColumns, styles.fixedColumnsLeft].join(' ')}
            style={{
              top: fixedTopHeight,
              height: bodyClientHeight - fixedTopHeight - fixedBottomHeight,
              width: fixedLeftWidth,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -virtual.scrollTop,
                height: totalHeight,
                width: fixedLeftWidth,
              }}
            >
              <div
                className={styles.rows}
                style={{
                  transform: `translateY(${virtual.offsetY}px)`,
                  width: fixedLeftWidth,
                }}
              >
                {visibleRows.map((row) => renderRow(row, fixedLeftColumns, styles, rowInteraction))}
              </div>
            </div>
          </div>
        ) : null}

        {fixedRightColumns.length ? (
          <div
            className={[styles.fixedColumns, styles.fixedColumnsRight].join(' ')}
            style={{
              left: rightFixedLeft,
              top: fixedTopHeight,
              height: bodyClientHeight - fixedTopHeight - fixedBottomHeight,
              width: fixedRightWidth,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -virtual.scrollTop,
                height: totalHeight,
                width: fixedRightWidth,
              }}
            >
              <div
                className={styles.rows}
                style={{
                  transform: `translateY(${virtual.offsetY}px)`,
                  width: fixedRightWidth,
                }}
              >
                {visibleRows.map((row) => renderRow(row, fixedRightColumns, styles, rowInteraction))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {footerRowCount > 0 && (
        <div className={styles.footer} style={{ height: totalFooterHeight }}>
          <div
            ref={footerScrollRef}
            className={styles.headerScroller}
            style={{
              marginLeft: fixedLeftWidth,
              marginRight: fixedRightWidth + verticalScrollbarWidth,
              overflow: 'scroll',
            }}
          >
            <div
              className={styles.headerTrack}
              style={{
                width: totalWidth - fixedLeftWidth - fixedRightWidth,
              }}
            >
              {renderFooterColumns(centerColumns)}
            </div>
          </div>

          {fixedLeftColumns.length ? (
            <div
              className={[styles.fixedHeader, styles.fixedHeaderLeft].join(' ')}
              style={{ width: fixedLeftWidth }}
            >
              {renderFooterColumns(fixedLeftColumns)}
            </div>
          ) : null}

          {fixedRightColumns.length ? (
            <div
              className={[styles.fixedHeader, styles.fixedHeaderRight].join(' ')}
              style={{ width: fixedRightWidth, left: rightFixedLeft }}
            >
              {renderFooterColumns(fixedRightColumns)}
            </div>
          ) : null}
        </div>
      )}

      {tooltip && gridTooltip.tooltipState
        ? createPortal(
            <div
              className={[
                styles.tooltip,
                gridTooltip.tooltipState.visible ? styles.tooltipVisible : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: gridTooltip.tooltipState.x + 12,
                top: gridTooltip.tooltipState.y + 16,
              }}
              role="tooltip"
            >
              {gridTooltip.tooltipState.content}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

export const Grid = forwardRef(GridInner) as <T extends GridRow>(
  props: GridProps<T> & RefAttributes<GridApi<T>>,
) => ReactElement | null
