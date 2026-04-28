import { EventSystem } from '../events/EventSystem'
import { isId } from '../utils/common'
import { DataStore } from '../data/DataStore'
import { DataEvents } from '../data/types'
import type { DataItem } from '../data/types'
import type { SelectionConfig } from './types'
import { SelectionEvents } from './types'

/**
 * Selection — faithful conversion of DHTMLX Selection (suite.js lines 12340-12491).
 *
 * Manages selected items with support for:
 * - Single selection (replaces previous)
 * - Multi-selection (Ctrl toggle, Shift range)
 * - Auto-advance on remove (selects next/prev item)
 * - Metadata tracking via DataStore.setMeta
 * - Before/after events with veto pattern
 */
export class Selection<T extends DataItem = DataItem> {
  config: SelectionConfig
  events: EventSystem
  private _data: DataStore<T>
  private _selected: string[] = []
  private _nextSelection: string | null = null

  constructor(config: SelectionConfig, data: DataStore<T>, events: EventSystem) {
    this.config = { ...config }
    this.events = events
    this._data = data

    // Validate multiselection value
    if (typeof this.config.multiselection === 'string') {
      const valid = ['click', 'ctrlClick']
      if (!valid.includes(this.config.multiselection)) {
        this.config.multiselection = false
      }
    }

    // Clear selection when all data is removed
    this._data.events.on(DataEvents.removeAll, () => {
      this._selected = []
    })

    // Auto-advance: pick next item before removal
    this._data.events.on(DataEvents.beforeRemove, (obj: unknown) => {
      const item = obj as T
      this._nextSelection = null
      if (this._selected.length === 1) {
        const next = this._data.getIndex(item.id)
        const count = this._data.getLength()
        if (count > 1) {
          const lastIndex = count === next - 1 ? next - 1 : next + 1
          this._nextSelection = this._data.getId(lastIndex) ?? null
        }
      }
    })

    // After removal: clean up selection and auto-advance
    this._data.events.on(DataEvents.afterRemove, (obj: unknown) => {
      const item = obj as T
      const hasIndex = this._selected.indexOf(item.id)
      if (hasIndex !== -1) {
        this._selected.splice(hasIndex, 1)
      }
      if (isId(this._nextSelection)) {
        this.add(this._nextSelection!)
        this._nextSelection = null
      }
    })
  }

  /** Enable selection */
  enable(): void {
    this.config.disabled = false
  }

  /** Disable selection and clear current selection */
  disable(): void {
    this.remove()
    this.config.disabled = true
  }

  /** Get selected id(s) — returns array if multiselection, single id otherwise */
  getId(): string | string[] | undefined {
    if (this.config.multiselection) {
      return this._selected
    }
    return this._selected[0]
  }

  /** Get selected item(s) */
  getItem(): T | T[] | null {
    if (this.config.multiselection) {
      return this._selected.map((id) => this._data.getItem(id))
    }
    return this._selected.length ? this._data.getItem(this._selected[0]) : null
  }

  /** Check if an id is selected, or if any selection exists */
  contains(id?: string): boolean {
    if (isId(id)) {
      return this._selected.includes(id!)
    }
    return this._selected.length > 0
  }

  /** Remove selection — by id, or clear all if no id given */
  remove(id?: string, silent = false): void {
    if (isId(id)) {
      this._unselectItem(id!, silent)
    } else {
      this._selected.forEach((selectedId) => this._unselectItem(selectedId, silent))
      this._selected = []
    }
  }

  /**
   * Add to selection.
   * - No id: select all unselected items
   * - isShift: range select from last selected to id
   * - isCtrl: toggle in/out (if multiselection supports it)
   * - Otherwise: single select (replaces previous)
   */
  add(id?: string, isCtrl = false, isShift = false, silent = false): void {
    if (this.config.disabled) return

    if (typeof id === 'undefined') {
      // Select all
      const unSelected = this._data.serialize().filter(
        ({ id: itemId }) => !this._selected.includes(itemId),
      )
      unSelected.forEach(({ id: itemId }) => this._addMulti(itemId, silent))
      return
    }

    const multi = this.config.multiselection
    if (isShift && this._selected.length && multi) {
      this._addMulti(id, silent)
    } else {
      this._addSingle(id, !!(multi && (multi !== 'ctrlClick' || isCtrl)), silent)
    }
  }

  /** Clean up — deselect all silently */
  destructor(): void {
    this._selected.forEach((selectedId) => this._unselectItem(selectedId, true))
  }

  // --- Private ---

  private _addMulti(id: string, silent: boolean): void {
    const last = this._selected[this._selected.length - 1]
    let i1 = this._data.getIndex(last)
    let i2 = this._data.getIndex(id)
    if (i1 > i2) {
      ;[i1, i2] = [i2, i1]
    }
    for (let i = i1; i <= i2; i++) {
      const itemId = this._data.getId(i)
      if (itemId) this._selectItem(itemId, silent)
    }
  }

  private _addSingle(id: string, isCtrl: boolean, silent: boolean): void {
    if (!isCtrl) {
      this._selected.forEach((selectedId) => {
        if (selectedId !== id) this._unselectItem(selectedId)
      })
    }
    if (isCtrl && this._selected.includes(id)) {
      this._unselectItem(id, silent)
    } else {
      this._selectItem(id, silent)
    }
  }

  private _selectItem(id: string, silent = false): void {
    const item = this._data.getItem(id)
    if (!item || this._data.getMeta(item, 'selected')) return
    if (!silent && !this.events.fire(SelectionEvents.beforeSelect, [id])) return
    this._selected.push(id)
    this._data.setMeta(item, 'selected', true)
    if (!silent) this.events.fire(SelectionEvents.afterSelect, [id])
  }

  private _unselectItem(id: string, silent = false): void {
    if (!silent && !this.events.fire(SelectionEvents.beforeUnSelect, [id])) return
    this._selected = this._selected.filter((selectedId) => selectedId !== id)
    const item = this._data.getItem(id)
    if (item) this._data.setMeta(item, 'selected', false)
    if (!silent) this.events.fire(SelectionEvents.afterUnSelect, [id])
  }
}
