export interface DataProxyConfig {
  url: string
  pageSize?: number
  polling?: number
  params?: Record<string, unknown>
  fetchFn?: (url: string, init?: RequestInit) => Promise<Response>
}

export interface LoadOptions {
  sortBy?: string
  sortDir?: string
  filters?: Record<string, unknown>
  groupBy?: string
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

export class DataProxy<T = Record<string, unknown>> {
  private config: DataProxyConfig & { pageSize: number }
  private controller: AbortController | null = null

  constructor(config: DataProxyConfig) {
    this.config = { pageSize: 50, ...config }
  }

  buildUrl(page: number, opts: LoadOptions): string {
    const params: Record<string, string> = {
      page: String(page),
      size: String(this.config.pageSize),
    }

    if (this.config.params) {
      for (const [k, v] of Object.entries(this.config.params)) {
        params[k] = String(v)
      }
    }

    if (opts.sortBy) params['sortBy'] = opts.sortBy
    if (opts.sortDir) params['sortDir'] = opts.sortDir
    if (opts.groupBy) params['groupBy'] = opts.groupBy

    if (opts.filters) {
      for (const [k, v] of Object.entries(opts.filters)) {
        params[`filter[${k}]`] = String(v)
      }
    }

    const qs = new URLSearchParams(params).toString()
    return `${this.config.url}?${qs}`
  }

  async load(page: number, opts: LoadOptions): Promise<LoadResult<T>> {
    this.abort()
    this.controller = new AbortController()
    const url = this.buildUrl(page, opts)
    const fetchFn = this.config.fetchFn ?? fetch

    const response = await fetchFn(url, { signal: this.controller.signal })
    if (!response.ok) {
      throw new DataProxyError(`DataProxy: HTTP ${response.status}`)
    }

    const json = (await response.json()) as { data: T[]; total: number }
    return { data: json.data, total: json.total }
  }

  abort(): void {
    this.controller?.abort()
    this.controller = null
  }
}
