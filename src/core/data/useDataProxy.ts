import { useState, useCallback, useRef, useEffect } from 'react'
import { DataProxy, isAbortError } from './DataProxy'
import type { DataProxyConfig, LoadOptions, LoadResult } from './DataProxy'

export interface UseDataProxyOptions {
  paginationMode?: 'append' | 'replace'
  onLoadStart?: () => void
  onLoadEnd?: () => void
  onLoadError?: (error: Error) => void
}

export interface UseDataProxyReturn<T = Record<string, unknown>> {
  proxyData: T[]
  total: number
  /** True while the latest user-initiated request is pending (polls never set it). */
  loading: boolean
  error: Error | null
  page: number
  /**
   * Whether another page can be loaded: rows covered so far < total and the
   * last response was non-empty. False until the first load completes.
   */
  hasMore: boolean
  /** Options of the latest user-initiated load (reused by polls and loadNextPage). */
  lastOptions: LoadOptions
  load: (page: number, opts: LoadOptions) => Promise<void>
  /** Load page + 1. No-op while loading or when !hasMore. Defaults to the latest options. */
  loadNextPage: (opts?: LoadOptions) => Promise<void>
}

/**
 * React binding for {@link DataProxy}.
 *
 * Concurrency rules:
 * - Latest request wins: each `load()` gets an id; responses (and errors) of
 *   superseded requests are ignored. A new `load()` aborts the previous one.
 * - Aborted requests are never reported via `error` / `onLoadError` and never
 *   flip `loading` to false; `loading` stays true until the latest request settles.
 * - Polls reuse the latest load options, run in the background (no `loading`,
 *   no callbacks, errors swallowed), never abort a user request and are skipped
 *   while one is pending. A user `load()` aborts and supersedes an in-flight poll.
 *   In append mode a poll re-fetches pages 1..current and replaces the
 *   accumulated rows with the result, so already loaded rows are kept.
 */
export function useDataProxy<T = Record<string, unknown>>(
  config: DataProxyConfig | undefined,
  options: UseDataProxyOptions = {},
): UseDataProxyReturn<T> {
  const { paginationMode = 'replace', onLoadStart, onLoadEnd, onLoadError } = options

  const proxyRef = useRef<DataProxy<T> | null>(null)
  // Always keep a ref to the latest config so fetchFn/transforms stay current
  // without recreating the DataProxy on every render.
  const configRef = useRef(config)
  configRef.current = config
  const paginationModeRef = useRef(paginationMode)
  paginationModeRef.current = paginationMode

  const [proxyData, setProxyData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [lastOptions, setLastOptions] = useState<LoadOptions>({})

  // Synchronous mirrors of state, used by callbacks/intervals
  const requestIdRef = useRef(0)
  const pendingRef = useRef(false)
  const pageRef = useRef(1)
  const hasMoreRef = useRef(false)
  const optsRef = useRef<LoadOptions>({})
  const rowCountRef = useRef(0)
  const pollRef = useRef<AbortController | null>(null)

  /**
   * Commit a response.
   * @param rows      rows to show (appended to the current rows when `append`)
   * @param lastPage  rows of the last page fetched (empty => no more pages)
   * @param offset    number of rows before `rows` in the full result set
   */
  const commit = useCallback(
    (p: number, rows: T[], lastPage: T[], newTotal: number, append: boolean, offset: number) => {
      const covered = (append ? rowCountRef.current : offset) + rows.length
      const more = lastPage.length > 0 && covered < newTotal
      rowCountRef.current = append ? covered : rows.length
      pageRef.current = p
      hasMoreRef.current = more
      setPage(p)
      setTotal(newTotal)
      setHasMore(more)
      if (append) setProxyData((prev) => [...prev, ...rows])
      else setProxyData(rows)
    },
    [],
  )

  // Recreate DataProxy only when the URL changes, not on every object reference change.
  useEffect(() => {
    if (!config?.url) {
      proxyRef.current = null
      return
    }
    const proxy = new DataProxy<T>({
      ...config,
      // Wrap fetchFn through the ref so the latest version is always called
      // even though the DataProxy instance is only recreated on URL changes.
      fetchFn: config.fetchFn
        ? (url: string, init?: RequestInit) => configRef.current!.fetchFn!(url, init)
        : undefined,
    })
    proxyRef.current = proxy
    return () => {
      proxy.abort()
      // Invalidate whatever was in flight for this proxy
      requestIdRef.current++
      pendingRef.current = false
      pollRef.current = null
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.url])

  // Polling
  useEffect(() => {
    if (!config?.polling) return
    const interval = setInterval(() => {
      const proxy = proxyRef.current
      // A pending user request will deliver fresh data; an earlier poll is still running
      if (!proxy || pendingRef.current || pollRef.current) return

      const controller = new AbortController()
      pollRef.current = controller
      const startId = requestIdRef.current
      const opts = optsRef.current
      const append = paginationModeRef.current === 'append'
      const current = pageRef.current
      const pages = append ? Array.from({ length: current }, (_, i) => i + 1) : [current]
      const request = { signal: controller.signal, exclusive: false }

      Promise.all(pages.map((p) => proxy.load(p, opts, request)))
        .then((results: LoadResult<T>[]) => {
          if (controller.signal.aborted || requestIdRef.current !== startId) return
          const last = results[results.length - 1]
          const rows = results.flatMap((r) => r.data)
          // Append mode: rows hold pages 1..current (offset 0); replace mode: just `current`
          const offset = append ? 0 : (current - 1) * proxy.pageSize
          commit(current, rows, last.data, last.total, false, offset)
        })
        .catch(() => { /* polls are silent; aborts and errors are ignored */ })
        .finally(() => { if (pollRef.current === controller) pollRef.current = null })
    }, config.polling)
    return () => {
      clearInterval(interval)
      pollRef.current?.abort()
      pollRef.current = null
    }
  }, [config?.polling, commit])

  const load = useCallback(async (p: number, opts: LoadOptions): Promise<void> => {
    const proxy = proxyRef.current
    if (!proxy) return
    const id = ++requestIdRef.current
    // User requests supersede background polls
    pollRef.current?.abort()
    pollRef.current = null
    pendingRef.current = true
    optsRef.current = opts
    setLastOptions(opts)
    setLoading(true)
    setError(null)
    onLoadStart?.()
    try {
      const result = await proxy.load(p, opts)
      if (id !== requestIdRef.current) return
      const append = paginationModeRef.current === 'append' && p > 1
      commit(p, result.data, result.data, result.total, append, (p - 1) * proxy.pageSize)
      pendingRef.current = false
      setLoading(false)
      onLoadEnd?.()
    } catch (err) {
      if (id !== requestIdRef.current) return
      pendingRef.current = false
      setLoading(false)
      if (isAbortError(err)) return
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      onLoadError?.(e)
    }
  }, [onLoadStart, onLoadEnd, onLoadError, commit])

  const loadNextPage = useCallback(
    async (opts?: LoadOptions): Promise<void> => {
      if (pendingRef.current || !hasMoreRef.current) return
      return load(pageRef.current + 1, opts ?? optsRef.current)
    },
    [load],
  )

  return { proxyData, total, loading, error, page, hasMore, lastOptions, load, loadNextPage }
}
