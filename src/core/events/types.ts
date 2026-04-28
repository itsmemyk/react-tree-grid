/** Event handler callback */
export type EventCallback = (...args: unknown[]) => unknown

/** Event handler entry (matches DHTMLX internal structure) */
export interface EventHandler {
  callback: EventCallback
  context: unknown
}

/** Grid-specific events */
export enum GridEvents {
  scroll = 'scroll',
  sort = 'sort',
  expand = 'expand',
  filterChange = 'filterchange',
  resize = 'resize',
  cellClick = 'cellclick',
  cellRightClick = 'cellrightclick',
  cellMouseOver = 'cellmouseover',
  cellMouseDown = 'cellmousedown',
  cellDblClick = 'celldblclick',
  headerClick = 'headerclick',
  footerClick = 'footerclick',
  headerCellClick = 'headercellclick',
  footerCellClick = 'footercellclick',
  headerCellMouseOver = 'headercellmouseover',
  footerCellMouseOver = 'footercellmouseover',
  headerCellMouseDown = 'headercellmousedown',
  footerCellMouseDown = 'footercellmousedown',
  headerCellDblClick = 'headercelldblclick',
  footerCellDblClick = 'footercelldblclick',
  headerCellRightClick = 'headercellrightclick',
  footerCellRightClick = 'footercellrightclick',
  beforeSort = 'beforesort',
  afterSort = 'aftersort',
  beforeFilter = 'beforefilter',
  afterFilter = 'afterfilter',
  beforeResizeStart = 'beforeresizestart',
  afterResizeEnd = 'afterresizeend',
  beforeEditStart = 'beforeeditstart',
  afterEditStart = 'aftereditstart',
  beforeEditEnd = 'beforeeditend',
  afterEditEnd = 'aftereditend',
  beforeColumnHide = 'beforecolumnhide',
  afterColumnHide = 'aftercolumnhide',
  beforeColumnShow = 'beforecolumnshow',
  afterColumnShow = 'aftercolumnshow',
  beforeColumnDrag = 'beforecolumndrag',
  afterColumnDrag = 'aftercolumndrag',
  beforeColumnDrop = 'beforecolumndrop',
  afterColumnDrop = 'aftercolumndrop',
  beforeRowDrag = 'beforerowdrag',
  afterRowDrag = 'afterrowdrag',
  beforeRowDrop = 'beforerowdrop',
  afterRowDrop = 'afterrowdrop',
  beforeRowResize = 'beforerowresize',
  afterRowResize = 'afterrowresize',
}


/** Drag-and-drop events */
export enum DragEvents {
  beforeDrag = 'beforedrag',
  dragStart = 'dragstart',
  dragIn = 'dragin',
  dragOut = 'dragout',
  canDrop = 'candrop',
  cancelDrop = 'canceldrop',
  beforeDrop = 'beforedrop',
  afterDrop = 'afterdrop',
  afterDrag = 'afterdrag',
}

