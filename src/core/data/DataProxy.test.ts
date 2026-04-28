import { describe, it, expect, vi } from 'vitest'
import { DataProxy } from './DataProxy'

const mockFetch = (data: unknown[], total: number) =>
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data, total }),
  } as Response)

describe('DataProxy', () => {
  it('buildUrl encodes page, size and static params', () => {
    const proxy = new DataProxy({
      url: 'https://api.test/items',
      pageSize: 20,
      params: { org: 'acme' },
      fetchFn: mockFetch([], 0),
    })
    const url = proxy.buildUrl(2, {})
    expect(url).toBe('https://api.test/items?page=2&size=20&org=acme')
  })

  it('buildUrl appends sortBy and sortDir', () => {
    const proxy = new DataProxy({
      url: 'https://api.test/items',
      fetchFn: mockFetch([], 0),
    })
    const url = proxy.buildUrl(1, { sortBy: 'name', sortDir: 'asc' })
    expect(url).toContain('sortBy=name')
    expect(url).toContain('sortDir=asc')
  })

  it('buildUrl appends filter params as filter[col]=val', () => {
    const proxy = new DataProxy({
      url: 'https://api.test/items',
      fetchFn: mockFetch([], 0),
    })
    const url = proxy.buildUrl(1, { filters: { status: 'active' } })
    expect(url).toContain('filter%5Bstatus%5D=active')
  })

  it('buildUrl appends groupBy when provided', () => {
    const proxy = new DataProxy({
      url: 'https://api.test/items',
      fetchFn: mockFetch([], 0),
    })
    const url = proxy.buildUrl(1, { groupBy: 'dept' })
    expect(url).toContain('groupBy=dept')
  })

  it('load fetches data and resolves with data+total', async () => {
    const items = [{ id: '1', name: 'Alice' }]
    const proxy = new DataProxy({
      url: 'https://api.test/items',
      fetchFn: mockFetch(items, 99),
    })
    const result = await proxy.load(1, {})
    expect(result.data).toEqual(items)
    expect(result.total).toBe(99)
  })

  it('load throws DataProxyError when response is not ok', async () => {
    const proxy = new DataProxy({
      url: 'https://api.test/items',
      fetchFn: vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response),
    })
    await expect(proxy.load(1, {})).rejects.toThrow('DataProxy: HTTP 500')
  })

  it('aborts in-flight request when abort() is called', async () => {
    let aborted = false
    const proxy = new DataProxy({
      url: 'https://api.test/items',
      fetchFn: vi.fn((_url: string, opts?: RequestInit) => {
        opts?.signal?.addEventListener('abort', () => { aborted = true })
        return new Promise(() => {}) as Promise<Response>
      }),
    })
    proxy.load(1, {})
    proxy.abort()
    expect(aborted).toBe(true)
  })
})
