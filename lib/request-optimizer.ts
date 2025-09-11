import { cacheManager } from "./cache-manager"
import { performanceMonitor } from "./performance-monitor"

interface BatchRequest {
  id: string
  endpoint: string
  params: any
  resolve: (data: any) => void
  reject: (error: any) => void
  timestamp: number
}

export class RequestOptimizer {
  private batchQueue: BatchRequest[] = []
  private batchTimeout: NodeJS.Timeout | null = null
  private readonly batchDelay = 100 // 100ms batch window
  private readonly maxBatchSize = 10

  constructor() {
    // Process batches periodically
    setInterval(() => {
      if (this.batchQueue.length > 0) {
        this.processBatch()
      }
    }, this.batchDelay)
  }

  async optimizedFetch(
    endpoint: string,
    params: any = {},
    options: { cache?: boolean; ttl?: number } = {},
  ): Promise<any> {
    const cacheKey = this.generateCacheKey(endpoint, params)

    // Try cache first if enabled
    if (options.cache !== false) {
      const cached = cacheManager.get(cacheKey)
      if (cached) {
        performanceMonitor.recordMetric("cache_hit", 1, "count", "system")
        return cached
      }
    }

    // Add to batch queue for non-cached requests
    return new Promise((resolve, reject) => {
      const request: BatchRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        endpoint,
        params,
        resolve,
        reject,
        timestamp: Date.now(),
      }

      this.batchQueue.push(request)

      // Process immediately if batch is full
      if (this.batchQueue.length >= this.maxBatchSize) {
        this.processBatch()
      }
    })
  }

  private async processBatch() {
    if (this.batchQueue.length === 0) return

    const batch = this.batchQueue.splice(0, this.maxBatchSize)
    const startTime = performance.now()

    try {
      // Group requests by endpoint
      const groupedRequests = new Map<string, BatchRequest[]>()
      batch.forEach((request) => {
        if (!groupedRequests.has(request.endpoint)) {
          groupedRequests.set(request.endpoint, [])
        }
        groupedRequests.get(request.endpoint)!.push(request)
      })

      // Process each group
      const promises = Array.from(groupedRequests.entries()).map(([endpoint, requests]) =>
        this.processBatchGroup(endpoint, requests),
      )

      await Promise.all(promises)

      const endTime = performance.now()
      performanceMonitor.recordMetric("batch_processing_time", endTime - startTime, "ms", "response_time")
      performanceMonitor.recordMetric("batch_size", batch.length, "count", "api_calls")
    } catch (error) {
      // Reject all requests in the batch
      batch.forEach((request) => {
        request.reject(error)
      })
    }
  }

  private async processBatchGroup(endpoint: string, requests: BatchRequest[]) {
    try {
      // Simulate batch API call
      const batchParams = requests.map((req) => req.params)
      const response = await this.simulateBatchAPICall(endpoint, batchParams)

      // Resolve individual requests
      requests.forEach((request, index) => {
        const result = response[index]
        const cacheKey = this.generateCacheKey(request.endpoint, request.params)

        // Cache the result
        cacheManager.set(cacheKey, result)

        request.resolve(result)
      })

      performanceMonitor.trackAPICall(endpoint, performance.now() - requests[0].timestamp, true)
    } catch (error) {
      requests.forEach((request) => {
        request.reject(error)
      })

      performanceMonitor.trackAPICall(endpoint, performance.now() - requests[0].timestamp, false)
    }
  }

  private async simulateBatchAPICall(endpoint: string, batchParams: any[]): Promise<any[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 100))

    // Return mock responses based on endpoint
    return batchParams.map((params, index) => {
      switch (endpoint) {
        case "/api/chat":
          return { text: `Response ${index + 1}`, tokens: 150 }
        case "/api/context":
          return { context: { sessionId: params.sessionId, data: {} } }
        case "/api/integrations":
          return { integrations: [], stats: {} }
        default:
          return { success: true, data: params }
      }
    })
  }

  private generateCacheKey(endpoint: string, params: any): string {
    return `${endpoint}_${JSON.stringify(params)}`
  }

  // Preload frequently accessed data
  async preloadData(endpoints: { endpoint: string; params: any }[]) {
    const preloadPromises = endpoints.map(
      ({ endpoint, params }) => this.optimizedFetch(endpoint, params, { cache: true, ttl: 600000 }), // 10 minute cache
    )

    try {
      await Promise.all(preloadPromises)
      performanceMonitor.recordMetric("preload_success", 1, "count", "system")
    } catch (error) {
      performanceMonitor.recordMetric("preload_error", 1, "count", "system")
      console.error("[v0] Preload failed:", error)
    }
  }

  getOptimizationStats() {
    return {
      queueSize: this.batchQueue.length,
      cacheStats: cacheManager.getStats(),
      performanceMetrics: performanceMonitor.getLatestMetrics(),
    }
  }
}

// Global request optimizer instance
export const requestOptimizer = new RequestOptimizer()
