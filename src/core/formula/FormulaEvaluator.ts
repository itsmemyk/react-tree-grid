import type { ASTNode } from './FormulaParser'

export type GetCellValue = (col: number, row: number) => unknown

function expandRange(
  from: { col: number; row: number },
  to: { col: number; row: number },
  getCellValue: GetCellValue,
  visiting: Set<string>,
): unknown[] {
  const values: unknown[] = []
  for (let c = from.col; c <= to.col; c++) {
    for (let r = from.row; r <= to.row; r++) {
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
      if (typeof v === 'string' && v.startsWith('#')) return v
      if (node.op === '-') return -(v as number)
      return v
    }

    case 'binary': {
      if (node.op === '&') {
        const l = evaluateFormula(node.left, getCellValue, visiting)
        const r = evaluateFormula(node.right, getCellValue, visiting)
        if (typeof l === 'string' && l.startsWith('#')) return l
        if (typeof r === 'string' && r.startsWith('#')) return r
        return String(l) + String(r)
      }
      if (/^(>|<|>=|<=|=|<>|!=)$/.test(node.op)) {
        const l = evaluateFormula(node.left, getCellValue, visiting)
        const r = evaluateFormula(node.right, getCellValue, visiting)
        return compare(l, node.op, r)
      }
      const lv = evaluateFormula(node.left, getCellValue, visiting)
      const rv = evaluateFormula(node.right, getCellValue, visiting)
      if (typeof lv === 'string' && lv.startsWith('#')) return lv
      if (typeof rv === 'string' && rv.startsWith('#')) return rv
      const l = toNumber(lv)
      const r = toNumber(rv)
      if (l === '#ERR' || r === '#ERR') return '#ERR'
      if (node.op === '/' && r === 0) return '#DIV/0'
      switch (node.op) {
        case '+': return l + r
        case '-': return l - r
        case '*': return l * r
        case '/': return l / r
        default: return '#ERR'
      }
    }

    case 'call': {
      const { name, args } = node
      if (name === 'IF') {
        const cond = evaluateFormula(args[0], getCellValue, visiting)
        return cond
          ? evaluateFormula(args[1], getCellValue, visiting)
          : evaluateFormula(args[2], getCellValue, visiting)
      }
      const rangeNode = args[0]
      if (!rangeNode || rangeNode.type !== 'range') return '#ERR'
      const values = expandRange(rangeNode.from, rangeNode.to, getCellValue, visiting)
      if (values.includes('#CIRC')) return '#CIRC'
      const nums = values.map(Number).filter((n) => !isNaN(n))
      switch (name) {
        case 'SUM': return nums.reduce((a, b) => a + b, 0)
        case 'AVG': return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
        case 'COUNT': return values.filter((v) => v !== undefined && v !== null && v !== '').length
        case 'MIN': return Math.min(...nums)
        case 'MAX': return Math.max(...nums)
        default: return '#ERR'
      }
    }

    default:
      return '#ERR'
  }
}
