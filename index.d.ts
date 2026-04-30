import { CSSProperties } from 'react';
import { Dispatch } from 'react';
import { DragEvent as DragEvent_2 } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { JSX } from 'react/jsx-runtime';
import { PointerEvent as PointerEvent_2 } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { RefAttributes } from 'react';
import { RefObject } from 'react';
import { SetStateAction } from 'react';

declare type AggregateType = 'sum' | 'avg' | 'count' | 'min' | 'max';

declare type CellCssMap = Record<string, Record<string, string>>;

/** Change tracking entry */
declare interface ChangeEntry {
    id: string;
    status: 'add' | 'update' | 'remove';
    obj: DataItem;
    saving: boolean;
    error?: boolean;
}

declare interface ColumnDragState extends GridColumnDragData {
}

declare interface ColumnDropIndicator {
    columnId: string;
    position: GridColumnDropPosition;
}

declare interface ColumnReorderEvents {
    onBeforeColumnDrag?: (data: GridColumnDragData, event: DragEvent_2) => boolean | void;
    onDragColumnStart?: (data: GridColumnDragData, event: DragEvent_2) => void;
    onDragColumnIn?: (data: GridColumnDragData, event: DragEvent_2) => void;
    onDragColumnOut?: (data: GridColumnDragData, event: DragEvent_2) => void;
    onAfterColumnDrag?: (data: GridColumnDragData, event: DragEvent_2) => void;
    canColumnDrop?: (data: GridColumnDragData, event: DragEvent_2) => boolean | void;
    onCancelColumnDrop?: (data: GridColumnDragData, event: DragEvent_2) => void;
    onBeforeColumnDrop?: (data: GridColumnDragData, event: DragEvent_2) => boolean | void;
    onAfterColumnDrop?: (data: GridColumnDragData, event: DragEvent_2) => void;
}

declare interface ColumnResizeEvents {
    onBeforeResizeStart?: (colId: string) => boolean | void;
    onResize?: (colId: string, width: number) => void;
    onAfterResizeEnd?: (colId: string, width: number) => void;
}

/**
 * ComboFilter — searchable dropdown (filterable select).
 *
 * Like SelectFilter but with a text search input inside the dropdown.
 * Full Combobox component (Phase 3h) can replace this later.
 */
export declare function ComboFilter<T extends GridRow>({ column, store, value, onChange, }: ComboFilterProps<T>): JSX.Element;

declare interface ComboFilterProps<T extends GridRow> {
    column: GridColumn<T>;
    store: DataStore<T>;
    value: unknown;
    onChange: (value: string | null) => void;
}

export declare interface CsvExportConfig {
    /** Column ids to export (default: all visible) */
    columns?: string[];
    /** Include header row (default: true) */
    includeHeader?: boolean;
    /** Include footer row (default: false) */
    includeFooter?: boolean;
    /** Row delimiter (default: '\n') */
    rowDelimiter?: string;
    /** Column delimiter (default: ',') */
    columnDelimiter?: string;
}

/** Base data item — all items must have a string id */
declare interface DataItem {
    id: string;
    [key: string]: unknown;
}

declare interface DataProxyConfig {
    url: string;
    pageSize?: number;
    polling?: number;
    params?: Record<string, unknown>;
    fetchFn?: (url: string, init?: RequestInit) => Promise<Response>;
}

/**
 * DataStore — faithful conversion of DHTMLX DataCollection (suite.js lines 8258-9040).
 *
 * Core data management class with:
 * - O(1) id lookup via _pull
 * - Ordered display via _order
 * - Stackable, permanent filters with restore
 * - Multi-column sorting with smart cycling
 * - Change tracking (max 10 per item)
 * - Per-item metadata via WeakMap
 * - Before/after events with veto pattern
 */
