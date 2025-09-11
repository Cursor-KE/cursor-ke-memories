"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FeedbackWidget } from "@/components/feedback-widget"
import { useAIAgent } from "@/hooks/use-ai-agent"
import { useLearning } from "@/hooks/use-learning"
import { Send, Bot, User, Loader2, Brain, Clock, MessageSquare, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, context } = useAIAgent()
  const { metrics } = useLearning()

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsThinking(true)
    handleSubmit(e)

    // Simulate thinking time
    setTimeout(() => setIsThinking(false), 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Chat Area */}
      <Card className="lg:col-span-3 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
              {metrics && (
                <Badge variant="outline" className="text-xs bg-accent text-accent-foreground">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Learning: {metrics.averageRating.toFixed(1)}/5
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {context.conversationHistory?.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {context.conversationHistory.length} messages
                </Badge>
              )}
              {isThinking && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  <Brain className="w-3 h-3 mr-1 animate-pulse" />
                  Thinking...
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Welcome to AI Agent</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    I'm your intelligent assistant with context awareness, API integration capabilities, and continuous
                    learning from your feedback.
                  </p>
                  {metrics && (
                    <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
                      <span>Learning from {metrics.totalFeedback} interactions</span>
                      <span>•</span>
                      <span>Average satisfaction: {metrics.averageRating.toFixed(1)}/5</span>
                    </div>
                  )}
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={cn(
                      "flex gap-3 max-w-4xl",
                      message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground",
                      )}
                    >
                      {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={cn(
                        "rounded-lg px-4 py-3 max-w-[80%]",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>

                  {message.role === "assistant" && (
                    <div className="ml-11 mt-1">
                      <FeedbackWidget
                        messageId={message.id}
                        sessionId={context.sessionId}
                        userQuery={messages[messages.indexOf(message) - 1]?.content || ""}
                        aiResponse={message.content}
                        conversationLength={messages.length}
                      />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-4xl mr-auto">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-lg px-4 py-3 bg-muted">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Generating response...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-6">
            <form onSubmit={onSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything... I learn from your feedback to improve over time."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="px-6">
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {error && <p className="text-destructive text-sm mt-2">Error: {error.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Context Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Learning & Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Learning Progress</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Satisfaction:</span>
                  <span className="font-mono">{metrics.averageRating.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Feedback:</span>
                  <span>{metrics.totalFeedback} interactions</span>
                </div>
                {metrics.successfulPatterns.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Top success pattern:</span>
                    <Badge variant="outline" className="text-xs ml-1">
                      {metrics.successfulPatterns[0].replace(/_/g, " ")}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Session Info</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Session ID:</span>
                <span className="font-mono text-muted-foreground">{context.sessionId?.slice(-8) || "Loading..."}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Messages:</span>
                <span>{context.conversationHistory?.length || 0}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Capabilities</h4>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs w-full justify-start">
                Natural Language Processing
              </Badge>
              <Badge variant="outline" className="text-xs w-full justify-start">
                Context Retention
              </Badge>
              <Badge variant="outline" className="text-xs w-full justify-start">
                API Integration Ready
              </Badge>
              <Badge variant="outline" className="text-xs w-full justify-start bg-accent text-accent-foreground">
                Continuous Learning
              </Badge>
            </div>
          </div>

          {Object.keys(context.userPreferences || {}).length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Preferences</h4>
              <div className="space-y-1">
                {Object.entries(context.userPreferences).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="capitalize">{key}:</span>
                    <span className="text-muted-foreground">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
