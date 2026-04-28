/**
 * DOM utility functions — faithful conversion of DHTMLX suite.js modules 10, 11.
 * Attribute names use "data-rgs-id" instead of "data-dhx-id".
 */

const RGS_ID_ATTR = 'data-rgs-id'

/** Cached scrollbar dimensions (-1 = not yet measured) */
let scrollWidthCache = -1
let scrollHeightCache = -1

/**
 * Walk up the DOM tree from target until an element with the given attribute is found.
 * (suite.js lines 721-733)
 */
export function locateNode(
  target: Event | HTMLElement,
  attr: string = RGS_ID_ATTR,
  dir: 'target' | 'relatedTarget' = 'target',
): HTMLElement | undefined {
  let node: HTMLElement | null =
    target instanceof Event
      ? ((target as unknown as Record<string, unknown>)[dir] as HTMLElement)
      : target

  while (node) {
    if (node.getAttribute && node.getAttribute(attr)) {
      return node
    }
    node = node.parentNode as HTMLElement | null
  }
  return undefined
}

/**
 * Find the attribute value by walking up the DOM tree.
 * (suite.js lines 735-739)
 */
export function locate(
  target: Event | HTMLElement,
  attr: string = RGS_ID_ATTR,
): string {
  const node = locateNode(target, attr)
  return node ? node.getAttribute(attr)! : ''
}

export interface BoxRect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

/**
 * Get element bounding box with scroll offsets.
 * (suite.js lines 758-770)
 */
export function getBox(elem: HTMLElement): BoxRect {
  const box = elem.getBoundingClientRect()
  const body = document.body
  const scrollTop = window.pageYOffset || body.scrollTop
  const scrollLeft = window.pageXOffset || body.scrollLeft
  const top = box.top + scrollTop
  const left = box.left + scrollLeft
  const right = body.offsetWidth - box.right
  const bottom = body.offsetHeight - box.bottom
  const width = box.right - box.left
  const height = box.bottom - box.top
  return { top, left, right, bottom, width, height }
}

/**
 * Measure the native scrollbar width (cached).
 * (suite.js lines 773-783)
 */
export function getScrollbarWidth(): number {
  if (scrollWidthCache > -1) return scrollWidthCache
  const div = document.createElement('div')
  document.body.appendChild(div)
  div.style.cssText =
    'position:absolute;left:-99999px;overflow:scroll;width:100px;height:100px;'
  scrollWidthCache = div.offsetWidth - div.clientWidth
  document.body.removeChild(div)
  return scrollWidthCache
}

/**
 * Measure the native scrollbar height (cached).
 * (suite.js lines 786-796)
 */
export function getScrollbarHeight(): number {
  if (scrollHeightCache > -1) return scrollHeightCache
  const div = document.createElement('div')
  document.body.appendChild(div)
  div.style.cssText =
    'position:absolute;left:-99999px;overflow:scroll;width:100px;height:100px;'
  scrollHeightCache = div.offsetHeight - div.clientHeight
  document.body.removeChild(div)
  return scrollHeightCache
}

/** Reset cached scrollbar values (useful after zoom/DPI changes) */
export function resetScrollbarCache(): void {
  scrollWidthCache = -1
  scrollHeightCache = -1
}

// --- Positioning (suite.js lines 817-966) ---

interface RealPosition {
  left: number
  right: number
  top: number
  bottom: number
}

export interface PositionConfig {
  width: number
  height: number
  mode: 'top' | 'bottom' | 'left' | 'right'
  centering?: boolean
  auto?: boolean
}

function getRealPosition(node: HTMLElement): RealPosition {
  const rects = node.getBoundingClientRect()
  return {
    left: rects.left + window.pageXOffset,
    right: rects.right + window.pageXOffset,
    top: rects.top + window.pageYOffset,
    bottom: rects.bottom + window.pageYOffset,
  }
}

function getWindowBorders() {
  return {
    rightBorder: window.pageXOffset + window.innerWidth,
    bottomBorder: window.pageYOffset + window.innerHeight,
  }
}

function horizontalCentering(
  pos: RealPosition,
  width: number,
  rightBorder: number,
): number {
  const nodeWidth = pos.right - pos.left
  const diff = (width - nodeWidth) / 2
  const left = pos.left - diff
  const right = pos.right + diff
  if (left >= 0 && right <= rightBorder) return left
  if (left < 0) return 0
  return rightBorder - width
}

