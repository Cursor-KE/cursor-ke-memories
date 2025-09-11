"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAIAgent } from "@/hooks/use-ai-agent"
import { Brain, Database, Users, Trash2, Download, Tag, User } from "lucide-react"

export function ContextManager() {
  const { contextMetrics, clearOldContext, context } = useAIAgent()
  const [retentionDays, setRetentionDays] = useState(7)

  const contextData = {
    totalSessions: 1,
    activeContexts: 1,
    memoryUsage: Math.round((contextMetrics.memoryUsage || 0) * 100),
    retentionPeriod: retentionDays,
    learningPoints: contextMetrics.messageCount || 0,
    topicCount: contextMetrics.topicCount || 0,
    lastOptimized: contextMetrics.lastOptimized,
  }

  const handleClearContext = () => {
    clearOldContext(retentionDays)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Context Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearContext}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Old Data
          </Button>
        </div>
      </div>

      {/* Context Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{contextData.totalSessions}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                <p className="text-2xl font-bold text-accent">{contextData.memoryUsage}%</p>
              </div>
              <Database className="w-8 h-8 text-accent" />
            </div>
            <Progress value={contextData.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{contextData.learningPoints}</p>
              </div>
              <Brain className="w-8 h-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Topics</p>
                <p className="text-2xl font-bold text-chart-3">{contextData.topicCount}</p>
              </div>
              <Tag className="w-8 h-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Context Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Communication Style</h4>
                  <p className="text-sm text-muted-foreground">
                    {contextMetrics.userProfile?.communicationStyle || "Learning..."}
                  </p>
                </div>
                <Badge variant="outline">
                  {contextMetrics.userProfile?.communicationStyle ? "Detected" : "Analyzing"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Interaction Patterns</h4>
                  <p className="text-sm text-muted-foreground">
                    {Object.keys(contextMetrics.userProfile?.interactionPatterns || {}).length > 0
                      ? "Pattern analysis available"
                      : "Collecting data..."}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Context Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {context.contextSummary ? "Available" : "Generating..."}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {context.contextSummary ? "Ready" : "Processing"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Recent Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {context.topicTags?.slice(-10).map((topic: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              )) || <p className="text-sm text-muted-foreground">No topics detected yet</p>}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Context Optimization</h4>
              <div className="flex items-center justify-between text-xs">
                <span>Last optimized:</span>
                <span className="text-muted-foreground">
                  {contextData.lastOptimized ? new Date(contextData.lastOptimized).toLocaleTimeString() : "Never"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Memory efficiency:</span>
                <Badge variant="secondary" className="bg-chart-2 text-white">
                  {contextData.memoryUsage < 70 ? "Good" : contextData.memoryUsage < 90 ? "Fair" : "High"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Context Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Context Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="retention-days">Context Retention (days)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Auto-optimization</h4>
                  <p className="text-sm text-muted-foreground">Automatically optimize context when needed</p>
                </div>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  Enabled
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Privacy Mode</h4>
                  <p className="text-sm text-muted-foreground">Enhanced data protection</p>
                </div>
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  Enabled
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Learning Mode</h4>
                  <p className="text-sm text-muted-foreground">Continuously improve responses</p>
                </div>
                <Badge variant="secondary" className="bg-chart-3 text-white">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
