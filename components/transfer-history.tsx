"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Package, MapPin, ArrowRight } from "lucide-react"

interface TransferHistoryProps {
  transfers: Array<{
    id: string
    fromLocation: string
    toLocation: string
    item: string
    quantity: number
    timestamp: Date
    type: "manual" | "ai"
    status: "completed" | "in-transit"
  }>
  locations: Array<{
    id: string
    name: string
  }>
}

export function TransferHistory({ transfers, locations }: TransferHistoryProps) {
  const getLocationName = (locationId: string) => {
    return locations.find((loc) => loc.id === locationId)?.name || locationId
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Transfers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {transfers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No transfers yet</p>
              </div>
            ) : (
              transfers.map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={transfer.type === "ai" ? "default" : "secondary"}>
                        {transfer.type === "ai" ? "AI" : "Manual"}
                      </Badge>
                      <Badge variant={transfer.status === "completed" ? "outline" : "secondary"}>
                        {transfer.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">
                      {transfer.quantity}x {transfer.item}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{getLocationName(transfer.fromLocation)}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{getLocationName(transfer.toLocation)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{formatTime(transfer.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
