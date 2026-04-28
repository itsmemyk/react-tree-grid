import { describe, expect, it, vi } from 'vitest'
import { DragEvents } from '../events/types'
import { DragManager } from './DragManager'

describe('DragManager', () => {
  it('computes before/inside/after drop positions', () => {
    const manager = new DragManager()
    const element = document.createElement('div')
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 100,
      toJSON: () => '',
    })

    expect(
      manager.getDropPosition(new PointerEvent('pointermove', { clientY: 110 }), element),
    ).toBe('top')
    expect(
      manager.getDropPosition(new PointerEvent('pointermove', { clientY: 150 }), element),
    ).toBe('in')
    expect(
      manager.getDropPosition(new PointerEvent('pointermove', { clientY: 190 }), element),
    ).toBe('bottom')
  })

  it('fires drop lifecycle and returns drop data', () => {
    const manager = new DragManager()
    const target = document.createElement('div')
    document.body.appendChild(target)
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => '',
    })

    manager.registerTarget({
      id: 'row-2',
      componentId: 'grid-a',
      element: target,
      accepts: ['row'],
    })

    const afterDrop = vi.fn()
    manager.events.on(DragEvents.afterDrop, afterDrop)

    const startEvent = new PointerEvent('pointerdown', { clientX: 5, clientY: 5 })
    const transfer = manager.dragStart(
      startEvent,
      { id: 'row-1', source: ['row-1'], type: 'row' },
      { componentId: 'grid-a' },
    )

    expect(transfer).not.toBeNull()

    vi.spyOn(document, 'elementFromPoint').mockReturnValue(target)
    const moveEvent = new PointerEvent('pointermove', { clientX: 8, clientY: 8 })
    Object.defineProperty(moveEvent, 'target', { value: target })
    manager.drag(moveEvent)

    const result = manager.drop(moveEvent)

    expect(result?.data).toEqual({
      start: 'row-1',
      source: ['row-1'],
      target: 'row-2',
      dropPosition: 'top',
      dragItem: 'row',
    })
    expect(afterDrop).toHaveBeenCalledTimes(1)
    expect(manager.transfer).toBeNull()
  })

  it('cancels a drop when beforeDrop vetoes it', () => {
    const manager = new DragManager()
    const target = document.createElement('div')
    document.body.appendChild(target)
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => '',
    })

    manager.registerTarget({
      id: 'row-2',
      componentId: 'grid-a',
      element: target,
    })

    manager.events.on(DragEvents.beforeDrop, () => false)
    const onCancel = vi.fn()
    manager.events.on(DragEvents.cancelDrop, onCancel)

    const startEvent = new PointerEvent('pointerdown', { clientX: 5, clientY: 5 })
    manager.dragStart(
      startEvent,
      { id: 'row-1', source: ['row-1'], type: 'row' },
      { componentId: 'grid-a' },
    )

    vi.spyOn(document, 'elementFromPoint').mockReturnValue(target)
    const moveEvent = new PointerEvent('pointermove', { clientX: 8, clientY: 8 })
    Object.defineProperty(moveEvent, 'target', { value: target })

    expect(manager.drop(moveEvent)).toBeNull()
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('auto-scrolls the container near its edges', () => {
    const manager = new DragManager({ autoScrollThreshold: 20, autoScrollStep: 10 })
    const container = document.createElement('div')
    container.scrollTop = 50
    container.scrollLeft = 20
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 300,
      left: 100,
      right: 300,
      width: 200,
      height: 200,
      x: 100,
      y: 100,
      toJSON: () => '',
    })

    manager._autoScroll(
      container,
      new PointerEvent('pointermove', { clientX: 105, clientY: 105 }),
    )
    expect(container.scrollTop).toBe(40)
    expect(container.scrollLeft).toBe(10)

    manager._autoScroll(
      container,
      new PointerEvent('pointermove', { clientX: 295, clientY: 295 }),
    )
    expect(container.scrollTop).toBe(50)
    expect(container.scrollLeft).toBe(20)
  })

  it('resolves drag hover from pointer coordinates instead of relying on event.target', () => {
    const manager = new DragManager()
    const target = document.createElement('div')
    document.body.appendChild(target)
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => '',
    })
    vi.spyOn(document, 'elementFromPoint').mockReturnValue(target)

    manager.registerTarget({
      id: 'row-2',
      componentId: 'grid-a',
      element: target,
      accepts: ['row'],
    })

    manager.dragStart(
      new PointerEvent('pointerdown', { clientX: 5, clientY: 5 }),
      { id: 'row-1', source: ['row-1'], type: 'row' },
      { componentId: 'grid-a' },
    )

    const moveEvent = new PointerEvent('pointermove', { clientX: 8, clientY: 8 })
    Object.defineProperty(moveEvent, 'target', { value: document.body })
    const transfer = manager.drag(moveEvent)

    expect(transfer?.target).toBe('row-2')
    expect(transfer?.dropPosition).toBe('top')
  })
})
