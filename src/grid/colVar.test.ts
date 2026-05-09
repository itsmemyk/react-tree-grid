import { describe, expect, it } from 'vitest'
import { colVarName, colVarRef } from './colVar'

describe('colVarName', () => {
  it('produces a valid CSS custom property name for a simple id', () => {
    expect(colVarName('name')).toBe('--rgs-col-name')
  })

  it('replaces spaces with hyphens', () => {
    expect(colVarName('first name')).toBe('--rgs-col-first-name')
  })

  it('replaces dots with hyphens', () => {
    expect(colVarName('col.price')).toBe('--rgs-col-col-price')
  })

  it('replaces multiple consecutive special chars with hyphens', () => {
    expect(colVarName('a  b')).toBe('--rgs-col-a--b')
  })

  it('preserves underscores', () => {
    expect(colVarName('col_id')).toBe('--rgs-col-col_id')
  })
})

describe('colVarRef', () => {
  it('wraps colVarName in a var() call', () => {
    expect(colVarRef('name')).toBe('var(--rgs-col-name)')
  })

  it('sanitizes the id inside the var() call', () => {
    expect(colVarRef('first name')).toBe('var(--rgs-col-first-name)')
  })
})
