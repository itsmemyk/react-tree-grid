import { useCallback, useMemo, useState } from 'react'
import type { GridColumn, GridMarkRange, GridRow } from './types'

type RowCssState = Record<string, string[]>
type CellCssState = Record<string, Record<string, string[]>>
type CellCssMap = Record<string, Record<string, string>>

function normalizeTokens(css: string): string[] {
  return css
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function appendTokens(existing: string[] | undefined, css: string): string[] {
  const next = [...(existing ?? [])]
  normalizeTokens(css).forEach((token) => {
    if (!next.includes(token)) {
      next.push(token)
    }
  })
  return next
}

function removeTokens(existing: string[] | undefined, css: string): string[] {
  if (!existing?.length) {
    return []
  }

  const toRemove = new Set(normalizeTokens(css))
  return existing.filter((token) => !toRemove.has(token))
}

function buildClassMap(tokens: string[]): string | undefined {
  if (!tokens.length) {
    return undefined
  }
  return tokens.join(' ')
}

function getNumericMarkClasses<T extends GridRow>(
  rows: T[],
  column: GridColumn<T>,
  mark: GridMarkRange,
): Record<string, string> {
  const numericRows = rows
    .map((row) => ({
      rowId: row.id,
      value: row[column.id],
    }))
    .filter((entry): entry is { rowId: string; value: number } => typeof entry.value === 'number' && Number.isFinite(entry.value))

  if (!numericRows.length) {
    return {}
  }

  const values = numericRows.map((entry) => entry.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const result: Record<string, string> = {}

  numericRows.forEach(({ rowId, value }) => {
    const tokens: string[] = []
    if (mark.min && value === min) {
      tokens.push(mark.min)
    }
    if (mark.max && value === max) {
      tokens.push(mark.max)
    }
    const className = buildClassMap(tokens)
    if (className) {
      result[rowId] = className
    }
  })

  return result
}

function getMarkCssMap<T extends GridRow>(rows: T[], columns: GridColumn<T>[]): CellCssMap {
  const next: CellCssMap = {}

  columns.forEach((column) => {
    if (!column.mark) {
      return
    }

    if (typeof column.mark === 'function') {
      const markFn = column.mark
      const values = rows.map((row) => row[column.id])
      rows.forEach((row) => {
        const className = markFn(row[column.id], values, row, column)
        if (className) {
          next[column.id] ??= {}
          next[column.id][row.id] = className
        }
      })
      return
    }

    const columnMarks = getNumericMarkClasses(rows, column, column.mark)
    if (Object.keys(columnMarks).length) {
      next[column.id] = columnMarks
    }
  })

  return next
}

function mergeCellCssMaps(base: CellCssState, marks: CellCssMap): CellCssMap {
  const next: CellCssMap = {}

  Object.entries(base).forEach(([colId, rows]) => {
    Object.entries(rows).forEach(([rowId, tokens]) => {
      const className = buildClassMap(tokens)
      if (className) {
        next[colId] ??= {}
        next[colId][rowId] = className
      }
    })
  })

  Object.entries(marks).forEach(([colId, rows]) => {
    Object.entries(rows).forEach(([rowId, className]) => {
      const merged = [next[colId]?.[rowId], className].filter(Boolean).join(' ').trim()
      if (merged) {
        next[colId] ??= {}
        next[colId][rowId] = merged
      }
    })
  })

  return next
}

export function useGridCss<T extends GridRow>(rows: T[], columns: GridColumn<T>[]) {
  const [rowCssState, setRowCssState] = useState<RowCssState>({})
  const [cellCssState, setCellCssState] = useState<CellCssState>({})

  const addRowCss = useCallback((rowId: string, css: string) => {
    setRowCssState((prev) => {
      const nextTokens = appendTokens(prev[rowId], css)
      if (nextTokens.length === (prev[rowId]?.length ?? 0)) {
        return prev
      }
      return { ...prev, [rowId]: nextTokens }
    })
  }, [])

  const removeRowCss = useCallback((rowId: string, css: string) => {
    setRowCssState((prev) => {
      const nextTokens = removeTokens(prev[rowId], css)
      if (nextTokens.length === (prev[rowId]?.length ?? 0)) {
        return prev
      }
      if (!nextTokens.length) {
        const { [rowId]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [rowId]: nextTokens }
    })
  }, [])

  const addCellCss = useCallback((rowId: string, colId: string, css: string) => {
    setCellCssState((prev) => {
      const currentColumn = prev[colId] ?? {}
      const nextTokens = appendTokens(currentColumn[rowId], css)
      if (nextTokens.length === (currentColumn[rowId]?.length ?? 0)) {
        return prev
      }
      return {
        ...prev,
        [colId]: {
          ...currentColumn,
          [rowId]: nextTokens,
        },
      }
    })
  }, [])

  const removeCellCss = useCallback((rowId: string, colId: string, css: string) => {
    setCellCssState((prev) => {
      const currentColumn = prev[colId]
      if (!currentColumn) {
        return prev
      }

      const nextTokens = removeTokens(currentColumn[rowId], css)
      if (nextTokens.length === (currentColumn[rowId]?.length ?? 0)) {
        return prev
      }

      if (!nextTokens.length) {
        const { [rowId]: _removed, ...restRows } = currentColumn
        if (!Object.keys(restRows).length) {
          const { [colId]: _removedColumn, ...restColumns } = prev
          return restColumns
        }
        return {
          ...prev,
          [colId]: restRows,
        }
      }

      return {
        ...prev,
        [colId]: {
          ...currentColumn,
          [rowId]: nextTokens,
        },
      }
    })
  }, [])

  const rowCssMap = useMemo(() => {
    const next: Record<string, string> = {}
    Object.entries(rowCssState).forEach(([rowId, tokens]) => {
      const className = buildClassMap(tokens)
      if (className) {
        next[rowId] = className
      }
    })
    return next
  }, [rowCssState])

  const markCssMap = useMemo(() => getMarkCssMap(rows, columns), [columns, rows])
  const cellCssMap = useMemo(
    () => mergeCellCssMaps(cellCssState, markCssMap),
    [cellCssState, markCssMap],
  )

  return {
    addRowCss,
    removeRowCss,
    addCellCss,
    removeCellCss,
    rowCssMap,
    cellCssMap,
  }
}
