"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Activity, Zap, Clock, DollarSign } from "lucide-react"

interface MetricData {
  label: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
  unit: string
  target?: number
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: "Network Efficiency", value: 94.2, change: 2.1, trend: "up", unit: "%", target: 95 },
    { label: "Cost Savings", value: 847250, change: 12.3, trend: "up", unit: "$" },
    { label: "Avg Delivery Time", value: 2.4, change: -0.3, trend: "down", unit: "hrs" },
    { label: "Stock Accuracy", value: 98.7, change: 0.8, trend: "up", unit: "%", target: 99 },
    { label: "AI Predictions", value: 96.1, change: 1.2, trend: "up", unit: "%", target: 97 },
    { label: "Energy Usage", value: 78.3, change: -4.2, trend: "down", unit: "kWh" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 2,
          change: (Math.random() - 0.5) * 5,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = (label: string) => {
    switch (label) {
      case "Network Efficiency":
        return Activity
      case "Cost Savings":
        return DollarSign
      case "Avg Delivery Time":
        return Clock
      case "AI Predictions":
        return Zap
      default:
        return TrendingUp
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => {
        const Icon = getIcon(metric.label)
        const isPositive = metric.trend === "up" ? metric.change > 0 : metric.change < 0

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.unit === "$" ? "$" : ""}
                {metric.value.toFixed(metric.unit === "$" ? 0 : 1)}
                {metric.unit !== "$" ? metric.unit : ""}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={isPositive ? "default" : "secondary"} className="text-xs">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(metric.change).toFixed(1)}%
                </Badge>
                <span className="text-xs text-muted-foreground">vs last hour</span>
              </div>
              {metric.target && (
                <div className="mt-2">
                  <Progress value={(metric.value / metric.target) * 100} className="h-1" />
                  <div className="text-xs text-muted-foreground mt-1">
                    Target: {metric.target}
                    {metric.unit}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