declare class DataStore<T extends DataItem = DataItem> {
    _pull: Record<string, T>;
    _order: T[];
    _initFilterOrder: T[] | null;
    _initSortOrder: T[] | null;
    _filters: Record<string, StoredFilter>;
    _sortingStates: SortRule[];
    _changes: {
        order: ChangeEntry[];
    };
    _meta: WeakMap<T, Record<string, unknown>>;
    _range: [number, number] | null;
    _loaded: boolean;
    config: DataStoreConfig;
    events: EventSystem;
    private _sort;
    private _sorter;
    constructor(config?: DataStoreConfig, events?: EventSystem);
    _reset(): void;
    /** Add one or more items. Fires beforeAdd/afterAdd events. Returns id(s). */
    add(newItem: T | T[], index?: number): string | string[] | undefined;
    /** Remove one or more items by id */
    remove(id: string | string[]): void;
    /** Remove all items and reset state */
    removeAll(): void;
    /** Check if an item with the given id exists */
    exists(id: string): boolean;
    /** Get item by id */
    getItem(id: string): T;
    /** Update an item with partial changes */
    update(id: string, newItem: Partial<T>, silent?: boolean): void;
    /** Get the index of an item in the current order */
    getIndex(id: string): number;
    /** Get the id of the item at a given index */
    getId(index: number): string | undefined;
    /** Get the number of items in the current display order */
    getLength(): number;
    /** Get nearest valid id (first item if given id doesn't exist) */
    getNearId(id: string): string;
    forEach(callback: (item: T, index: number, array: T[]) => void): void;
    map<R>(callback: (item: T, index: number, array: T[]) => R): R[];
    mapRange<R>(from: number, to: number, callback: (item: T, index: number, array: T[]) => R): R[];
    reduce<R>(callback: (acc: R, item: T, index: number) => R, acc: R): R;
    /** Find first matching item (searches unfiltered data) */
    find(conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig): T | null;
    /** Find all matching items (searches unfiltered data) */
    findAll(conf: ((item: T, index: number, array: T[]) => boolean) | FilterRuleConfig): T[];
    /**
     * Apply a filter. Supports stacking, permanent filters, and config-based or function rules.
     * Returns the filter ID.
     */
    filter(rule: FilterRule | null, config?: FilterConfig, silent?: boolean): string | undefined;
    /** Reset filters. Returns true if all non-permanent filters were removed. */
    resetFilter(config?: {
        id?: string;
        permanent?: boolean;
    }, silent?: boolean): boolean;
    /** Get active (non-local) filters */
    getFilters(config?: {
        permanent?: boolean;
    }): Record<string, StoredFilter> | null;
    /** Get raw filters (optionally only permanent) */
    getRawFilters(config?: {
        permanent?: boolean;
    }): Record<string, StoredFilter> | null;
    /** Get the unfiltered data order */
    getInitialData(): T[] | null;
    /**
     * Sort by a rule. Supports multi-column and smart sorting (click cycling).
     */
    sort(rule: SortRule | null, config?: SortConfig, ignore?: boolean): void;
    /** Get current sorting states */
    getSortingStates(): SortRule[];
    /** Parse data array into the store */
    parse(data: T[]): void;
    /** Serialize current order to plain objects (strips $ prefixed keys) */
    serialize(): T[];
    setMeta(obj: T, key: string, value: unknown): void;
    getMeta(obj: T, key: string): unknown;
    getMetaMap(obj: T): Record<string, unknown> | undefined;
    isSaved(): boolean;
    /** Change the id of an existing item */
    changeId(id: string, newId?: string, silent?: boolean): void;
    setRange(from: number, to: number): void;
    getRawData(from: number, to: number, order?: T[], mode?: number): T[];
    /** Copy item(s) — optionally to another DataStore */
    copy(id: string | string[], index: number, target?: DataStore<T>, targetId?: string): string | string[] | null;
    /** Move item(s) — optionally to another DataStore */
    move(id: string | string[], index: number, target?: DataStore<T>, targetId?: string, newId?: string): string | string[] | null;
    isDataLoaded(from?: number, to?: number): boolean;
    private _add;
    private _remove;
    _addCore(obj: T, index?: number): string;
    private _removeCore;
    private _parseData;
    private _onChange;
    private _addToOrder;
    _applySorters(): void;
    private _applyFilters;
    _reapplyFilters(): void;
    private _getRuleCallback;
    private _getPureFilters;
    private _normalizeFilters;
    private _findByConf;
    private _copy;
    private _move;
    private _copyWithoutInternal;
}

/** DataStore configuration */
declare interface DataStoreConfig {
    /** Item init callback — called on each item during add/parse */
    init?: (item: DataItem) => DataItem;
    /** Item update callback — called after update */
    update?: (item: DataItem) => void;
}

/**
 * Detect parent theme by walking up the DOM to find the nearest [data-react-tree-grid-theme] attribute.
 * Returns the theme name or null if not found.
 */
export declare function detectTheme(element: HTMLElement): ThemeName | null;

/**
 * Export and download grid data as a CSV file.
 */
export declare function downloadGridAsCsv<T extends DataItem>(store: DataStore<T>, columns: GridColumn<T>[], filename: string, config?: CsvExportConfig): void;

/**
 * Export and download grid data as an Excel file.
 */
export declare function downloadGridAsExcel<T extends DataItem>(store: DataStore<T>, columns: GridColumn<T>[], filename: string, config?: ExcelExportConfig): void;

declare interface DropIndicator {
    rowId: string;
    position: GridRowDropPosition;
    top: number;
}

