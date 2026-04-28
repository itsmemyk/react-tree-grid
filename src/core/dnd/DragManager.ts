import { EventSystem } from '../events/EventSystem'
import { DragEvents } from '../events/types'
import type {
  DragComponent,
  DragData,
  DragManagerConfig,
  DragResult,
  DragStartConfig,
  DropPosition,
  DropTargetRegistration,
  TransferData,
} from './types'

export class DragManager {
  events: EventSystem
  transfer: TransferData | null = null
  private _targets = new Map<string, DropTargetRegistration>()
  private _activeTargetId: string | null = null
  private _config: Required<DragManagerConfig>

  constructor(config: DragManagerConfig = {}) {
    this.events = new EventSystem(this)
    this._config = {
      autoScrollThreshold: config.autoScrollThreshold ?? 24,
      autoScrollStep: config.autoScrollStep ?? 18,
    }
  }

  registerTarget(config: DropTargetRegistration): () => void {
    this._targets.set(config.id, config)
    return () => {
      if (this._activeTargetId === config.id) {
        this._activeTargetId = null
      }
      this._targets.delete(config.id)
    }
  }

  dragStart(
    event: PointerEvent,
    item: DragStartConfig,
    component: DragComponent,
  ): TransferData | null {
    const source = item.source?.length ? [...item.source] : [item.id]
    const nextTransfer: TransferData = {
      start: item.id,
      source,
      target: null,
      componentId: component.componentId,
      dropComponentId: null,
      type: item.type ?? 'row',
      x: event.clientX,
      y: event.clientY,
      initXOffset: item.initXOffset ?? 0,
      initYOffset: item.initYOffset ?? 0,
      ghost: item.ghost ?? null,
    }

    if (!this.events.fire(DragEvents.beforeDrag, [this.toDragData(nextTransfer), nextTransfer])) {
      return null
    }

    this.transfer = nextTransfer
    if (nextTransfer.ghost) {
      this._prepareGhost(nextTransfer.ghost, nextTransfer)
      document.body.appendChild(nextTransfer.ghost)
    }

    this.events.fire(DragEvents.dragStart, [this.toDragData(nextTransfer), nextTransfer])
    return nextTransfer
  }

  drag(event: PointerEvent): TransferData | null {
    if (!this.transfer) {
      return null
    }

    this.transfer.x = event.clientX
    this.transfer.y = event.clientY
    this._moveGhost(this.transfer)

    const resolved = this._resolveTarget(event)
    const previousTargetId = this._activeTargetId
    const nextTargetId = resolved?.id ?? null

    if (previousTargetId && previousTargetId !== nextTargetId) {
      const previous = this._targets.get(previousTargetId)
      if (previous) {
        this.events.fire(DragEvents.dragOut, [previous.id, this.toDragData(this.transfer), this.transfer])
      }
    }

    if (resolved && previousTargetId !== resolved.id) {
      this.events.fire(DragEvents.dragIn, [resolved.id, this.toDragData(this.transfer), this.transfer])
    }

    this._activeTargetId = nextTargetId
    this.transfer.target = resolved?.accepted ? resolved.id : null
    this.transfer.dropComponentId = resolved?.accepted ? resolved.componentId : null
    this.transfer.dropPosition = resolved?.accepted ? resolved.position : undefined

    const container = this._findScrollContainer(this._getEventElement(event))
    if (container) {
      this._autoScroll(container, event)
    }

    return this.transfer
  }

  drop(event: PointerEvent): DragResult | null {
    if (!this.transfer) {
      return null
    }

    this.drag(event)
    const transfer = this.transfer
    const data = this.toDragData(transfer)

    if (!transfer.target || !this.events.fire(DragEvents.beforeDrop, [data, transfer])) {
      this.cancelDrop()
      return null
    }

    this.events.fire(DragEvents.afterDrop, [data, transfer])
    this.events.fire(DragEvents.afterDrag, [data, transfer])
    this._cleanupTransfer(false)
    return { data, transfer }
  }

  cancelDrop(): void {
    if (!this.transfer) {
      return
    }

    const data = this.toDragData(this.transfer)
    this.events.fire(DragEvents.cancelDrop, [data, this.transfer])
    this.events.fire(DragEvents.afterDrag, [data, this.transfer])
    this._cleanupTransfer(true)
  }

  getDropPosition(
    event: PointerEvent,
    target: HTMLElement,
  ): DropPosition {
    const rect = target.getBoundingClientRect()
    const relativeY = event.clientY - rect.top
    const topBoundary = rect.height * 0.25
    const bottomBoundary = rect.height * 0.75

    if (relativeY <= topBoundary) {
      return 'top'
    }
    if (relativeY >= bottomBoundary) {
      return 'bottom'
    }
    return 'in'
  }

