/**
 * Core utility functions — faithful conversion of DHTMLX suite.js modules 1, 3.
 */

let counter = 0

/** Generate a unique ID string (suite.js line 226-228) */
export function uid(): string {
  return 'u' + counter++
}

/**
 * Deep/shallow merge source into target (suite.js lines 270-291).
 * - If deep=true (default), recursively merges plain objects
 * - Arrays and Dates are NOT deep-merged (replaced directly)
 * - undefined values in source DELETE the key from target
 */
export function extend<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T> | Record<string, unknown>,
  deep = true,
): T {
  if (source) {
    for (const key in source) {
      const sobj = (source as Record<string, unknown>)[key]
      const tobj = (target as Record<string, unknown>)[key]
      if (sobj === undefined) {
        delete (target as Record<string, unknown>)[key]
      } else if (
        deep &&
        typeof tobj === 'object' &&
        tobj !== null &&
        !(tobj instanceof Date) &&
        !(tobj instanceof Array)
      ) {
        extend(
          tobj as Record<string, unknown>,
          sobj as Record<string, unknown>,
        )
      } else {
        ;(target as Record<string, unknown>)[key] = sobj
      }
    }
  }
  return target
}

/**
 * Shallow copy of an object (suite.js lines 293-301).
 * If withoutInner=true, skips keys starting with "$".
 */
export function copy<T extends Record<string, unknown>>(
  source: T,
  withoutInner = false,
): T {
  const result: Record<string, unknown> = {}
  for (const key in source) {
    if (!withoutInner || !key.startsWith('$')) {
      result[key] = source[key]
    }
  }
  return result as T
}

/** Check if value is not null and not undefined (suite.js lines 357-359) */
export function isDefined(some: unknown): some is NonNullable<unknown> {
  return some !== null && some !== undefined
}

/** Check if value is a valid ID (number or non-empty string) (suite.js lines 361-363) */
export function isId(some: unknown): some is string | number {
  return typeof some === 'number' || (typeof some === 'string' && some !== '')
}

/** Check if value is numeric (suite.js lines 376-378) */
export function isNumeric(val: unknown): boolean {
  return !isNaN((val as number) - parseFloat(val as string))
}

/** Check if an object has no own enumerable properties (suite.js lines 461-466) */
export function isEmptyObj(obj: Record<string, unknown>): boolean {
  for (const _key in obj) {
    return false
  }
  return true
}