declare interface EditingCell {
    rowId: string;
    colId: string;
    value: unknown;
    originalValue: unknown;
}

/** Event handler callback */
declare type EventCallback = (...args: unknown[]) => unknown;

/** Event handler entry (matches DHTMLX internal structure) */
declare interface EventHandler {
    callback: EventCallback;
    context: unknown;
}

/**
 * Event system — faithful conversion of DHTMLX EventSystem (suite.js lines 616-656).
 *
 * Supports:
 * - Named event subscription with optional context
 * - Detach by name (all handlers) or by name+context (selective)
 * - Fire with veto pattern: returns false if ANY handler returns false
 * - Clear all handlers
 */
declare class EventSystem {
    events: Record<string, EventHandler[]>;
    private context;
    constructor(context?: unknown);
    /** Subscribe to an event. Name is case-insensitive. */
    on(name: string, callback: EventCallback, context?: unknown): void;
    /**
     * Detach handlers for an event.
     * - With context: removes only handlers matching that context
     * - Without context: removes ALL handlers for the event
     */
    detach(name: string, context?: unknown): void;
    /**
     * Fire an event. Returns false if ANY handler returns false (veto pattern).
     * Returns true if no handlers or all handlers return non-false.
     */
    fire(name: string, args?: unknown[]): boolean;
    /** Remove all event handlers */
    clear(): void;
}

export declare interface ExcelExportConfig {
    /** Column ids to export (default: all visible) */
    columns?: string[];
    /** Include header row (default: true) */
    includeHeader?: boolean;
    /** Sheet name (default: 'Sheet1') */
    sheetName?: string;
}

/**
 * Export grid data to CSV string.
 */
export declare function exportGridToCsv<T extends DataItem>(store: DataStore<T>, columns: GridColumn<T>[], config?: CsvExportConfig): string;

/**
 * Build a minimal XLSX file (Open XML SpreadsheetML) as a Blob.
 *
 * Uses inline strings (no shared string table) for simplicity.
 * This avoids any external dependency while producing valid .xlsx files.
 */
export declare function exportGridToExcel<T extends DataItem>(store: DataStore<T>, columns: GridColumn<T>[], config?: ExcelExportConfig): Blob;

/** Filter configuration */
declare interface FilterConfig {
    /** Add to existing filters (stack) instead of replacing */
    add?: boolean;
    /** Permanent filter — reapplied on add/remove */
    permanent?: boolean;
    /** Smart filter mode */
    smartFilter?: boolean;
    /** Filter ID for stacking */
    id?: string;
    /** Internal: local filter (excluded from getFilters) */
    $local?: boolean;
    /** Internal: restore mode */
    $restore?: boolean;
}

/** Filter rule — either a function or a config object */
declare type FilterRule = ((item: DataItem) => boolean) | FilterRuleConfig | Record<string, FilterRuleConfig>;

/** Config-based filter rule */
declare interface FilterRuleConfig {
    /** Field to filter by */
    by: string;
    /** Value to match */
    match: unknown;
    /** Custom compare function */
    compare?: (value: unknown, match: unknown, item: DataItem, multi?: unknown) => boolean;
    /** Multi-value for compare */
    multi?: unknown;
}

export declare type FooterValues = Record<string, Record<number, string | number>>;

export declare const Grid: <T extends GridRow>(props: GridProps<T> & RefAttributes<GridApi<T>>) => ReactElement | null;

declare type GridAdjustOption = boolean | 'data' | 'header' | 'footer';

export declare interface GridApi<T extends GridRow = GridRow> {
    addRowCss: (rowId: string, css: string) => void;
    removeRowCss: (rowId: string, css: string) => void;
    addCellCss: (rowId: string, colId: string, css: string) => void;
    removeCellCss: (rowId: string, colId: string, css: string) => void;
    showColumn: (colId: string) => void;
    hideColumn: (colId: string) => void;
    getColumn: (colId: string) => GridColumn<T> | undefined;
    setColumns: (columns: GridColumn<T>[]) => void;
}

export declare interface GridCellCoord {
    rowId: string;
    colId: string;
}

export declare interface GridColumn<T = Record<string, unknown>> {
    id: string;
    header?: GridHeaderCell[];
    footer?: GridFooterCell[];
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    hidden?: boolean;
    sortable?: boolean;
    resizable?: boolean;
    gravity?: number;
    type?: GridColumnType;
    editorType?: GridEditorType;
    template?: (value: unknown, row: T, column: GridColumn<T>) => ReactNode;
    align?: 'left' | 'center' | 'right';
    htmlEnable?: boolean;
    /** Per-column auto-fit width. Overrides grid-level `adjust`. */
    adjust?: GridAdjustOption;
    /** Per-column opt-in/out of `autoWidth` distribution. */
    autoWidth?: boolean;
    /** Override tooltip content for this column. Return null/empty to suppress. */
    tooltipTemplate?: (value: unknown, row: T, column: GridColumn<T>) => string | null | undefined;
    /** Explicitly enable/disable tooltip for this column. Default: inherits grid `tooltip`. */
    tooltip?: boolean;
    /** Auto-applied cell CSS derived from min/max or a custom function. */
    mark?: GridMarkConfig<T>;
}

