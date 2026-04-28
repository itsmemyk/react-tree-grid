export type AggregateType = 'sum' | 'avg' | 'count' | 'min' | 'max'

export function computeAggregate(
  items: Record<string, unknown>[],
  field: string,
  type: AggregateType,
): number | undefined {
  if (type === 'count') return items.length

  const nums: number[] = []
  for (const item of items) {
    const v = item[field]
    if (v !== null && v !== undefined && v !== '') {
      const n = Number(v)
      if (!isNaN(n)) nums.push(n)
    }
  }
  if (nums.length === 0) return undefined

  switch (type) {
    case 'sum': return nums.reduce((a, b) => a + b, 0)
    case 'avg': return nums.reduce((a, b) => a + b, 0) / nums.length
    case 'min': return Math.min(...nums)
    case 'max': return Math.max(...nums)
  }
}
