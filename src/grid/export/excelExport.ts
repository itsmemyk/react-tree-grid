import type { DataStore } from '../../core/data'
import type { DataItem } from '../../core/data/types'
import type { GridColumn } from '../types'

export interface ExcelExportConfig {
  /** Column ids to export (default: all visible) */
  columns?: string[]
  /** Include header row (default: true) */
  includeHeader?: boolean
  /** Sheet name (default: 'Sheet1') */
  sheetName?: string
}

/**
 * Escape XML special characters and drop characters that are illegal in XML 1.0
 * (C0 control chars other than tab/LF/CR, unpaired surrogates, U+FFFE/U+FFFF).
 */
function escapeXml(value: string): string {
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, '')
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Inline string cell. xml:space="preserve" keeps leading/trailing whitespace. */
function textCell(ref: string, text: string): string {
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`
}

/** cellXfs indexes defined in STYLES_XML */
const STYLE_DATE = 1
const STYLE_DATETIME = 2

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="14" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="22" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`

const MS_PER_DAY = 86400000
const EXCEL_EPOCH = Date.UTC(1899, 11, 30)

/**
 * Convert a Date to an Excel serial date number (1900 date system), using the
 * date's local wall-clock time since Excel dates carry no time zone.
 */
function toExcelSerial(d: Date): number {
  const utc = Date.UTC(
    d.getFullYear(), d.getMonth(), d.getDate(),
    d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds(),
  )
  return (utc - EXCEL_EPOCH) / MS_PER_DAY
}

function dateCell(ref: string, d: Date): string {
  if (isNaN(d.getTime())) return `<c r="${ref}"/>`
  const serial = toExcelSerial(d)
  const style = Number.isInteger(serial) ? STYLE_DATE : STYLE_DATETIME
  return `<c r="${ref}" s="${style}"><v>${serial}</v></c>`
}

/**
 * Convert column index (0-based) to Excel column letter (A, B, ... Z, AA, AB, ...).
 */
function colLetter(index: number): string {
  let result = ''
  let n = index
  while (n >= 0) {
    result = String.fromCharCode((n % 26) + 65) + result
    n = Math.floor(n / 26) - 1
  }
  return result
}

/**
 * Build a minimal XLSX file (Open XML SpreadsheetML) as a Blob.
 *
 * Uses inline strings (no shared string table) for simplicity.
 * This avoids any external dependency while producing valid .xlsx files.
 */
export function exportGridToExcel<T extends DataItem>(
  store: DataStore<T>,
  columns: GridColumn<T>[],
  config?: ExcelExportConfig,
): Blob {
  const sheetName = config?.sheetName ?? 'Sheet1'
  const includeHeader = config?.includeHeader ?? true

  const exportColIds = config?.columns
  const exportColumns = exportColIds
    ? columns.filter((c) => !c.hidden && exportColIds.includes(c.id))
    : columns.filter((c) => !c.hidden)

  // Build sheet XML rows
  const rows: string[] = []
  let rowNum = 1

  if (includeHeader) {
    const cells = exportColumns
      .map((col, ci) => {
        const text = col.header?.[0]?.text ?? col.id
        return textCell(`${colLetter(ci)}${rowNum}`, text)
      })
      .join('')
    rows.push(`<row r="${rowNum}">${cells}</row>`)
    rowNum++
  }

  const items = store._order
  for (const item of items) {
    const cells = exportColumns
      .map((col, ci) => {
        const raw = item[col.id]
        const ref = `${colLetter(ci)}${rowNum}`
        if (raw === null || raw === undefined || raw === '') {
          return `<c r="${ref}"/>`
        }
        // Only real finite numbers become numeric cells; numeric-looking
        // strings ("007", "1e3", "0x1F", " ") stay text.
        if (typeof raw === 'number' && Number.isFinite(raw)) {
          return `<c r="${ref}"><v>${raw}</v></c>`
        }
        if (raw instanceof Date) return dateCell(ref, raw)
        return textCell(ref, String(raw))
      })
      .join('')
    rows.push(`<row r="${rowNum}">${cells}</row>`)
    rowNum++
  }

  const sheetData = rows.join('')

  // Build minimal XLSX archive using ZIP format
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${sheetData}</sheetData>
</worksheet>`

  // Build ZIP manually (minimal, store-only, no compression)
  const files: Array<{ path: string; data: Uint8Array }> = [
    { path: '[Content_Types].xml', data: encode(contentTypes) },
    { path: '_rels/.rels', data: encode(rels) },
    { path: 'xl/_rels/workbook.xml.rels', data: encode(workbookRels) },
    { path: 'xl/workbook.xml', data: encode(workbook) },
    { path: 'xl/worksheets/sheet1.xml', data: encode(sheet) },
    { path: 'xl/styles.xml', data: encode(STYLES_XML) },
  ]

  return buildZip(files)
}

/**
 * Export and download grid data as an Excel file.
 */
export function downloadGridAsExcel<T extends DataItem>(
  store: DataStore<T>,
  columns: GridColumn<T>[],
  filename: string,
  config?: ExcelExportConfig,
): void {
  const blob = exportGridToExcel(store, columns, config)
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

// ─── Minimal ZIP builder (store-only, no compression) ────────────────

function encode(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

function buildZip(
  files: Array<{ path: string; data: Uint8Array }>,
): Blob {
  const entries: Array<{
    path: Uint8Array
    data: Uint8Array
    offset: number
  }> = []
  const parts: Uint8Array[] = []
  let offset = 0
  const stamp = dosDateTime(new Date())

  // Local file headers + data
  for (const file of files) {
    const pathBytes = encode(file.path)
    const header = localFileHeader(pathBytes, file.data, stamp)
    entries.push({ path: pathBytes, data: file.data, offset })
    parts.push(header, file.data)
    offset += header.length + file.data.length
  }

  // Central directory
  const centralStart = offset
  for (const entry of entries) {
    const cd = centralDirectoryEntry(entry.path, entry.data, entry.offset, stamp)
    parts.push(cd)
    offset += cd.length
  }
  const centralSize = offset - centralStart

  // End of central directory
  const eocdr = endOfCentralDirectory(
    entries.length,
    centralSize,
    centralStart,
  )
  parts.push(eocdr)

  return new Blob(parts as unknown as BlobPart[], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

interface DosDateTime {
  time: number
  date: number
}

/** MS-DOS date/time used by ZIP headers (local time, 2-second resolution, years 1980–2107). */
function dosDateTime(d: Date): DosDateTime {
  const year = Math.min(Math.max(d.getFullYear(), 1980), 2107)
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: ((year - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  }
}

function localFileHeader(path: Uint8Array, data: Uint8Array, stamp: DosDateTime): Uint8Array {
  const buf = new ArrayBuffer(30 + path.length)
  const view = new DataView(buf)
  const arr = new Uint8Array(buf)

  view.setUint32(0, 0x04034b50, true) // signature
  view.setUint16(4, 20, true) // version needed
  view.setUint16(6, 0, true) // flags
  view.setUint16(8, 0, true) // compression (store)
  view.setUint16(10, stamp.time, true) // mod time
  view.setUint16(12, stamp.date, true) // mod date
  view.setUint32(14, crc32(data), true) // crc32
  view.setUint32(18, data.length, true) // compressed size
  view.setUint32(22, data.length, true) // uncompressed size
  view.setUint16(26, path.length, true) // filename length
  view.setUint16(28, 0, true) // extra length
  arr.set(path, 30)

  return arr
}

function centralDirectoryEntry(
  path: Uint8Array,
  data: Uint8Array,
  localOffset: number,
  stamp: DosDateTime,
): Uint8Array {
  const buf = new ArrayBuffer(46 + path.length)
  const view = new DataView(buf)
  const arr = new Uint8Array(buf)

  view.setUint32(0, 0x02014b50, true) // signature
  view.setUint16(4, 20, true) // version made by
  view.setUint16(6, 20, true) // version needed
  view.setUint16(8, 0, true) // flags
  view.setUint16(10, 0, true) // compression
  view.setUint16(12, stamp.time, true) // mod time
  view.setUint16(14, stamp.date, true) // mod date
  view.setUint32(16, crc32(data), true)
  view.setUint32(20, data.length, true)
  view.setUint32(24, data.length, true)
  view.setUint16(28, path.length, true)
  view.setUint16(30, 0, true) // extra length
  view.setUint16(32, 0, true) // comment length
  view.setUint16(34, 0, true) // disk number start
  view.setUint16(36, 0, true) // internal attributes
  view.setUint32(38, 0, true) // external attributes
  view.setUint32(42, localOffset, true)
  arr.set(path, 46)

  return arr
}

function endOfCentralDirectory(
  count: number,
  size: number,
  offset: number,
): Uint8Array {
  const buf = new ArrayBuffer(22)
  const view = new DataView(buf)

  view.setUint32(0, 0x06054b50, true) // signature
  view.setUint16(4, 0, true) // disk number
  view.setUint16(6, 0, true) // disk with central dir
  view.setUint16(8, count, true) // entries on this disk
  view.setUint16(10, count, true) // total entries
  view.setUint32(12, size, true) // central dir size
  view.setUint32(16, offset, true) // central dir offset
  view.setUint16(20, 0, true) // comment length

  return new Uint8Array(buf)
}

// ─── CRC-32 ──────────────────────────────────────────────────────────

let crcTable: Uint32Array | null = null

function ensureCrcTable(): Uint32Array {
  if (crcTable) return crcTable
  crcTable = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    crcTable[n] = c >>> 0
  }
  return crcTable
}

function crc32(data: Uint8Array): number {
  const table = ensureCrcTable()
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}
