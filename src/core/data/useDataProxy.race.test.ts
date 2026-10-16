import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDataProxy } from './useDataProxy'
import type { DataProxyConfig } from './DataProxy'

interface PendingCall {
  url: string
  init?: RequestInit
  respond: (data: unknown[], total: number) => void
  fail: (err: Error) => void
}

/** fetch mock that keeps every request pending until the test resolves it, and rejects on abort like real fetch */
function controllableFetch() {
  const calls: PendingCall[] = []
  const fn = vi.fn((url: string, init?: RequestInit) =>
    new Promise<Response>((resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        reject(new DOMException('The operation was aborted.', 'AbortError'))
      })
      calls.push({
        url,
        init,
        respond: (data, total) =>
          resolve({ ok: true, json: async () => ({ data, total }) } as Response),
        fail: reject,
      })
    }),
  )
  return { fn, calls }
}

const flush = () => act(async () => { await Promise.resolve() })

afterEach(() => { vi.useRealTimers() })

describe('useDataProxy — request lifecycle', () => {
  it('passes the AbortSignal through a custom fetchFn', async () => {
    const { fn, calls } = controllableFetch()
    const config: DataProxyConfig = { url: '/items', fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config))
    act(() => { void result.current.load(1, {}) })
    expect(calls[0].init?.signal).toBeInstanceOf(AbortSignal)
  })

  it('ignores a slow older response once a newer request has resolved', async () => {
    const { fn, calls } = controllableFetch()
    // Swallow aborts so the "old" request can still be resolved late
    const config: DataProxyConfig = {
      url: '/items',
      fetchFn: (url, init) => fn(url, { ...init, signal: undefined }),
    }
    const { result } = renderHook(() => useDataProxy(config))
    act(() => { void result.current.load(1, { sortBy: 'a' }) })
    act(() => { void result.current.load(1, { sortBy: 'b' }) })
    await act(async () => { calls[1].respond([{ id: 'new' }], 1) })
    await act(async () => { calls[0].respond([{ id: 'old' }], 1) })
    expect(result.current.proxyData).toEqual([{ id: 'new' }])
    expect(result.current.loading).toBe(false)
  })

  it('does not report an aborted request as an error and keeps loading while the newer one runs', async () => {
    const { fn, calls } = controllableFetch()
    const onLoadError = vi.fn()
    const config: DataProxyConfig = { url: '/items', fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config, { onLoadError }))
    act(() => { void result.current.load(1, {}) })
    act(() => { void result.current.load(1, { sortBy: 'x' }) })
    await flush()
    expect(calls[0].init?.signal?.aborted).toBe(true)
    expect(result.current.error).toBeNull()
    expect(onLoadError).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(true)
    await act(async () => { calls[1].respond([{ id: '1' }], 1) })
    expect(result.current.loading).toBe(false)
    expect(result.current.proxyData).toEqual([{ id: '1' }])
  })

  it('still reports real errors of the latest request', async () => {
    const { fn, calls } = controllableFetch()
    const onLoadError = vi.fn()
    const config: DataProxyConfig = { url: '/items', fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config, { onLoadError }))
    act(() => { void result.current.load(1, {}) })
    await act(async () => { calls[0].fail(new Error('boom')) })
    expect(result.current.error?.message).toBe('boom')
    expect(onLoadError).toHaveBeenCalledTimes(1)
    expect(result.current.loading).toBe(false)
  })
})

