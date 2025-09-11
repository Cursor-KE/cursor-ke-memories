import { type NextRequest, NextResponse } from "next/server"
import { apiManager } from "@/lib/api-integrations"

export async function GET() {
  try {
    const integrations = apiManager.getAllIntegrations()
    const stats = apiManager.getIntegrationStats()

    return NextResponse.json({ integrations, stats })
  } catch (error) {
    console.error("[v0] Integrations API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, integrationId, ...data } = body

    switch (action) {
      case "test":
        const testResult = await apiManager.testConnection(integrationId)
        return NextResponse.json({ success: testResult })

      case "toggle":
        const integration = apiManager.getIntegration(integrationId)
        if (integration) {
          apiManager.updateIntegration(integrationId, { enabled: !integration.enabled })
          return NextResponse.json({ success: true })
        }
        return NextResponse.json({ error: "Integration not found" }, { status: 404 })

      case "add":
        const newId = apiManager.addIntegration(data)
        return NextResponse.json({ id: newId, success: true })

      case "update":
        const updated = apiManager.updateIntegration(integrationId, data)
        return NextResponse.json({ success: updated })

      case "remove":
        const removed = apiManager.removeIntegration(integrationId)
        return NextResponse.json({ success: removed })

      case "call":
        const result = await apiManager.makeAPICall(integrationId, data.endpoint, data.options)
        return NextResponse.json({ result })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Integrations API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
