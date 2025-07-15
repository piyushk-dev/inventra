"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, AlertTriangle, MapPin, Package, RefreshCw, Bell, Settings, Users, Shield } from "lucide-react"
import { SupplyChainMap } from "@/components/supply-chain-map"
import { ManualTransferModal } from "@/components/manual-transfer-modal"
import { TransferHistory } from "@/components/transfer-history"
import { WalmartLogo } from "@/components/walmart-logo"
import { RealTimeMetrics } from "@/components/real-time-metrics"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { SystemHealthMonitor } from "@/components/system-health-monitor"
import { PredictiveAnalytics } from "@/components/predictive-analytics"
import { IntegrationStatus } from "@/components/integration-status"

interface MapLocation {
  id: string
  name: string
  type: "store" | "warehouse" | "distribution"
  x: number
  y: number
  address: string
  inventory: {
    itemName: string
    stock: number
    demand: number
    optimal: number
  }[]
}

interface TransferRoute {
  id: string
  from: string
  to: string
  item: string
  quantity: number
  priority: "high" | "medium" | "low"
  status: "recommended" | "in-transit" | "completed"
  estimatedTime: string
  cost: number
}

interface TransferRecord {
  id: string
  fromLocation: string
  toLocation: string
  item: string
  quantity: number
  timestamp: Date
  type: "manual" | "ai"
  status: "completed" | "in-transit"
}

