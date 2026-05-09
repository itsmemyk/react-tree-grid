import { describe, expect, it } from 'vitest'
import { colVarName, colVarRef } from './colVar'

describe('colVarName', () => {
  it('produces a valid CSS custom property name for a simple id', () => {
    expect(colVarName('name')).toBe('--rgs-col-name')
  })

  it('encodes spaces', () => {
    expect(colVarName('first name')).toBe('--rgs-col-first_20_name')
  })

  it('encodes dots', () => {
    expect(colVarName('col.price')).toBe('--rgs-col-col_2e_price')
  })

  it('encodes multiple consecutive special chars', () => {
    expect(colVarName('a  b')).toBe('--rgs-col-a_20__20_b')
  })

  it('encodes underscores', () => {
    expect(colVarName('col_id')).toBe('--rgs-col-col_5f_id')
  })

  it('does not collapse distinct ids to the same custom property name', () => {
    expect(colVarName('a-b')).toBe('--rgs-col-a_2d_b')
    expect(colVarName('a.b')).toBe('--rgs-col-a_2e_b')
    expect(colVarName('first name')).not.toBe(colVarName('first-name'))
  })
})

describe('colVarRef', () => {
  it('wraps colVarName in a var() call', () => {
    expect(colVarRef('name')).toBe('var(--rgs-col-name)')
  })

  it('sanitizes the id inside the var() call', () => {
    expect(colVarRef('first name')).toBe('var(--rgs-col-first_20_name)')
  })
})