describe('useDataProxy — polling', () => {
  it('polls with the latest sort/filter options', async () => {
    vi.useFakeTimers()
    const { fn, calls } = controllableFetch()
    const config: DataProxyConfig = { url: '/items', polling: 1000, fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config))
    act(() => { void result.current.load(1, { sortBy: 'name', sortDir: 'desc', filters: { s: 'x' } }) })
    await act(async () => { calls[0].respond([{ id: '1' }], 1) })
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(calls).toHaveLength(2)
    expect(calls[1].url).toContain('sortBy=name')
    expect(calls[1].url).toContain('sortDir=desc')
    expect(calls[1].url).toContain('filter%5Bs%5D=x')
    await act(async () => { calls[1].respond([{ id: '1', v: 2 }], 1) })
    expect(result.current.proxyData).toEqual([{ id: '1', v: 2 }])
  })

  it('keeps accumulated rows in append mode by refreshing pages 1..current', async () => {
    vi.useFakeTimers()
    const { fn, calls } = controllableFetch()
    const config: DataProxyConfig = { url: '/items', pageSize: 1, polling: 1000, fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config, { paginationMode: 'append' }))
    act(() => { void result.current.load(1, {}) })
    await act(async () => { calls[0].respond([{ id: '1' }], 3) })
    act(() => { void result.current.loadNextPage({}) })
    await act(async () => { calls[1].respond([{ id: '2' }], 3) })
    expect(result.current.proxyData).toEqual([{ id: '1' }, { id: '2' }])

    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(calls).toHaveLength(4)
    expect(calls[2].url).toContain('page=1')
    expect(calls[3].url).toContain('page=2')
    await act(async () => {
      calls[3].respond([{ id: '2', v: 'b' }], 3)
      calls[2].respond([{ id: '1', v: 'a' }], 3)
    })
    expect(result.current.proxyData).toEqual([{ id: '1', v: 'a' }, { id: '2', v: 'b' }])
    expect(result.current.page).toBe(2)
  })

  it('a poll does not cancel a pending user request', async () => {
    vi.useFakeTimers()
    const { fn, calls } = controllableFetch()
    const config: DataProxyConfig = { url: '/items', polling: 1000, fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config))
    act(() => { void result.current.load(1, {}) })
    await act(async () => { calls[0].respond([], 0) })
    await act(async () => { vi.advanceTimersByTime(900) })
    // user request starts, poll timer fires while it is pending
    act(() => { void result.current.load(1, { sortBy: 'b' }) })
    await act(async () => { vi.advanceTimersByTime(100) })
    expect(calls[1].init?.signal?.aborted).toBe(false)
    await act(async () => { calls[1].respond([{ id: 'user' }], 1) })
    expect(result.current.proxyData).toEqual([{ id: 'user' }])
    expect(result.current.loading).toBe(false)
  })

  it('a user request supersedes an in-flight poll', async () => {
    vi.useFakeTimers()
    const { fn, calls } = controllableFetch()
    const config: DataProxyConfig = { url: '/items', polling: 1000, fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config))
    act(() => { void result.current.load(1, {}) })
    await act(async () => { calls[0].respond([{ id: 'initial' }], 1) })
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(calls).toHaveLength(2) // poll in flight
    act(() => { void result.current.load(1, { sortBy: 'b' }) })
    expect(calls[1].init?.signal?.aborted).toBe(true)
    await act(async () => { calls[2].respond([{ id: 'user' }], 1) })
    expect(result.current.proxyData).toEqual([{ id: 'user' }])
    expect(result.current.error).toBeNull()
  })
})

describe('useDataProxy — hasMore', () => {
  it('reports hasMore and stops loadNextPage past the end', async () => {
    const { fn, calls } = controllableFetch()
    const config: DataProxyConfig = { url: '/items', pageSize: 2, fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config, { paginationMode: 'append' }))
    act(() => { void result.current.load(1, {}) })
    await act(async () => { calls[0].respond([{ id: '1' }, { id: '2' }], 3) })
    expect(result.current.hasMore).toBe(true)
    act(() => { void result.current.loadNextPage({}) })
    await act(async () => { calls[1].respond([{ id: '3' }], 3) })
    expect(result.current.hasMore).toBe(false)
    await act(async () => { await result.current.loadNextPage({}) })
    expect(calls).toHaveLength(2)
    expect(result.current.proxyData).toHaveLength(3)
  })

  it('hasMore is false after an empty page even if total says otherwise', async () => {
    const { fn, calls } = controllableFetch()
    const config: DataProxyConfig = { url: '/items', pageSize: 2, fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config, { paginationMode: 'append' }))
    act(() => { void result.current.load(1, {}) })
    await act(async () => { calls[0].respond([{ id: '1' }, { id: '2' }], 10) })
    act(() => { void result.current.loadNextPage({}) })
    await act(async () => { calls[1].respond([], 10) })
    expect(result.current.hasMore).toBe(false)
    await act(async () => { await result.current.loadNextPage({}) })
    expect(calls).toHaveLength(2)
  })

  it('hasMore works in replace mode', async () => {
    const { fn, calls } = controllableFetch()
    const config: DataProxyConfig = { url: '/items', pageSize: 2, fetchFn: fn }
    const { result } = renderHook(() => useDataProxy(config))
    act(() => { void result.current.load(2, {}) })
    await act(async () => { calls[0].respond([{ id: '3' }, { id: '4' }], 4) })
    expect(result.current.hasMore).toBe(false)
  })
})
