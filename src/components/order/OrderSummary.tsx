"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, User, Package, ShoppingBag, CheckCircle2, Minus, Plus, Tag, Loader2, X } from "lucide-react"
import { OrderType } from "./OrderTypeSelector"
import { DeliveryDetails } from "./DeliveryDetailsForm"
import { useState } from "react"

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
  readonly onCouponApplied?: (coupon: { code: string; discountType: string; discountValue: number } | null) => void
}

export function OrderSummary({
  packageDetails,
  orderType,
  selectedFruits,
  deliveryDetails,
  quantity = 1,
  onQuantityChange,
  onCouponApplied,
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: string; discountValue: number } | null>(null)
  const [couponError, setCouponError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const subtotal = packageDetails.price * quantity
  
  // Calculate discount
  let discountAmount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100
    } else {
      discountAmount = appliedCoupon.discountValue
    }
    discountAmount = Math.min(discountAmount, subtotal)
  }
  
  const totalAmount = subtotal - discountAmount
  const minQuantity = (orderType === 'donate' || orderType === 'sponsor') ? 10 : 1

  const handleQuantityChange = (newQuantity: number) => {
    if (onQuantityChange) {
      onQuantityChange(Math.min(100, Math.max(minQuantity, newQuantity)))
    }
  }

  const handleVerifyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    setIsVerifying(true)
    setCouponError('')

    try {
      const response = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCouponError(data.error || 'Invalid coupon code')
        return
      }

      const couponData = {
        code: data.coupon.code,
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
      }

      setAppliedCoupon(couponData)
      if (onCouponApplied) {
        onCouponApplied(couponData)
      }
      setCouponError('')
    } catch (error) {
      console.error('Error verifying coupon:', error)
      setCouponError('Failed to verify coupon. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
    if (onCouponApplied) {
      onCouponApplied(null)
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
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Coupon Code Section */}
          <div className="space-y-3 pb-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Have a coupon code?</p>
            </div>
            
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase())
                    setCouponError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleVerifyCoupon()
                    }
                  }}
                  className="flex-1"
                  disabled={isVerifying}
                />
                <Button
                  onClick={handleVerifyCoupon}
                  disabled={isVerifying || !couponCode.trim()}
                  variant="outline"
                  className="shrink-0"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">{appliedCoupon.code}</p>
                    <p className="text-xs text-green-600">
                      {appliedCoupon.discountType === 'percentage' 
                        ? `${appliedCoupon.discountValue}% discount applied` 
                        : `₹${appliedCoupon.discountValue} discount applied`}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={handleRemoveCoupon}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {couponError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <X className="w-3 h-3" />
                {couponError}
              </p>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="font-medium text-foreground">₹{subtotal}</p>
            </div>

            {appliedCoupon && discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <p className="text-green-600 font-medium">Discount</p>
                <p className="font-semibold text-green-600">-₹{discountAmount.toFixed(2)}</p>
              </div>
            )}

            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base font-semibold text-foreground">Total Amount</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quantity > 1 ? `₹${packageDetails.price} × ${quantity} boxes` : 'Includes all taxes'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl sm:text-4xl font-bold text-primary">₹{totalAmount.toFixed(2)}</p>
                </div>
              </div>
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
