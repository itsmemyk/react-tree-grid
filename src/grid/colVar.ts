export function colVarName(id: string): string {
  return `--rgs-col-${id.replace(/[^a-zA-Z0-9_]/g, '-')}`
}

export function colVarRef(id: string): string {
  return `var(${colVarName(id)})`
}
