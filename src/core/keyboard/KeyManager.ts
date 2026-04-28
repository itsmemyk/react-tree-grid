/**
 * KeyManager — faithful conversion of DHTMLX KeyManager (suite.js lines 2813-2891).
 *
 * Manages keyboard hotkeys with modifier support (Ctrl/Cmd, Shift, Alt).
 * Key combos are encoded as: modifierBits + keyName (e.g. "4a" = Ctrl+A).
 */

type HotKeyHandler = (e: KeyboardEvent) => void

interface HotKeyEntry {
  handler: HotKeyHandler
}

/**
 * Parse a hotkey string like "ctrl+shift+a" into an encoded key.
 * Modifier bits: Ctrl/Cmd=4, Shift=2, Alt=1
 */
function getHotKeyCode(code: string): string {
  const matches = code.toLowerCase().match(/\w+/g)
  if (!matches) return ''
  let comp = 0
  let key = ''
  for (const check of matches) {
    if (check === 'ctrl') {
      comp += 4
    } else if (check === 'shift') {
      comp += 2
    } else if (check === 'alt') {
      comp += 1
    } else {
      key = check
    }
  }
  return comp + key
}

export class KeyManager {
  private _keysStorage: Record<string, HotKeyEntry[]> = {}
  private _initHandler: (e: KeyboardEvent) => void
  private _beforeCall?: (e: KeyboardEvent, focusId?: string) => boolean | void

  constructor(beforeCall?: (e: KeyboardEvent, focusId?: string) => boolean | void) {
    if (beforeCall) {
      this._beforeCall = beforeCall
    }

    this._initHandler = (e: KeyboardEvent) => {
      let key: string
      if ((e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90)) {
        key = String.fromCharCode(e.which)
      } else {
        key = e.which === 32 ? e.code : e.key
      }

      const code =
        (e.ctrlKey || e.metaKey ? 4 : 0) +
        (e.shiftKey ? 2 : 0) +
        (e.altKey ? 1 : 0) +
        (key ? key.toLowerCase() : '')

      const actions = this._keysStorage[code]
      if (actions) {
        for (const action of actions) {
          if (this._beforeCall && this._beforeCall(e) === false) {
            return
          }
          action.handler(e)
        }
      }
    }

    document.addEventListener('keydown', this._initHandler)
  }

  /** Clean up — remove document listener and clear all hotkeys */
  destructor(): void {
    document.removeEventListener('keydown', this._initHandler)
    this.removeHotKey()
  }

  /** Register a hotkey handler. Key format: "ctrl+shift+a", "escape", "enter" */
  addHotKey(key: string, handler: HotKeyHandler): void {
    const code = getHotKeyCode(key)
    if (!this._keysStorage[code]) {
      this._keysStorage[code] = []
    }
    this._keysStorage[code].push({ handler })
  }

  /**
   * Remove hotkey handler(s).
   * - key + handler: remove specific handler
   * - key only: remove all handlers for that key
   * - no args: remove all handlers
   */
  removeHotKey(key?: string, handler?: HotKeyHandler): void {
    if (key) {
      if (handler) {
        const code = getHotKeyCode(key)
        const fnToString = (fn: HotKeyHandler) =>
          fn.toString().replace(/\n/g, '').replace(/\s/g, '')
        if (this._keysStorage[code]) {
          this._keysStorage[code] = this._keysStorage[code].filter(
            (entry) => fnToString(entry.handler) !== fnToString(handler),
          )
        }
      } else {
        const code = getHotKeyCode(key)
        delete this._keysStorage[code]
      }
    } else {
      this._keysStorage = {}
    }
  }

  /** Check if a hotkey is registered */
  exist(key: string): boolean {
    const code = getHotKeyCode(key)
    return !!this._keysStorage[code]
  }

  /** Get the number of registered key combos */
  getKeyStorageLength(): number {
    return Object.keys(this._keysStorage).length
  }
}
