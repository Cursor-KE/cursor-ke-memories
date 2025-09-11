function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  context?: any
  metadata?: {
    tokens?: number
    responseTime?: number
    relevanceScore?: number
  }
}

export interface AgentContext {
  sessionId: string
  userPreferences: Record<string, any>
  conversationHistory: Message[]
  apiConnections: Record<string, boolean>
  learningData: Record<string, any>
  contextSummary?: string
  memoryUsage: number
  lastOptimized: number
  topicTags: string[]
  userProfile: {
    communicationStyle?: string
    expertise?: string[]
    preferences?: Record<string, any>
    interactionPatterns?: Record<string, number>
  }
}

export class AIAgent {
  private sessionId: string
  private context: AgentContext
  private maxHistoryLength = 50
  private optimizationThreshold = 0.8

  constructor(sessionId?: string) {
    this.sessionId = sessionId || generateId()
    this.context = {
      sessionId: this.sessionId,
      userPreferences: {},
      conversationHistory: [],
      apiConnections: {},
      learningData: {},
      memoryUsage: 0,
      lastOptimized: Date.now(),
      topicTags: [],
      userProfile: {},
    }
  }

  async saveContext() {
    try {
      await fetch("/api/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this.sessionId,
          context: this.context,
        }),
      })
    } catch (error) {
      console.error("[v0] Failed to save context:", error)
    }
  }

  async loadContext() {
    try {
      const response = await fetch(`/api/context?sessionId=${this.sessionId}`)
      const data = await response.json()
      if (data.context) {
        this.context = { ...this.context, ...data.context }
      }
    } catch (error) {
      console.error("[v0] Failed to load context:", error)
    }
  }

  addMessage(message: Omit<Message, "id" | "timestamp">) {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    }

    this.context.conversationHistory.push(newMessage)

    this.updateMemoryUsage()
    this.extractTopics(newMessage.content)
    this.updateUserProfile(newMessage)

    if (this.shouldOptimizeContext()) {
      this.optimizeContext()
    }

    this.saveContext()
    return newMessage
  }

  getContext() {
    return this.context
  }

  updatePreferences(preferences: Record<string, any>) {
    this.context.userPreferences = { ...this.context.userPreferences, ...preferences }
    this.saveContext()
  }

  updateLearningData(data: Record<string, any>) {
    this.context.learningData = { ...this.context.learningData, ...data }
    this.saveContext()
  }

  private updateMemoryUsage() {
    const totalTokens = this.context.conversationHistory.reduce((sum, msg) => {
      return sum + (msg.metadata?.tokens || msg.content.length / 4)
    }, 0)
    this.context.memoryUsage = Math.min(totalTokens / 10000, 1) // Normalize to 0-1
  }

  private extractTopics(content: string) {
    // Simple topic extraction - in production, use NLP libraries
    const keywords = content.toLowerCase().match(/\b\w{4,}\b/g) || []
    const newTopics = keywords
      .filter((word) => !["this", "that", "with", "from", "they", "have", "been", "will"].includes(word))
      .slice(0, 3)

    newTopics.forEach((topic) => {
      if (!this.context.topicTags.includes(topic)) {
        this.context.topicTags.push(topic)
      }
    })

    // Keep only recent topics
    if (this.context.topicTags.length > 20) {
      this.context.topicTags = this.context.topicTags.slice(-20)
    }
  }

  private updateUserProfile(message: Message) {
    if (message.role === "user") {
      // Update interaction patterns
      const hour = new Date().getHours()
      this.context.userProfile.interactionPatterns = {
        ...this.context.userProfile.interactionPatterns,
        [hour]: (this.context.userProfile.interactionPatterns?.[hour] || 0) + 1,
      }

      // Analyze communication style
      const wordCount = message.content.split(" ").length
      if (wordCount > 20) {
        this.context.userProfile.communicationStyle = "detailed"
      } else if (wordCount < 5) {
        this.context.userProfile.communicationStyle = "concise"
      } else {
        this.context.userProfile.communicationStyle = "balanced"
      }
    }
  }

  private shouldOptimizeContext(): boolean {
    return (
      this.context.memoryUsage > this.optimizationThreshold ||
      this.context.conversationHistory.length > this.maxHistoryLength ||
      Date.now() - this.context.lastOptimized > 3600000 // 1 hour
    )
  }

  private async optimizeContext() {
    if (this.context.conversationHistory.length > this.maxHistoryLength) {
      // Keep recent messages and important ones
      const recentMessages = this.context.conversationHistory.slice(-20)
      const importantMessages = this.context.conversationHistory
        .slice(0, -20)
        .filter((msg) => msg.metadata?.relevanceScore && msg.metadata.relevanceScore > 0.8)

      this.context.conversationHistory = [...importantMessages, ...recentMessages]
    }

    // Generate context summary
    await this.generateContextSummary()

    this.context.lastOptimized = Date.now()
    this.updateMemoryUsage()
  }

  private async generateContextSummary() {
    if (this.context.conversationHistory.length < 5) return

    try {
      const recentMessages = this.context.conversationHistory.slice(-10)
      const conversationText = recentMessages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: conversationText }),
      })

      if (response.ok) {
        const { summary } = await response.json()
        this.context.contextSummary = summary
      }
    } catch (error) {
      console.error("[v0] Failed to generate context summary:", error)
    }
  }

  getRelevantContext(query: string): string {
    const contextParts = []

    // Add context summary if available
    if (this.context.contextSummary) {
      contextParts.push(`Previous conversation summary: ${this.context.contextSummary}`)
    }

    // Add user profile information
    if (this.context.userProfile.communicationStyle) {
      contextParts.push(`User prefers ${this.context.userProfile.communicationStyle} responses`)
    }

    // Add relevant topics
    if (this.context.topicTags.length > 0) {
      contextParts.push(`Recent topics: ${this.context.topicTags.slice(-5).join(", ")}`)
    }

    // Add user preferences
    if (Object.keys(this.context.userPreferences).length > 0) {
      contextParts.push(`User preferences: ${JSON.stringify(this.context.userPreferences)}`)
    }

    return contextParts.join("\n")
  }

  getContextMetrics() {
    return {
      memoryUsage: this.context.memoryUsage,
      messageCount: this.context.conversationHistory.length,
      topicCount: this.context.topicTags.length,
      lastOptimized: this.context.lastOptimized,
      userProfile: this.context.userProfile,
    }
  }

  clearOldContext(daysOld = 7) {
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000
    this.context.conversationHistory = this.context.conversationHistory.filter((msg) => msg.timestamp > cutoffTime)
    this.updateMemoryUsage()
    this.saveContext()
  }
}
