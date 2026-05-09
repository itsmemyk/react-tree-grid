export function colVarName(id: string): string {
  const encoded = Array.from(id, (char) => {
    return /[a-zA-Z0-9]/.test(char)
      ? char
      : `_${char.codePointAt(0)!.toString(16)}_`
  }).join('')

  return `--rgs-col-${encoded}`
}

export function colVarRef(id: string): string {
  return `var(${colVarName(id)})`
}
