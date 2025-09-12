import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(req: Request) {
  try {
    console.log("Chat API called")
    
    const { messages, context, llmConfig } = await req.json()
    console.log("Messages received:", messages.length, "messages")
    
    // Get API key from environment
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    
    if (!apiKey) {
      console.log("No API key found, using mock response")
      
      // Create a simple mock model that works with streamText
      const mockModel = {
        provider: 'custom' as const,
        modelId: 'mock-model',
        async *generateText() {
          const mockResponse = `Hello! I'm your NOC AI Assistant. I received your message: "${messages[messages.length - 1]?.content || 'Hello'}".

I'm currently running in test mode. Once the Google API integration is fully configured, I'll be able to provide real AI-powered responses for your network operations needs.

Key capabilities I'll have:
- Network monitoring and diagnostics
- Incident response and troubleshooting
- API integration management
- Performance optimization
- Technical support and guidance

${context ? `\nContext from our conversation: ${context}` : ''}`

          const words = mockResponse.split(" ")
          for (const word of words) {
            yield word + " "
            await new Promise(resolve => setTimeout(resolve, 50))
          }
        }
      }

      const result = await streamText({
        model: mockModel,
        messages: messages,
        temperature: 0.7,
        maxTokens: 1000,
      })

      return result.toDataStreamResponse()
    }

    // Create Google AI model instance
    const model = google('gemini-1.5-flash', { apiKey })

    // Prepare system message with context
    const systemMessage = `You are an intelligent AI assistant for a Network Operations Center (NOC).
    You help with network monitoring, incident management, and technical troubleshooting.

    ${context ? `Context from conversation: ${context}` : ''}

    Key capabilities:
    - Network monitoring and diagnostics
    - Incident response and troubleshooting
    - API integration management
    - Performance optimization
    - Technical support and guidance

    Provide helpful, accurate, and contextually relevant responses. If you don't know something,
    say so and offer to help find the information.`

    // Prepare messages for the LLM
    const llmMessages = [
      { role: 'system', content: systemMessage },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    console.log("Streaming response from Google AI")
    
    // Stream the response from the LLM
    const result = await streamText({
      model: model,
      messages: llmMessages,
      temperature: llmConfig?.temperature || 0.7,
      maxTokens: llmConfig?.maxTokens || 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    
    // Return a fallback response if LLM fails
    const fallbackResponse = "I'm experiencing technical difficulties. Please check your API configuration and try again."

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallbackResponse))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  }
}