export interface DataProxyConfig {
  url: string
  pageSize?: number
  polling?: number
  params?: Record<string, unknown>
  fetchFn?: (url: string, init?: RequestInit) => Promise<Response>
}

/** One remote sort rule. */
export interface RemoteSortRule {
  by: string
  dir: 'asc' | 'desc' | string
}

export interface LoadOptions {
  /**
   * Sort rules, primary first. Accepts a single rule or an array (multi-column
   * sort). When present (even as an empty array) it takes precedence over the
   * legacy `sortBy` / `sortDir` pair.
   */
  sort?: RemoteSortRule | RemoteSortRule[]
  /** Legacy single-column sort field. Prefer `sort`. */
  sortBy?: string
  /** Legacy single-column sort direction. Prefer `sort`. */
  sortDir?: string
  filters?: Record<string, unknown>
  groupBy?: string
}

/** Per-request options for {@link DataProxy.load}. */
export interface DataProxyRequestOptions {
  /** External signal; aborting it aborts this request. */
  signal?: AbortSignal
  /**
   * When true (default) this request aborts the previous exclusive request,
   * so only one exclusive request is in flight at a time. Non-exclusive
   * requests (e.g. background polls) neither abort nor get aborted by other
   * requests; they are only aborted by their own `signal` or by `abort()`.
   */
  exclusive?: boolean
}

export interface LoadResult<T = Record<string, unknown>> {
  data: T[]
  total: number
}

export class DataProxyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataProxyError'
  }
}

/** True for errors produced by aborting a fetch. */
export function isAbortError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { name?: unknown }).name === 'AbortError'
  )
}

/** Normalize the sort part of LoadOptions into an ordered list of rules. */
export function normalizeSortRules(opts: LoadOptions): RemoteSortRule[] {
  if (opts.sort !== undefined) {
    const list = Array.isArray(opts.sort) ? opts.sort : [opts.sort]
    return list.filter((r): r is RemoteSortRule => !!r && !!r.by)
  }
  if (opts.sortBy) return [{ by: opts.sortBy, dir: opts.sortDir ?? '' }]
  return []
}

export class DataProxy<T = Record<string, unknown>> {
  private config: DataProxyConfig & { pageSize: number }
  /** Controller of the current exclusive request */
  private controller: AbortController | null = null
  /** Every in-flight request, so abort() can cancel all of them */
  private inflight = new Set<AbortController>()

  constructor(config: DataProxyConfig) {
    this.config = { pageSize: 50, ...config }
  }

  get pageSize(): number {
    return this.config.pageSize
  }

  /**
   * Build the request URL.
   *
   * Query format:
   *   page=<n>&size=<pageSize>&<static params>
   *   &sortBy=<field1>&sortDir=<dir1>[&sortBy=<field2>&sortDir=<dir2>...]
   *   &groupBy=<field>&filter[<col>]=<value>...
   *
   * Multi-column sort is sent as repeated `sortBy` / `sortDir` pairs, in
   * priority order (the n-th `sortDir` belongs to the n-th `sortBy`). The
   * first pair is the primary sort, so servers that only read a single
   * `sortBy` / `sortDir` value keep working unchanged.
   */
  buildUrl(page: number, opts: LoadOptions): string {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('size', String(this.config.pageSize))

    if (this.config.params) {
      for (const [k, v] of Object.entries(this.config.params)) {
        params.set(k, String(v))
      }
    }

    for (const rule of normalizeSortRules(opts)) {
      params.append('sortBy', rule.by)
      if (rule.dir) params.append('sortDir', rule.dir)
    }
    if (opts.groupBy) params.set('groupBy', opts.groupBy)

    if (opts.filters) {
      for (const [k, v] of Object.entries(opts.filters)) {
        params.set(`filter[${k}]`, String(v))
      }
    }

    return `${this.config.url}?${params.toString()}`
  }

  async load(
    page: number,
    opts: LoadOptions,
    request: DataProxyRequestOptions = {},
  ): Promise<LoadResult<T>> {
    const { signal, exclusive = true } = request
    const controller = new AbortController()
    if (exclusive) {
      this.controller?.abort()
      this.controller = controller
    }
    this.inflight.add(controller)

    const onExternalAbort = () => controller.abort()
    if (signal) {
      if (signal.aborted) controller.abort()
      else signal.addEventListener('abort', onExternalAbort)
    }

    try {
      const url = this.buildUrl(page, opts)
      const fetchFn = this.config.fetchFn ?? fetch
      const response = await fetchFn(url, { signal: controller.signal })
      if (!response.ok) {
        throw new DataProxyError(`DataProxy: HTTP ${response.status}`)
      }
      const json = (await response.json()) as { data: T[]; total: number }
      return { data: json.data, total: json.total }
    } finally {
      this.inflight.delete(controller)
      if (this.controller === controller) this.controller = null
      signal?.removeEventListener('abort', onExternalAbort)
    }
  }

  /** Abort every in-flight request (exclusive and non-exclusive). */
  abort(): void {
    for (const c of this.inflight) c.abort()
    this.inflight.clear()
    this.controller?.abort()
    this.controller = null
  }
}
