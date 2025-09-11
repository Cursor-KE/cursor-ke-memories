import { type NextRequest, NextResponse } from "next/server"
import { performanceMonitor } from "@/lib/performance-monitor"
import { cacheManager } from "@/lib/cache-manager"
import { requestOptimizer } from "@/lib/request-optimizer"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get("action")

    switch (action) {
      case "summary":
        const summary = performanceMonitor.getPerformanceSummary()
        return NextResponse.json({ summary })

      case "metrics":
        const category = url.searchParams.get("category") as any
        const metrics = category
          ? performanceMonitor.getMetricsByCategory(category)
          : performanceMonitor.getLatestMetrics()
        return NextResponse.json({ metrics })

      case "alerts":
        const limit = Number.parseInt(url.searchParams.get("limit") || "20")
        const alerts = performanceMonitor.getAlerts(limit)
        return NextResponse.json({ alerts })

      case "cache-stats":
        const cacheStats = cacheManager.getStats()
        return NextResponse.json({ cacheStats })

      case "optimization-stats":
        const optimizationStats = requestOptimizer.getOptimizationStats()
        return NextResponse.json({ optimizationStats })

      default:
        const defaultSummary = performanceMonitor.getPerformanceSummary()
        return NextResponse.json({ summary: defaultSummary })
    }
  } catch (error) {
    console.error("[v0] Performance API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...data } = body

    switch (action) {
      case "record-metric":
        performanceMonitor.recordMetric(data.name, data.value, data.unit, data.category)
        return NextResponse.json({ success: true })

      case "track-interaction":
        performanceMonitor.trackUserInteraction(data.type, data.duration)
        return NextResponse.json({ success: true })

      case "clear-cache":
        cacheManager.clear()
        return NextResponse.json({ success: true })

      case "preload-data":
        await requestOptimizer.preloadData(data.endpoints)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Performance API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
