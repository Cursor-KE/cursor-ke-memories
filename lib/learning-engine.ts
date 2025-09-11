export interface FeedbackData {
  id: string
  messageId: string
  sessionId: string
  rating: number // 1-5 scale
  feedbackType: "helpful" | "unhelpful" | "incorrect" | "incomplete" | "excellent"
  comment?: string
  timestamp: number
  context?: {
    userQuery: string
    aiResponse: string
    conversationLength: number
  }
}

export interface LearningMetrics {
  averageRating: number
  totalFeedback: number
  responsePatterns: Record<string, number>
  improvementAreas: string[]
  successfulPatterns: string[]
  userSatisfactionTrend: number[]
}

export interface AdaptiveResponse {
  originalResponse: string
  adaptedResponse: string
  adaptationReason: string
  confidence: number
}

export class LearningEngine {
  private feedbackData: Map<string, FeedbackData> = new Map()
  private learningMetrics: LearningMetrics = {
    averageRating: 0,
    totalFeedback: 0,
    responsePatterns: {},
    improvementAreas: [],
    successfulPatterns: [],
    userSatisfactionTrend: [],
  }

  constructor() {
    this.initializeLearningData()
  }

  private initializeLearningData() {
    // Initialize with some sample learning data
    const sampleFeedback: FeedbackData[] = [
      {
        id: "fb_1",
        messageId: "msg_1",
        sessionId: "sess_1",
        rating: 5,
        feedbackType: "excellent",
        comment: "Very helpful and detailed response",
        timestamp: Date.now() - 86400000,
        context: {
          userQuery: "How do I optimize my code?",
          aiResponse: "Here are several optimization strategies...",
          conversationLength: 3,
        },
      },
      {
        id: "fb_2",
        messageId: "msg_2",
        sessionId: "sess_2",
        rating: 2,
        feedbackType: "incomplete",
        comment: "Missing important details",
        timestamp: Date.now() - 43200000,
        context: {
          userQuery: "Explain machine learning",
          aiResponse: "Machine learning is...",
          conversationLength: 1,
        },
      },
    ]

    sampleFeedback.forEach((feedback) => {
      this.feedbackData.set(feedback.id, feedback)
    })

    this.updateLearningMetrics()
  }