export declare interface GridColumnDragData {
    start: string;
    source: string[];
    target: string | null;
    position: GridColumnDropPosition | null;
}

export declare type GridColumnDropPosition = 'before' | 'after';

export declare type GridColumnType = 'string' | 'number' | 'date' | 'boolean' | 'select' | 'combo' | 'checkbox';

export declare type GridDragItem = 'row' | 'column';

export declare type GridDragMode = 'source' | 'target' | 'both';

declare interface GridEditorEvents {
    onBeforeEditStart?: (rowId: string, colId: string) => boolean | void;
    onAfterEditStart?: (rowId: string, colId: string) => void;
    onBeforeEditEnd?: (rowId: string, colId: string, newValue: unknown, oldValue: unknown) => boolean | void;
    onAfterEditEnd?: (rowId: string, colId: string, newValue: unknown) => void;
}

export declare type GridEditorType = 'input' | 'select' | 'combo' | 'checkbox' | 'datePicker' | 'multiselect';

export declare interface GridFilterState {
    /** Current filter values keyed by column id */
    values: Record<string, unknown>;
    /** Set a filter value for a column (null/empty clears) */
    setFilterValue: (columnId: string, value: unknown) => void;
    /** Clear all header filters */
    clearFilters: () => void;
}

export declare interface GridFooterCell {
    id?: string;
    text?: string;
    css?: string;
    content?: GridFooterContent;
    template?: (value: number, column: GridColumn<any>) => string;
}

export declare type GridFooterContent = 'sum' | 'avg' | 'count' | 'min' | 'max';

export declare interface GridHeaderCell {
    id?: string;
    text?: string;
    css?: string;
    content?: GridHeaderFilterContent;
}

export declare type GridHeaderFilterContent = 'selectFilter' | 'inputFilter' | 'comboFilter';

export declare type GridMarkConfig<T = Record<string, unknown>> = GridMarkRange | GridMarkFunction<T>;

export declare type GridMarkFunction<T = Record<string, unknown>> = (cellValue: unknown, allColumnValues: unknown[], row: T, column: GridColumn<T>) => string | false | null | undefined;

export declare interface GridMarkRange {
    min?: string;
    max?: string;
}

