"use client"

import { useState, useEffect, useCallback } from "react"
import type { APIIntegration } from "@/lib/api-integrations"

interface IntegrationStats {
  total: number
  connected: number
  enabled: number
  totalRequests: number
  totalErrors: number
}

export function useAPIIntegrations() {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([])
  const [stats, setStats] = useState<IntegrationStats>({
    total: 0,
    connected: 0,
    enabled: 0,
    totalRequests: 0,
    totalErrors: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIntegrations = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/integrations")
      const data = await response.json()

      if (response.ok) {
        setIntegrations(data.integrations)
        setStats(data.stats)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch integrations")
      }
    } catch (err) {
      setError("Network error")
      console.error("[v0] Failed to fetch integrations:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIntegrations()
  }, [fetchIntegrations])

  const testConnection = useCallback(
    async (integrationId: string) => {
      try {
        const response = await fetch("/api/integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "test", integrationId }),
        })

        const data = await response.json()

        if (response.ok) {
          await fetchIntegrations() // Refresh data
          return data.success
        } else {
          setError(data.error || "Test failed")
          return false
        }
      } catch (err) {
        setError("Network error")
        console.error("[v0] Test connection failed:", err)
        return false
      }
    },
    [fetchIntegrations],
  )

  const toggleIntegration = useCallback(
    async (integrationId: string) => {
      try {
        const response = await fetch("/api/integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "toggle", integrationId }),
        })

        const data = await response.json()

        if (response.ok) {
          await fetchIntegrations() // Refresh data
          return true
        } else {
          setError(data.error || "Toggle failed")
          return false
        }
      } catch (err) {
        setError("Network error")
        console.error("[v0] Toggle integration failed:", err)
        return false
      }
    },
    [fetchIntegrations],
  )

  const addIntegration = useCallback(
    async (integration: Omit<APIIntegration, "id">) => {
      try {
        const response = await fetch("/api/integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add", ...integration }),
        })

        const data = await response.json()

        if (response.ok) {
          await fetchIntegrations() // Refresh data
          return data.id
        } else {
          setError(data.error || "Add failed")
          return null
        }
      } catch (err) {
        setError("Network error")
        console.error("[v0] Add integration failed:", err)
        return null
      }
    },
    [fetchIntegrations],
  )

  const makeAPICall = useCallback(
    async (integrationId: string, endpoint: string, options: any = {}) => {
      try {
        const response = await fetch("/api/integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "call", integrationId, endpoint, options }),
        })

        const data = await response.json()

        if (response.ok) {
          await fetchIntegrations() // Refresh usage stats
          return data.result
        } else {
          setError(data.error || "API call failed")
          return null
        }
      } catch (err) {
        setError("Network error")
        console.error("[v0] API call failed:", err)
        return null
      }
    },
    [fetchIntegrations],
  )

  return {
    integrations,
    stats,
    isLoading,
    error,
    testConnection,
    toggleIntegration,
    addIntegration,
    makeAPICall,
    refreshIntegrations: fetchIntegrations,
  }
}