export default function WalmartSupplyChainDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState(3)

  const [locations, setLocations] = useState<MapLocation[]>([
    {
      id: "store-downtown",
      name: "Downtown Store",
      type: "store",
      x: 25,
      y: 60,
      address: "123 Main St, Downtown",
      inventory: [
        { itemName: "Wireless Headphones", stock: 45, demand: 15, optimal: 30 },
        { itemName: "Bluetooth Speaker", stock: 8, demand: 25, optimal: 35 },
        { itemName: "Phone Charger", stock: 60, demand: 20, optimal: 40 },
        { itemName: "Smart Watch", stock: 12, demand: 18, optimal: 25 },
      ],
    },
    {
      id: "store-mall",
      name: "Mall Store",
      type: "store",
      x: 75,
      y: 40,
      address: "456 Oak Ave, Shopping Mall",
      inventory: [
        { itemName: "Wireless Headphones", stock: 12, demand: 30, optimal: 35 },
        { itemName: "Bluetooth Speaker", stock: 42, demand: 18, optimal: 25 },
        { itemName: "Phone Charger", stock: 25, demand: 35, optimal: 45 },
        { itemName: "Smart Watch", stock: 35, demand: 12, optimal: 20 },
      ],
    },
    {
      id: "warehouse-central",
      name: "Central Warehouse",
      type: "warehouse",
      x: 50,
      y: 20,
      address: "789 Industrial Blvd",
      inventory: [
        { itemName: "Wireless Headphones", stock: 150, demand: 0, optimal: 100 },
        { itemName: "Bluetooth Speaker", stock: 80, demand: 0, optimal: 60 },
        { itemName: "Phone Charger", stock: 200, demand: 0, optimal: 150 },
        { itemName: "Smart Watch", stock: 90, demand: 0, optimal: 70 },
      ],
    },
    {
      id: "distribution-north",
      name: "North Distribution",
      type: "distribution",
      x: 30,
      y: 25,
      address: "321 Logistics Way North",
      inventory: [
        { itemName: "Wireless Headphones", stock: 80, demand: 0, optimal: 60 },
        { itemName: "Bluetooth Speaker", stock: 45, demand: 0, optimal: 40 },
        { itemName: "Phone Charger", stock: 120, demand: 0, optimal: 100 },
        { itemName: "Smart Watch", stock: 55, demand: 0, optimal: 45 },
      ],
    },
    {
      id: "store-suburb",
      name: "Suburban Store",
      type: "store",
      x: 80,
      y: 75,
      address: "654 Pine St, Suburbs",
      inventory: [
        { itemName: "Wireless Headphones", stock: 22, demand: 28, optimal: 30 },
        { itemName: "Bluetooth Speaker", stock: 15, demand: 22, optimal: 25 },
        { itemName: "Phone Charger", stock: 40, demand: 30, optimal: 35 },
        { itemName: "Smart Watch", stock: 8, demand: 20, optimal: 25 },
      ],
    },
  ])

  const [routes, setRoutes] = useState<TransferRoute[]>([])
  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Update document title with real-time info
  useEffect(() => {
    const criticalAlerts = locations.reduce(
      (count, loc) => count + loc.inventory.filter((item) => item.stock < item.demand * 0.5).length,
      0,
    )

    document.title =
      criticalAlerts > 0
        ? `(${criticalAlerts}) Walmart Supply Chain AI - Critical Alerts`
        : "Walmart Supply Chain AI - All Systems Operational"
  }, [locations])

  // AI Analysis Function
  const generateAIRecommendations = () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      const newRoutes: TransferRoute[] = []

      // Analyze each item across all locations
      const itemNames = ["Wireless Headphones", "Bluetooth Speaker", "Phone Charger", "Smart Watch"]

      itemNames.forEach((itemName) => {
        const itemData = locations.map((loc) => ({
          locationId: loc.id,
          locationName: loc.name,
          ...loc.inventory.find((inv) => inv.itemName === itemName)!,
        }))

        // Find locations with surplus and shortage
        const surplus = itemData.filter((item) => item.stock > item.demand + 5)
        const shortage = itemData.filter((item) => item.stock < item.demand)

        // Create transfer recommendations
        shortage.forEach((shortageLocation) => {
          const deficit = shortageLocation.demand - shortageLocation.stock

          // Find best surplus location (closest with enough stock)
          const bestSurplus = surplus
            .filter((surplusLocation) => surplusLocation.stock - surplusLocation.demand >= deficit)
            .sort((a, b) => b.stock - b.demand - (a.stock - a.demand))[0]

          if (bestSurplus) {
            const transferQuantity = Math.min(deficit, bestSurplus.stock - bestSurplus.demand)
            const priority = deficit > shortageLocation.optimal * 0.3 ? "high" : deficit > 10 ? "medium" : "low"

            newRoutes.push({
              id: `route-${newRoutes.length + 1}`,
              from: bestSurplus.locationId,
              to: shortageLocation.locationId,
              item: itemName,
              quantity: transferQuantity,
              priority,
              status: "recommended",
              estimatedTime: `${2 + Math.floor(Math.random() * 4)}-${4 + Math.floor(Math.random() * 4)} hours`,
              cost: Math.round(transferQuantity * (15 + Math.random() * 10) * 100) / 100,
            })

            // Update surplus location stock for next calculations
            bestSurplus.stock -= transferQuantity
          }
        })
      })

      setRoutes(newRoutes)
      setIsAnalyzing(false)
    }, 2000)
  }

  // Execute AI transfer
  const executeTransfer = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId)
    if (!route) return

    // Update locations inventory
    setLocations((prevLocations) =>
      prevLocations.map((location) => {
        if (location.id === route.from) {
          return {
            ...location,
            inventory: location.inventory.map((item) =>
              item.itemName === route.item ? { ...item, stock: item.stock - route.quantity } : item,
            ),
          }
        } else if (location.id === route.to) {
          return {
            ...location,
            inventory: location.inventory.map((item) =>
              item.itemName === route.item ? { ...item, stock: item.stock + route.quantity } : item,
            ),
          }
        }
        return location
      }),
    )

    // Add to transfer history
    setTransferHistory((prev) => [
      {
        id: `transfer-${Date.now()}`,
        fromLocation: route.from,
        toLocation: route.to,
        item: route.item,
        quantity: route.quantity,
        timestamp: new Date(),
        type: "ai",
        status: "completed",
      },
      ...prev,
    ])

    // Update route status
    setRoutes((prevRoutes) => prevRoutes.map((r) => (r.id === routeId ? { ...r, status: "in-transit" as const } : r)))

    // Simulate completion after delay
    setTimeout(() => {
      setRoutes((prevRoutes) => prevRoutes.filter((r) => r.id !== routeId))
    }, 3000)
  }

  // Handle manual transfer
  const handleManualTransfer = (transfer: {
    fromLocationId: string
    toLocationId: string
    itemName: string
    quantity: number
  }) => {
    // Update locations inventory
    setLocations((prevLocations) =>
      prevLocations.map((location) => {
        if (location.id === transfer.fromLocationId) {
          return {
            ...location,
            inventory: location.inventory.map((item) =>
              item.itemName === transfer.itemName ? { ...item, stock: item.stock - transfer.quantity } : item,
            ),
          }
        } else if (location.id === transfer.toLocationId) {
          return {
            ...location,
            inventory: location.inventory.map((item) =>
              item.itemName === transfer.itemName ? { ...item, stock: item.stock + transfer.quantity } : item,
            ),
          }
        }
        return location
      }),
    )

    // Add to transfer history
    setTransferHistory((prev) => [
      {
        id: `transfer-${Date.now()}`,
        fromLocation: transfer.fromLocationId,
        toLocation: transfer.toLocationId,
        item: transfer.itemName,
        quantity: transfer.quantity,
        timestamp: new Date(),
        type: "manual",
        status: "completed",
      },
      ...prev,
    ])
  }

  // Generate initial recommendations
  useEffect(() => {
    generateAIRecommendations()
  }, [])

  // Calculate network statistics
  const networkStats = {
    totalLocations: locations.length,
    activeRoutes: routes.filter((r) => r.status === "recommended").length,
    criticalShortages: locations.reduce(
      (count, loc) => count + loc.inventory.filter((item) => item.stock < item.demand * 0.5).length,
      0,
    ),
    totalValue: locations.reduce(
      (total, loc) => total + loc.inventory.reduce((locTotal, item) => locTotal + item.stock * 50, 0),
      0,
    ),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Walmart Logo */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <WalmartLogo />
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">{currentTime.toLocaleString()}</div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{notifications}</Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Shield className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Enterprise Command Center</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                All Systems Operational
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <ManualTransferModal locations={locations} onTransfer={handleManualTransfer} />
              <Button onClick={generateAIRecommendations} disabled={isAnalyzing} variant="default">
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    AI Analyzing Network...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Run AI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Real-time Metrics Dashboard */}
        <RealTimeMetrics />

        {/* AI Status */}
        {isAnalyzing && (
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Walmart AI is analyzing supply chain patterns across {locations.length} locations and optimizing goods
              movement...
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Geographic View</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="systems">Systems</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AIInsightsPanel />
              <PredictiveAnalytics />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <SystemHealthMonitor />
              <IntegrationStatus />
            </div>
          </TabsContent>

          <TabsContent value="map">
            <SupplyChainMap locations={locations} routes={routes} onExecuteTransfer={executeTransfer} />
          </TabsContent>

          <TabsContent value="ai-insights">
            <div className="grid gap-6">
              <AIInsightsPanel />
              <Card>
                <CardHeader>
                  <CardTitle>Walmart AI Recommendations</CardTitle>
                  <CardDescription>
                    Optimized goods movement based on real-time demand analysis and machine learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {routes
                      .filter((route) => route.status === "recommended")
                      .map((route) => {
                        const fromLocation = locations.find((loc) => loc.id === route.from)
                        const toLocation = locations.find((loc) => loc.id === route.to)

                        return (
                          <Alert key={route.id} className="border-l-4 border-l-primary">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={route.priority === "high" ? "destructive" : "secondary"}>
                                      {route.priority} priority
                                    </Badge>
                                    <Badge variant="outline">AI Recommended</Badge>
                                  </div>
                                  <p className="font-medium">
                                    Move {route.quantity}x {route.item}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{fromLocation?.name}</span>
                                    <span>→</span>
                                    <span>{toLocation?.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span>Cost: ${route.cost}</span>
                                    <span>Time: {route.estimatedTime}</span>
                                  </div>
                                </div>
                                <Button size="sm" onClick={() => executeTransfer(route.id)} className="ml-4">
                                  Execute Transfer
                                </Button>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )
                      })}
                    {routes.filter((route) => route.status === "recommended").length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                        <p>All supply chain operations are optimized!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <PredictiveAnalytics />
              <div className="grid gap-4 md:grid-cols-2">
                {locations.map((location) => {
                  const totalStock = location.inventory.reduce((sum, item) => sum + item.stock, 0)
                  const totalDemand = location.inventory.reduce((sum, item) => sum + item.demand, 0)
                  const criticalItems = location.inventory.filter((item) => item.stock < item.demand).length

                  return (
                    <Card key={location.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {location.type === "store" && <MapPin className="h-5 w-5" />}
                          {location.type === "warehouse" && <Package className="h-5 w-5" />}
                          {location.type === "distribution" && <TrendingUp className="h-5 w-5" />}
                          {location.name}
                        </CardTitle>
                        <CardDescription>{location.address}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold">{totalStock}</div>
                              <div className="text-xs text-muted-foreground">Total Stock</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{totalDemand}</div>
                              <div className="text-xs text-muted-foreground">Total Demand</div>
                            </div>
                            <div>
                              <div
                                className={`text-2xl font-bold ${criticalItems > 0 ? "text-red-600" : "text-green-600"}`}
                              >
                                {criticalItems}
                              </div>
                              <div className="text-xs text-muted-foreground">Critical Items</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {location.inventory.map((item, index) => {
                              const balance = item.stock - item.demand
                              const percentage = (item.stock / item.optimal) * 100

                              return (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.itemName}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${
                                          percentage < 50
                                            ? "bg-red-500"
                                            : percentage < 80
                                              ? "bg-yellow-500"
                                              : "bg-green-500"
                                        }`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span
                                      className={`font-medium ${
                                        balance < 0 ? "text-red-600" : balance > 0 ? "text-green-600" : ""
                                      }`}
                                    >
                                      {balance > 0 ? "+" : ""}
                                      {balance}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="systems">
            <div className="grid gap-6 lg:grid-cols-2">
              <SystemHealthMonitor />
              <IntegrationStatus />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <TransferHistory transfers={transferHistory} locations={locations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
