import { describe, it, expect } from 'vitest'
import { Sort } from './Sort'

const sortVals = (vals: unknown[], dir: 'asc' | 'desc' = 'asc', as?: (v: unknown) => unknown) =>
  new Sort().sort(vals.map((v, i) => ({ id: String(i), v })), [{ by: 'v', dir, as }]).map((x) => x.v)

describe('Sort', () => {
  it('sorts numbers numerically with nulls last (asc)', () => {
    expect(sortVals([5, null, -3, 10, undefined, 0, -10])).toEqual([-10, -3, 0, 5, 10, null, undefined])
  })

  it('reverses the whole order in desc (nulls first)', () => {
    expect(sortVals([5, null, -3, 10, 0, -10], 'desc')).toEqual([null, 10, 5, 0, -3, -10])
  })

  it('treats empty strings as empty values', () => {
    expect(sortVals(['b', '', 'a', null])).toEqual(['a', 'b', '', null])
  })

  it('sorts Date objects chronologically', () => {
    const d1 = new Date('2024-01-01') // Monday
    const d2 = new Date('2024-01-05') // Friday
    const d3 = new Date('2024-01-03') // Wednesday
    expect(sortVals([d2, null, d1, d3])).toEqual([d1, d3, d2, null])
  })

  it('keeps natural string compare', () => {
    expect(sortVals(['item10', 'item2', 'item1'])).toEqual(['item1', 'item2', 'item10'])
  })

  it('compares numeric strings numerically', () => {
    expect(sortVals(['10', '9', '-1'])).toEqual(['-1', '9', '10'])
  })

  it('applies the `as` accessor before comparing', () => {
    expect(sortVals(['2024-03-01', '2023-01-01'], 'asc', (v) => new Date(v as string))).toEqual([
      '2023-01-01',
      '2024-03-01',
    ])
  })

  it('is stable for equal keys', () => {
    const items = [
      { id: 'a', v: 1 },
      { id: 'b', v: null },
      { id: 'c', v: 1 },
      { id: 'd', v: null },
    ]
    expect(new Sort().sort([...items], [{ by: 'v', dir: 'asc' }]).map((x) => x.id)).toEqual(['a', 'c', 'b', 'd'])
    expect(new Sort().sort([...items], [{ by: 'v', dir: 'desc' }]).map((x) => x.id)).toEqual(['b', 'd', 'a', 'c'])
  })
})