function verticalCentering(
  pos: RealPosition,
  height: number,
  bottomBorder: number,
): number {
  const nodeHeight = pos.bottom - pos.top
  const diff = (height - nodeHeight) / 2
  const top = pos.top - diff
  const bottom = pos.bottom + diff
  if (top >= 0 && bottom <= bottomBorder) return top
  if (top < 0) return 0
  return bottomBorder - height
}

function placeBottomOrTop(
  pos: RealPosition,
  config: PositionConfig,
): { left: number; top: number } {
  const { rightBorder, bottomBorder } = getWindowBorders()
  let left: number
  let top: number
  const bottomDiff = bottomBorder - pos.bottom - config.height
  const topDiff = pos.top - config.height

  if (config.mode === 'bottom') {
    if (bottomDiff >= 0) {
      top = pos.bottom
    } else if (topDiff >= 0) {
      top = topDiff
    } else {
      top = bottomDiff > topDiff ? pos.bottom : topDiff
    }
  } else {
    if (topDiff >= 0) {
      top = topDiff
    } else if (bottomDiff >= 0) {
      top = pos.bottom
    } else {
      top = bottomDiff > topDiff ? pos.bottom : topDiff
    }
  }

  if (bottomDiff < 0 && topDiff < 0 && config.auto) {
    return placeRightOrLeft(pos, { ...config, mode: 'right', auto: false })
  }

  if (config.centering) {
    left = horizontalCentering(pos, config.width, rightBorder)
  } else {
    const leftDiff = rightBorder - pos.left - config.width
    const rightDiff = pos.right - config.width
    if (leftDiff >= 0) {
      left = pos.left
    } else if (rightDiff >= 0) {
      left = rightDiff
    } else {
      left = rightDiff > leftDiff ? pos.left : rightDiff
    }
  }
  return { left: left!, top: top! }
}

function placeRightOrLeft(
  pos: RealPosition,
  config: PositionConfig,
): { left: number; top: number } {
  const { rightBorder, bottomBorder } = getWindowBorders()
  let left: number
  let top: number
  const rightDiff = rightBorder - pos.right - config.width
  const leftDiff = pos.left - config.width

  if (config.mode === 'right') {
    if (rightDiff >= 0) {
      left = pos.right
    } else if (leftDiff >= 0) {
      left = leftDiff
    } else {
      left = leftDiff > rightDiff ? leftDiff : pos.right
    }
  } else {
    if (leftDiff >= 0) {
      left = leftDiff
    } else if (rightDiff >= 0) {
      left = pos.right
    } else {
      left = leftDiff > rightDiff ? leftDiff : pos.right
    }
  }

  if (leftDiff < 0 && rightDiff < 0 && config.auto) {
    return placeBottomOrTop(pos, { ...config, mode: 'bottom', auto: false })
  }

  if (config.centering) {
    top = verticalCentering(pos, config.height, bottomBorder)
  } else {
    const bDiff = pos.bottom - config.height
    const tDiff = bottomBorder - pos.top - config.height
    if (tDiff >= 0) {
      top = pos.top
    } else if (bDiff > 0) {
      top = bDiff
    } else {
      top = bDiff > tDiff ? bDiff : pos.top
    }
  }
  return { left: left!, top: top! }
}

/**
 * Calculate absolute positioning styles for a popup/dropdown.
 * (suite.js lines 952-962)
 */
export function calculatePosition(
  pos: RealPosition,
  config: PositionConfig,
): { left: string; top: string; minWidth: string; position: 'absolute' } {
  const { left, top } =
    config.mode === 'bottom' || config.mode === 'top'
      ? placeBottomOrTop(pos, config)
      : placeRightOrLeft(pos, config)
  return {
    left: Math.round(left) + 'px',
    top: Math.round(top) + 'px',
    minWidth: Math.round(config.width) + 'px',
    position: 'absolute',
  }
}

/**
 * Convenience: get real position of a node and calculate placement.
 * (suite.js lines 964-966)
 */
export function fitPosition(
  node: HTMLElement,
  config: PositionConfig,
): { left: string; top: string; minWidth: string; position: 'absolute' } {
  return calculatePosition(getRealPosition(node), config)
}
