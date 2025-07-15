"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Package, AlertTriangle } from "lucide-react"

export function PredictiveAnalytics() {
  const predictions = [
    {
      item: "Wireless Headphones",
      currentStock: 229,
      predictedDemand: 340,
      timeframe: "Next 7 days",
      confidence: 92,
      action: "Increase stock by 35%",
      risk: "medium",
    },
    {
      item: "Bluetooth Speaker",
      currentStock: 185,
      predictedDemand: 120,
      timeframe: "Next 7 days",
      confidence: 87,
      action: "Redistribute excess stock",
      risk: "low",
    },
    {
      item: "Phone Charger",
      currentStock: 445,
      predictedDemand: 520,
      timeframe: "Next 7 days",
      confidence: 94,
      action: "Reorder 100 units",
      risk: "high",
    },
    {
      item: "Smart Watch",
      currentStock: 200,
      predictedDemand: 180,
      timeframe: "Next 7 days",
      confidence: 89,
      action: "Maintain current levels",
      risk: "low",
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <h4 className="font-medium">{prediction.item}</h4>
                </div>
                <Badge variant={getRiskColor(prediction.risk)}>{prediction.risk} risk</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Stock:</span>
                  <div className="font-medium">{prediction.currentStock} units</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Predicted Demand:</span>
                  <div className="font-medium">{prediction.predictedDemand} units</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="text-muted-foreground">{prediction.timeframe}</span>
                </div>
                <div className="text-muted-foreground">Confidence: {prediction.confidence}%</div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">Recommended: {prediction.action}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
