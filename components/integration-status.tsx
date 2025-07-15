"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle, Plug } from "lucide-react"

export function IntegrationStatus() {
  const integrations = [
    { name: "SAP ERP", status: "connected", lastSync: "2 min ago", health: 98 },
    { name: "Oracle WMS", status: "connected", lastSync: "1 min ago", health: 95 },
    { name: "Salesforce CRM", status: "connected", lastSync: "5 min ago", health: 92 },
    { name: "Amazon Marketplace", status: "warning", lastSync: "15 min ago", health: 78 },
    { name: "Shopify Store", status: "connected", lastSync: "3 min ago", health: 96 },
    { name: "FedEx API", status: "connected", lastSync: "1 min ago", health: 99 },
    { name: "UPS Tracking", status: "error", lastSync: "45 min ago", health: 45 },
    { name: "Weather Service", status: "connected", lastSync: "10 min ago", health: 88 },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return CheckCircle
      case "warning":
        return AlertCircle
      case "error":
        return XCircle
      default:
        return Plug
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plug className="h-5 w-5" />
          System Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {integrations.map((integration, index) => {
            const StatusIcon = getStatusIcon(integration.status)

            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon
                    className={`h-4 w-4 ${
                      integration.status === "connected"
                        ? "text-green-600"
                        : integration.status === "warning"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-sm">{integration.name}</div>
                    <div className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">{integration.health}%</div>
                    <div className="text-xs text-muted-foreground">health</div>
                  </div>
                  <Badge className={`${getStatusColor(integration.status)} text-xs`}>{integration.status}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
