"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, AlertTriangle, TrendingUp, Lightbulb, Target } from "lucide-react"

interface AIInsight {
  id: string
  type: "optimization" | "prediction" | "alert" | "recommendation"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  timestamp: Date
  actionable: boolean
}

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: "1",
      type: "optimization",
      title: "Route Optimization Opportunity",
      description:
        "Walmart AI detected 23% efficiency gain possible by consolidating deliveries from Central Warehouse to Downtown area during 2-4 PM window.",
      impact: "high",
      confidence: 94,
      timestamp: new Date(Date.now() - 5 * 60000),
      actionable: true,
    },
    {
      id: "2",
      type: "prediction",
      title: "Demand Surge Forecast",
      description:
        "Wireless Headphones demand expected to increase 45% in next 72 hours based on social media trends and weather patterns.",
      impact: "medium",
      confidence: 87,
      timestamp: new Date(Date.now() - 12 * 60000),
      actionable: true,
    },
    {
      id: "3",
      type: "alert",
      title: "Supply Chain Disruption Risk",
      description:
        "Weather conditions may impact deliveries from North Distribution Center. Recommend preemptive stock redistribution.",
      impact: "high",
      confidence: 91,
      timestamp: new Date(Date.now() - 18 * 60000),
      actionable: true,
    },
    {
      id: "4",
      type: "recommendation",
      title: "Inventory Rebalancing",
      description:
        "Smart Watch inventory at Suburban Store is 60% above optimal. Consider redistribution to Mall Store which shows increasing demand.",
      impact: "medium",
      confidence: 82,
      timestamp: new Date(Date.now() - 25 * 60000),
      actionable: true,
    },
  ])

  const [isGenerating, setIsGenerating] = useState(false)

  const generateNewInsight = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newInsight: AIInsight = {
        id: Date.now().toString(),
        type: ["optimization", "prediction", "alert", "recommendation"][Math.floor(Math.random() * 4)] as any,
        title: "New Walmart AI Analysis Complete",
        description:
          "Machine learning models have identified new optimization opportunities in your supply chain network based on current market conditions.",
        impact: ["high", "medium", "low"][Math.floor(Math.random() * 3)] as any,
        confidence: 75 + Math.random() * 20,
        timestamp: new Date(),
        actionable: true,
      }
      setInsights((prev) => [newInsight, ...prev.slice(0, 4)])
      setIsGenerating(false)
    }, 2000)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return Target
      case "prediction":
        return TrendingUp
      case "alert":
        return AlertTriangle
      case "recommendation":
        return Lightbulb
      default:
        return Brain
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "optimization":
        return "bg-blue-100 text-blue-800"
      case "prediction":
        return "bg-purple-100 text-purple-800"
      case "alert":
        return "bg-red-100 text-red-800"
      case "recommendation":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Walmart AI Insights & Predictions
          </CardTitle>
          <Button onClick={generateNewInsight} disabled={isGenerating} size="sm" variant="outline">
            {isGenerating ? "Analyzing..." : "Generate Insights"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {insights.map((insight) => {
              const Icon = getIcon(insight.type)

              return (
                <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getTypeColor(insight.type)}`}>{insight.type}</Badge>
                      <Badge
                        variant={
                          insight.impact === "high"
                            ? "destructive"
                            : insight.impact === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {insight.impact}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{insight.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Confidence: {insight.confidence.toFixed(0)}%</span>
                      <span>{insight.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {insight.actionable && (
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
