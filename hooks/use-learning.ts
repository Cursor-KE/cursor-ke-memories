"use client"

import { useState, useEffect, useCallback } from "react"
import type { LearningMetrics, FeedbackData } from "@/lib/learning-engine"

export function useLearning() {
  const [metrics, setMetrics] = useState<LearningMetrics | null>(null)
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch("/api/learning?action=metrics")
      const data = await response.json()

      if (response.ok) {
        setMetrics(data.metrics)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch metrics")
      }
    } catch (err) {
      setError("Network error")
      console.error("[v0] Failed to fetch learning metrics:", err)
    }
  }, [])

  const fetchFeedbackHistory = useCallback(async (limit = 50) => {
    try {
      const response = await fetch(`/api/learning?action=feedback-history&limit=${limit}`)
      const data = await response.json()

      if (response.ok) {
        setFeedbackHistory(data.history)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch feedback history")
      }
    } catch (err) {
      setError("Network error")
      console.error("[v0] Failed to fetch feedback history:", err)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchMetrics(), fetchFeedbackHistory()])
      setIsLoading(false)
    }

    loadData()
  }, [fetchMetrics, fetchFeedbackHistory])

  const addFeedback = useCallback(
    async (feedback: Omit<FeedbackData, "id" | "timestamp">) => {
      try {
        const response = await fetch("/api/learning", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add-feedback", ...feedback }),
        })

        const data = await response.json()

        if (response.ok) {
          await Promise.all([fetchMetrics(), fetchFeedbackHistory()])
          return data.id
        } else {
          setError(data.error || "Failed to add feedback")
          return null
        }
      } catch (err) {
        setError("Network error")
        console.error("[v0] Failed to add feedback:", err)
        return null
      }
    },
    [fetchMetrics, fetchFeedbackHistory],
  )

  const getPersonalizedInsights = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/learning?action=insights&sessionId=${sessionId}`)
      const data = await response.json()

      if (response.ok) {
        return data.insights
      } else {
        setError(data.error || "Failed to get insights")
        return null
      }
    } catch (err) {
      setError("Network error")
      console.error("[v0] Failed to get insights:", err)
      return null
    }
  }, [])

  const adaptResponse = useCallback(async (response: string, context: any) => {
    try {
      const apiResponse = await fetch("/api/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "adapt-response", response, context }),
      })

      const data = await apiResponse.json()

      if (apiResponse.ok) {
        return data.adaptation
      } else {
        setError(data.error || "Failed to adapt response")
        return null
      }
    } catch (err) {
      setError("Network error")
      console.error("[v0] Failed to adapt response:", err)
      return null
    }
  }, [])

  const exportLearningData = useCallback(async () => {
    try {
      const response = await fetch("/api/learning?action=export")
      const data = await response.json()

      if (response.ok) {
        return data.data
      } else {
        setError(data.error || "Failed to export data")
        return null
      }
    } catch (err) {
      setError("Network error")
      console.error("[v0] Failed to export learning data:", err)
      return null
    }
  }, [])

  return {
    metrics,
    feedbackHistory,
    isLoading,
    error,
    addFeedback,
    getPersonalizedInsights,
    adaptResponse,
    exportLearningData,
    refreshData: () => Promise.all([fetchMetrics(), fetchFeedbackHistory()]),
  }
}
