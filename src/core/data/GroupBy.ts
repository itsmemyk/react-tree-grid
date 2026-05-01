import { computeAggregate } from './aggregate'
import type { AggregateType } from './aggregate'

export type GroupAggregateConfig = Record<string, AggregateType>

export function applyGroupBy(
  data: Record<string, unknown>[],
  groupBy: string[],
  aggregate?: GroupAggregateConfig,
  _parentId: string = '',
): Record<string, unknown>[] {
  if (groupBy.length === 0) return data

  const [currentKey, ...remainingKeys] = groupBy

  const order: string[] = []
  const buckets: Map<string, Record<string, unknown>[]> = new Map()

  for (const item of data) {
    const val = String(item[currentKey] ?? '')
    if (!buckets.has(val)) {
      order.push(val)
      buckets.set(val, [])
    }
    buckets.get(val)!.push(item)
  }

  return order.map((val) => {
    const children = buckets.get(val)!
    const groupId = `${_parentId}__group__${currentKey}__${val}`
    const nestedChildren =
      remainingKeys.length > 0
        ? applyGroupBy(children, remainingKeys, aggregate, groupId)
        : children

    const groupRow: Record<string, unknown> = {
      id: groupId,
      $group: true,
      $editable: false,
      $selectable: false,
      [currentKey]: val,
      items: nestedChildren,
    }

    if (aggregate) {
      for (const [field, type] of Object.entries(aggregate)) {
        const computed = computeAggregate(children, field, type)
        if (computed !== undefined) groupRow[field] = computed
      }
    }

    return groupRow
  })
}
