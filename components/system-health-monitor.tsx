"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, Database, Wifi, Shield, Cpu, HardDrive } from "lucide-react"

interface SystemStatus {
  name: string
  status: "operational" | "warning" | "critical"
  uptime: number
  performance: number
  lastCheck: Date
}

export function SystemHealthMonitor() {
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: "AI Processing Engine", status: "operational", uptime: 99.8, performance: 94, lastCheck: new Date() },
    { name: "Inventory Database", status: "operational", uptime: 99.9, performance: 97, lastCheck: new Date() },
    { name: "Network Connectivity", status: "warning", uptime: 98.2, performance: 89, lastCheck: new Date() },
    { name: "Security Systems", status: "operational", uptime: 100, performance: 98, lastCheck: new Date() },
    { name: "Analytics Platform", status: "operational", uptime: 99.5, performance: 92, lastCheck: new Date() },
    { name: "Storage Systems", status: "operational", uptime: 99.7, performance: 95, lastCheck: new Date() },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSystems((prev) =>
        prev.map((system) => ({
          ...system,
performance: parseFloat(
  Math.max(85, Math.min(100, system.performance + (Math.random() - 0.5) * 4)).toFixed(1)
),
uptime: parseFloat(
  Math.max(95, Math.min(100, system.uptime + (Math.random() - 0.5) * 0.2)).toFixed(1)
),
          lastCheck: new Date(),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = (name: string) => {
    if (name.includes("AI") || name.includes("Analytics")) return Cpu
    if (name.includes("Database") || name.includes("Storage")) return Database
    if (name.includes("Network")) return Wifi
    if (name.includes("Security")) return Shield
    if (name.includes("Storage")) return HardDrive
    return Server
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Health Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systems.map((system, index) => {
            const Icon = getIcon(system.name)

            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium text-sm">{system.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Last check: {system.lastCheck.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{system.performance}%</div>
                    <Progress value={system.performance} className="w-16 h-1" />
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium">{system.uptime.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">uptime</div>
                  </div>

                  <Badge className={`${getStatusColor(system.status)} text-xs`}>{system.status}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
