import { render, screen, fireEvent } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDraggable } from './useDraggable'
import { useDropTarget } from './useDropTarget'
import { dragManager } from './DragManager'

afterEach(() => {
  dragManager.events.clear()
  dragManager.cancelDrop()
  document.body.innerHTML = ''
})

function DragDropFixture({
  onDrop,
  onAfterDrag,
}: {
  onDrop: (data: unknown) => void
  onAfterDrag: (data: unknown) => void
}) {
  const { draggableProps } = useDraggable({
    id: 'row-1',
    source: ['row-1'],
    componentId: 'grid-a',
    type: 'row',
    onAfterDrag: (data) => onAfterDrag(data),
  })
  const { targetRef } = useDropTarget<HTMLDivElement>({
    id: 'row-2',
    componentId: 'grid-a',
    accepts: ['row'],
    onDrop: (data) => onDrop(data),
  })

  return (
    <div>
      <button data-testid="drag" {...draggableProps}>
        Drag row
      </button>
      <div data-testid="drop" ref={targetRef}>
        Drop row
      </div>
    </div>
  )
}

describe('useDraggable/useDropTarget', () => {
  it('completes a drag and drop cycle through the shared manager', () => {
    const onDrop = vi.fn()
    const onAfterDrag = vi.fn()

    render(<DragDropFixture onDrop={onDrop} onAfterDrag={onAfterDrag} />)

    const dragNode = screen.getByTestId('drag')
    const dropNode = screen.getByTestId('drop')
    vi.spyOn(dropNode, 'getBoundingClientRect').mockReturnValue({
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

    fireEvent.pointerDown(dragNode, { clientX: 10, clientY: 10 })
    fireEvent.pointerMove(dropNode, { clientX: 50, clientY: 50 })
    fireEvent.pointerUp(dropNode, { clientX: 50, clientY: 50 })

    expect(onDrop).toHaveBeenCalledWith({
      start: 'row-1',
      source: ['row-1'],
      target: 'row-2',
      dropPosition: 'in',
      dragItem: 'row',
    })
    expect(onAfterDrag).toHaveBeenCalled()
  })
})
