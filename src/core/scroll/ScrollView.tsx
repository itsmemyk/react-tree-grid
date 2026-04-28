import {
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type UIEvent,
} from 'react'
import { useVirtualScroll, type UseVirtualScrollOptions } from './useVirtualScroll'

export interface ScrollViewRenderState {
  xStart: number
  xEnd: number
  yStart: number
  yEnd: number
  offsetX: number
  offsetY: number
}

export interface ScrollViewProps
  extends UseVirtualScrollOptions,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  className?: string
  style?: CSSProperties
  children: (state: ScrollViewRenderState) => ReactNode
}

export function ScrollView({
  className,
  style,
  children,
  ...rest
}: ScrollViewProps) {
  const {
    totalRows,
    totalCols,
    rowHeight,
    colWidths,
    containerWidth,
    containerHeight,
    overscan,
    ...divProps
  } = rest
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const virtual = useVirtualScroll({
    totalRows,
    totalCols,
    rowHeight,
    colWidths,
    containerWidth,
    containerHeight,
    overscan,
  })

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    virtual.onScroll(
      event.currentTarget.scrollLeft,
      event.currentTarget.scrollTop,
    )
  }

  return (
    <div
      ref={viewportRef}
      {...divProps}
      className={className}
      style={{
        overflow: 'auto',
        position: 'relative',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: virtual.totalHeight,
          position: 'relative',
          width: virtual.totalWidth,
        }}
      >
        <div
          style={{
            left: virtual.offsetX,
            position: 'absolute',
            top: virtual.offsetY,
          }}
        >
          {children({
            xStart: virtual.xStart,
            xEnd: virtual.xEnd,
            yStart: virtual.yStart,
            yEnd: virtual.yEnd,
            offsetX: virtual.offsetX,
            offsetY: virtual.offsetY,
          })}
        </div>
      </div>
    </div>
  )
}
