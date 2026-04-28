import { uid } from '../utils/common'

/**
 * Dynamic CSS class manager — faithful conversion of DHTMLX CssManager (suite.js lines 24535-24619).
 *
 * Manages a <style> tag in document.head where generated CSS classes are injected.
 * Classes are identified by auto-generated or custom IDs, and de-duplicated by CSS content.
 */
export class CssManager {
  _classes: Record<string, string> = {}
  private _styleCont: HTMLStyleElement | null = null

  constructor() {
    if (typeof document !== 'undefined') {
      const styles = document.createElement('style')
      styles.id = 'rgs_generated_styles'
      this._styleCont = document.head.appendChild(styles)
    }
  }

  /** Regenerate the <style> tag content from all registered classes */
  update(): void {
    if (!this._styleCont) return
    const css = this._generateCss()
    if (this._styleCont.innerHTML !== css) {
      document.head.appendChild(this._styleCont)
      this._styleCont.innerHTML = css
    }
  }

  /** Remove a generated class by its ID */
  remove(className: string): void {
    delete this._classes[className]
    this.update()
  }

  /**
   * Add a CSS class from a property map. Returns the class name (ID).
   * - If an identical CSS string already exists, returns the existing ID
   * - If customId is provided and matches an existing class, reuses it
   * - silent=true skips the <style> tag update (for batching)
   */
  add(
    cssList: Record<string, string>,
    customId?: string,
    silent = false,
  ): string {
    const cssString = this._toCssString(cssList)
    const existingId = this._findSameClassId(cssString)

    if (existingId && customId && customId !== existingId) {
      this._classes[customId] = this._classes[existingId]
      return customId
    }
    if (existingId) {
      return existingId
    }
    return this._addNewClass(cssString, customId, silent)
  }

  /** Get parsed CSS properties for a class, or null if not found */
  get(className: string): Record<string, string> | null {
    if (this._classes[className]) {
      const props: Record<string, string> = {}
      const parts = this._classes[className].split(';')
      for (const item of parts) {
        if (item) {
          const prop = item.split(':')
          props[prop[0]] = prop[1]
        }
      }
      return props
    }
    return null
  }

  /** Clean up the style element */
  destructor(): void {
    if (this._styleCont && this._styleCont.parentNode) {
      this._styleCont.parentNode.removeChild(this._styleCont)
    }
    this._classes = {}
    this._styleCont = null
  }

  private _findSameClassId(cssString: string): string | null {
    for (const key in this._classes) {
      if (cssString === this._classes[key]) {
        return key
      }
    }
    return null
  }

  private _addNewClass(
    cssString: string,
    customId?: string,
    silent = false,
  ): string {
    const id = customId || `rgs_generated_class_${uid()}`
    this._classes[id] = cssString
    if (!silent) {
      this.update()
    }
    return id
  }

  /** Convert a JS property map to a CSS string: { backgroundColor: 'red' } → 'background-color:red;' */
  private _toCssString(cssList: Record<string, string>): string {
    let cssString = ''
    for (const key in cssList) {
      const prop = cssList[key]
      const name = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      cssString += `${name}:${prop};`
    }
    return cssString
  }

  private _generateCss(): string {
    let result = ''
    for (const key in this._classes) {
      result += `.${key}{${this._classes[key]}}\n`
    }
    return result
  }
}

/** Global singleton instance */
export const cssManager = new CssManager()
