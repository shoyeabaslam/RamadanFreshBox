"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/common/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Package, Calendar, MapPin, Phone, User, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

interface OrderDetails {
  order_id: number
  customer_name: string
  phone_number: string
  delivery_date: string
  address: string
  total_amount: number
  package_name: string
  quantity: number
  order_type: string
  transaction_id: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('order_id')
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    // Fetch order details
    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const result = await response.json()
        
        if (result.success && result.data) {
          setOrderDetails(result.data)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-500/10 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Payment <span className="text-green-500">Successful!</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Your order has been confirmed. We'll deliver fresh Iftar boxes right to your doorstep.
            </p>
          </div>

          {/* Order Reference */}
          <Card className="mb-6 border-2 border-green-500/30 bg-green-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="text-2xl font-bold text-foreground">#{orderDetails.order_id}</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount Paid</p>
                  <p className="text-3xl font-bold text-green-500">
                    ₹{orderDetails.total_amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="grid gap-6 mb-8">
            {/* Package Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Package Details</h3>
                    <div className="space-y-1">
                      <p className="text-base text-foreground">
                        <span className="font-medium">{orderDetails.package_name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {orderDetails.quantity} {orderDetails.quantity === 1 ? 'box' : 'boxes'}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Order Type: <span className="font-medium">{orderDetails.order_type}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Customer Details</h3>
                    <div className="space-y-2">
                      <p className="text-base text-foreground font-medium">{orderDetails.customer_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>+91 {orderDetails.phone_number}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Delivery Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(orderDetails.delivery_date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{orderDetails.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What's Next */}
          <Card className="mb-8 bg-accent/10 border-accent/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">📦 What happens next?</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    1
                  </div>
                  <p className="text-sm text-foreground">
                    You'll receive an order confirmation on your registered phone number
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </div>
                  <p className="text-sm text-foreground">
                    Our team will prepare fresh fruits on the day of delivery
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </div>
                  <p className="text-sm text-foreground">
                    We'll deliver your Iftar box before Maghrib on the selected date
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/order?package=1`}>
                Order More Boxes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{' '}
              <a href="tel:+919876543210" className="text-primary font-medium hover:underline">
                +91 98765 43210
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
