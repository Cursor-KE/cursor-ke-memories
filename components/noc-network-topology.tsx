"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const RouterIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const ServerIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
    />
  </svg>
)

export function NOCNetworkTopology() {
  const networkDevices = [
    { id: 1, name: "Core Router 01", type: "router", status: "healthy", ip: "192.168.1.1", uptime: "99.9%" },
    { id: 2, name: "Core Router 02", type: "router", status: "healthy", ip: "192.168.1.2", uptime: "99.8%" },
    { id: 3, name: "Web Server 01", type: "server", status: "warning", ip: "10.0.1.10", uptime: "98.5%" },
    { id: 4, name: "Database Server", type: "server", status: "healthy", ip: "10.0.1.20", uptime: "99.9%" },
    { id: 5, name: "Load Balancer", type: "router", status: "healthy", ip: "10.0.1.5", uptime: "99.7%" },
    { id: 6, name: "Backup Server", type: "server", status: "critical", ip: "10.0.1.30", uptime: "85.2%" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Topology</CardTitle>
        <CardDescription>Real-time network infrastructure status and health monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {networkDevices.map((device) => (
            <div key={device.id} className="p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-3">
                {device.type === "router" ? <RouterIcon /> : <ServerIcon />}
                <div>
                  <h4 className="font-semibold">{device.name}</h4>
                  <p className="text-sm text-muted-foreground">{device.ip}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(device.status)}>{device.status.toUpperCase()}</Badge>
                <span className="text-sm font-medium">↑ {device.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
