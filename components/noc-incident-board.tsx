"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

export function NOCIncidentBoard() {
  const incidents = [
    {
      id: "INC-001",
      title: "High CPU Usage on Web Server 01",
      severity: "warning",
      status: "investigating",
      assignee: "John Smith",
      created: "2 hours ago",
      description: "CPU utilization consistently above 85% threshold",
    },
    {
      id: "INC-002",
      title: "Backup Server Connection Lost",
      severity: "critical",
      status: "escalated",
      assignee: "Sarah Johnson",
      created: "45 minutes ago",
      description: "Primary backup server unreachable, failover initiated",
    },
    {
      id: "INC-003",
      title: "Network Latency Spike - East Coast",
      severity: "warning",
      status: "monitoring",
      assignee: "Mike Chen",
      created: "1 hour ago",
      description: "Increased response times detected in eastern region",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertIcon />
          Active Incidents
        </CardTitle>
        <CardDescription>Current network incidents requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="p-4 border rounded-lg bg-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(incident.severity)}>{incident.severity.toUpperCase()}</Badge>
                  <span className="font-mono text-sm text-muted-foreground">{incident.id}</span>
                </div>
                <span className="text-sm text-muted-foreground">{incident.created}</span>
              </div>
              <h4 className="font-semibold mb-1">{incident.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    <strong>Status:</strong> {incident.status}
                  </span>
                  <span className="text-sm">
                    <strong>Assignee:</strong> {incident.assignee}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
