import type { DataItem, SortRule } from './types'

/**
 * Natural comparison that handles mixed numeric/string sorting (e.g. "item2" < "item10").
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

function isEmptyValue(v: unknown): boolean {
  return (
    v === null ||
    v === undefined ||
    v === '' ||
    (typeof v === 'number' && Number.isNaN(v)) ||
    (v instanceof Date && Number.isNaN(v.getTime()))
  )
}

/**
 * Compare two cell values in ascending order.
 *
 * Rules:
 * - Empty values (null, undefined, '', NaN, invalid Date) sort AFTER every
 *   non-empty value in ascending order. Descending order simply reverses the
 *   ascending result, so empty values come first there.
 * - Two numbers compare numerically.
 * - Two Date objects compare chronologically (getTime()).
 * - Anything else uses natural string comparison ("item2" < "item10").
 */
export function compareValues(a: unknown, b: unknown): number {
  const ae = isEmptyValue(a)
  const be = isEmptyValue(b)
  if (ae || be) return ae === be ? 0 : ae ? 1 : -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  return naturalCompare(String(a), String(b))
}

/**
 * Sort class supporting multi-column sorting with custom value accessors.
 *
 * The default comparison (when a rule has no custom `rule`) is
 * {@link compareValues}: empty values last in asc / first in desc, numbers
 * numerically, Dates chronologically, strings naturally. Sorting is stable.
 */
export class Sort {
  /** Sort an array using one or more sort rules */
  sort<T extends DataItem>(array: T[], sorters: SortRule[]): T[] {
    return this._sort(array, sorters)
  }

  private _createSorter(by: SortRule): void {
    if (by && !by.rule) {
      by.rule = (a: DataItem, b: DataItem): number => {
        const aa = this._checkVal(by.as, a[by.by])
        const bb = this._checkVal(by.as, b[by.by])
        return compareValues(aa, bb)
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
