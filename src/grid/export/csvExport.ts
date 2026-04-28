import type { DataStore } from '../../core/data'
import type { DataItem } from '../../core/data/types'
import type { GridColumn } from '../types'

export interface CsvExportConfig {
  /** Column ids to export (default: all visible) */
  columns?: string[]
  /** Include header row (default: true) */
  includeHeader?: boolean
  /** Include footer row (default: false) */
  includeFooter?: boolean
  /** Row delimiter (default: '\n') */
  rowDelimiter?: string
  /** Column delimiter (default: ',') */
  columnDelimiter?: string
}

function escapeCsv(value: unknown, delimiter: string): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (
    str.includes(delimiter) ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r')
  ) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Export grid data to CSV string.
 */
export function exportGridToCsv<T extends DataItem>(
  store: DataStore<T>,
  columns: GridColumn<T>[],
  config?: CsvExportConfig,
): string {
  const colDelim = config?.columnDelimiter ?? ','
  const rowDelim = config?.rowDelimiter ?? '\n'
  const includeHeader = config?.includeHeader ?? true

  const exportColIds = config?.columns
  const exportColumns = exportColIds
    ? columns.filter((c) => !c.hidden && exportColIds.includes(c.id))
    : columns.filter((c) => !c.hidden)

  const lines: string[] = []

  if (includeHeader) {
    const headerLine = exportColumns
      .map((col) => {
        const text = col.header?.[0]?.text ?? col.id
        return escapeCsv(text, colDelim)
      })
      .join(colDelim)
    lines.push(headerLine)
  }

  const items = store._order
  for (const item of items) {
    const row = exportColumns
      .map((col) => escapeCsv(item[col.id], colDelim))
      .join(colDelim)
    lines.push(row)
  }

  return lines.join(rowDelim)
}

/**
 * Export and download grid data as a CSV file.
 */
export function downloadGridAsCsv<T extends DataItem>(
  store: DataStore<T>,
  columns: GridColumn<T>[],
  filename: string,
  config?: CsvExportConfig,
): void {
  const csv = exportGridToCsv(store, columns, config)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, filename)
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
