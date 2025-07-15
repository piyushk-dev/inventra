"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, MapPin, AlertTriangle, CheckCircle } from "lucide-react"

interface ManualTransferModalProps {
  locations: Array<{
    id: string
    name: string
    type: string
    inventory: Array<{
      itemName: string
      stock: number
      demand: number
      optimal: number
    }>
  }>
  onTransfer: (transfer: {
    fromLocationId: string
    toLocationId: string
    itemName: string
    quantity: number
  }) => void
}

export function ManualTransferModal({ locations, onTransfer }: ManualTransferModalProps) {
  const [open, setOpen] = useState(false)
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [selectedItem, setSelectedItem] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferComplete, setTransferComplete] = useState(false)

  const fromLocationData = locations.find((loc) => loc.id === fromLocation)
  const toLocationData = locations.find((loc) => loc.id === toLocation)
  const availableItems = fromLocationData?.inventory || []
  const selectedItemData = availableItems.find((item) => item.itemName === selectedItem)

  const maxQuantity = selectedItemData?.stock || 0
  const quantityNum = Number.parseInt(quantity) || 0

  const canTransfer =
    fromLocation &&
    toLocation &&
    selectedItem &&
    quantityNum > 0 &&
    quantityNum <= maxQuantity &&
    fromLocation !== toLocation

  const handleTransfer = async () => {
    if (!canTransfer) return

    setIsTransferring(true)

    // Simulate transfer time
    setTimeout(() => {
      onTransfer({
        fromLocationId: fromLocation,
        toLocationId: toLocation,
        itemName: selectedItem,
        quantity: quantityNum,
      })

      setIsTransferring(false)
      setTransferComplete(true)

      // Reset form after showing success
      setTimeout(() => {
        setTransferComplete(false)
        setFromLocation("")
        setToLocation("")
        setSelectedItem("")
        setQuantity("")
        setOpen(false)
      }, 2000)
    }, 1500)
  }

  const resetForm = () => {
    setFromLocation("")
    setToLocation("")
    setSelectedItem("")
    setQuantity("")
    setTransferComplete(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Truck className="h-4 w-4" />
          Manual Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Manual Goods Transfer
          </DialogTitle>
          <DialogDescription>
            Move inventory between locations manually. Select source, destination, item, and quantity.
          </DialogDescription>
        </DialogHeader>

        {transferComplete ? (
          <div className="space-y-4 text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Transfer Completed!</h3>
              <p className="text-sm text-muted-foreground">
                {quantity}x {selectedItem} moved successfully
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* From Location */}
            <div className="space-y-2">
              <Label htmlFor="from-location">From Location</Label>
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {location.name}
                        <Badge variant="outline" className="text-xs">
                          {location.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Location */}
            <div className="space-y-2">
              <Label htmlFor="to-location">To Location</Label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination location" />
                </SelectTrigger>
                <SelectContent>
                  {locations
                    .filter((loc) => loc.id !== fromLocation)
                    .map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {location.name}
                          <Badge variant="outline" className="text-xs">
                            {location.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Item Selection */}
            {fromLocation && (
              <div className="space-y-2">
                <Label htmlFor="item">Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item to transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map((item) => (
                      <SelectItem key={item.itemName} value={item.itemName}>
                        <div className="flex items-center justify-between w-full">
                          <span>{item.itemName}</span>
                          <Badge variant="secondary" className="ml-2">
                            {item.stock} available
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            {selectedItem && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max={maxQuantity}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Available: {maxQuantity}</span>
                  {quantityNum > maxQuantity && <span className="text-red-500">Exceeds available stock</span>}
                </div>
              </div>
            )}

            {/* Transfer Preview */}
            {fromLocation && toLocation && selectedItem && quantityNum > 0 && (
              <Alert>
                <Package className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Transfer Preview:</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Item:</span>
                        <span>{selectedItem}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{quantityNum}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>From:</span>
                        <span>{fromLocationData?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>To:</span>
                        <span>{toLocationData?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Time:</span>
                        <span>2-4 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Cost:</span>
                        <span>${(quantityNum * 12.5).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Validation Errors */}
            {fromLocation === toLocation && fromLocation && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Source and destination locations cannot be the same.</AlertDescription>
              </Alert>
            )}

            {quantityNum > maxQuantity && maxQuantity > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Quantity exceeds available stock ({maxQuantity} available).</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleTransfer} disabled={!canTransfer || isTransferring} className="flex-1">
                {isTransferring ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Transferring...
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 mr-2" />
                    Execute Transfer
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
