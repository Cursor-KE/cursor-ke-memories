import { type NextRequest, NextResponse } from "next/server"

// In-memory context store (in production, use a database)
const contextStore = new Map<string, any>()

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId")

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 })
  }

  const context = contextStore.get(sessionId) || {}
  return NextResponse.json({ context })
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, context } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Merge with existing context
    const existingContext = contextStore.get(sessionId) || {}
    const updatedContext = { ...existingContext, ...context, lastUpdated: Date.now() }

    contextStore.set(sessionId, updatedContext)

    return NextResponse.json({ success: true, context: updatedContext })
  } catch (error) {
    console.error("[v0] Context API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