export declare interface GridProps<T extends GridRow = GridRow> {
    columns: GridColumn<T>[];
    data: T[];
    store?: DataStore<T>;
    spans?: GridSpan[];
    rowHeight?: number;
    headerRowHeight?: number;
    footerRowHeight?: number;
    sortable?: boolean;
    keyNavigation?: boolean;
    tooltip?: boolean;
    selection?: boolean | 'row' | 'cell' | 'complex';
    multiselection?: boolean;
    editable?: boolean;
    leftSplit?: number;
    rightSplit?: number;
    topSplit?: number;
    bottomSplit?: number;
    /** Auto-fit column widths to content (grid-level). */
    adjust?: GridAdjustOption;
    /** Distribute remaining width proportionally across flexible columns. */
    autoWidth?: boolean;
    /** Per-row height wraps to fit widest cell content. */
    autoHeight?: boolean;
    /** Header row height wraps to fit widest header text. */
    headerAutoHeight?: boolean;
    /** Footer row height wraps to fit widest footer text. */
    footerAutoHeight?: boolean;
    dragItem?: GridDragItem;
    dragMode?: GridDragMode;
    rootParent?: string;
    className?: string;
    style?: CSSProperties;
    onScroll?: (state: {
        x: number;
        y: number;
    }) => void;
    onBeforeResizeStart?: (colId: string) => boolean | void;
    onResize?: (colId: string, width: number) => void;
    onAfterResizeEnd?: (colId: string, width: number) => void;
    onBeforeSort?: (states: SortState[]) => boolean | void;
    onAfterSort?: (states: SortState[]) => void;
    onBeforeSelect?: (rowId: string, colId: string) => boolean | void;
    onAfterSelect?: (rowId: string, colId: string) => void;
    onBeforeUnSelect?: (rowId: string, colId: string) => boolean | void;
    onAfterUnSelect?: (rowId: string, colId: string) => void;
    onCellClick?: (rowId: string, colId: string, event: React.MouseEvent) => void;
    onCellDblClick?: (rowId: string, colId: string, event: React.MouseEvent) => void;
    onBeforeEditStart?: (rowId: string, colId: string) => boolean | void;
    onAfterEditStart?: (rowId: string, colId: string) => void;
    onBeforeEditEnd?: (rowId: string, colId: string, newValue: unknown, oldValue: unknown) => boolean | void;
    onAfterEditEnd?: (rowId: string, colId: string, newValue: unknown) => void;
    onBeforeColumnDrag?: (data: GridColumnDragData, event: React.DragEvent) => boolean | void;
    onDragColumnStart?: (data: GridColumnDragData, event: React.DragEvent) => void;
    onDragColumnIn?: (data: GridColumnDragData, event: React.DragEvent) => void;
    onDragColumnOut?: (data: GridColumnDragData, event: React.DragEvent) => void;
    onAfterColumnDrag?: (data: GridColumnDragData, event: React.DragEvent) => void;
    canColumnDrop?: (data: GridColumnDragData, event: React.DragEvent) => boolean | void;
    onCancelColumnDrop?: (data: GridColumnDragData, event: React.DragEvent) => void;
    onBeforeColumnDrop?: (data: GridColumnDragData, event: React.DragEvent) => boolean | void;
    onAfterColumnDrop?: (data: GridColumnDragData, event: React.DragEvent) => void;
    onBeforeRowDrag?: (data: GridRowDragData, event: PointerEvent) => boolean | void;
    onDragRowStart?: (data: GridRowDragData, event: PointerEvent) => void;
    onDragRowIn?: (data: GridRowDragData, event: PointerEvent) => void;
    onDragRowOut?: (data: GridRowDragData, event: PointerEvent) => void;
    canRowDrop?: (data: GridRowDragData, event: PointerEvent) => boolean | void;
    onCancelRowDrop?: (data: GridRowDragData, event: PointerEvent) => void;
    onBeforeRowDrop?: (data: GridRowDragData, event: PointerEvent) => boolean | void;
    onAfterRowDrop?: (data: GridRowDragData, event: PointerEvent) => void;
    onAfterRowDrag?: (data: GridRowDragData, event: PointerEvent) => void;
    dataProxy?: DataProxyConfig;
    paginationMode?: 'append' | 'replace';
    remoteSort?: boolean;
    remoteFilter?: boolean;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onLoadError?: (error: Error) => void;
    freezable?: boolean;
    onFreeze?: (splits: {
        left: number;
        top: number;
    }) => void;
    formulas?: boolean;
}

export declare interface GridRow {
    id: string;
    hidden?: boolean;
    $height?: number;
    $css?: string;
    [key: string]: unknown;
}

export declare interface GridRowDragData {
    start: string;
    source: string[];
    target: string | null;
    position: GridRowDropPosition | null;
}

export declare type GridRowDropPosition = 'top' | 'bottom' | 'in';

declare interface GridSelectionConfig {
    mode: SelectionMode_2;
    multiselection: boolean;
    disabled: boolean;
    events: GridSelectionEvents;
}

declare interface GridSelectionEvents {
    onBeforeSelect?: (rowId: string, colId: string) => boolean | void;
    onAfterSelect?: (rowId: string, colId: string) => void;
    onBeforeUnSelect?: (rowId: string, colId: string) => boolean | void;
    onAfterUnSelect?: (rowId: string, colId: string) => void;
}

declare interface GridSortEvents {
    onBeforeSort?: (states: SortState[]) => boolean | void;
    onAfterSort?: (states: SortState[]) => void;
    onRemoteSort?: (sortBy: string | null, sortDir: string | null) => void;
}

export declare interface GridSpan {
    row: string;
    column: string;
    rowspan?: number;
    colspan?: number;
    text?: string;
    css?: string;
    tooltip?: string;
}

declare interface GridSpansResult {
    /** Get span info if this cell is the span origin */
    getSpan: (rowId: string, colId: string) => SpanInfo | undefined;
    /** Check if this cell is covered (hidden) by another span */
    isCovered: (rowId: string, colId: string) => boolean;
    /**
     * Extend the visible row/col range to include span origins that are
     * outside the viewport but whose spanned area overlaps it.
     */
    extendRange: (yStart: number, yEnd: number, xStart: number, xEnd: number) => {
        yStart: number;
        yEnd: number;
        xStart: number;
        xEnd: number;
    };
}

declare type GroupAggregateConfig = Record<string, AggregateType>;

/**
 * InputFilter — text input with debounced filter.
 *
 * Renders <input type="text"> in header cell. Applies filter after 300ms
 * of inactivity. Empty string clears the column filter.
 */
