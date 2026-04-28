import type { EventCallback, EventHandler } from './types'

/**
 * Event system — faithful conversion of DHTMLX EventSystem (suite.js lines 616-656).
 *
 * Supports:
 * - Named event subscription with optional context
 * - Detach by name (all handlers) or by name+context (selective)
 * - Fire with veto pattern: returns false if ANY handler returns false
 * - Clear all handlers
 */
export class EventSystem {
  events: Record<string, EventHandler[]> = {}
  private context: unknown

  constructor(context?: unknown) {
    this.context = context ?? this
  }

  /** Subscribe to an event. Name is case-insensitive. */
  on(name: string, callback: EventCallback, context?: unknown): void {
    const event = name.toLowerCase()
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push({
      callback,
      context: context ?? this.context,
    })
  }

  /**
   * Detach handlers for an event.
   * - With context: removes only handlers matching that context
   * - Without context: removes ALL handlers for the event
   */
  detach(name: string, context?: unknown): void {
    const event = name.toLowerCase()
    const stack = this.events[event]
    if (context && stack && stack.length) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].context === context) {
          stack.splice(i, 1)
        }
      }
    } else {
      this.events[event] = []
    }
  }

  /**
   * Fire an event. Returns false if ANY handler returns false (veto pattern).
   * Returns true if no handlers or all handlers return non-false.
   */
  fire(name: string, args: unknown[] = []): boolean {
    const event = name.toLowerCase()
    if (this.events[event]) {
      const results = this.events[event].map((e) =>
        e.callback.apply(e.context, args),
      )
      return !results.includes(false)
    }
    return true
  }

  /** Remove all event handlers */
  clear(): void {
    this.events = {}
  }
}
