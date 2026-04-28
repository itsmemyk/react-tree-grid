/** Drop position relative to target */
export type DropPosition = 'top' | 'bottom' | 'in'

/** Drag event data passed to event handlers */
export interface DragData {
  /** Id of the dragged item */
  start: string
  /** All source item ids (for multi-drag) */
  source: string[]
  /** Id of the drop target item */
  target: string | null
  /** Position relative to target */
  dropPosition?: DropPosition
  /** Current drag item type */
  dragItem?: DragType
}

/** Drag type */
export type DragType = 'row' | 'column' | 'group'

/** Drag mode — what the component supports */
export type DragMode = 'target' | 'source' | 'both'

/** Transfer data during drag operation */
export interface TransferData {
  start: string
  source: string[]
  target: string | null
  componentId: string
  dropComponentId: string | null
  type: DragType
  x: number
  y: number
  initXOffset: number
  initYOffset: number
  ghost: HTMLElement | null
  dropPosition?: DropPosition
}

export interface DragStartConfig {
  id: string
  source?: string[]
  type?: DragType
  ghost?: HTMLElement | null
  initXOffset?: number
  initYOffset?: number
}

export interface DragComponent {
  componentId: string
}

export interface DropTargetRegistration {
  id: string
  componentId: string
  element: HTMLElement
  mode?: DragMode
  type?: DragType
  accepts?: DragType[]
  getDropPosition?: (event: PointerEvent, element: HTMLElement) => DropPosition
  canDrop?: (transfer: TransferData) => boolean
}

export interface DragResult {
  data: DragData
  transfer: TransferData
}

export interface DragManagerConfig {
  autoScrollThreshold?: number
  autoScrollStep?: number
}

export interface UseDraggableConfig {
  id: string
  source?: string[]
  componentId: string
  type?: DragType
  disabled?: boolean
  ghost?: HTMLElement | null | (() => HTMLElement | null)
  getInitialOffset?: (event: React.PointerEvent<HTMLElement>) => {
    x: number
    y: number
  }
  onDragStart?: (transfer: TransferData) => void
  onAfterDrag?: (data: DragData) => void
  onCancelDrop?: (data: DragData) => void
}

export interface UseDropTargetConfig {
  id: string
  componentId: string
  type?: DragType
  mode?: DragMode
  accepts?: DragType[]
  disabled?: boolean
  getDropPosition?: (event: PointerEvent, element: HTMLElement) => DropPosition
  canDrop?: (transfer: TransferData) => boolean
  onDrop?: (data: DragData) => void
}
