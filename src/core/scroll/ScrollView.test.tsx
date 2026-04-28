import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScrollView } from './ScrollView'

describe('ScrollView', () => {
  it('renders children with the current virtual window and reacts to scroll', () => {
    render(
      <ScrollView
        data-testid="viewport"
        totalRows={100}
        totalCols={4}
        rowHeight={20}
        colWidths={[100, 120, 140, 160]}
        containerWidth={220}
        containerHeight={80}
        overscan={1}
        style={{ width: 220, height: 80 }}
      >
        {({ xStart, xEnd, yStart, yEnd }) => (
          <div data-testid="range">
            {`${xStart}:${xEnd}:${yStart}:${yEnd}`}
          </div>
        )}
      </ScrollView>,
    )

    const viewport = screen.getByTestId('viewport')
    expect(screen.getByTestId('range')).toHaveTextContent('0:2:0:4')

    Object.defineProperty(viewport, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: 130,
    })
    Object.defineProperty(viewport, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 100,
    })
    fireEvent.scroll(viewport)

    expect(screen.getByTestId('range')).toHaveTextContent('0:3:4:9')
  })
})
