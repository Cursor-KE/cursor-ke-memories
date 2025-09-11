"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useLearning } from "@/hooks/use-learning"
import { ThumbsUp, ThumbsDown, Star, MessageSquare, X } from "lucide-react"

interface FeedbackWidgetProps {
  messageId: string
  sessionId: string
  userQuery: string
  aiResponse: string
  conversationLength: number
  onFeedbackSubmitted?: () => void
}

export function FeedbackWidget({
  messageId,
  sessionId,
  userQuery,
  aiResponse,
  conversationLength,
  onFeedbackSubmitted,
}: FeedbackWidgetProps) {
  const { addFeedback } = useLearning()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [feedbackType, setFeedbackType] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuickFeedback = async (type: "helpful" | "unhelpful") => {
    setIsSubmitting(true)

    await addFeedback({
      messageId,
      sessionId,
      rating: type === "helpful" ? 4 : 2,
      feedbackType: type,
      context: {
        userQuery,
        aiResponse,
        conversationLength,
      },
    })

    setIsSubmitting(false)
    onFeedbackSubmitted?.()
  }

  const handleDetailedFeedback = async () => {
    if (!rating || !feedbackType) return

    setIsSubmitting(true)

    await addFeedback({
      messageId,
      sessionId,
      rating,
      feedbackType: feedbackType as any,
      comment: comment.trim() || undefined,
      context: {
        userQuery,
        aiResponse,
        conversationLength,
      },
    })

    setIsSubmitting(false)
    setIsOpen(false)
    setRating(null)
    setFeedbackType(null)
    setComment("")
    onFeedbackSubmitted?.()
  }

  const feedbackTypes = [
    { value: "excellent", label: "Excellent", color: "bg-accent" },
    { value: "helpful", label: "Helpful", color: "bg-primary" },
    { value: "incomplete", label: "Incomplete", color: "bg-chart-2" },
    { value: "incorrect", label: "Incorrect", color: "bg-destructive" },
    { value: "unhelpful", label: "Unhelpful", color: "bg-muted" },
  ]

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuickFeedback("helpful")}
          disabled={isSubmitting}
          className="h-8 px-2"
        >
          <ThumbsUp className="w-3 h-3 mr-1" />
          Helpful
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuickFeedback("unhelpful")}
          disabled={isSubmitting}
          className="h-8 px-2"
        >
          <ThumbsDown className="w-3 h-3 mr-1" />
          Not helpful
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="h-8 px-2">
          <MessageSquare className="w-3 h-3 mr-1" />
          Detailed feedback
        </Button>
      </div>
    )
  }

  return (
    <Card className="mt-2 border-border/50">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Provide detailed feedback</h4>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                onClick={() => setRating(star)}
                className={`p-1 ${rating && star <= rating ? "text-accent" : "text-muted-foreground"}`}
              >
                <Star className={`w-4 h-4 ${rating && star <= rating ? "fill-current" : ""}`} />
              </Button>
            ))}
          </div>
        </div>

        {/* Feedback Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Feedback type</label>
          <div className="flex flex-wrap gap-2">
            {feedbackTypes.map((type) => (
              <Badge
                key={type.value}
                variant={feedbackType === type.value ? "default" : "outline"}
                className={`cursor-pointer ${feedbackType === type.value ? type.color + " text-white" : ""}`}
                onClick={() => setFeedbackType(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Additional comments (optional)</label>
          <Textarea
            placeholder="Tell us more about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <Button onClick={handleDetailedFeedback} disabled={!rating || !feedbackType || isSubmitting} size="sm">
            {isSubmitting ? "Submitting..." : "Submit feedback"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
