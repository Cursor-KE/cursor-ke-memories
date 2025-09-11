export interface PerformanceMetric {
  id: string
  name: string
  value: number
  unit: string
  timestamp: number
  category: "response_time" | "memory" | "api_calls" | "user_experience" | "system"
}

export interface PerformanceAlert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  metric: string
  threshold: number
  currentValue: number
  timestamp: number
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private alerts: PerformanceAlert[] = []
  private thresholds = {
    response_time: 3000, // 3 seconds
    memory_usage: 0.8, // 80%
    api_error_rate: 0.1, // 10%
    user_satisfaction: 3.5, // 3.5/5
  }

  constructor() {
    this.initializeMetrics()
    this.startPerformanceTracking()
  }

  private initializeMetrics() {
    // Initialize with some baseline metrics
    const baselineMetrics = [
      { name: "avg_response_time", value: 1200, unit: "ms", category: "response_time" as const },
      { name: "memory_usage", value: 0.45, unit: "%", category: "memory" as const },
      { name: "api_calls_per_minute", value: 15, unit: "calls", category: "api_calls" as const },
      { name: "user_satisfaction", value: 4.2, unit: "rating", category: "user_experience" as const },
      { name: "uptime", value: 99.9, unit: "%", category: "system" as const },
    ]

    baselineMetrics.forEach((metric) => {
      this.recordMetric(metric.name, metric.value, metric.unit, metric.category)
    })
  }

  private startPerformanceTracking() {
    // Simulate real-time performance tracking
    setInterval(() => {
      this.updateRealTimeMetrics()
    }, 5000) // Update every 5 seconds

    // Check for performance alerts
    setInterval(() => {
      this.checkPerformanceAlerts()
    }, 10000) // Check every 10 seconds
  }

  private updateRealTimeMetrics() {
    // Simulate fluctuating metrics
    const responseTime = 800 + Math.random() * 1000
    const memoryUsage = 0.3 + Math.random() * 0.4
    const apiCalls = 10 + Math.random() * 20
    const satisfaction = 3.5 + Math.random() * 1.5

    this.recordMetric("avg_response_time", responseTime, "ms", "response_time")
    this.recordMetric("memory_usage", memoryUsage, "%", "memory")
    this.recordMetric("api_calls_per_minute", apiCalls, "calls", "api_calls")
    this.recordMetric("user_satisfaction", satisfaction, "rating", "user_experience")
  }

  recordMetric(name: string, value: number, unit: string, category: PerformanceMetric["category"]) {
    const metric: PerformanceMetric = {
      id: `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      unit,
      category,
      timestamp: Date.now(),
    }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const metricHistory = this.metrics.get(name)!
    metricHistory.push(metric)

    // Keep only last 100 entries per metric
    if (metricHistory.length > 100) {
      metricHistory.shift()
    }
  }

  private checkPerformanceAlerts() {
    const latestMetrics = this.getLatestMetrics()

    Object.entries(this.thresholds).forEach(([key, threshold]) => {
      const metric = latestMetrics.find((m) => m.name.includes(key.replace("_", "")))
      if (!metric) return

      let shouldAlert = false
      let alertType: "warning" | "error" = "warning"

      switch (key) {
        case "response_time":
          shouldAlert = metric.value > threshold
          alertType = metric.value > threshold * 1.5 ? "error" : "warning"
          break
        case "memory_usage":
          shouldAlert = metric.value > threshold
          alertType = metric.value > 0.9 ? "error" : "warning"
          break
        case "api_error_rate":
          shouldAlert = metric.value > threshold
          alertType = metric.value > 0.2 ? "error" : "warning"
          break
        case "user_satisfaction":
          shouldAlert = metric.value < threshold
          alertType = metric.value < 3.0 ? "error" : "warning"
          break
      }

      if (shouldAlert) {
        this.createAlert(alertType, `${metric.name} threshold exceeded`, metric.name, threshold, metric.value)
      }
    })
  }

  private createAlert(
    type: "warning" | "error",
    message: string,
    metric: string,
    threshold: number,
    currentValue: number,
  ) {
    // Avoid duplicate alerts within 5 minutes
    const recentAlert = this.alerts.find((alert) => alert.metric === metric && Date.now() - alert.timestamp < 300000)

    if (recentAlert) return

    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      metric,
      threshold,
      currentValue,
      timestamp: Date.now(),
    }

    this.alerts.push(alert)

    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts.shift()
    }
  }

  getLatestMetrics(): PerformanceMetric[] {
    const latest: PerformanceMetric[] = []

    this.metrics.forEach((metricHistory) => {
      if (metricHistory.length > 0) {
        latest.push(metricHistory[metricHistory.length - 1])
      }
    })

    return latest
  }

  getMetricHistory(name: string, limit = 50): PerformanceMetric[] {
    const history = this.metrics.get(name) || []
    return history.slice(-limit)
  }

  getMetricsByCategory(category: PerformanceMetric["category"]): PerformanceMetric[] {
    return this.getLatestMetrics().filter((metric) => metric.category === category)
  }

  getAlerts(limit = 20): PerformanceAlert[] {
    return this.alerts.slice(-limit).reverse()
  }

  getPerformanceSummary() {
    const latest = this.getLatestMetrics()
    const alerts = this.getAlerts(10)

    return {
      metrics: latest,
      alerts: alerts,
      summary: {
        totalMetrics: latest.length,
        activeAlerts: alerts.filter((a) => Date.now() - a.timestamp < 3600000).length, // Last hour
        averageResponseTime: latest.find((m) => m.name === "avg_response_time")?.value || 0,
        memoryUsage: latest.find((m) => m.name === "memory_usage")?.value || 0,
        userSatisfaction: latest.find((m) => m.name === "user_satisfaction")?.value || 0,
      },
    }
  }

  // Performance optimization methods
  measureExecutionTime<T>(fn: () => Promise<T>, operationName: string): Promise<T> {
    const startTime = performance.now()

    return fn().then((result) => {
      const endTime = performance.now()
      const executionTime = endTime - startTime

      this.recordMetric(`${operationName}_execution_time`, executionTime, "ms", "response_time")

      return result
    })
  }

  trackAPICall(endpoint: string, responseTime: number, success: boolean) {
    this.recordMetric(`api_${endpoint}_response_time`, responseTime, "ms", "api_calls")
    this.recordMetric(`api_${endpoint}_success_rate`, success ? 1 : 0, "boolean", "api_calls")
  }

  trackUserInteraction(interactionType: string, duration: number) {
    this.recordMetric(`user_${interactionType}_duration`, duration, "ms", "user_experience")
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()
