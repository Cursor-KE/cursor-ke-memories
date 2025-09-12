"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useChat } from "ai/react"
import { AIAgent } from "@/lib/ai-agent"
import { requestOptimizer } from "@/lib/request-optimizer"
import { performanceMonitor } from "@/lib/performance-monitor"

function useCustomChat(apiEndpoint: string) {
  const [llmConfig, setLlmConfig] = useState<any>(null)
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    error,
  } = useChat({
    api: apiEndpoint,
    body: {
      llmConfig: llmConfig,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    originalHandleSubmit(e)
  }

  return {
    messages: messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    })),
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    llmConfig,
    setLlmConfig,
  }
}

export function useAIAgent() {
  const [agent, setAgent] = useState<AIAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [context, setContext] = useState<any>({})
  const [contextMetrics, setContextMetrics] = useState<any>({})

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading: isChatLoading,
    error,
    llmConfig,
    setLlmConfig,
  } = useCustomChat("/api/chat")

  useEffect(() => {
    const initAgent = async () => {
      const startTime = performance.now()

      try {
        const newAgent = new AIAgent()

        // Use optimized request for loading context
        const contextData = await requestOptimizer.optimizedFetch("/api/context", {
          sessionId: newAgent.getContext().sessionId,
        })

        if (contextData?.context) {
          // Apply loaded context to agent
          Object.assign(newAgent.getContext(), contextData.context)
        }

        setAgent(newAgent)
        setContext(newAgent.getContext())
        setContextMetrics(newAgent.getContextMetrics())

        const endTime = performance.now()
        performanceMonitor.recordMetric("agent_initialization_time", endTime - startTime, "ms", "response_time")
      } catch (error) {
        console.error("[v0] Agent initialization failed:", error)
        performanceMonitor.recordMetric("agent_initialization_error", 1, "count", "system")
      } finally {
        setIsLoading(false)
      }
    }

    initAgent()

    // Preload frequently accessed data
    requestOptimizer.preloadData([
      { endpoint: "/api/integrations", params: {} },
      { endpoint: "/api/learning", params: { action: "metrics" } },
    ])
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      const interactionStart = performance.now()

      if (agent) {
        agent.addMessage({ role: "user", content: input })
        setContext(agent.getContext())
        setContextMetrics(agent.getContextMetrics())

        // Track user interaction performance
        performanceMonitor.trackUserInteraction("message_send", performance.now() - interactionStart)
      }

      // Use the original handleSubmit from useChat
      originalHandleSubmit(e)
    },
    [agent, input, originalHandleSubmit],
  )

  const updatePreferences = useCallback(
    async (preferences: Record<string, any>) => {
      if (agent) {
        const startTime = performance.now()

        agent.updatePreferences(preferences)
        setContext(agent.getContext())

        // Use optimized request for saving preferences
        await requestOptimizer.optimizedFetch(
          "/api/context",
          {
            sessionId: agent.getContext().sessionId,
            context: agent.getContext(),
          },
          { cache: false },
        )

        performanceMonitor.recordMetric("preference_update_time", performance.now() - startTime, "ms", "response_time")
      }
    },
    [agent],
  )

  const updateLearningData = useCallback(
    async (data: Record<string, any>) => {
      if (agent) {
        const startTime = performance.now()

        agent.updateLearningData(data)
        setContext(agent.getContext())

        performanceMonitor.recordMetric("learning_update_time", performance.now() - startTime, "ms", "response_time")
      }
    },
    [agent],
  )

  const clearOldContext = useCallback(
    async (days = 7) => {
      if (agent) {
        const startTime = performance.now()

        agent.clearOldContext(days)
        setContext(agent.getContext())
        setContextMetrics(agent.getContextMetrics())

        performanceMonitor.recordMetric("context_cleanup_time", performance.now() - startTime, "ms", "response_time")
      }
    },
    [agent],
  )

  const getContextMetrics = useCallback(() => {
    return agent?.getContextMetrics() || {}
  }, [agent])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isLoading || isChatLoading,
    error,
    context,
    contextMetrics,
    updatePreferences,
    updateLearningData,
    clearOldContext,
    getContextMetrics,
    agent,
    llmConfig,
    setLlmConfig,
  }
}
