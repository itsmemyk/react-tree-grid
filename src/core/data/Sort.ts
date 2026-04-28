import type { DataItem, SortRule } from './types'

/**
 * Natural comparison — faithful conversion of DHTMLX naturalCompare (suite.js lines 4125-4146).
 * Handles mixed numeric/string sorting (e.g. "item2" < "item10").
 */
export function naturalCompare(a: string, b: string): number {
  if (isNaN(a as unknown as number) || isNaN(b as unknown as number)) {
    const ax: [number | typeof Infinity, string][] = []
    const bx: [number | typeof Infinity, string][] = []
    a.replace(/(\d+)|(\D+)/g, ((_: string, $1: string, $2: string) => {
      ax.push([$1 ? Number($1) : Infinity, $2 || ''])
    }) as unknown as (substring: string, ...args: unknown[]) => string)
    b.replace(/(\d+)|(\D+)/g, ((_: string, $1: string, $2: string) => {
      bx.push([$1 ? Number($1) : Infinity, $2 || ''])
    }) as unknown as (substring: string, ...args: unknown[]) => string)
    while (ax.length && bx.length) {
      const an = ax.shift()!
      const bn = bx.shift()!
      const nn = (an[0] as number) - (bn[0] as number) || an[1].localeCompare(bn[1])
      if (nn) return nn
    }
    return ax.length - bx.length
  }
  return (a as unknown as number) - (b as unknown as number)
}

/**
 * Sort class — faithful conversion of DHTMLX Sort (suite.js lines 27290-27343).
 * Supports multi-column sorting with custom value accessors.
 */
export class Sort {
  /** Sort an array using one or more sort rules */
  sort<T extends DataItem>(array: T[], sorters: SortRule[]): T[] {
    return this._sort(array, sorters)
  }

  private _createSorter(by: SortRule): void {
    if (by && !by.rule) {
      by.rule = (a: DataItem, b: DataItem): number => {
        const aa = this._checkVal(by.as, a[by.by]) ?? ''
        const bb = this._checkVal(by.as, b[by.by]) ?? ''
        return naturalCompare(String(aa), String(bb))
      }
    }
  }

  private _checkVal(
    method: ((value: unknown) => unknown) | undefined,
    val: unknown,
  ): unknown {
    return method ? method.call(this, val) : val
  }

  private _sort<T extends DataItem>(array: T[], sorters: SortRule[]): T[] {
    sorters.forEach((sorter) => this._createSorter(sorter))
    const dir: Record<string, number> = { asc: 1, desc: -1 }

    const sorted = array.sort((a, b) => {
      for (const sorter of sorters) {
        const result =
          sorter.rule!.call(this, a, b) * (dir[sorter.dir] || dir.asc)
        if (result !== 0) return result
      }
      return 0
    })

    return sorted
  }
}