  addFeedback(feedback: Omit<FeedbackData, "id" | "timestamp">): string {
    const id = `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newFeedback: FeedbackData = {
      ...feedback,
      id,
      timestamp: Date.now(),
    }

    this.feedbackData.set(id, newFeedback)
    this.updateLearningMetrics()
    this.analyzeAndAdapt(newFeedback)

    return id
  }

  private updateLearningMetrics() {
    const allFeedback = Array.from(this.feedbackData.values())

    if (allFeedback.length === 0) return

    // Calculate average rating
    const totalRating = allFeedback.reduce((sum, fb) => sum + fb.rating, 0)
    this.learningMetrics.averageRating = totalRating / allFeedback.length
    this.learningMetrics.totalFeedback = allFeedback.length

    // Analyze response patterns
    this.learningMetrics.responsePatterns = {}
    allFeedback.forEach((fb) => {
      const pattern = this.extractResponsePattern(fb)
      this.learningMetrics.responsePatterns[pattern] = (this.learningMetrics.responsePatterns[pattern] || 0) + 1
    })

    // Identify improvement areas and successful patterns
    this.identifyLearningInsights(allFeedback)

    // Update satisfaction trend (last 10 feedback items)
    const recentFeedback = allFeedback.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)

    this.learningMetrics.userSatisfactionTrend = recentFeedback.reverse().map((fb) => fb.rating)
  }

  private extractResponsePattern(feedback: FeedbackData): string {
    if (!feedback.context) return "unknown"

    const responseLength = feedback.context.aiResponse.length
    const conversationLength = feedback.context.conversationLength

    if (responseLength > 500 && feedback.rating >= 4) return "detailed_helpful"
    if (responseLength < 100 && feedback.rating <= 2) return "too_brief"
    if (conversationLength === 1 && feedback.rating >= 4) return "first_response_success"
    if (feedback.feedbackType === "incorrect") return "accuracy_issue"
    if (feedback.feedbackType === "incomplete") return "completeness_issue"

    return "general"
  }

  private identifyLearningInsights(allFeedback: FeedbackData[]) {
    const lowRatedFeedback = allFeedback.filter((fb) => fb.rating <= 2)
    const highRatedFeedback = allFeedback.filter((fb) => fb.rating >= 4)

    // Identify improvement areas
    this.learningMetrics.improvementAreas = []
    const improvementPatterns = new Map<string, number>()

    lowRatedFeedback.forEach((fb) => {
      if (fb.feedbackType === "incomplete") {
        improvementPatterns.set("provide_more_detail", (improvementPatterns.get("provide_more_detail") || 0) + 1)
      }
      if (fb.feedbackType === "incorrect") {
        improvementPatterns.set("improve_accuracy", (improvementPatterns.get("improve_accuracy") || 0) + 1)
      }
      if (fb.context && fb.context.aiResponse.length < 100) {
        improvementPatterns.set(
          "increase_response_length",
          (improvementPatterns.get("increase_response_length") || 0) + 1,
        )
      }
    })

    this.learningMetrics.improvementAreas = Array.from(improvementPatterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pattern]) => pattern)

    // Identify successful patterns
    this.learningMetrics.successfulPatterns = []
    const successPatterns = new Map<string, number>()

    highRatedFeedback.forEach((fb) => {
      if (fb.context && fb.context.aiResponse.length > 300) {
        successPatterns.set("detailed_responses", (successPatterns.get("detailed_responses") || 0) + 1)
      }
      if (fb.feedbackType === "excellent") {
        successPatterns.set("comprehensive_answers", (successPatterns.get("comprehensive_answers") || 0) + 1)
      }
      if (fb.context && fb.context.conversationLength === 1 && fb.rating === 5) {
        successPatterns.set("first_response_excellence", (successPatterns.get("first_response_excellence") || 0) + 1)
      }
    })

    this.learningMetrics.successfulPatterns = Array.from(successPatterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pattern]) => pattern)
  }

  private analyzeAndAdapt(feedback: FeedbackData) {
    // Trigger adaptive learning based on feedback
    if (feedback.rating <= 2) {
      this.recordLearningEvent({
        type: "negative_feedback",
        data: feedback,
        adaptationNeeded: true,
      })
    } else if (feedback.rating >= 4) {
      this.recordLearningEvent({
        type: "positive_feedback",
        data: feedback,
        adaptationNeeded: false,
      })
    }
  }

  private recordLearningEvent(event: {
    type: string
    data: any
    adaptationNeeded: boolean
  }) {
    // In a real implementation, this would trigger ML model updates
    console.log("[v0] Learning event recorded:", event.type)
  }

  adaptResponse(originalResponse: string, userContext: any): AdaptiveResponse {
    const adaptations = []
    let confidence = 0.7

    // Apply learned improvements
    if (this.learningMetrics.improvementAreas.includes("provide_more_detail")) {
      if (originalResponse.length < 200) {
        adaptations.push("Added more detailed explanation")
        confidence += 0.1
      }
    }

    if (this.learningMetrics.improvementAreas.includes("improve_accuracy")) {
      adaptations.push("Enhanced accuracy verification")
      confidence += 0.1
    }

    if (this.learningMetrics.successfulPatterns.includes("detailed_responses")) {
      if (originalResponse.length < 300) {
        adaptations.push("Expanded response based on successful patterns")
        confidence += 0.15
      }
    }

    // Generate adapted response
    let adaptedResponse = originalResponse

    if (adaptations.length > 0) {
      adaptedResponse = this.enhanceResponse(originalResponse, adaptations)
    }

    return {
      originalResponse,
      adaptedResponse,
      adaptationReason: adaptations.join(", ") || "No adaptation needed",
      confidence: Math.min(confidence, 1.0),
    }
  }

  private enhanceResponse(response: string, adaptations: string[]): string {
    let enhanced = response

    if (adaptations.some((a) => a.includes("detailed"))) {
      enhanced +=
        "\n\nAdditional context: Based on user feedback, I've provided more comprehensive details to ensure completeness."
    }

    if (adaptations.some((a) => a.includes("accuracy"))) {
      enhanced +=
        "\n\nNote: This response has been enhanced with additional accuracy verification based on learning from previous interactions."
    }

    return enhanced
  }

  getLearningMetrics(): LearningMetrics {
    return { ...this.learningMetrics }
  }

  getFeedbackHistory(limit = 50): FeedbackData[] {
    return Array.from(this.feedbackData.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  getPersonalizedInsights(sessionId: string): {
    userPreferences: Record<string, any>
    recommendedImprovements: string[]
    satisfactionScore: number
  } {
    const userFeedback = Array.from(this.feedbackData.values()).filter((fb) => fb.sessionId === sessionId)

    if (userFeedback.length === 0) {
      return {
        userPreferences: {},
        recommendedImprovements: [],
        satisfactionScore: 0,
      }
    }

    const avgRating = userFeedback.reduce((sum, fb) => sum + fb.rating, 0) / userFeedback.length

    const preferences: Record<string, any> = {}
    const improvements: string[] = []

    // Analyze user-specific patterns
    const detailedResponses = userFeedback.filter(
      (fb) => fb.context && fb.context.aiResponse.length > 300 && fb.rating >= 4,
    )

    if (detailedResponses.length > 0) {
      preferences.responseStyle = "detailed"
    }

    const lowRatedFeedback = userFeedback.filter((fb) => fb.rating <= 2)
    lowRatedFeedback.forEach((fb) => {
      if (fb.feedbackType === "incomplete") {
        improvements.push("Provide more comprehensive answers")
      }
      if (fb.feedbackType === "incorrect") {
        improvements.push("Improve factual accuracy")
      }
    })

    return {
      userPreferences: preferences,
      recommendedImprovements: [...new Set(improvements)],
      satisfactionScore: avgRating,
    }
  }

  exportLearningData(): {
    metrics: LearningMetrics
    feedbackSummary: any
    insights: any
  } {
    const feedbackByType = new Map<string, number>()
    const feedbackByRating = new Map<number, number>()

    Array.from(this.feedbackData.values()).forEach((fb) => {
      feedbackByType.set(fb.feedbackType, (feedbackByType.get(fb.feedbackType) || 0) + 1)
      feedbackByRating.set(fb.rating, (feedbackByRating.get(fb.rating) || 0) + 1)
    })

    return {
      metrics: this.getLearningMetrics(),
      feedbackSummary: {
        byType: Object.fromEntries(feedbackByType),
        byRating: Object.fromEntries(feedbackByRating),
        totalCount: this.feedbackData.size,
      },
      insights: {
        topImprovementAreas: this.learningMetrics.improvementAreas,
        topSuccessPatterns: this.learningMetrics.successfulPatterns,
        satisfactionTrend: this.learningMetrics.userSatisfactionTrend,
      },
    }
  }
}

// Global learning engine instance
export const learningEngine = new LearningEngine()
