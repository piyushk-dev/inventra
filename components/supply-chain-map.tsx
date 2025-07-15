// SupplyChainMapPhysics.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import {
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  SimulationNodeDatum,
  drag as d3Drag,
  select,
} from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Package, ArrowRight, Truck, Warehouse, Store } from "lucide-react"

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

interface SupplyChainMapProps {
  locations: MapLocation[]
  routes: TransferRoute[]
  onExecuteTransfer: (routeId: string) => void
}

interface LabelNode extends SimulationNodeDatum {
  id: string
  fx?: number
  fy?: number
}

export function SupplyChainMap({ locations, routes, onExecuteTransfer }: SupplyChainMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [labelNodes, setLabelNodes] = useState<LabelNode[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  const initializeSimulation = () => {
    // Create nodes at midpoints
    const nodes: LabelNode[] = routes.map(route => {
      const from = locations.find(l => l.id === route.from)!
      const to = locations.find(l => l.id === route.to)!
      return { id: route.id, x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
    })

    const sim = forceSimulation<LabelNode>(nodes)
      .force("x", forceX(d => d.x!).strength(0.1))
      .force("y", forceY(d => d.y!).strength(0.1))
      .force("collide", forceCollide(12))
      .on("tick", () => {
        // update state to re-render labels
        setLabelNodes(nodes.map(n => ({ id: n.id, x: n.x!, y: n.y! })))
      })

    // Drag behavior
    if (svgRef.current) {
      select(svgRef.current)
        .selectAll<SVGTextElement, LabelNode>(".draggable-label")
        .data(nodes, d => d.id)
        .call(
          d3Drag<SVGTextElement, LabelNode>()
            .on("start", event => {
              event.subject.fx = event.subject.x
              event.subject.fy = event.subject.y
            })
            .on("drag", event => {
              event.subject.fx = event.x
              event.subject.fy = event.y
            })
            .on("end", event => {
              event.subject.fx = null
              event.subject.fy = null
            })
        )
    }
  }

  useEffect(() => {
    initializeSimulation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes, locations])

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "store": return Store
      case "warehouse": return Warehouse
      case "distribution": return Package
      default: return MapPin
    }
  }

  const getSupplyDemandStatus = (loc: MapLocation) => {
    let surplus = 0, shortage = 0, critical = 0
    loc.inventory.forEach(i => {
      const bal = i.stock - i.demand
      if (bal > 0) surplus += bal
      if (bal < 0) shortage += Math.abs(bal), critical++
    })
    return { surplus, shortage, critical }
  }

  const getColor = (loc: MapLocation) => {
    const { surplus, shortage } = getSupplyDemandStatus(loc)
    if (shortage > surplus) return "bg-red-500"
    if (surplus > shortage * 1.5) return "bg-green-500"
    return "bg-yellow-500"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Supply Chain Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 bg-slate-50 rounded-lg border overflow-hidden">
            <svg ref={svgRef} className="absolute inset-0 w-full h-full">
              {/* Routes */}
              <g className="pointer-events-visible">
                {routes.map(route => {
                  const from = locations.find(l => l.id === route.from)!
                  const to = locations.find(l => l.id === route.to)!
                  const color = route.priority === "high" ? "#ef4444" : route.priority === "medium" ? "#f59e0b" : "#10b981"
                  const width = route.priority === "high" ? 3 : 2
                  return (
                    <g key={route.id}>
                      <defs>
                        <marker
                          id={`arrow-${route.id}`} markerWidth={10} markerHeight={7}
                          refX={9} refY={3.5} orient="auto"
                        >
                          <polygon points="0 0,10 3.5,0 7" fill={color} />
                        </marker>
                      </defs>
                      <line
                        x1={`${from.x}%`} y1={`${from.y}%`}
                        x2={`${to.x}%`} y2={`${to.y}%`}
                        stroke={color} strokeWidth={width}
                        strokeDasharray={route.status === "recommended" ? "5,5" : undefined}
                        markerEnd={`url(#arrow-${route.id})`}
                        className="cursor-pointer"
                        onClick={() => setSelectedRoute(route.id)}
                      />
                    </g>
                  )
                })}
              </g>

              {/* Labels */}
              {labelNodes.map(ln => {
                const route = routes.find(r => r.id === ln.id)!
                return (
                  <text
                    key={ln.id}
                    className="draggable-label pointer-events-auto text-xs font-semibold"
                    x={`${ln.x}%`} y={`${ln.y}%`}
                    textAnchor="middle"
                    style={{ paintOrder: "stroke", stroke: "white", strokeWidth: 2, cursor: 'move' }}
                    onClick={() => setSelectedRoute(ln.id)}
                  >{route.quantity}x {route.item}</text>
                )
              })}
            </svg>

            {/* Location markers */}
            {locations.map(loc => {
              const Icon = getLocationIcon(loc.type)
              const sts = getSupplyDemandStatus(loc)
              return (
                <div
                  key={loc.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  onClick={() => setSelectedLocation(loc.id)}
                >
                  <div className={`w-12 h-12 rounded-full ${getColor(loc)} flex items-center justify-center border-2 border-white`}
                  ><Icon className="h-6 w-6 text-white" /></div>
                  {/* label */}
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                    {loc.name}
                    <div className="text-xs">
                      {sts.shortage > 0 && <span className="text-red-600">-{sts.shortage}</span>}
                      {sts.shortage > 0 && sts.surplus > 0 && ' / '}
                      {sts.surplus > 0 && <span className="text-green-600">+{sts.surplus}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail Panels omitted for brevity */}
    </div>
  )
}
