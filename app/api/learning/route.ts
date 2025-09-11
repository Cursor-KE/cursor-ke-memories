import { type NextRequest, NextResponse } from "next/server"
import { learningEngine } from "@/lib/learning-engine"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get("action")
    const sessionId = url.searchParams.get("sessionId")

    switch (action) {
      case "metrics":
        const metrics = learningEngine.getLearningMetrics()
        return NextResponse.json({ metrics })

      case "feedback-history":
        const limit = Number.parseInt(url.searchParams.get("limit") || "50")
        const history = learningEngine.getFeedbackHistory(limit)
        return NextResponse.json({ history })

      case "insights":
        if (!sessionId) {
          return NextResponse.json({ error: "Session ID required" }, { status: 400 })
        }
        const insights = learningEngine.getPersonalizedInsights(sessionId)
        return NextResponse.json({ insights })

      case "export":
        const exportData = learningEngine.exportLearningData()
        return NextResponse.json({ data: exportData })

      default:
        const defaultMetrics = learningEngine.getLearningMetrics()
        return NextResponse.json({ metrics: defaultMetrics })
    }
  } catch (error) {
    console.error("[v0] Learning API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...data } = body

    switch (action) {
      case "add-feedback":
        const feedbackId = learningEngine.addFeedback(data)
        return NextResponse.json({ id: feedbackId, success: true })

      case "adapt-response":
        const adaptation = learningEngine.adaptResponse(data.response, data.context)
        return NextResponse.json({ adaptation })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Learning API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
