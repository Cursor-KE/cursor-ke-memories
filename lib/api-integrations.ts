export interface APIIntegration {
  id: string
  name: string
  type: "AI Model" | "Data Source" | "Productivity" | "Communication" | "Storage" | "Custom"
  status: "connected" | "disconnected" | "error" | "testing"
  enabled: boolean
  config: {
    baseUrl?: string
    apiKey?: string
    headers?: Record<string, string>
    timeout?: number
    retries?: number
  }
  capabilities: string[]
  lastTested?: number
  testResult?: {
    success: boolean
    responseTime?: number
    error?: string
  }
  usage?: {
    requestCount: number
    lastUsed: number
    errorCount: number
  }
}

export class APIIntegrationManager {
  private integrations: Map<string, APIIntegration> = new Map()

  constructor() {
    this.initializeDefaultIntegrations()
  }

  private initializeDefaultIntegrations() {
    const defaultIntegrations: APIIntegration[] = [
      {
        id: "openai-gpt4",
        name: "OpenAI GPT-4",
        type: "AI Model",
        status: "connected",
        enabled: true,
        config: {
          baseUrl: "https://api.openai.com/v1",
          timeout: 30000,
          retries: 3,
        },
        capabilities: ["text-generation", "conversation", "analysis"],
        usage: { requestCount: 0, lastUsed: Date.now(), errorCount: 0 },
      },
      {
        id: "weather-api",
        name: "Weather API",
        type: "Data Source",
        status: "disconnected",
        enabled: false,
        config: {
          baseUrl: "https://api.openweathermap.org/data/2.5",
          timeout: 10000,
          retries: 2,
        },
        capabilities: ["weather-data", "forecasts", "location-based"],
        usage: { requestCount: 0, lastUsed: 0, errorCount: 0 },
      },
      {
        id: "calendar-api",
        name: "Calendar API",
        type: "Productivity",
        status: "connected",
        enabled: true,
        config: {
          baseUrl: "https://www.googleapis.com/calendar/v3",
          timeout: 15000,
          retries: 2,
        },
        capabilities: ["event-management", "scheduling", "reminders"],
        usage: { requestCount: 0, lastUsed: Date.now() - 3600000, errorCount: 0 },
      },
      {
        id: "email-service",
        name: "Email Service",
        type: "Communication",
        status: "connected",
        enabled: false,
        config: {
          baseUrl: "https://api.sendgrid.com/v3",
          timeout: 10000,
          retries: 3,
        },
        capabilities: ["email-sending", "templates", "analytics"],
        usage: { requestCount: 0, lastUsed: Date.now() - 7200000, errorCount: 0 },
      },
      {
        id: "database",
        name: "Database",
        type: "Storage",
        status: "connected",
        enabled: true,
        config: {
          timeout: 5000,
          retries: 2,
        },
        capabilities: ["data-storage", "queries", "real-time"],
        usage: { requestCount: 0, lastUsed: Date.now(), errorCount: 0 },
      },
    ]

    defaultIntegrations.forEach((integration) => {
      this.integrations.set(integration.id, integration)
    })
  }

  async testConnection(integrationId: string): Promise<boolean> {
    const integration = this.integrations.get(integrationId)
    if (!integration) return false

    integration.status = "testing"

    try {
      const startTime = Date.now()

      // Simulate API test based on integration type
      const testResult = await this.performConnectionTest(integration)

      const responseTime = Date.now() - startTime

      integration.testResult = {
        success: testResult,
        responseTime,
        error: testResult ? undefined : "Connection failed",
      }

      integration.status = testResult ? "connected" : "error"
      integration.lastTested = Date.now()

      return testResult
    } catch (error) {
      integration.status = "error"
      integration.testResult = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
      return false
    }
  }

  private async performConnectionTest(integration: APIIntegration): Promise<boolean> {
    // Simulate different test scenarios based on integration type
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 500))

    switch (integration.type) {
      case "AI Model":
        return Math.random() > 0.1 // 90% success rate
      case "Data Source":
        return Math.random() > 0.2 // 80% success rate
      case "Productivity":
        return Math.random() > 0.15 // 85% success rate
      case "Communication":
        return Math.random() > 0.25 // 75% success rate
      case "Storage":
        return Math.random() > 0.05 // 95% success rate
      default:
        return Math.random() > 0.3 // 70% success rate
    }
  }

  async makeAPICall(integrationId: string, endpoint: string, options: any = {}): Promise<any> {
    const integration = this.integrations.get(integrationId)
    if (!integration || !integration.enabled || integration.status !== "connected") {
      throw new Error(`Integration ${integrationId} is not available`)
    }

    try {
      // Update usage statistics
      integration.usage!.requestCount++
      integration.usage!.lastUsed = Date.now()

      // Simulate API call
      const response = await this.simulateAPICall(integration, endpoint, options)

      return response
    } catch (error) {
      integration.usage!.errorCount++
      throw error
    }
  }

  private async simulateAPICall(integration: APIIntegration, endpoint: string, options: any): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 200))

    // Simulate different responses based on integration type
    switch (integration.type) {
      case "AI Model":
        return { text: "AI generated response", tokens: 150 }
      case "Data Source":
        return { data: { temperature: 22, humidity: 65, condition: "sunny" } }
      case "Productivity":
        return { events: [{ title: "Meeting", time: "2024-01-15T10:00:00Z" }] }
      case "Communication":
        return { messageId: "msg_123", status: "sent" }
      case "Storage":
        return { id: "record_456", created: true }
      default:
        return { success: true }
    }
  }

  addIntegration(integration: Omit<APIIntegration, "id">): string {
    const id = `custom_${Date.now()}`
    const newIntegration: APIIntegration = {
      ...integration,
      id,
      usage: { requestCount: 0, lastUsed: 0, errorCount: 0 },
    }

    this.integrations.set(id, newIntegration)
    return id
  }

  updateIntegration(id: string, updates: Partial<APIIntegration>): boolean {
    const integration = this.integrations.get(id)
    if (!integration) return false

    Object.assign(integration, updates)
    return true
  }

  removeIntegration(id: string): boolean {
    return this.integrations.delete(id)
  }

  getIntegration(id: string): APIIntegration | undefined {
    return this.integrations.get(id)
  }

  getAllIntegrations(): APIIntegration[] {
    return Array.from(this.integrations.values())
  }

  getIntegrationsByType(type: APIIntegration["type"]): APIIntegration[] {
    return this.getAllIntegrations().filter((integration) => integration.type === type)
  }

  getEnabledIntegrations(): APIIntegration[] {
    return this.getAllIntegrations().filter((integration) => integration.enabled)
  }

  getIntegrationStats() {
    const integrations = this.getAllIntegrations()
    return {
      total: integrations.length,
      connected: integrations.filter((i) => i.status === "connected").length,
      enabled: integrations.filter((i) => i.enabled).length,
      totalRequests: integrations.reduce((sum, i) => sum + (i.usage?.requestCount || 0), 0),
      totalErrors: integrations.reduce((sum, i) => sum + (i.usage?.errorCount || 0), 0),
    }
  }
}

// Global instance
export const apiManager = new APIIntegrationManager()