export declare function InputFilter<T extends GridRow>({ column, value, onChange, }: InputFilterProps<T>): JSX.Element;

declare interface InputFilterProps<T extends GridRow> {
    column: GridColumn<T>;
    value: unknown;
    onChange: (value: string) => void;
}

declare interface RowDragEvents {
    onBeforeRowDrag?: (data: GridRowDragData, event: PointerEvent) => boolean | void;
    onDragRowStart?: (data: GridRowDragData, event: PointerEvent) => void;
    onDragRowIn?: (data: GridRowDragData, event: PointerEvent) => void;
    onDragRowOut?: (data: GridRowDragData, event: PointerEvent) => void;
    canRowDrop?: (data: GridRowDragData, event: PointerEvent) => boolean | void;
    onCancelRowDrop?: (data: GridRowDragData, event: PointerEvent) => void;
    onBeforeRowDrop?: (data: GridRowDragData, event: PointerEvent) => boolean | void;
    onAfterRowDrop?: (data: GridRowDragData, event: PointerEvent) => void;
    onAfterRowDrag?: (data: GridRowDragData, event: PointerEvent) => void;
}

/**
 * SelectFilter — dropdown with unique column values.
 *
 * Scans the DataStore's full (unfiltered) data for unique values in the column
 * and renders a native <select>. Empty selection = "All" (clears filter).
 */
export declare function SelectFilter<T extends GridRow>({ column, store, value, onChange, }: SelectFilterProps<T>): JSX.Element;

declare interface SelectFilterProps<T extends GridRow> {
    column: GridColumn<T>;
    store: DataStore<T>;
    value: unknown;
    onChange: (value: string | null) => void;
}

declare type SelectionMode_2 = 'row' | 'cell' | 'complex';

/**
 * Imperative theme setter — faithful conversion of DHTMLX setTheme (suite.js lines 173-183).
 * Sets data-react-tree-grid-theme attribute on a container (defaults to document.documentElement).
 * If no container is given, clears all existing data-react-tree-grid-theme attributes first.
 */
export declare function setTheme(theme?: ThemeName, container?: HTMLElement): void;

/** Sort configuration */
declare interface SortConfig {
    /** Enable smart sorting: click cycles asc → desc → none */
    smartSorting?: boolean;
}

/** Sort direction */
declare type SortDir = 'asc' | 'desc';

export declare type SortOrder = 'asc' | 'desc';

/** Sort rule for a single column */
declare interface SortRule {
    /** Field to sort by */
    by: string;
    /** Sort direction */
    dir: SortDir;
    /** Custom value accessor (e.g. parse date before compare) */
    as?: (value: unknown) => unknown;
    /** Custom comparison function (overrides natural compare) */
    rule?: (a: DataItem, b: DataItem) => number;
    /** Whether this was set via smart sorting (click cycling) */
    smartSorting?: boolean;
}

export declare interface SortState {
    columnId: string;
    order: SortOrder;
}

declare interface SpanInfo {
    /** Original span config */
    span: GridSpan;
    /** Resolved row count */
    rowspan: number;
    /** Resolved column count */
    colspan: number;
    /** Sum of spanned column widths in pixels */
    width: number;
    /** Sum of spanned row heights in pixels */
    height: number;
}

/** Stored filter entry */
declare interface StoredFilter {
    rule: FilterRule;
    config: FilterConfig;
}

declare interface ThemeContextValue {
    theme: ThemeName;
    tokens: ThemeTokens;
}

export declare type ThemeName = 'light' | 'dark';

export declare function ThemeProvider({ theme, overrides, children, }: ThemeProviderProps): JSX.Element;

export declare interface ThemeProviderProps {
    theme?: ThemeName;
    overrides?: Partial<ThemeTokens>;
    children: ReactNode;
}

/** All design token keys. Values map to CSS custom properties as --react-tree-grid-{key-in-kebab-case}. */
export declare interface ThemeTokens {
    colorPrimary: string;
    colorPrimaryHover: string;
    colorSecondary: string;
    colorDanger: string;
    colorSuccess: string;
    colorWarning: string;
    colorBackground: string;
    colorSurface: string;
    colorText: string;
    colorTextSecondary: string;
    colorBorder: string;
    fontFamily: string;
    fontSizeSm: string;
    fontSizeMd: string;
    fontSizeLg: string;
    fontWeightNormal: string;
    fontWeightMedium: string;
    fontWeightBold: string;
    spacingXs: string;
    spacingSm: string;
    spacingMd: string;
    spacingLg: string;
    spacingXl: string;
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
    zIndexDropdown: string;
    zIndexModal: string;
    zIndexPopup: string;
    zIndexTooltip: string;
}

export declare const Tree: ForwardRefExoticComponent<TreeProps & RefAttributes<TreeRef>>;

