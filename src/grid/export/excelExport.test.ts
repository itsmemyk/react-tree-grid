import { describe, it, expect } from 'vitest'
import { DataStore } from '../../core/data'
import type { DataItem } from '../../core/data/types'
import type { GridColumn } from '../types'
import { exportGridToExcel } from './excelExport'

interface ZipEntry {
  path: string
  data: string
  modTime: number
  modDate: number
}

/** Reads the store-only ZIP written by exportGridToExcel. */
async function readZip(blob: Blob): Promise<ZipEntry[]> {
  const buf = new Uint8Array(await blob.arrayBuffer())
  const view = new DataView(buf.buffer)
  const decoder = new TextDecoder()
  const entries: ZipEntry[] = []
  let p = 0
  while (view.getUint32(p, true) === 0x04034b50) {
    const modTime = view.getUint16(p + 10, true)
    const modDate = view.getUint16(p + 12, true)
    const size = view.getUint32(p + 18, true)
    const nameLen = view.getUint16(p + 26, true)
    const extraLen = view.getUint16(p + 28, true)
    const path = decoder.decode(buf.subarray(p + 30, p + 30 + nameLen))
    const start = p + 30 + nameLen + extraLen
    entries.push({ path, data: decoder.decode(buf.subarray(start, start + size)), modTime, modDate })
    p = start + size
  }
  // Central directory dates must match the local headers
  while (view.getUint32(p, true) === 0x02014b50) {
    const nameLen = view.getUint16(p + 28, true)
    const path = decoder.decode(buf.subarray(p + 46, p + 46 + nameLen))
    const entry = entries.find((e) => e.path === path)!
    expect(view.getUint16(p + 12, true)).toBe(entry.modTime)
    expect(view.getUint16(p + 14, true)).toBe(entry.modDate)
    p += 46 + nameLen + view.getUint16(p + 30, true) + view.getUint16(p + 32, true)
  }
  return entries
}

async function exportSheet(rows: DataItem[], columns: GridColumn<DataItem>[]) {
  const store = new DataStore<DataItem>()
  store.parse(rows)
  const entries = await readZip(exportGridToExcel(store, columns, { includeHeader: false }))
  const sheet = entries.find((e) => e.path === 'xl/worksheets/sheet1.xml')!.data
  return { entries, sheet }
}

function cell(sheet: string, ref: string): string {
  const m = sheet.match(new RegExp(`<c r="${ref}"[^>]*?(/>|>[\\s\\S]*?</c>)`))
  if (!m) throw new Error(`cell ${ref} not found in ${sheet}`)
  return m[0]
}

const cols: GridColumn<DataItem>[] = [{ id: 'v' }]

describe('exportGridToExcel', () => {
  it('writes finite numbers as numeric cells', async () => {
    const { sheet } = await exportSheet([{ id: '1', v: 42 }, { id: '2', v: -1.5 }], cols)
    expect(cell(sheet, 'A1')).toBe('<c r="A1"><v>42</v></c>')
    expect(cell(sheet, 'A2')).toBe('<c r="A2"><v>-1.5</v></c>')
  })

  it('keeps numeric-looking strings as text', async () => {
    const values = ['007', ' ', '1e3', '0x1F', '12']
    const { sheet } = await exportSheet(values.map((v, i) => ({ id: String(i), v })), cols)
    values.forEach((v, i) => {
      const c = cell(sheet, `A${i + 1}`)
      expect(c).toContain('t="inlineStr"')
      expect(c).toContain(`>${v}</t>`)
      expect(c).not.toContain('<v>')
    })
  })

  it('does not write Infinity or NaN as numbers', async () => {
    const { sheet } = await exportSheet(
      [{ id: '1', v: Infinity }, { id: '2', v: -Infinity }, { id: '3', v: NaN }],
      cols,
    )
    expect(sheet).not.toContain('<v>Infinity</v>')
    expect(sheet).not.toContain('<v>-Infinity</v>')
    expect(sheet).not.toContain('<v>NaN</v>')
  })

  it('writes booleans as text', async () => {
    const { sheet } = await exportSheet([{ id: '1', v: true }], cols)
    expect(cell(sheet, 'A1')).toContain('>true</t>')
  })

  it('writes dates as Excel serials with a date style', async () => {
    const { sheet, entries } = await exportSheet(
      [
        { id: '1', v: new Date(2024, 0, 15) },
        { id: '2', v: new Date(2024, 0, 15, 18, 0, 0) },
        { id: '3', v: new Date('invalid') },
      ],
      cols,
    )
    const dateCell = cell(sheet, 'A1')
    expect(dateCell).toMatch(/<c r="A1" s="(\d+)"><v>45306<\/v><\/c>/)
    const dateTimeCell = cell(sheet, 'A2')
    expect(dateTimeCell).toMatch(/<v>45306\.75<\/v>/)
    expect(cell(sheet, 'A3')).toBe('<c r="A3"/>')

    const styles = entries.find((e) => e.path === 'xl/styles.xml')
    expect(styles).toBeDefined()
    const styleIndex = Number(dateCell.match(/s="(\d+)"/)![1])
    const xfs = styles!.data.match(/<cellXfs[^>]*>(.*?)<\/cellXfs>/)![1].match(/<xf [^>]*\/>/g)!
    expect(xfs[styleIndex]).toMatch(/numFmtId="14"/)

    const contentTypes = entries.find((e) => e.path === '[Content_Types].xml')!.data
    expect(contentTypes).toContain('/xl/styles.xml')
    const wbRels = entries.find((e) => e.path === 'xl/_rels/workbook.xml.rels')!.data
    expect(wbRels).toContain('Target="styles.xml"')
  })

  it('strips XML-illegal control characters', async () => {
    const { sheet } = await exportSheet([{ id: '1', v: 'a\u0000b\u0007c\u000Bd\u001Fe\tf\ng' }], cols)
    expect(cell(sheet, 'A1')).toContain('>abcde\tf\ng</t>')
  })

  it('also strips control characters from headers', async () => {
    const store = new DataStore<DataItem>()
    store.parse([])
    const entries = await readZip(
      exportGridToExcel(store, [{ id: 'v', header: [{ text: 'He\u0001ad' }] }]),
    )
    const sheet = entries.find((e) => e.path === 'xl/worksheets/sheet1.xml')!.data
    expect(sheet).toContain('>Head</t>')
  })

  it('preserves leading and trailing spaces in text', async () => {
    const { sheet } = await exportSheet([{ id: '1', v: '  padded  ' }], cols)
    expect(cell(sheet, 'A1')).toContain('<t xml:space="preserve">  padded  </t>')
  })

  it('writes valid DOS dates on zip entries', async () => {
    const { entries } = await exportSheet([{ id: '1', v: 1 }], cols)
    for (const e of entries) {
      const day = e.modDate & 0x1f
      const month = (e.modDate >> 5) & 0x0f
      const year = (e.modDate >> 9) + 1980
      expect(day).toBeGreaterThanOrEqual(1)
      expect(month).toBeGreaterThanOrEqual(1)
      expect(month).toBeLessThanOrEqual(12)
      expect(year).toBeGreaterThanOrEqual(2020)
      expect(e.modTime >> 11).toBeLessThan(24)
    }
  })
})
