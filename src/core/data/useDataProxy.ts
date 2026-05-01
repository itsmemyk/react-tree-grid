import { useState, useCallback, useRef, useEffect } from 'react'
import { DataProxy } from './DataProxy'
import type { DataProxyConfig, LoadOptions } from './DataProxy'

export interface UseDataProxyOptions {
  paginationMode?: 'append' | 'replace'
  onLoadStart?: () => void
  onLoadEnd?: () => void
  onLoadError?: (error: Error) => void
}

export interface UseDataProxyReturn<T = Record<string, unknown>> {
  proxyData: T[]
  total: number
  loading: boolean
  error: Error | null
  page: number
  load: (page: number, opts: LoadOptions) => Promise<void>
  loadNextPage: (opts: LoadOptions) => Promise<void>
}

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

  const [proxyData, setProxyData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)

  // Recreate DataProxy only when the URL changes, not on every object reference change.
  useEffect(() => {
    if (!config?.url) {
      proxyRef.current = null
      return
    }
    proxyRef.current = new DataProxy<T>({
      ...config,
      // Wrap fetchFn through the ref so the latest version is always called
      // even though the DataProxy instance is only recreated on URL changes.
      fetchFn: config.fetchFn
        ? (url: string) => configRef.current!.fetchFn!(url)
        : undefined,
    })
    return () => { proxyRef.current?.abort() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.url])

  // Polling
  useEffect(() => {
    if (!config?.polling) return
    const interval = setInterval(() => {
      proxyRef.current?.load(page, {}).then((result) => {
        setProxyData(result.data)
        setTotal(result.total)
      }).catch(() => {})
    }, config.polling)
    return () => clearInterval(interval)
  }, [config?.polling, page])

  const load = useCallback(async (p: number, opts: LoadOptions): Promise<void> => {
    if (!proxyRef.current) return
    setLoading(true)
    setError(null)
    onLoadStart?.()
    try {
      const result = await proxyRef.current.load(p, opts)
      setPage(p)
      setTotal(result.total)
      if (paginationMode === 'append' && p > 1) {
        setProxyData((prev) => [...prev, ...result.data])
      } else {
        setProxyData(result.data)
      }
      onLoadEnd?.()
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      onLoadError?.(e)
    } finally {
      setLoading(false)
    }
  }, [paginationMode, onLoadStart, onLoadEnd, onLoadError])

  const loadNextPage = useCallback(
    (opts: LoadOptions) => load(page + 1, opts),
    [load, page],
  )

  return { proxyData, total, loading, error, page, load, loadNextPage }
}
