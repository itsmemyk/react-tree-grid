import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDataProxy } from './useDataProxy'
import type { DataProxyConfig } from './DataProxy'

const makeConfig = (data: unknown[], total: number): DataProxyConfig => ({
  url: 'https://api.test/items',
  pageSize: 10,
  fetchFn: vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data, total }),
  } as Response),
})

describe('useDataProxy', () => {
  it('starts with loading=false and empty data', () => {
    const { result } = renderHook(() => useDataProxy(undefined))
    expect(result.current.loading).toBe(false)
    expect(result.current.proxyData).toEqual([])
    expect(result.current.total).toBe(0)
  })

  it('loads page 1 on first load() call', async () => {
    const items = [{ id: '1' }, { id: '2' }]
    const config = makeConfig(items, 2)
    const { result } = renderHook(() => useDataProxy(config))
    await act(async () => { await result.current.load(1, {}) })
    expect(result.current.proxyData).toEqual(items)
    expect(result.current.total).toBe(2)
    expect(result.current.loading).toBe(false)
  })

  it('sets loading=true during fetch and false after', async () => {
    let resolveResponse!: (v: unknown) => void
    const config: DataProxyConfig = {
      url: 'https://api.test/items',
      fetchFn: vi.fn().mockReturnValue(
        new Promise((res) => { resolveResponse = res }),
      ),
    }
    const { result } = renderHook(() => useDataProxy(config))

    act(() => { result.current.load(1, {}) })
    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolveResponse({ ok: true, json: async () => ({ data: [], total: 0 }) })
    })
    expect(result.current.loading).toBe(false)
  })

  it('captures fetch errors in error state', async () => {
    const config: DataProxyConfig = {
      url: 'https://api.test/items',
      fetchFn: vi.fn().mockRejectedValue(new Error('network error')),
    }
    const { result } = renderHook(() => useDataProxy(config))
    await act(async () => { await result.current.load(1, {}).catch(() => {}) })
    expect(result.current.error?.message).toBe('network error')
  })

  it('appends data in append paginationMode', async () => {
    const page1 = [{ id: '1' }]
    const page2 = [{ id: '2' }]
    let call = 0
    const config: DataProxyConfig = {
      url: 'https://api.test/items',
      pageSize: 1,
      fetchFn: vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ data: call++ === 0 ? page1 : page2, total: 2 }),
        } as Response),
      ),
    }
    const { result } = renderHook(() =>
      useDataProxy(config, { paginationMode: 'append' }),
    )
    await act(async () => { await result.current.load(1, {}) })
    await act(async () => { await result.current.load(2, {}) })
    expect(result.current.proxyData).toEqual([...page1, ...page2])
  })
})
