import { describe, it, expect } from 'vitest'
import { applyGroupBy } from './GroupBy'

const employees = [
  { id: '1', name: 'Alice', dept: 'Eng', status: 'active', salary: 100 },
  { id: '2', name: 'Bob',   dept: 'Eng', status: 'inactive', salary: 80 },
  { id: '3', name: 'Cara',  dept: 'HR',  status: 'active', salary: 90 },
  { id: '4', name: 'Dan',   dept: 'HR',  status: 'active', salary: 70 },
]

describe('applyGroupBy', () => {
  it('creates one group row per unique value', () => {
    const result = applyGroupBy(employees, ['dept'])
    expect(result.length).toBe(2)
    expect(result[0].dept).toBe('Eng')
    expect(result[1].dept).toBe('HR')
  })

  it('group rows have synthetic id and $group=true', () => {
    const result = applyGroupBy(employees, ['dept'])
    expect(result[0].id).toBe('__group__dept__Eng')
    expect(result[0].$group).toBe(true)
  })

  it('group rows have $editable=false and $selectable=false', () => {
    const result = applyGroupBy(employees, ['dept'])
    expect(result[0].$editable).toBe(false)
    expect(result[0].$selectable).toBe(false)
  })

  it('child rows are placed under their group', () => {
    const result = applyGroupBy(employees, ['dept'])
    expect(result[0].items).toHaveLength(2)
    expect((result[0].items as typeof employees)[0].name).toBe('Alice')
  })

  it('multi-level groupBy creates nested hierarchy', () => {
    const result = applyGroupBy(employees, ['dept', 'status'])
    const eng = result[0]
    expect((eng.items as Record<string, unknown>[]).length).toBe(2) // active + inactive
    const firstSubGroup = (eng.items as Record<string, unknown>[])[0]
    expect(firstSubGroup.$group).toBe(true)
    expect((firstSubGroup.items as Record<string, unknown>[]).length).toBe(1)
  })

  it('computes sum aggregate on group rows', () => {
    const result = applyGroupBy(employees, ['dept'], { salary: 'sum' })
    expect(result[0].salary).toBe(180) // Alice 100 + Bob 80
    expect(result[1].salary).toBe(160) // Cara 90 + Dan 70
  })

  it('computes avg aggregate on group rows', () => {
    const result = applyGroupBy(employees, ['dept'], { salary: 'avg' })
    expect(result[0].salary).toBe(90)  // (100+80)/2
  })

  it('computes count aggregate on group rows', () => {
    const result = applyGroupBy(employees, ['dept'], { salary: 'count' })
    expect(result[0].salary).toBe(2)
  })

  it('preserves order of first occurrence for groups', () => {
    const result = applyGroupBy(employees, ['dept'])
    expect(result[0].dept).toBe('Eng')
    expect(result[1].dept).toBe('HR')
  })
})
