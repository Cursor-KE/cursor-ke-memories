export async function POST(req: Request) {
  try {
    const { conversation } = await req.json()

    // Mock summarization logic
    const lines = conversation.split("\n").filter((line) => line.trim())
    const topics = []
    const userQuestions = []

    lines.forEach((line) => {
      if (line.includes("user:")) {
        const content = line.replace("user:", "").trim()
        if (content.includes("?")) {
          userQuestions.push(content)
        }
      }
    })

    let summary = "Conversation Summary: "

    if (userQuestions.length > 0) {
      summary += `User asked about ${userQuestions.length} topics including questions about AI capabilities, integrations, and functionality. `
    }

    summary += `The conversation covered ${lines.length} exchanges focusing on AI agent features, context management, and system capabilities. `
    summary += "The user is exploring the AI agent's natural language processing and learning capabilities."

    return Response.json({ summary })
  } catch (error) {
    console.error("[v0] Summarization error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
