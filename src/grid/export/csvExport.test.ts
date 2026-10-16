import { describe, it, expect, vi, afterEach } from 'vitest'
import { DataStore } from '../../core/data'
import type { DataItem } from '../../core/data/types'
import type { GridColumn } from '../types'
import { exportGridToCsv, downloadGridAsCsv } from './csvExport'

function makeStore(rows: DataItem[]) {
  const store = new DataStore<DataItem>()
  store.parse(rows)
  return store
}

const cols: GridColumn<DataItem>[] = [
  { id: 'name', header: [{ text: 'Name' }] },
  { id: 'when' },
]

describe('exportGridToCsv', () => {
  it('returns a plain CSV string without BOM', () => {
    const csv = exportGridToCsv(makeStore([{ id: '1', name: 'Zoë', when: 'x' }]), cols)
    expect(csv.charCodeAt(0)).not.toBe(0xfeff)
    expect(csv).toBe('Name,when\nZoë,x')
  })

  it('escapes delimiters, quotes and newlines', () => {
    const csv = exportGridToCsv(makeStore([{ id: '1', name: 'a,"b"\nc', when: '' }]), cols, {
      includeHeader: false,
    })
    expect(csv).toBe('"a,""b""\nc",')
  })

  it('formats Date values in local time, like the Excel export', () => {
    const withTime = new Date(2024, 0, 15, 10, 30, 5)
    const midnight = new Date(2024, 0, 15)
    const csv = exportGridToCsv(makeStore([
      { id: '1', name: 'a', when: withTime },
      { id: '2', name: 'b', when: midnight },
    ]), cols, { includeHeader: false })
    expect(csv).toBe('a,2024-01-15 10:30:05\nb,2024-01-15')
  })

  it('exports invalid dates as empty cells', () => {
    const csv = exportGridToCsv(makeStore([{ id: '1', name: 'a', when: new Date('nope') }]), cols, {
      includeHeader: false,
    })
    expect(csv).toBe('a,')
  })
})

describe('downloadGridAsCsv', () => {
  afterEach(() => vi.restoreAllMocks())

  it('prepends a UTF-8 BOM to the downloaded file', async () => {
    let captured: Blob | undefined
    vi.spyOn(URL, 'createObjectURL').mockImplementation((b) => {
      captured = b as Blob
      return 'blob:test'
    })
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    downloadGridAsCsv(makeStore([{ id: '1', name: 'Zoë', when: 'x' }]), cols, 'out.csv')

    expect(captured).toBeDefined()
    const bytes = new Uint8Array(await captured!.arrayBuffer())
    expect(Array.from(bytes.subarray(0, 3))).toEqual([0xef, 0xbb, 0xbf])
    expect(new TextDecoder().decode(bytes.subarray(3))).toBe('Name,when\nZoë,x')
  })
})
