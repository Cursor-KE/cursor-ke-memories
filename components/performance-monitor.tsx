"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { usePerformance } from "@/hooks/use-performance"
import { Activity, Clock, Zap, Users, TrendingUp, AlertTriangle, CheckCircle, Trash2 } from "lucide-react"

export function PerformanceMonitor() {
  const { summary, isLoading, clearCache } = usePerformance()

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleClearCache = async () => {
    const success = await clearCache()
    if (success) {
      // Show success feedback
      console.log("[v0] Cache cleared successfully")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Monitor</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            <Activity className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
          <Button variant="outline" size="sm" onClick={handleClearCache}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Performance Alerts */}
      {summary.alerts.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              Active Performance Alerts ({summary.alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 bg-background rounded border">
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.metric}: {alert.currentValue.toFixed(2)} (threshold: {alert.threshold})
                  </p>
                </div>
                <Badge variant={alert.type === "error" ? "destructive" : "secondary"}>{alert.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.summary.averageResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
            <Progress value={Math.min((summary.summary.averageResponseTime / 3000) * 100, 100)} className="mt-2" />
            <div className="flex items-center gap-1 mt-2">
              {summary.summary.averageResponseTime < 1500 ? (
                <CheckCircle className="w-3 h-3 text-accent" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-destructive" />
              )}
              <span className="text-xs text-muted-foreground">
                {summary.summary.averageResponseTime < 1500 ? "Excellent" : "Needs attention"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(summary.summary.memoryUsage * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">System memory usage</p>
            <Progress value={summary.summary.memoryUsage * 100} className="mt-2" />
            <div className="flex items-center gap-1 mt-2">
              {summary.summary.memoryUsage < 0.7 ? (
                <CheckCircle className="w-3 h-3 text-accent" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-destructive" />
              )}
              <span className="text-xs text-muted-foreground">
                {summary.summary.memoryUsage < 0.7 ? "Optimal" : "High usage"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-chart-2" />
              User Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.summary.userSatisfaction.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">Average user rating</p>
            <Progress value={(summary.summary.userSatisfaction / 5) * 100} className="mt-2" />
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-accent" />
              <span className="text-xs text-accent">
                {summary.summary.userSatisfaction >= 4 ? "Excellent" : "Good"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.metrics
              .filter((metric) => metric.category === "system" || metric.category === "response_time")
              .slice(0, 5)
              .map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm capitalize">{metric.name.replace(/_/g, " ")}</h4>
                    <p className="text-xs text-muted-foreground">{new Date(metric.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {metric.value.toFixed(metric.unit === "ms" ? 0 : 2)} {metric.unit}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">Response Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  {summary.summary.averageResponseTime < 1500
                    ? "Response times are optimal"
                    : "Consider optimizing slow operations"}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={
                  summary.summary.averageResponseTime < 1500
                    ? "bg-accent text-accent-foreground"
                    : "bg-destructive text-destructive-foreground"
                }
              >
                {summary.summary.averageResponseTime < 1500 ? "Excellent" : "Attention"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">Memory Efficiency</h4>
                <p className="text-sm text-muted-foreground">
                  {summary.summary.memoryUsage < 0.7
                    ? "Memory usage is within optimal range"
                    : "High memory usage detected"}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={
                  summary.summary.memoryUsage < 0.7 ? "bg-primary text-primary-foreground" : "bg-chart-4 text-white"
                }
              >
                {summary.summary.memoryUsage < 0.7 ? "Optimized" : "Monitor"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">User Experience</h4>
                <p className="text-sm text-muted-foreground">
                  User satisfaction is {summary.summary.userSatisfaction >= 4 ? "excellent" : "good"}
                </p>
              </div>
              <Badge variant="secondary" className="bg-chart-2 text-white">
                {summary.summary.userSatisfaction >= 4 ? "Excellent" : "Good"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">Cache Performance</h4>
                <p className="text-sm text-muted-foreground">Caching is improving response times</p>
              </div>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
