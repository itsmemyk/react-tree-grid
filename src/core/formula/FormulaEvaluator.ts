import type { ASTNode } from './FormulaParser'

export type GetCellValue = (col: number, row: number) => unknown

const ERROR_CODES = new Set(['#ERR', '#CIRC', '#REF', '#DIV/0'])

/** True when `v` is one of the error values produced by the evaluator. */
export function isFormulaError(v: unknown): v is string {
  return typeof v === 'string' && ERROR_CODES.has(v)
}

function isBlank(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '')
}

function expandRange(
  from: { col: number; row: number },
  to: { col: number; row: number },
  getCellValue: GetCellValue,
  visiting: Set<string>,
): unknown[] {
  const values: unknown[] = []
  const c0 = Math.min(from.col, to.col), c1 = Math.max(from.col, to.col)
  const r0 = Math.min(from.row, to.row), r1 = Math.max(from.row, to.row)
  for (let c = c0; c <= c1; c++) {
    for (let r = r0; r <= r1; r++) {
      const key = `${c}:${r}`
      if (visiting.has(key)) return ['#CIRC']
      values.push(getCellValue(c, r))
    }
  }
  return values
}

function toNumber(v: unknown): number | '#ERR' {
  const n = Number(v)
  return isNaN(n) ? '#ERR' : n
}

function compare(left: unknown, op: string, right: unknown): boolean {
  const l = Number(left), r = Number(right)
  switch (op) {
    case '>': return l > r
    case '<': return l < r
    case '>=': return l >= r
    case '<=': return l <= r
    case '=': return left === right
    case '<>': case '!=': return left !== right
    default: return false
  }
}

export function evaluateFormula(
  node: ASTNode,
  getCellValue: GetCellValue,
  visiting: Set<string>,
): unknown {
  switch (node.type) {
    case 'number': return node.value
    case 'string': return node.value

    case 'cellRef': {
      const key = `${node.col}:${node.row}`
      if (visiting.has(key)) return '#CIRC'
      const v = getCellValue(node.col, node.row)
      if (v === undefined) return '#REF'
      return v
    }

    case 'range':
      return expandRange(node.from, node.to, getCellValue, visiting)

    case 'unary': {
      const v = evaluateFormula(node.operand, getCellValue, visiting)
      if (isFormulaError(v)) return v
      const n = toNumber(v)
      if (n === '#ERR') return n
      return node.op === '-' ? -n : n
    }

    case 'binary': {
      const lv = evaluateFormula(node.left, getCellValue, visiting)
      const rv = evaluateFormula(node.right, getCellValue, visiting)
      if (isFormulaError(lv)) return lv
      if (isFormulaError(rv)) return rv
      if (node.op === '&') return String(lv) + String(rv)
      if (/^(>|<|>=|<=|=|<>|!=)$/.test(node.op)) return compare(lv, node.op, rv)
      const l = toNumber(lv)
      const r = toNumber(rv)
      if (l === '#ERR' || r === '#ERR') return '#ERR'
      if (node.op === '/' && r === 0) return '#DIV/0'
      switch (node.op) {
        case '+': return l + r
        case '-': return l - r
        case '*': return l * r
        case '/': return l / r
        case '^': {
          const p = Math.pow(l, r)
          return Number.isFinite(p) ? p : '#ERR'
        }
        default: return '#ERR'
      }
    }

    case 'call': {
      const { name, args } = node
      if (name === 'IF') {
        if (!args[0]) return '#ERR'
        const cond = evaluateFormula(args[0], getCellValue, visiting)
        if (isFormulaError(cond)) return cond
        const branch = cond ? args[1] : args[2]
        if (!branch) return cond ? true : false
        return evaluateFormula(branch, getCellValue, visiting)
      }
      const rangeNode = args[0]
      if (!rangeNode || rangeNode.type !== 'range') return '#ERR'
      const values = expandRange(rangeNode.from, rangeNode.to, getCellValue, visiting)
      const error = values.find(isFormulaError)
      if (error !== undefined) return error
      const nums = values
        .filter((v) => !isBlank(v))
        .map(Number)
        .filter((n) => !isNaN(n))
      switch (name) {
        case 'SUM': return nums.reduce((a, b) => a + b, 0)
        case 'AVG':
        case 'AVERAGE':
          return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
        case 'COUNT': return values.filter((v) => v !== undefined && v !== null && v !== '').length
        // Like Excel, MIN/MAX of a range without numbers is 0 (not ±Infinity).
        case 'MIN': return nums.length ? nums.reduce((a, b) => (b < a ? b : a)) : 0
        case 'MAX': return nums.length ? nums.reduce((a, b) => (b > a ? b : a)) : 0
        default: return '#ERR'
      }
    }

    default:
      return '#ERR'
  }
}