export declare const TreeGrid: ForwardRefExoticComponent<TreeGridProps<TreeGridRow> & RefAttributes<TreeGridRef>>;

declare type TreeGridDropBehaviour = 'child' | 'sibling' | 'complex';

export declare interface TreeGridProps<T extends TreeGridRow = TreeGridRow> extends Omit<GridProps<T>, 'data' | 'store'> {
    data: T[];
    columns: GridColumn<T>[];
    treeColumnId?: string;
    collapsed?: boolean;
    rootParent?: string;
    dropBehaviour?: TreeGridDropBehaviour;
    dragExpand?: boolean;
    groupBy?: string | string[];
    groupAggregate?: GroupAggregateConfig;
}

export declare interface TreeGridRef {
    open(id: string): void;
    close(id: string): void;
    openAll(): void;
    closeAll(): void;
}

export declare interface TreeGridRow extends GridRow {
    parent?: string;
    items?: TreeGridRow[];
    $opened?: boolean;
}

export declare interface TreeNode {
    id: string;
    value: string;
    icon?: ReactNode;
    items?: TreeNode[];
    disabled?: boolean;
    $opened?: boolean;
}

export declare interface TreeProps {
    data: TreeNode[];
    checkbox?: boolean;
    editable?: boolean;
    /** 'item' = item is drag source; 'both' = item is source and drop target */
    dragItem?: 'item' | 'both';
    virtual?: boolean;
    expanded?: string[];
    defaultExpanded?: string[];
    selected?: string[];
    checked?: string[];
    css?: string;
    onSelect?: (id: string) => void;
    onCheck?: (ids: string[]) => void;
    onExpand?: (id: string) => void;
    onCollapse?: (id: string) => void;
    onEdit?: (id: string, newValue: string) => void;
    onDrop?: (dragId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
}

export declare interface TreeRef {
    expand(id: string): void;
    collapse(id: string): void;
    expandAll(): void;
    collapseAll(): void;
    select(ids: string[]): void;
    check(ids: string[]): void;
}

export declare function useColumnReorder<T extends GridRow>(columns: GridColumn<T>[], config: {
    dragItem?: GridDragItem;
    dragMode?: GridDragMode;
    leftSplit: number;
    rightSplit: number;
}, events: ColumnReorderEvents): {
    enabled: boolean;
    orderedColumns: GridColumn<T>[];
    dragState: ColumnDragState | null;
    dropIndicator: ColumnDropIndicator | null;
    setColumnOrder: Dispatch<SetStateAction<string[]>>;
    handleHeaderDragStart: (event: DragEvent_2, colId: string) => void;
    handleHeaderDragOver: (event: DragEvent_2, targetColId: string) => void;
    handleHeaderDrop: (event: DragEvent_2, targetColId: string) => void;
    handleHeaderDragEnd: (event: DragEvent_2) => void;
    shouldPreventHeaderClick: () => boolean;
};

/**
 * Manages interactive column resize for the Grid.
 * Faithful conversion of DHTMLX suite.js Resizer module.
 *
 * Detects pointer near column right edge in header, starts resize on drag.
 * Updates column widths in real time via direct DOM manipulation,
 * then commits to React state on drag end.
 */
export declare function useColumnResize<T extends GridRow>(_columns: GridColumn<T>[], events: ColumnResizeEvents): {
    widthOverrides: Record<string, number>;
    getWidth: (col: GridColumn<T>) => number;
    handleHeaderPointerDown: (e: React.PointerEvent, colId: string, currentWidth: number, col: GridColumn<T>) => boolean;
    handleHeaderPointerMove: (e: React.PointerEvent, col: GridColumn<T>) => string | undefined;
};

export declare function useFreeze({ containerRef, columnCount, initialFreezeCol, onFreeze, }: UseFreezeOptions): UseFreezeReturn;

export declare interface UseFreezeOptions {
    containerRef: React.RefObject<HTMLDivElement | null>;
    columnCount: number;
    initialFreezeCol?: number;
    onFreeze?: (col: number) => void;
}

export declare interface UseFreezeReturn {
    freezeCol: number;
    setFreezeCol: (col: number) => void;
    isDragging: boolean;
    handlePointerDown: (e: React.PointerEvent) => void;
}

export declare function useGridCss<T extends GridRow>(rows: T[], columns: GridColumn<T>[]): {
    addRowCss: (rowId: string, css: string) => void;
    removeRowCss: (rowId: string, css: string) => void;
    addCellCss: (rowId: string, colId: string, css: string) => void;
    removeCellCss: (rowId: string, colId: string, css: string) => void;
    rowCssMap: Record<string, string>;
    cellCssMap: CellCssMap;
};

/**
 * Manages inline cell editing for the Grid.
 * Faithful conversion of DHTMLX suite.js Grid editing (editCell/editEnd).
 *
 * Behavior:
 * - Double-click cell (or single-click checkbox) → open editor
 * - Enter/Tab → commit and move to next cell
 * - Escape → cancel
 * - Click outside → commit
 * - Updates DataStore on commit
 */
export declare function useGridEditor<T extends GridRow>(store: DataStore<T & DataItem> | undefined, data: T[], columns: GridColumn<T>[], events: GridEditorEvents): {
    editingCell: EditingCell | null;
    editorRef: RefObject<HTMLInputElement | null>;
    startEdit: (rowId: string, colId: string) => void;
    endEdit: (save: boolean) => void;
    setEditorValue: (value: unknown) => void;
    handleEditorKeyDown: (e: React.KeyboardEvent) => void;
    isEditing: (rowId: string, colId: string) => boolean;
};

/**
 * useGridFilter — manages header filter state and syncs with DataStore.
 *
 * Each column filter is stored as a $local, permanent, stacked filter on the
 * DataStore with id = `__hf_${columnId}` so it doesn't collide with
 * user-defined filters.
 */
export declare function useGridFilter<T extends GridRow>(store: DataStore<T> | undefined, columns: GridColumn<T>[], onRemoteFilter?: (filters: Record<string, unknown>) => void): GridFilterState;

/**
 * useGridFooter — computes footer aggregate values from DataStore.
 *
 * For each column with a `footer[].content` aggregate type, computes the
 * value from the current (filtered) DataStore order.
 *
 * Returns a map of `columnId → { rowIndex → computed value }`.
 */
export declare function useGridFooter<T extends GridRow>(store: DataStore<T> | undefined, columns: GridColumn<T>[], data: T[]): FooterValues;

/**
 * Manages row and cell selection for the Grid.
 * Faithful conversion of DHTMLX suite.js Grid Selection (module 230).
 *
 * Modes:
 * - 'row': clicking a cell selects the entire row
 * - 'cell': clicking a cell selects just that cell
 * - 'complex': clicking selects both the row and highlights the specific cell
 *
 * Multi-selection:
 * - Ctrl+click: toggle item in selection
 * - Shift+click: range select from last selected to current
 */
export declare function useGridSelection<T extends GridRow>(data: T[], config: GridSelectionConfig): {
    selectedRows: Set<string>;
    selectedCell: GridCellCoord | null;
    handleClick: (rowId: string, colId: string, ctrlKey: boolean, shiftKey: boolean) => void;
    isRowSelected: (rowId: string) => boolean;
    isCellSelected: (rowId: string, colId: string) => boolean;
    clearSelection: () => void;
};

/**
 * Manages sort state and header click-to-sort for the Grid.
 * Faithful conversion of DHTMLX suite.js Grid._initSort and _sortingStates.
 *
 * Behavior:
 * - Click header → cycle: asc → desc → none
 * - Ctrl+click → add/modify secondary sort column (multi-sort)
 * - Fires events, then calls store.sort() with sort rules
 */
export declare function useGridSort<T extends GridRow>(store: DataStore<T & DataItem> | undefined, columns: GridColumn<T>[], events: GridSortEvents): {
    sortingStates: SortState[];
    handleHeaderClick: (colId: string, ctrlKey: boolean) => void;
    getSortOrder: (colId: string) => SortOrder | undefined;
    getSortIndex: (colId: string) => number;
};

/**
 * useGridSpans — builds lookup maps for cell spanning.
 *
 * Produces O(1) lookups for:
 * - span origins (cells that render with extended width/height)
 * - covered cells (cells hidden because they're inside a span)
 * - range extension (ensures partially visible spans are rendered)
 */
export declare function useGridSpans<T extends GridRow>(spans: GridSpan[] | undefined, columns: GridColumn<T>[], rowIds: string[], colWidths: Record<string, number>, rowHeights: Record<string, number>): GridSpansResult;

export declare function useRowDrag<T extends GridRow>(rows: T[], config: {
    store?: DataStore<T & DataItem>;
    dragItem?: GridDragItem;
    dragMode?: GridDragMode;
    rowHeight: number;
    viewportRef: RefObject<HTMLDivElement | null>;
}, events: RowDragEvents): {
    enabled: boolean;
    orderedRows: T[];
    dropIndicator: DropIndicator | null;
    getRowProps: (rowId: string) => {
        ref: (node: HTMLDivElement | null) => void;
        onPointerDown: (event: PointerEvent_2<HTMLElement>) => void;
    };
};

export declare function useTheme(): ThemeContextValue;

export { }