  _autoScroll(container: HTMLElement, event: PointerEvent): void {
    const rect = container.getBoundingClientRect()
    const threshold = this._config.autoScrollThreshold
    const step = this._config.autoScrollStep

    if (event.clientY < rect.top + threshold) {
      container.scrollTop -= step
    } else if (event.clientY > rect.bottom - threshold) {
      container.scrollTop += step
    }

    if (event.clientX < rect.left + threshold) {
      container.scrollLeft -= step
    } else if (event.clientX > rect.right - threshold) {
      container.scrollLeft += step
    }
  }

  private _resolveTarget(event: PointerEvent): (DropTargetRegistration & {
    position: DropPosition
    accepted: boolean
  }) | null {
    const target = this._getEventElement(event)
    if (!target) {
      return null
    }

    let bestMatch: DropTargetRegistration | undefined
    let deepestDepth = -1

    for (const registration of this._targets.values()) {
      if (!registration.element.isConnected) {
        continue
      }
      if (registration.mode === 'source') {
        continue
      }
      if (!registration.element.contains(target) && registration.element !== target) {
        continue
      }

      let depth = 0
      let node: HTMLElement | null = target
      while (node && node !== registration.element) {
        depth += 1
        node = node.parentElement
      }

      if (depth > deepestDepth) {
        deepestDepth = depth
        bestMatch = registration
      }
    }

    if (!bestMatch || !this.transfer) {
      return null
    }

    const position = bestMatch.getDropPosition?.(event, bestMatch.element) ??
      this.getDropPosition(event, bestMatch.element)
    const acceptsType =
      !bestMatch.accepts?.length || bestMatch.accepts.includes(this.transfer.type)
    const canDrop =
      acceptsType &&
      bestMatch.canDrop?.(this.transfer) !== false &&
      this.events.fire(DragEvents.canDrop, [bestMatch.id, this.toDragData(this.transfer), this.transfer]) !== false

    return {
      ...bestMatch,
      position,
      accepted: canDrop,
    }
  }

  private _prepareGhost(ghost: HTMLElement, transfer: TransferData): void {
    ghost.style.position = 'fixed'
    ghost.style.pointerEvents = 'none'
    ghost.style.left = '0'
    ghost.style.top = '0'
    ghost.style.zIndex = '9999'
    ghost.style.opacity = '0.9'
    ghost.style.transform = `translate(${transfer.x - transfer.initXOffset}px, ${transfer.y - transfer.initYOffset}px)`
  }

  private _moveGhost(transfer: TransferData): void {
    if (!transfer.ghost) {
      return
    }

    transfer.ghost.style.transform = `translate(${transfer.x - transfer.initXOffset}px, ${transfer.y - transfer.initYOffset}px)`
  }

  private _cleanupTransfer(cancelled: boolean): void {
    if (!this.transfer) {
      return
    }

    if (this.transfer.ghost?.parentNode) {
      this.transfer.ghost.parentNode.removeChild(this.transfer.ghost)
    }

    if (cancelled) {
      this._activeTargetId = null
    } else {
      this._activeTargetId = null
    }
    this.transfer = null
  }

  private _findScrollContainer(target: EventTarget | null): HTMLElement | null {
    let node = target instanceof HTMLElement ? target : null
    while (node) {
      const style = window.getComputedStyle(node)
      const overflowY = style.overflowY
      const overflowX = style.overflowX
      const scrollableY =
        (overflowY === 'auto' || overflowY === 'scroll') &&
        node.scrollHeight > node.clientHeight
      const scrollableX =
        (overflowX === 'auto' || overflowX === 'scroll') &&
        node.scrollWidth > node.clientWidth

      if (scrollableX || scrollableY) {
        return node
      }
      node = node.parentElement
    }

    return null
  }

  private _getEventElement(event: PointerEvent): HTMLElement | null {
    const hovered =
      typeof document.elementFromPoint === 'function'
        ? document.elementFromPoint(event.clientX, event.clientY)
        : null

    if (hovered instanceof HTMLElement) {
      return hovered
    }

    return event.target instanceof HTMLElement ? event.target : null
  }

  toDragData(transfer: TransferData): DragData {
    return {
      start: transfer.start,
      source: [...transfer.source],
      target: transfer.target,
      dropPosition: transfer.dropPosition,
      dragItem: transfer.type,
    }
  }
}

export const dragManager = new DragManager()
