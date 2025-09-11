export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json()

    // Mock AI response for preview
    const lastMessage = messages[messages.length - 1]?.content || ""

    // Simple mock response based on input
    let mockResponse = "I'm an AI agent powered by the Vercel AI SDK. "

    if (lastMessage.toLowerCase().includes("hello") || lastMessage.toLowerCase().includes("hi")) {
      mockResponse +=
        "Hello! How can I assist you today? I have capabilities for natural language processing, context awareness, API integrations, and continuous learning."
    } else if (lastMessage.toLowerCase().includes("help")) {
      mockResponse +=
        "I can help you with various tasks including answering questions, processing natural language, managing context from our conversation, and integrating with external APIs."
    } else if (lastMessage.toLowerCase().includes("api")) {
      mockResponse +=
        "I can integrate with external APIs to fetch data, send notifications, or perform various tasks. You can configure API connections in the integrations tab."
    } else {
      mockResponse += `I understand you're asking about: "${lastMessage}". I'm designed to provide contextually relevant responses and learn from our interactions to improve over time.`
    }

    // Mock streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const words = mockResponse.split(" ")
        let index = 0

        const interval = setInterval(() => {
          if (index < words.length) {
            controller.enqueue(encoder.encode(words[index] + " "))
            index++
          } else {
            clearInterval(interval)
            controller.close()
          }
        }, 50)
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
