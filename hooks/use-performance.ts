"use client"

import { useState, useEffect, useCallback } from "react"
import type { PerformanceMetric, PerformanceAlert } from "@/lib/performance-monitor"

interface PerformanceSummary {
  metrics: PerformanceMetric[]
  alerts: PerformanceAlert[]
  summary: {
    totalMetrics: number
    activeAlerts: number
    averageResponseTime: number
    memoryUsage: number
    userSatisfaction: number
  }
}

export function usePerformance() {
  const [summary, setSummary] = useState<PerformanceSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformanceData = useCallback(async () => {
    try {
      const response = await fetch("/api/performance?action=summary")
      const data = await response.json()

      if (response.ok) {
        setSummary(data.summary)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch performance data")
      }
    } catch (err) {
      setError("Network error")
      console.error("[v0] Failed to fetch performance data:", err)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchPerformanceData()
      setIsLoading(false)
    }

    loadData()

    // Set up real-time updates
    const interval = setInterval(fetchPerformanceData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [fetchPerformanceData])

  const recordMetric = useCallback(
    async (name: string, value: number, unit: string, category: PerformanceMetric["category"]) => {
      try {
        await fetch("/api/performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "record-metric", name, value, unit, category }),
        })
      } catch (err) {
        console.error("[v0] Failed to record metric:", err)
      }
    },
    [],
  )

  const trackUserInteraction = useCallback(async (type: string, duration: number) => {
    try {
      await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "track-interaction", type, duration }),
      })
    } catch (err) {
      console.error("[v0] Failed to track interaction:", err)
    }
  }, [])

  const clearCache = useCallback(async () => {
    try {
      const response = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear-cache" }),
      })

      if (response.ok) {
        await fetchPerformanceData() // Refresh data
        return true
      }
      return false
    } catch (err) {
      console.error("[v0] Failed to clear cache:", err)
      return false
    }
  }, [fetchPerformanceData])

  return {
    summary,
    isLoading,
    error,
    recordMetric,
    trackUserInteraction,
    clearCache,
    refreshData: fetchPerformanceData,
  }
}
