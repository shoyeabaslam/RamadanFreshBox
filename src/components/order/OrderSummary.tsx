"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, User, Package, ShoppingBag, CheckCircle2, Minus, Plus } from "lucide-react"
import { OrderType } from "./OrderTypeSelector"
import { DeliveryDetails } from "./DeliveryDetailsForm"

interface OrderSummaryProps {
  readonly packageDetails: {
    id: number
    name: string
    price: number
    fruits_limit: number
  }
  readonly orderType: OrderType
  readonly selectedFruits: Array<{ id: number; name: string }>
  readonly deliveryDetails: DeliveryDetails
  readonly quantity: number
  readonly onQuantityChange?: (quantity: number) => void
}

export function OrderSummary({
  packageDetails,
  orderType,
  selectedFruits,
  deliveryDetails,
  quantity = 1,
  onQuantityChange,
}: OrderSummaryProps) {
  const totalAmount = packageDetails.price * quantity
  const minQuantity = (orderType === 'donate' || orderType === 'sponsor') ? 10 : 1

  const handleQuantityChange = (newQuantity: number) => {
    if (onQuantityChange) {
      onQuantityChange(Math.min(100, Math.max(minQuantity, newQuantity)))
    }
  }

  const getOrderTypeLabel = () => {
    switch (orderType) {
      case 'self':
        return { label: 'Self', color: 'bg-blue-500' }
      case 'donate':
        return { label: 'Donate', color: 'bg-green-500' }
      case 'sponsor':
        return { label: 'Sponsor', color: 'bg-purple-500' }
      default:
        return { label: orderType, color: 'bg-gray-500' }
    }
  }

  const orderTypeInfo = getOrderTypeLabel()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Review Your <span className="text-primary">Order</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Please review all details before proceeding to payment
        </p>
      </div>

      {/* Package Details */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Package Details</h3>
            </div>
            <Badge className={`${orderTypeInfo.color} text-white`}>
              {orderTypeInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground">{packageDetails.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {packageDetails.fruits_limit} items per box
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Price per box</p>
              <p className="text-xl font-bold text-primary">₹{packageDetails.price}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <p className="text-sm font-medium text-foreground">Quantity</p>
            {onQuantityChange ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= minQuantity}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '') {
                      handleQuantityChange(0)
                      return
                    }
                    const numValue = value.replaceAll(/\D/g, '')
                    if (numValue) {
                      handleQuantityChange(Number.parseInt(numValue))
                    }
                  }}
                  onBlur={() => {
                    if (quantity < minQuantity) {
                      handleQuantityChange(minQuantity)
                    }
                  }}
                  className="w-14 h-8 text-center text-sm font-semibold p-1"
                />
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 100}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <span className="text-sm text-muted-foreground ml-1">
                  {quantity === 1 ? 'box' : 'boxes'}
                </span>
              </div>
            ) : (
              <p className="text-base font-semibold text-foreground">{quantity} {quantity === 1 ? 'box' : 'boxes'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Items */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Selected Items</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {selectedFruits.map((fruit) => (
              <div
                key={fruit.id}
                className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground truncate">{fruit.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Customer Details</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="text-sm font-medium text-muted-foreground min-w-30">Name:</p>
            <p className="text-sm sm:text-base font-semibold text-foreground">{deliveryDetails.customerName}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="text-sm font-medium text-muted-foreground min-w-30">Phone:</p>
            <p className="text-sm sm:text-base font-semibold text-foreground">+91 {deliveryDetails.phoneNumber}</p>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Details */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Delivery Details</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground sm:ml-0" />
            <p className="text-sm font-medium text-muted-foreground min-w-25">Date:</p>
            <p className="text-sm sm:text-base font-semibold text-foreground">
              {new Date(deliveryDetails.deliveryDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {deliveryDetails.deliveryLocation && (
            <div className="flex flex-col gap-1 pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground">
                {orderType === 'donate' ? 'Mosque Location:' : 'Charity Location:'}
              </p>
              <p className="text-sm sm:text-base text-foreground">{deliveryDetails.deliveryLocation}</p>
            </div>
          )}

          {orderType === 'sponsor' && deliveryDetails.sponsorName && (
            <div className="flex flex-col gap-1 pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground">Sponsor Name:</p>
              <p className="text-sm sm:text-base font-semibold text-foreground">{deliveryDetails.sponsorName}</p>
            </div>
          )}

          <div className="flex flex-col gap-1 pt-2 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground">Delivery Address:</p>
            <p className="text-sm sm:text-base text-foreground leading-relaxed">{deliveryDetails.address}</p>
          </div>

          {orderType === 'sponsor' && deliveryDetails.sponsorMessage && (
            <div className="flex flex-col gap-1 pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground">Sponsorship Message:</p>
              <p className="text-sm sm:text-base text-foreground italic">&ldquo;{deliveryDetails.sponsorMessage}&rdquo;</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Amount */}
      <Card className="border-2 border-primary">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xs text-muted-foreground mt-1">
                {quantity > 1 ? `₹${packageDetails.price} × ${quantity} boxes` : 'Includes all taxes'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl sm:text-4xl font-bold text-primary">₹{totalAmount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">📦 Delivery:</span> Your order will be delivered before Maghrib on the selected date. Our team will contact you to confirm the timing.
        </p>
      </div>
    </div>
  )
}
