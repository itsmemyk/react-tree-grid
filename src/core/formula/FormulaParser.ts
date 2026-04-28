export type ASTNode =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'cellRef'; col: number; row: number }
  | { type: 'range'; from: { col: number; row: number }; to: { col: number; row: number } }
  | { type: 'call'; name: string; args: ASTNode[] }
  | { type: 'binary'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: string; operand: ASTNode }

export class ParseError extends Error {
  constructor(msg: string) {
    super(`FormulaParser: ${msg}`)
    this.name = 'ParseError'
  }
}

function colLetterToIndex(letters: string): number {
  let result = 0
  for (const ch of letters.toUpperCase()) {
    result = result * 26 + ch.charCodeAt(0) - 64
  }
  return result - 1
}

interface Token {
  type: 'NUMBER' | 'STRING' | 'CELLREF' | 'FUNC' | 'OP' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'COLON' | 'EOF'
  value: string
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < src.length) {
    const ch = src[i]
    if (/\s/.test(ch)) { i++; continue }

    if (/\d/.test(ch)) {
      let num = ''
      while (i < src.length && /[\d.]/.test(src[i])) num += src[i++]
      tokens.push({ type: 'NUMBER', value: num })
      continue
    }

    if (ch === '"') {
      let str = ''
      i++
      while (i < src.length && src[i] !== '"') str += src[i++]
      i++
      tokens.push({ type: 'STRING', value: str })
      continue
    }

    if (/[A-Za-z]/.test(ch)) {
      let name = ''
      while (i < src.length && /[A-Za-z]/.test(src[i])) name += src[i++]
      if (/\d/.test(src[i] ?? '')) {
        let rowStr = ''
        while (i < src.length && /\d/.test(src[i])) rowStr += src[i++]
        tokens.push({ type: 'CELLREF', value: `${name}${rowStr}` })
      } else if (src[i] === '(') {
        tokens.push({ type: 'FUNC', value: name.toUpperCase() })
      } else {
        tokens.push({ type: 'OP', value: name })
      }
      continue
    }

    if (ch === '(') { tokens.push({ type: 'LPAREN', value: '(' }); i++; continue }
    if (ch === ')') { tokens.push({ type: 'RPAREN', value: ')' }); i++; continue }
    if (ch === ',') { tokens.push({ type: 'COMMA', value: ',' }); i++; continue }
    if (ch === ':') { tokens.push({ type: 'COLON', value: ':' }); i++; continue }
    if (/[+\-*/&<>=!]/.test(ch)) {
      let op = ch; i++
      if (i < src.length && /[=]/.test(src[i])) op += src[i++]
      tokens.push({ type: 'OP', value: op })
      continue
    }

    throw new ParseError(`Unexpected character: ${ch}`)
  }
  tokens.push({ type: 'EOF', value: '' })
  return tokens
}

function parseCellRef(value: string): { col: number; row: number } {
  const match = value.match(/^([A-Za-z]+)(\d+)$/)
  if (!match) throw new ParseError(`Invalid cell ref: ${value}`)
  return { col: colLetterToIndex(match[1]), row: Number(match[2]) }
}

class Parser {
  private tokens: Token[]
  private pos = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  private peek(): Token { return this.tokens[this.pos] }
  private consume(): Token { return this.tokens[this.pos++] }
  private expect(type: Token['type']): Token {
    const t = this.consume()
    if (t.type !== type) throw new ParseError(`Expected ${type}, got ${t.type} (${t.value})`)
    return t
  }

  parse(): ASTNode {
    const node = this.parseExpr()
    if (this.peek().type !== 'EOF') throw new ParseError('Unexpected tokens after expression')
    return node
  }

  private parseExpr(): ASTNode { return this.parseAdditive() }

  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative()
    while (this.peek().type === 'OP' && /^[+\-&]$/.test(this.peek().value)) {
      const op = this.consume().value
      const right = this.parseMultiplicative()
      left = { type: 'binary', op, left, right }
    }
    return left
  }

  private parseMultiplicative(): ASTNode {
    let left = this.parseComparison()
    while (this.peek().type === 'OP' && /^[*/]$/.test(this.peek().value)) {
      const op = this.consume().value
      const right = this.parseComparison()
      left = { type: 'binary', op, left, right }
    }
    return left
  }

  private parseComparison(): ASTNode {
    let left = this.parsePrimary()
    while (this.peek().type === 'OP' && /^(>|<|>=|<=|=|<>|!=)$/.test(this.peek().value)) {
      const op = this.consume().value
      const right = this.parsePrimary()
      left = { type: 'binary', op, left, right }
    }
    return left
  }

  private parsePrimary(): ASTNode {
    const t = this.peek()

    if (t.type === 'NUMBER') {
      this.consume()
      return { type: 'number', value: Number(t.value) }
    }

    if (t.type === 'STRING') {
      this.consume()
      return { type: 'string', value: t.value }
    }

    if (t.type === 'CELLREF') {
      this.consume()
      const ref = parseCellRef(t.value)
      if (this.peek().type === 'COLON') {
        this.consume()
        const t2 = this.expect('CELLREF')
        const ref2 = parseCellRef(t2.value)
        return { type: 'range', from: ref, to: ref2 }
      }
      return { type: 'cellRef', col: ref.col, row: ref.row }
    }

    if (t.type === 'FUNC') {
      this.consume()
      this.expect('LPAREN')
      const args: ASTNode[] = []
      while (this.peek().type !== 'RPAREN') {
        if (args.length > 0) this.expect('COMMA')
        args.push(this.parseExpr())
      }
      this.expect('RPAREN')
      return { type: 'call', name: t.value, args }
    }

    if (t.type === 'LPAREN') {
      this.consume()
      const inner = this.parseExpr()
      this.expect('RPAREN')
      return inner
    }

    if (t.type === 'OP' && t.value === '-') {
      this.consume()
      return { type: 'unary', op: '-', operand: this.parsePrimary() }
    }

    throw new ParseError(`Unexpected token: ${t.type} (${t.value})`)
  }
}

export function parseFormula(formula: string): ASTNode {
  if (!formula.startsWith('=')) throw new ParseError('Formula must start with =')
  const src = formula.slice(1)
  const tokens = tokenize(src)
  return new Parser(tokens).parse()
}
